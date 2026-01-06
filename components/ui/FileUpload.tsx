import React, { useRef } from "react";
import { UploadCloud } from "lucide-react";

interface FileUploadProps {
  accept: string;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  multiple = false,
  onFilesSelected,
  label = "Click to upload or drag and drop",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-pink-500 dark:hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-slate-800/50 rounded-xl p-8 cursor-pointer transition-all text-center group bg-white dark:bg-transparent"
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />
      <div className="flex flex-col items-center gap-3">
        <div className="p-4 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-pink-50 dark:group-hover:bg-pink-500/20 text-slate-400 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors">
          <UploadCloud size={32} />
        </div>
        <div>
          <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
            {label}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Supported: {accept.replace(/\./g, " ").toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
