import React, { useState, useEffect } from "react";
import { FileText, Download, RefreshCw, Eye } from "lucide-react";
import { TextInput, Button, Paper, Group, Text, Stack } from "@mantine/core";
import FileUpload from "../ui/FileUpload";
import PdfPreview from "../ui/PdfPreview";
import {
  splitPdf,
  downloadBlob,
  getPdfPageCount,
  parsePageRange,
} from "../../services/pdfService";

const PdfSplit: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [range, setRange] = useState("");
  const [processing, setProcessing] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (file) {
      getPdfPageCount(file).then(setPageCount);
    }
  }, [file]);

  const handleSplit = async () => {
    if (!file || !range) return;
    setProcessing(true);
    try {
      const result = await splitPdf(file, range);
      downloadBlob(result, `split-${file.name}`);
    } catch (err) {
      console.error(err);
      alert("Error splitting PDF. Please check your range format.");
    } finally {
      setProcessing(false);
    }
  };

  const getSelectedPages = (): number[] => {
    if (!range || !pageCount) return [];
    try {
      return parsePageRange(range, pageCount).map((idx) => idx + 1); // Convert to 1-indexed
    } catch {
      return [];
    }
  };

  const formatPageRanges = (pages: number[]): string => {
    if (pages.length === 0) return "";

    const sorted = [...pages].sort((a, b) => a - b);
    const ranges: string[] = [];
    let start = sorted[0];
    let end = sorted[0];

    for (let i = 1; i <= sorted.length; i++) {
      if (i < sorted.length && sorted[i] === end + 1) {
        end = sorted[i];
      } else {
        if (start === end) {
          ranges.push(`${start}`);
        } else if (end === start + 1) {
          ranges.push(`${start}, ${end}`);
        } else {
          ranges.push(`${start}-${end}`);
        }
        if (i < sorted.length) {
          start = sorted[i];
          end = sorted[i];
        }
      }
    }

    return ranges.join(", ");
  };

  const selectedPages = getSelectedPages();

  return (
    <div className="space-y-6">
      <div className="prose dark:prose-invert">
        <h3 className="text-slate-900 dark:text-white">Split PDF</h3>
        <p className="text-slate-500 dark:text-slate-400">
          Extract specific pages from your PDF document. Preview pages before
          splitting.
        </p>
      </div>

      {!file ? (
        <FileUpload
          accept=".pdf"
          onFilesSelected={(files) => setFile(files[0])}
          label="Upload PDF to split"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Stack gap="md">
            <Paper
              p="lg"
              radius="md"
              withBorder
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            >
              <Group justify="space-between" mb="lg">
                <Group>
                  <div className="p-3 bg-red-100 dark:bg-red-500/10 rounded-lg text-red-600 dark:text-red-400">
                    <FileText size={24} />
                  </div>
                  <div>
                    <Text fw={500}>{file.name}</Text>
                    <Text size="sm" c="dimmed">
                      {(file.size / 1024 / 1024).toFixed(2)} MB • {pageCount}{" "}
                      pages
                    </Text>
                  </div>
                </Group>
              </Group>

              <TextInput
                label="Page Range"
                placeholder="e.g. 1-3, 5, 8-10"
                description={`Enter page numbers or ranges (1-${pageCount})`}
                value={range}
                onChange={(event) => setRange(event.currentTarget.value)}
                mb="md"
              />

              {selectedPages.length > 0 && (
                <Paper
                  p="sm"
                  mb="md"
                  className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20"
                >
                  <Text size="sm" c="blue" fw={500}>
                    {selectedPages.length} page
                    {selectedPages.length > 1 ? "s" : ""} selected
                  </Text>
                  <Text size="xs" c="dimmed" mt={4}>
                    Pages: {formatPageRanges(selectedPages)}
                  </Text>
                </Paper>
              )}

              <Stack gap="xs">
                <Button
                  onClick={() => setShowPreview(!showPreview)}
                  disabled={!range || selectedPages.length === 0}
                  variant="light"
                  color="gray"
                  leftSection={<Eye size={18} />}
                  fullWidth
                >
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </Button>
                <Button
                  onClick={handleSplit}
                  loading={processing}
                  disabled={!range || selectedPages.length === 0}
                  fullWidth
                  size="md"
                  leftSection={!processing && <Download size={20} />}
                >
                  Download
                </Button>
                <Button
                  onClick={() => {
                    setFile(null);
                    setRange("");
                    setShowPreview(false);
                  }}
                  variant="subtle"
                  color="gray"
                  leftSection={<RefreshCw size={18} />}
                  fullWidth
                >
                  Reset
                </Button>
              </Stack>
            </Paper>
          </Stack>

          <Paper
            p="lg"
            radius="md"
            withBorder
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 lg:col-span-2"
          >
            {showPreview && selectedPages.length > 0 ? (
              <div>
                <Text size="sm" fw={500} mb="md" c="dimmed">
                  Preview of Selected Pages
                </Text>
                <PdfPreview
                  file={file}
                  pageNumbers={selectedPages}
                  maxHeight={600}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px] text-slate-400 dark:text-slate-500">
                <div className="text-center">
                  <Eye size={48} className="mx-auto mb-3 opacity-20" />
                  <Text c="dimmed" size="sm">
                    {!range
                      ? "Enter a page range to preview"
                      : selectedPages.length === 0
                      ? "Invalid page range"
                      : "Click 'Show Preview' to see selected pages"}
                  </Text>
                </div>
              </div>
            )}
          </Paper>
        </div>
      )}
    </div>
  );
};

export default PdfSplit;
