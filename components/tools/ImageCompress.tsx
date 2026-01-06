import React, { useState } from "react";
import {
  Minimize2,
  Download,
  RefreshCw,
  Sliders,
  HardDrive,
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
  Input,
} from "@mantine/core";
import FileUpload from "../ui/FileUpload";
import { compressImage } from "../../services/imageService";
import { downloadBlob } from "../../services/pdfService";

const ImageCompress: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"quality" | "size">("quality");

  // Mode Quality State
  const [quality, setQuality] = useState(80);

  // Mode Target Size State
  const [targetSize, setTargetSize] = useState<number | string>(500); // KB
  const [sizeUnit, setSizeUnit] = useState<"KB" | "MB">("KB");

  const [processing, setProcessing] = useState(false);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);

  const handleCompress = async () => {
    if (!file) return;
    setProcessing(true);
    setCompressedFile(null);

    try {
      let result: File;

      if (mode === "size") {
        // Calculate target in MB
        let targetMB = Number(targetSize);
        if (sizeUnit === "KB") {
          targetMB = targetMB / 1024;
        }

        result = await compressImage(file, {
          mode: "size",
          targetSizeMB: targetMB,
        });
      } else {
        result = await compressImage(file, {
          mode: "quality",
          quality: quality,
        });
      }

      setCompressedFile(result);
    } catch (err) {
      console.error(err);
      alert("Compression failed. Try a different setting.");
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (compressedFile) {
      downloadBlob(compressedFile, `compressed-${compressedFile.name}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="prose dark:prose-invert">
        <h3 className="text-slate-900 dark:text-white">Compress Image</h3>
        <p className="text-slate-500 dark:text-slate-400">
          Reduce image file size while maintaining acceptable quality.
        </p>
      </div>

      {!file ? (
        <FileUpload
          accept="image/*"
          onFilesSelected={(files) => {
            setFile(files[0]);
            setCompressedFile(null);
          }}
          label="Upload Image to Compress"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Paper
            p="lg"
            radius="md"
            withBorder
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          >
            <Group justify="space-between" mb="md" align="flex-start">
              <Text fw={600} size="lg">
                Settings
              </Text>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => setFile(null)}
              >
                <RefreshCw size={16} />
              </ActionIcon>
            </Group>

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
                    setCompressedFile(null);
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
                    color="pink"
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

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                <Text size="sm" c="dimmed" mb={4}>
                  Original Size
                </Text>
                <Text size="lg" fw={700} style={{ fontFamily: "monospace" }}>
                  {(file.size / 1024).toFixed(2)} KB
                </Text>
              </div>

              <Button
                onClick={handleCompress}
                loading={processing}
                fullWidth
                color="pink"
              >
                {mode === "quality"
                  ? `Compress at ${quality}%`
                  : `Compress to < ${targetSize}${sizeUnit}`}
              </Button>
            </Stack>
          </Paper>

          <Paper
            p="lg"
            radius="md"
            withBorder
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center min-h-[300px]"
          >
            {compressedFile ? (
              <div className="w-full space-y-4">
                <div className="relative aspect-video bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <img
                    src={URL.createObjectURL(compressedFile)}
                    alt="Compressed"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
                  <div>
                    <Text size="sm" c="green" fw={500}>
                      Compression Complete
                    </Text>
                    <Text size="xs" c="dimmed">
                      New Size:{" "}
                      <span className="font-mono text-slate-700 dark:text-slate-200">
                        {(compressedFile.size / 1024).toFixed(2)} KB
                      </span>{" "}
                      ({Math.round((1 - compressedFile.size / file.size) * 100)}
                      % saved)
                    </Text>
                  </div>
                  <Button
                    onClick={handleDownload}
                    color="green"
                    leftSection={<Download size={20} />}
                  >
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 dark:text-slate-500">
                <Minimize2 size={48} className="mx-auto mb-3 opacity-20" />
                <Text c="dimmed">Adjust settings and click Compress</Text>
              </div>
            )}
          </Paper>
        </div>
      )}
    </div>
  );
};

export default ImageCompress;
