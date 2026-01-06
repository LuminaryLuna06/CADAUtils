import React, { useState } from "react";
import {
  FileDown,
  Download,
  RefreshCw,
  Minimize2,
  FileText,
  AlertCircle,
  Info,
} from "lucide-react";
import {
  Button,
  Paper,
  Group,
  Text,
  ActionIcon,
  Stack,
  Progress,
  SegmentedControl,
  Alert,
  Badge,
} from "@mantine/core";
import FileUpload from "../ui/FileUpload";
import {
  compressPdf,
  CompressionQuality,
  QUALITY_PRESETS,
  isGhostscriptSupported,
} from "../../services/ghostscriptService";
import { downloadBlob } from "../../services/pdfService";

const PdfCompress: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<CompressionQuality>("ebook");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [compressedData, setCompressedData] = useState<Uint8Array | null>(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [compressionRatio, setCompressionRatio] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isSupported = isGhostscriptSupported();

  const handleCompress = async () => {
    if (!file) return;

    setProcessing(true);
    setCompressedData(null);
    setError(null);
    setProgress(0);
    setProgressMessage("Starting...");

    try {
      const result = await compressPdf(file, {
        quality,
        onProgress: (prog, msg) => {
          setProgress(prog);
          setProgressMessage(msg);
        },
      });

      setCompressedData(result.data);
      setOriginalSize(result.originalSize);
      setCompressedSize(result.compressedSize);
      setCompressionRatio(result.compressionRatio);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Compression failed. Please try a different file or quality setting."
      );
    } finally {
      setProcessing(false);
      setProgress(0);
      setProgressMessage("");
    }
  };

  const handleDownload = () => {
    if (compressedData) {
      downloadBlob(compressedData, `compressed-${file?.name || "file.pdf"}`);
    }
  };

  const handleReset = () => {
    setFile(null);
    setCompressedData(null);
    setCompressionRatio(0);
    setError(null);
    setProgress(0);
  };

  const selectedPreset = QUALITY_PRESETS[quality];

  if (!isSupported) {
    return (
      <div className="space-y-6">
        <div className="prose dark:prose-invert">
          <h3 className="text-slate-900 dark:text-white">Compress PDF</h3>
        </div>
        <Alert
          icon={<AlertCircle size={16} />}
          title="Not Supported"
          color="red"
        >
          Your browser doesn't support WebAssembly, which is required for PDF
          compression. Please use a modern browser like Chrome, Firefox, or
          Safari.
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="prose dark:prose-invert">
        <h3 className="text-slate-900 dark:text-white">Compress PDF</h3>
        <p className="text-slate-500 dark:text-slate-400">
          Reduce PDF file size using Ghostscript compression engine.
        </p>
      </div>

      {!file ? (
        <FileUpload
          accept="application/pdf"
          onFilesSelected={(files) => {
            setFile(files[0]);
            setCompressedData(null);
            setCompressionRatio(0);
            setError(null);
          }}
          label="Upload PDF to Compress"
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
              <ActionIcon variant="subtle" color="gray" onClick={handleReset}>
                <RefreshCw size={16} />
              </ActionIcon>
            </Group>

            <Stack gap="lg">
              <div>
                <Text size="sm" fw={500} mb="xs">
                  Compression Quality
                </Text>
                <SegmentedControl
                  value={quality}
                  onChange={(val) => setQuality(val as CompressionQuality)}
                  disabled={processing}
                  fullWidth
                  data={[
                    { label: "Screen", value: "screen" },
                    { label: "eBook", value: "ebook" },
                    { label: "Printer", value: "printer" },
                    { label: "Prepress", value: "prepress" },
                  ]}
                  color="pink"
                />
                <Paper
                  p="sm"
                  mt="sm"
                  className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20"
                >
                  <Group gap="xs" mb={4}>
                    <Info size={14} className="text-blue-600" />
                    <Text size="xs" fw={600} c="blue">
                      {selectedPreset.label} - {selectedPreset.dpi} DPI
                    </Text>
                  </Group>
                  <Text size="xs" c="dimmed">
                    {selectedPreset.description}
                  </Text>
                  <Badge size="xs" mt={6} variant="light" color="blue">
                    Expected: {selectedPreset.compression}
                  </Badge>
                </Paper>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                <Text size="sm" c="dimmed" mb={4}>
                  Original Size
                </Text>
                <Text size="lg" fw={700} style={{ fontFamily: "monospace" }}>
                  {(file.size / 1024).toFixed(2)} KB
                </Text>
                <Text size="xs" c="dimmed" mt={4} className="truncate">
                  {file.name}
                </Text>
              </div>

              {processing && (
                <div>
                  <div className="flex justify-between mb-2">
                    <Text size="sm" fw={500}>
                      {progressMessage}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {progress}%
                    </Text>
                  </div>
                  <Progress value={progress} color="pink" animated />
                  <Text size="xs" c="dimmed" mt={4}>
                    This may take a few seconds...
                  </Text>
                </div>
              )}

              {error && (
                <Alert icon={<AlertCircle size={16} />} color="red">
                  {error}
                </Alert>
              )}

              <Button
                onClick={handleCompress}
                loading={processing}
                disabled={processing}
                fullWidth
                color="pink"
                leftSection={<Minimize2 size={18} />}
              >
                {processing ? "Compressing..." : "Compress PDF"}
              </Button>
            </Stack>
          </Paper>

          <Paper
            p="lg"
            radius="md"
            withBorder
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center min-h-[400px]"
          >
            {compressedData ? (
              <div className="w-full space-y-4">
                <div className="relative aspect-[3/4] bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col items-center justify-center">
                    <FileDown
                      size={48}
                      className="text-green-600 dark:text-green-400 mb-2"
                    />
                    <Text size="sm" fw={600} c="green">
                      Ready to Download
                    </Text>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-lg">
                    <Text size="sm" c="green" fw={500} mb={2}>
                      Compression Complete ✓
                    </Text>
                    <div className="space-y-1">
                      <Text size="xs" c="dimmed">
                        Original:{" "}
                        <span className="font-mono text-slate-700 dark:text-slate-200">
                          {(originalSize / 1024).toFixed(2)} KB
                        </span>
                      </Text>
                      <Text size="xs" c="dimmed">
                        Compressed:{" "}
                        <span className="font-mono text-slate-700 dark:text-slate-200">
                          {(compressedSize / 1024).toFixed(2)} KB
                        </span>
                      </Text>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between mb-1">
                        <Text size="xs" c="dimmed">
                          Space Saved
                        </Text>
                        <Text size="xs" fw={600} c="green">
                          {compressionRatio.toFixed(1)}%
                        </Text>
                      </div>
                      <Progress
                        value={compressionRatio}
                        color="green"
                        size="sm"
                        animated
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleDownload}
                    color="green"
                    fullWidth
                    size="md"
                    leftSection={<Download size={20} />}
                  >
                    Download Compressed PDF
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 dark:text-slate-500">
                <Minimize2 size={48} className="mx-auto mb-3 opacity-20" />
                <Text c="dimmed" size="sm">
                  {processing
                    ? "Processing your PDF..."
                    : "Select quality and click Compress"}
                </Text>
              </div>
            )}
          </Paper>
        </div>
      )}
    </div>
  );
};

export default PdfCompress;
