import React, { useState } from "react";
import { ArrowUp, ArrowDown, X, Download, Loader2 } from "lucide-react";
import FileUpload from "../ui/FileUpload";
import { imagesToPdf, downloadBlob } from "../../services/pdfService";

const ImageToPdf: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

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

  const handleConvert = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const pdfBytes = await imagesToPdf(files);
      downloadBlob(pdfBytes, "images-combined.pdf");
    } catch (err) {
      console.error(err);
      alert("Error converting images to PDF");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="prose dark:prose-invert">
        <h3 className="text-slate-900 dark:text-white">Image to PDF</h3>
        <p className="text-slate-500 dark:text-slate-400">
          Convert JPG and PNG images into a single PDF document.
        </p>
      </div>

      <FileUpload
        accept=".jpg, .jpeg, .png"
        multiple
        onFilesSelected={handleFiles}
        label="Upload Images"
      />

      {files.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 space-y-2 border border-slate-200 dark:border-slate-700 shadow-sm">
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              {/* Preview Thumbnail */}
              <div className="w-10 h-10 rounded overflow-hidden bg-slate-200 dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-600">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate text-slate-700 dark:text-slate-200">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(file.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                <button
                  onClick={() => moveFile(idx, -1)}
                  disabled={idx === 0}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-30"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => moveFile(idx, 1)}
                  disabled={idx === files.length - 1}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded disabled:opacity-30"
                >
                  <ArrowDown size={16} />
                </button>
                <button
                  onClick={() => removeFile(idx)}
                  className="p-1 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded ml-2"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleConvert}
              disabled={processing || files.length === 0}
              className="flex items-center gap-2 bg-pink-600 hover:bg-pink-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
            >
              {processing ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Download size={20} />
              )}
              {processing ? "Generating PDF..." : "Convert to PDF"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageToPdf;
