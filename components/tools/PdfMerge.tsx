import React, { useState } from "react";
import {
  FileText,
  ArrowUp,
  ArrowDown,
  X,
  Download,
  Loader2,
  GripVertical,
} from "lucide-react";
import { clsx } from "clsx";
import FileUpload from "../ui/FileUpload";
import { mergePdfs, downloadBlob } from "../../services/pdfService";

const PdfMerge: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
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

  const handleMerge = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const mergedPdf = await mergePdfs(files);
      downloadBlob(mergedPdf, "merged-document.pdf");
    } catch (err) {
      console.error(err);
      alert("Error merging PDFs");
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
    // Set a transparent drag image or customized look if desired
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    // Optional: Visual feedback logic could go here
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
          Combine multiple PDF documents into a single file. Drag files to
          reorder.
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
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`} // Using index in key to force re-render on move for animation/state stability
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              className={clsx(
                "flex items-center gap-4 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 cursor-move transition-all",
                draggedIndex === idx &&
                  "opacity-50 border-dashed border-pink-500"
              )}
            >
              <div className="text-slate-400 cursor-grab active:cursor-grabbing">
                <GripVertical size={20} />
              </div>
              <FileText className="text-red-500 dark:text-red-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate text-slate-700 dark:text-slate-200">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
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
          ))}

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleMerge}
              disabled={processing || files.length < 2}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 dark:bg-pink-600 dark:hover:bg-pink-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              {processing ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Download size={20} />
              )}
              {processing ? "Merging..." : "Merge Files"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfMerge;
