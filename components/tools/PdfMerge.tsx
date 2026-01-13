import React, { useState, useEffect } from "react";
import {
  FileText,
  ArrowUp,
  ArrowDown,
  X,
  Download,
  Loader2,
  GripVertical,
  Eye,
} from "lucide-react";
import { clsx } from "clsx";
import { Modal, Button, TextInput } from "@mantine/core";
import FileUpload from "../ui/FileUpload";
import PdfPreview from "../ui/PdfPreview";
import {
  mergePdfs,
  mergePdfsWithRanges,
  downloadBlob,
  getPdfPageCount,
  extractPdfPages,
  parsePageRange,
} from "../../services/pdfService";
import { useSettingsContext } from "../../contexts/SettingsContext";

interface FileWithMeta {
  file: File;
  pageCount: number;
  range: string;
}

const PdfMerge: React.FC = () => {
  const { settings } = useSettingsContext();
  const [files, setFiles] = useState<FileWithMeta[]>([]);
  const [processing, setProcessing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [previewModal, setPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<Uint8Array | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const handleFiles = async (newFiles: File[]) => {
    const filesWithMeta: FileWithMeta[] = await Promise.all(
      newFiles.map(async (file) => ({
        file,
        pageCount: await getPdfPageCount(file),
        range: "all", // Default to all pages
      }))
    );
    setFiles((prev) => [...prev, ...filesWithMeta]);
  };

  const updateRange = (index: number, range: string) => {
    setFiles((prev) =>
      prev.map((item, i) => (i === index ? { ...item, range } : item))
    );
  };

  const moveFile = (index: number, direction: -1 | 1) => {
    const newFiles = [...files];
    const [moved] = newFiles.splice(index, 1);
    newFiles.splice(index + direction, 0, moved);
    setFiles(newFiles);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handlePreview = async () => {
    setLoadingPreview(true);
    setPreviewModal(true);
    try {
      const filesWithRanges = files.map(({ file, range }) => ({ file, range }));
      const previewPdf = await mergePdfsWithRanges(filesWithRanges);
      setPreviewData(previewPdf);
    } catch (err) {
      console.error(err);
      alert("Error generating preview. Please check your page ranges.");
      setPreviewModal(false);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleMerge = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const filesWithRanges = files.map(({ file, range }) => ({ file, range }));
      const mergedPdf = await mergePdfsWithRanges(filesWithRanges);
      downloadBlob(mergedPdf, "merged-document.pdf");
    } catch (err) {
      console.error(err);
      alert("Error merging PDFs. Please check your page ranges.");
    } finally {
      setProcessing(false);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newFiles = [...files];
    const [draggedFile] = newFiles.splice(draggedIndex, 1);
    newFiles.splice(dropIndex, 0, draggedFile);

    setFiles(newFiles);
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="prose dark:prose-invert">
        <h3 className="text-slate-900 dark:text-white">Merge PDFs</h3>
        <p className="text-slate-500 dark:text-slate-400">
          Combine multiple PDF documents into a single file. Select specific
          pages from each file or merge all pages.
        </p>
      </div>

      <FileUpload
        accept=".pdf"
        multiple
        onFilesSelected={handleFiles}
        label="Upload PDF files to merge"
      />

      {files.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 space-y-2 border border-slate-200 dark:border-slate-700 shadow-sm">
          {files.map((item, idx) => (
            <div
              key={`${item.file.name}-${idx}`}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              className={clsx(
                "bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border cursor-move transition-all",
                draggedIndex === idx
                  ? "opacity-50 border-dashed"
                  : "border-slate-200 dark:border-slate-700"
              )}
              style={
                draggedIndex === idx
                  ? {
                      borderColor: `var(--mantine-color-${settings.primaryColor}-6)`,
                    }
                  : undefined
              }
            >
              <div className="flex items-start gap-4">
                <div className="text-slate-400 cursor-grab active:cursor-grabbing mt-1">
                  <GripVertical size={20} />
                </div>
                <FileText className="text-red-500 dark:text-red-400 shrink-0 mt-1" />
                <div className="flex-1 min-w-0 space-y-2">
                  <div>
                    <p className="font-medium text-sm truncate text-slate-700 dark:text-slate-200">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {(item.file.size / 1024 / 1024).toFixed(2)} MB •{" "}
                      {item.pageCount} page{item.pageCount > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <TextInput
                      value={item.range}
                      onChange={(e) => updateRange(idx, e.currentTarget.value)}
                      placeholder='e.g., "1-3, 5" or "all"'
                      size="xs"
                      className="flex-1"
                    />
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      Page range
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <button
                    onClick={() => moveFile(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-30"
                    title="Move Up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    onClick={() => moveFile(idx, 1)}
                    disabled={idx === files.length - 1}
                    className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-30"
                    title="Move Down"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    onClick={() => removeFile(idx)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded ml-2"
                    title="Remove"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 flex justify-end gap-2">
            <Button
              onClick={handlePreview}
              disabled={processing || files.length < 1}
              variant="filled"
              color="gray"
              leftSection={<Eye size={18} />}
            >
              Preview Merge
            </Button>
            <Button
              onClick={handleMerge}
              disabled={processing || files.length < 2}
              loading={processing}
              variant="filled"
              color={settings.primaryColor}
              leftSection={!processing && <Download size={20} />}
            >
              {processing ? "Merging..." : "Merge Files"}
            </Button>
          </div>
        </div>
      )}

      <Modal
        opened={previewModal}
        onClose={() => setPreviewModal(false)}
        title="Merge Preview"
        size="xl"
        centered
      >
        {loadingPreview ? (
          <div className="flex items-center justify-center p-8">
            <Loader2
              className="animate-spin"
              size={32}
              style={{
                color: `var(--mantine-color-${settings.primaryColor}-6)`,
              }}
            />
          </div>
        ) : previewData ? (
          <PdfPreview file={previewData} maxHeight={500} />
        ) : null}
      </Modal>
    </div>
  );
};

export default PdfMerge;
