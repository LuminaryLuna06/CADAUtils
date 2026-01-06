import React, { useState } from "react";
import {
  RefreshCw,
  Download,
  Trash2,
  Plus,
  FileImage,
  Check,
  AlertCircle,
  Loader2,
  ArrowRight,
  Archive,
} from "lucide-react";
import {
  Select,
  Button,
  Paper,
  Group,
  Text,
  ActionIcon,
  Stack,
  ScrollArea,
  Badge,
  Tooltip,
} from "@mantine/core";
import JSZip from "jszip";
import FileUpload from "../ui/FileUpload";
import { convertImage } from "../../services/imageService";
import { downloadBlob } from "../../services/pdfService";

interface FileItem {
  id: string;
  file: File;
  status: "idle" | "processing" | "done" | "error";
  convertedBlob?: Blob;
  errorMsg?: string;
}

const ImageConverter: React.FC = () => {
  const [items, setItems] = useState<FileItem[]>([]);
  const [format, setFormat] = useState<string | null>("png");
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

  const handleConvertAll = async () => {
    if (!format || items.length === 0) return;

    setIsGlobalProcessing(true);

    // Process sequentially to avoid freezing the browser with too many heavy canvas ops
    const newItems = [...items];

    for (let i = 0; i < newItems.length; i++) {
      if (newItems[i].status === "done") continue; // Skip already converted

      // Update status to processing
      setItems((prev) =>
        prev.map((item, idx) =>
          idx === i ? { ...item, status: "processing" } : item
        )
      );

      try {
        const blob = await convertImage(
          newItems[i].file,
          format as "png" | "jpeg" | "webp"
        );

        // Update success
        setItems((prev) =>
          prev.map((item, idx) =>
            idx === i
              ? {
                  ...item,
                  status: "done",
                  convertedBlob: blob,
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
    if (item.convertedBlob && format) {
      const nameWithoutExt =
        item.file.name.substring(0, item.file.name.lastIndexOf(".")) ||
        item.file.name;
      downloadBlob(item.convertedBlob, `${nameWithoutExt}.${format}`);
    }
  };

  const handleDownloadZip = async () => {
    const completedItems = items.filter(
      (i) => i.status === "done" && i.convertedBlob
    );
    if (completedItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();

      completedItems.forEach((item) => {
        if (item.convertedBlob) {
          const nameWithoutExt =
            item.file.name.substring(0, item.file.name.lastIndexOf(".")) ||
            item.file.name;
          const fileName = `${nameWithoutExt}.${format}`;
          zip.file(fileName, item.convertedBlob);
        }
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      downloadBlob(zipBlob, "converted_images.zip");
    } catch (error) {
      console.error("Failed to zip files", error);
      alert("Failed to create ZIP file");
    } finally {
      setIsZipping(false);
    }
  };

  const formatOptions = [
    { value: "png", label: "PNG" },
    { value: "jpeg", label: "JPEG" },
    { value: "webp", label: "WEBP" },
  ];

  const hasCompletedItems = items.some((i) => i.status === "done");

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="prose dark:prose-invert">
          <h3 className="text-slate-900 dark:text-white m-0">
            Image Converter
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm m-0">
            Batch convert images to PNG, JPEG, or WEBP.
          </p>
        </div>

        {items.length > 0 && (
          <Group>
            <Select
              data={formatOptions}
              value={format}
              onChange={setFormat}
              allowDeselect={false}
              w={100}
            />

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
                onClick={handleConvertAll}
                loading={isGlobalProcessing}
                leftSection={<RefreshCw size={16} />}
              >
                Convert All
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
            label="Upload images to convert"
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0 gap-4">
          <Paper
            p="md"
            withBorder
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shrink-0"
          >
            <Group justify="space-between">
              <Group>
                <Text fw={500}>Selected Files ({items.length})</Text>
                <Badge variant="light" color="pink">
                  Target: {format?.toUpperCase()}
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
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-4 transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 relative">
                    <img
                      src={URL.createObjectURL(item.file)}
                      alt="thm"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Text size="sm" fw={500} truncate>
                      {item.file.name}
                    </Text>
                    <Group gap="xs">
                      <Text size="xs" c="dimmed">
                        {(item.file.size / 1024).toFixed(0)} KB
                      </Text>
                      <ArrowRight size={10} className="text-slate-400" />
                      <Badge size="xs" variant="outline" color="gray">
                        {item.file.type.split("/")[1]?.toUpperCase()}
                      </Badge>
                    </Group>
                  </div>

                  {/* Status & Actions */}
                  <Group gap="sm">
                    {item.status === "processing" && (
                      <Loader2
                        size={18}
                        className="animate-spin text-pink-500"
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
                </Paper>
              ))}
            </Stack>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ImageConverter;
