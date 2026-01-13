import React, { useRef } from "react";
import { UploadCloud } from "lucide-react";
import { useSettingsContext } from "../../contexts/SettingsContext";

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
  const { settings } = useSettingsContext();
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

  const primaryColor = `var(--mantine-color-${settings.primaryColor}-6)`;
  const primaryColorLight = `var(--mantine-color-${settings.primaryColor}-0)`;
  const primaryColorLightAlpha = `var(--mantine-color-${settings.primaryColor}-5)`;

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 cursor-pointer transition-all text-center group bg-white dark:bg-transparent hover-file-upload"
      style={
        {
          // @ts-ignore - CSS custom properties
          "--hover-border-color": primaryColor,
          "--hover-bg-color": primaryColorLight,
          "--hover-icon-bg": primaryColorLightAlpha,
          "--hover-icon-color": primaryColor,
        } as React.CSSProperties
      }
    >
      <style>
        {`
          .hover-file-upload:hover {
            border-color: var(--hover-border-color) !important;
          }
          .hover-file-upload:hover .icon-wrapper {
            color: var(--hover-icon-color);
          }
        `}
      </style>
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
      />
      <div className="flex flex-col items-center gap-3">
        <div className="icon-wrapper p-4 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 transition-colors">
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
