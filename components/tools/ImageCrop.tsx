import React, { useState, useRef } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { Crop as CropIcon, Download, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@mantine/core";
import FileUpload from "../ui/FileUpload";
import { cropImageCanvas } from "../../services/imageService";
import { downloadBlob } from "../../services/pdfService";
import { useSettingsContext } from "../../contexts/SettingsContext";

const ImageCrop: React.FC = () => {
  const { settings } = useSettingsContext();
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [processing, setProcessing] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const onSelectFile = (files: File[]) => {
    if (files && files.length > 0) {
      setFile(files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setImgSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(files[0]);
    }
  };

  const handleDownloadCrop = async () => {
    if (completedCrop && imgRef.current && file) {
      setProcessing(true);
      try {
        // Pass file.type to preserve original format (e.g., JPEG remains JPEG)
        // Pass 0.95 quality to ensure good output
        const blob = await cropImageCanvas(
          imgRef.current,
          completedCrop,
          file.name,
          file.type,
          0.95
        );
        downloadBlob(blob, `cropped-${file.name}`);
      } catch (e) {
        console.error(e);
        alert("Error cropping image");
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="prose dark:prose-invert">
        <h3 className="text-slate-900 dark:text-white">Crop Image</h3>
        <p className="text-slate-500 dark:text-slate-400">
          Select an area to crop and download.
        </p>
      </div>

      {!file ? (
        <FileUpload
          accept="image/*"
          onFilesSelected={onSelectFile}
          label="Upload Image to Crop"
        />
      ) : (
        <div className="flex flex-col h-full gap-4">
          <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <CropIcon
                size={20}
                style={{
                  color: `var(--mantine-color-${settings.primaryColor}-6)`,
                }}
              />
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Adjust Selection
              </span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="default"
                onClick={() => {
                  setFile(null);
                  setImgSrc("");
                }}
                leftSection={<RefreshCw size={16} />}
                size="sm"
              >
                Reset
              </Button>
              <Button
                onClick={handleDownloadCrop}
                disabled={!completedCrop || processing}
                loading={processing}
                color={settings.primaryColor}
                leftSection={!processing && <Download size={16} />}
                size="sm"
              >
                Download Crop
              </Button>
            </div>
          </div>

          <div className="bg-slate-100 dark:bg-slate-900 rounded-xl overflow-auto border border-slate-200 dark:border-slate-800 p-4 flex justify-center min-h-[400px]">
            {imgSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                className="max-h-[60vh]"
              >
                <img
                  ref={imgRef}
                  alt="Crop me"
                  src={imgSrc}
                  className="max-w-full"
                  onLoad={(e) => {
                    const { width, height } = e.currentTarget;
                    // Center initial crop
                    const size = Math.min(width, height) * 0.8;
                    const x = (width - size) / 2;
                    const y = (height - size) / 2;
                    setCrop({ unit: "px", x, y, width: size, height: size });
                  }}
                />
              </ReactCrop>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCrop;
