import React, { useState } from "react";
import {
  Minimize2,
  Download,
  RefreshCw,
  Sliders,
  HardDrive,
  Trash2,
  Plus,
  Check,
  AlertCircle,
  Loader2,
  ArrowRight,
  Archive,
} from "lucide-react";
import {
  Slider,
  Button,
  Paper,
  Group,
  Text,
  ActionIcon,
  Stack,
  SegmentedControl,
  NumberInput,
  ScrollArea,
  Badge,
  Tooltip,
} from "@mantine/core";
import JSZip from "jszip";
import FileUpload from "../ui/FileUpload";
import { compressImage } from "../../services/imageService";
import { downloadBlob } from "../../services/pdfService";
import { useSettingsContext } from "../../contexts/SettingsContext";

interface FileItem {
  id: string;
  file: File;
  status: "idle" | "processing" | "done" | "error";
  compressedFile?: File;
  errorMsg?: string;
}

const ImageCompress: React.FC = () => {
  const { settings } = useSettingsContext();
  const [items, setItems] = useState<FileItem[]>([]);
  const [mode, setMode] = useState<"quality" | "size">("quality");

  // Mode Quality State
  const [quality, setQuality] = useState(80);

  // Mode Target Size State
  const [targetSize, setTargetSize] = useState<number | string>(500); // KB
  const [sizeUnit, setSizeUnit] = useState<"KB" | "MB">("KB");

  const [isGlobalProcessing, setIsGlobalProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleFilesSelected = (newFiles: File[]) => {
    const newItems: FileItem[] = newFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      status: "idle",
    }));
    setItems((prev) => [...prev, ...newItems]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
  };

  const handleCompressAll = async () => {
    if (items.length === 0) return;

    setIsGlobalProcessing(true);

    const newItems = [...items];

    for (let i = 0; i < newItems.length; i++) {
      if (newItems[i].status === "done") continue; // Skip already compressed

      // Update status to processing
      setItems((prev) =>
        prev.map((item, idx) =>
          idx === i ? { ...item, status: "processing" } : item
        )
      );

      try {
        let result: File;

        if (mode === "size") {
          // Calculate target in MB
          let targetMB = Number(targetSize);
          if (sizeUnit === "KB") {
            targetMB = targetMB / 1024;
          }

          result = await compressImage(newItems[i].file, {
            mode: "size",
            targetSizeMB: targetMB,
          });
        } else {
          result = await compressImage(newItems[i].file, {
            mode: "quality",
            quality: quality,
          });
        }

        // Update success
        setItems((prev) =>
          prev.map((item, idx) =>
            idx === i
              ? {
                  ...item,
                  status: "done",
                  compressedFile: result,
                }
              : item
          )
        );
      } catch (err: any) {
        console.error(err);
        // Update error
        setItems((prev) =>
          prev.map((item, idx) =>
            idx === i
              ? {
                  ...item,
                  status: "error",
                  errorMsg: "Failed",
                }
              : item
          )
        );
      }
    }

    setIsGlobalProcessing(false);
  };

  const downloadItem = (item: FileItem) => {
    if (item.compressedFile) {
      downloadBlob(
        item.compressedFile,
        `compressed-${item.compressedFile.name}`
      );
    }
  };

  const handleDownloadZip = async () => {
    const completedItems = items.filter(
      (i) => i.status === "done" && i.compressedFile
    );
    if (completedItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();

      completedItems.forEach((item) => {
        if (item.compressedFile) {
          const fileName = `compressed-${item.compressedFile.name}`;
          zip.file(fileName, item.compressedFile);
        }
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, "compressed_images.zip");
    } catch (error) {
      console.error("Failed to zip files", error);
      alert("Failed to create ZIP file");
    } finally {
      setIsZipping(false);
    }
  };

  const hasCompletedItems = items.some((i) => i.status === "done");

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="prose dark:prose-invert">
          <h3 className="text-slate-900 dark:text-white m-0">Compress Image</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm m-0">
            Reduce image file size while maintaining acceptable quality.
          </p>
        </div>

        {items.length > 0 && (
          <Group>
            {hasCompletedItems ? (
              <Button
                onClick={handleDownloadZip}
                loading={isZipping}
                variant="filled"
                color="green"
                leftSection={<Archive size={16} />}
              >
                Download All (ZIP)
              </Button>
            ) : (
              <Button
                onClick={handleCompressAll}
                loading={isGlobalProcessing}
                leftSection={<RefreshCw size={16} />}
              >
                Compress All
              </Button>
            )}

            <Button
              variant="light"
              color="red"
              onClick={clearAll}
              disabled={isGlobalProcessing || isZipping}
              leftSection={<Trash2 size={16} />}
            >
              Clear
            </Button>
          </Group>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex-1">
          <FileUpload
            accept="image/*"
            multiple
            onFilesSelected={handleFilesSelected}
            label="Upload images to compress"
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0">
          {/* Settings Panel */}
          <Paper
            p="lg"
            withBorder
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shrink-0 md:w-80"
          >
            <Text fw={600} size="lg" mb="md">
              Settings
            </Text>

            <Stack gap="lg">
              <div>
                <Text size="sm" fw={500} mb="xs">
                  Compression Mode
                </Text>
                <SegmentedControl
                  fullWidth
                  value={mode}
                  onChange={(val) => {
                    setMode(val as "quality" | "size");
                  }}
                  data={[
                    {
                      value: "quality",
                      label: (
                        <Group gap={6}>
                          <Sliders size={14} /> By Quality
                        </Group>
                      ),
                    },
                    {
                      value: "size",
                      label: (
                        <Group gap={6}>
                          <HardDrive size={14} /> Target Size
                        </Group>
                      ),
                    },
                  ]}
                />
              </div>

              {mode === "quality" ? (
                <div>
                  <div className="flex justify-between mb-1">
                    <Text size="sm" c="dimmed">
                      Quality Level
                    </Text>
                    <Text size="sm" fw={500}>
                      {quality}%
                    </Text>
                  </div>
                  <Slider
                    value={quality}
                    onChange={setQuality}
                    min={1}
                    max={100}
                    color={settings.primaryColor}
                    marks={[
                      { value: 10, label: "Low" },
                      { value: 50, label: "Med" },
                      { value: 90, label: "High" },
                    ]}
                    mb="xl"
                  />
                </div>
              ) : (
                <div>
                  <Text size="sm" c="dimmed" mb="xs">
                    Max File Size
                  </Text>
                  <Group>
                    <NumberInput
                      value={targetSize}
                      onChange={setTargetSize}
                      min={1}
                      allowNegative={false}
                      className="flex-1"
                    />
                    <SegmentedControl
                      value={sizeUnit}
                      onChange={(val) => setSizeUnit(val as "KB" | "MB")}
                      data={[
                        { value: "KB", label: "KB" },
                        { value: "MB", label: "MB" },
                      ]}
                    />
                  </Group>
                  <Text size="xs" c="dimmed" mt="xs">
                    The tool will reduce quality until the file is smaller than
                    this value.
                  </Text>
                </div>
              )}
            </Stack>
          </Paper>

          {/* File List */}
          <div className="flex-1 flex flex-col min-h-0 gap-4">
            <Paper
              p="md"
              withBorder
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shrink-0"
            >
              <Group justify="space-between">
                <Group>
                  <Text fw={500}>Selected Files ({items.length})</Text>
                  <Badge variant="light" color={settings.primaryColor}>
                    {mode === "quality"
                      ? `Quality: ${quality}%`
                      : `Target: <${targetSize}${sizeUnit}`}
                  </Badge>
                </Group>
                <div className="relative">
                  <Button
                    variant="subtle"
                    size="xs"
                    leftSection={<Plus size={14} />}
                    className="overflow-hidden"
                  >
                    Add more
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        if (e.target.files)
                          handleFilesSelected(Array.from(e.target.files));
                        e.target.value = ""; // Reset
                      }}
                    />
                  </Button>
                </div>
              </Group>
            </Paper>

            <ScrollArea className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 p-2">
              <Stack gap="sm">
                {items.map((item) => (
                  <Paper
                    key={item.id}
                    p="sm"
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all"
                  >
                    <Group wrap="nowrap" gap="md">
                      {/* Thumbnail */}
                      <div className="w-12 h-12 rounded bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 relative">
                        <img
                          src={URL.createObjectURL(item.file)}
                          alt="thm"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 max-w-[40vh]">
                        <Text size="sm" fw={500} lineClamp={2}>
                          {item.file.name}
                        </Text>
                        <Group gap="xs">
                          <Text size="xs" c="dimmed">
                            {(item.file.size / 1024).toFixed(0)} KB
                          </Text>
                          {item.compressedFile && (
                            <>
                              <ArrowRight
                                size={10}
                                className="text-slate-400"
                              />
                              <Text size="xs" c="green" fw={500}>
                                {(item.compressedFile.size / 1024).toFixed(0)}{" "}
                                KB
                              </Text>
                              <Badge size="xs" variant="outline" color="green">
                                {Math.round(
                                  (1 -
                                    item.compressedFile.size / item.file.size) *
                                    100
                                )}
                                % saved
                              </Badge>
                            </>
                          )}
                        </Group>
                      </div>

                      {/* Status & Actions */}
                      <Group gap="sm">
                        {item.status === "processing" && (
                          <Loader2
                            size={18}
                            className="animate-spin"
                            style={{
                              color: `var(--mantine-color-${settings.primaryColor}-6)`,
                            }}
                          />
                        )}

                        {item.status === "done" && (
                          <Badge
                            color="green"
                            variant="light"
                            leftSection={<Check size={10} />}
                          >
                            Done
                          </Badge>
                        )}

                        {item.status === "error" && (
                          <Tooltip label={item.errorMsg}>
                            <Badge
                              color="red"
                              variant="light"
                              leftSection={<AlertCircle size={10} />}
                            >
                              Error
                            </Badge>
                          </Tooltip>
                        )}

                        {item.status === "done" ? (
                          <ActionIcon
                            variant="filled"
                            color="green"
                            onClick={() => downloadItem(item)}
                            title="Download"
                          >
                            <Download size={16} />
                          </ActionIcon>
                        ) : (
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => removeItem(item.id)}
                            disabled={item.status === "processing"}
                          >
                            <Trash2 size={16} />
                          </ActionIcon>
                        )}
                      </Group>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </ScrollArea>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCompress;
