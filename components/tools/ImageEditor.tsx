import React, { useState, useRef, useEffect } from "react";
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import {
  Download,
  RefreshCw,
  Maximize2,
  Crop as CropIcon,
  Check,
  Undo2,
  Image as ImageIcon,
  Upload,
} from "lucide-react";
import {
  Button,
  Paper,
  Group,
  Text,
  NumberInput,
  Slider,
  Checkbox,
  Stack,
  SegmentedControl,
  Badge,
  Overlay,
} from "@mantine/core";
import FileUpload from "../ui/FileUpload";
import { resizeImage, cropImageCanvas } from "../../services/imageService";
import { downloadBlob } from "../../services/pdfService";

type EditorMode = "resize" | "crop";

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      { unit: "px", width: mediaWidth * 0.9 },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const ImageEditor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string>("");
  const [currentSrc, setCurrentSrc] = useState<string>("");
  const [mode, setMode] = useState<EditorMode>("resize");
  const [processing, setProcessing] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  // Resize State
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [originalDims, setOriginalDims] = useState<{ w: number; h: number }>({
    w: 0,
    h: 0,
  }); // Store original dimensions
  const [aspectRatio, setAspectRatio] = useState(1);
  const [lockAspect, setLockAspect] = useState(true);
  const [percentage, setPercentage] = useState(100);

  // Crop State
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [cropAspect, setCropAspect] = useState<number | undefined>(undefined);
  const imgRef = useRef<HTMLImageElement>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  // Initialize image
  const onFileSelected = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setOriginalSrc(url);
      setCurrentSrc(url);
      setHistory([url]);
    }
  };

  const handleUploadClick = () => {
    uploadInputRef.current?.click();
  };

  const onUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(Array.from(e.target.files));
    }
    e.target.value = ""; // Reset value to allow re-uploading same file
  };

  // Handle Image Load (for both initial and updates)
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setWidth(naturalWidth);
    setHeight(naturalHeight);
    setOriginalDims({ w: naturalWidth, h: naturalHeight });
    setAspectRatio(naturalWidth / naturalHeight);
    setPercentage(100);

    // Reset crop when image changes
    if (mode === "crop") {
      setCrop(undefined);
      setCompletedCrop(undefined);
    }
  };

  // --- Resize Logic ---
  const handleWidthChange = (val: number | string) => {
    const w = typeof val === "string" ? parseFloat(val) : val;
    setWidth(w);
    if (lockAspect && !isNaN(w)) {
      setHeight(Math.round(w / aspectRatio));
    }
  };

  const handleHeightChange = (val: number | string) => {
    const h = typeof val === "string" ? parseFloat(val) : val;
    setHeight(h);
    if (lockAspect && !isNaN(h)) {
      setWidth(Math.round(h * aspectRatio));
    }
  };

  const handlePercentageChange = (val: number) => {
    setPercentage(val);
    if (originalDims.w > 0 && originalDims.h > 0) {
      const newW = Math.round(originalDims.w * (val / 100));
      setWidth(newW);
      // Determine height based on aspect ratio lock or pure percentage
      if (lockAspect) {
        setHeight(Math.round(newW / aspectRatio));
      } else {
        const newH = Math.round(originalDims.h * (val / 100));
        setHeight(newH);
      }
    }
  };

  const applyResize = async () => {
    if (!file) return;
    setProcessing(true);
    try {
      const response = await fetch(currentSrc);
      const blob = await response.blob();
      const currentFile = new File([blob], file.name, { type: file.type });

      const resizedBlob = await resizeImage(
        currentFile,
        Number(width),
        Number(height)
      );
      const newUrl = URL.createObjectURL(resizedBlob);

      updateImageState(newUrl);
    } catch (error) {
      console.error(error);
      alert("Resize failed");
    } finally {
      setProcessing(false);
    }
  };

  // --- Crop Logic ---
  const handleAspectClick = (val: number | undefined) => {
    setCropAspect(val);
    if (imgRef.current && val) {
      const { width, height } = imgRef.current;
      const newCrop = centerAspectCrop(width, height, val);
      setCrop(newCrop);
      setCompletedCrop(newCrop as PixelCrop);
    } else {
      setCrop(undefined);
      setCompletedCrop(undefined);
    }
  };

  const applyCrop = async () => {
    if (!completedCrop || !imgRef.current || !file) return;
    setProcessing(true);
    try {
      const blob = await cropImageCanvas(
        imgRef.current,
        completedCrop,
        file.name,
        file.type
      );
      const newUrl = URL.createObjectURL(blob);
      updateImageState(newUrl);

      // Switch back to free form or reset visual crop
      setCrop(undefined);
      setCompletedCrop(undefined);
    } catch (error) {
      console.error(error);
      alert("Crop failed");
    } finally {
      setProcessing(false);
    }
  };

  // --- Shared Logic ---
  const updateImageState = (newUrl: string) => {
    setCurrentSrc(newUrl);
    setHistory((prev) => [...prev, newUrl]);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current
      const prevUrl = newHistory[newHistory.length - 1];
      setCurrentSrc(prevUrl);
      setHistory(newHistory);
    }
  };

  const handleReset = () => {
    setCurrentSrc(originalSrc);
    setHistory([originalSrc]);
    setPercentage(100);
    setCrop(undefined);
    setCompletedCrop(undefined);
  };

  const handleDownload = () => {
    fetch(currentSrc)
      .then((res) => res.blob())
      .then((blob) =>
        downloadBlob(blob, `edited-${file?.name || "image.png"}`)
      );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header / Title Area */}
      <div className="shrink-0 mb-4 flex justify-between items-center">
        <div className="prose dark:prose-invert">
          <h3 className="text-slate-900 dark:text-white m-0">Image Editor</h3>
          <p className="text-slate-500 dark:text-slate-400 m-0 text-sm">
            Resize, crop, and transform your images locally.
          </p>
        </div>
        <input
          type="file"
          ref={uploadInputRef}
          className="hidden"
          accept="image/*"
          onChange={onUploadChange}
        />
        {file && (
          <Button
            variant="light"
            leftSection={<Upload size={16} />}
            onClick={handleUploadClick}
          >
            Change Image
          </Button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-6">
        {/* Left Sidebar: Controls */}
        <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0 overflow-y-auto pr-2 pb-2">
          {/* Mode Switcher */}
          <Paper
            p="sm"
            withBorder
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          >
            <SegmentedControl
              fullWidth
              value={mode}
              onChange={(val) => setMode(val as EditorMode)}
              disabled={!file}
              data={[
                { label: "Resize", value: "resize" },
                { label: "Crop", value: "crop" },
              ]}
            />
          </Paper>

          {/* Specific Controls based on Mode */}
          <Paper
            p="md"
            withBorder
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 flex-1 relative overflow-hidden"
          >
            {!file && (
              <Overlay
                color="#fff"
                backgroundOpacity={0.5}
                blur={2}
                zIndex={10}
                className="flex items-center justify-center"
              >
                <Text size="sm" c="dimmed" fs="italic">
                  Upload an image to edit
                </Text>
              </Overlay>
            )}

            {mode === "resize" && (
              <Stack gap="lg">
                <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-medium pb-2 border-b border-slate-100 dark:border-slate-700">
                  <Maximize2 size={20} />
                  <span>Resize Options</span>
                </div>

                <div>
                  <Text size="sm" fw={500} mb="xs">
                    Dimensions
                  </Text>
                  <Group grow>
                    <NumberInput
                      label="Width"
                      value={width}
                      onChange={handleWidthChange}
                      suffix=" px"
                      hideControls
                      disabled={!file}
                    />
                    <NumberInput
                      label="Height"
                      value={height}
                      onChange={handleHeightChange}
                      suffix=" px"
                      hideControls
                      disabled={!file}
                    />
                  </Group>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <Text size="sm" fw={500}>
                      Scale Percentage
                    </Text>
                    <Text size="sm" c="dimmed">
                      {percentage}%
                    </Text>
                  </div>
                  <Slider
                    value={percentage}
                    onChange={handlePercentageChange}
                    min={1}
                    max={200}
                    disabled={!file}
                    marks={[
                      { value: 50, label: "50%" },
                      { value: 100, label: "100%" },
                    ]}
                    mb="lg"
                  />
                </div>

                <Checkbox
                  label="Lock Aspect Ratio"
                  checked={lockAspect}
                  onChange={(e) => setLockAspect(e.currentTarget.checked)}
                  disabled={!file}
                />

                <Button
                  onClick={applyResize}
                  loading={processing}
                  leftSection={<Check size={18} />}
                  fullWidth
                  mt="auto"
                  disabled={!file}
                >
                  Apply Resize
                </Button>
              </Stack>
            )}

            {mode === "crop" && (
              <Stack gap="lg">
                <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-medium pb-2 border-b border-slate-100 dark:border-slate-700">
                  <CropIcon size={20} />
                  <span>Crop Options</span>
                </div>

                <div>
                  <Text size="sm" fw={500} mb="sm">
                    Aspect Ratio
                  </Text>
                  <Stack gap="xs">
                    <Button
                      variant={cropAspect === undefined ? "filled" : "light"}
                      onClick={() => handleAspectClick(undefined)}
                      fullWidth
                      justify="start"
                      color={cropAspect === undefined ? undefined : "gray"}
                      disabled={!file}
                    >
                      Free Form
                    </Button>
                    <Button
                      variant={cropAspect === 1 ? "filled" : "light"}
                      onClick={() => handleAspectClick(1)}
                      fullWidth
                      justify="start"
                      color={cropAspect === 1 ? undefined : "gray"}
                      disabled={!file}
                    >
                      Square (1:1)
                    </Button>
                    <Button
                      variant={cropAspect === 16 / 9 ? "filled" : "light"}
                      onClick={() => handleAspectClick(16 / 9)}
                      fullWidth
                      justify="start"
                      color={cropAspect === 16 / 9 ? undefined : "gray"}
                      disabled={!file}
                    >
                      Landscape (16:9)
                    </Button>
                    <Button
                      variant={cropAspect === 4 / 3 ? "filled" : "light"}
                      onClick={() => handleAspectClick(4 / 3)}
                      fullWidth
                      justify="start"
                      color={cropAspect === 4 / 3 ? undefined : "gray"}
                      disabled={!file}
                    >
                      Standard (4:3)
                    </Button>
                  </Stack>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded text-xs text-slate-500 dark:text-slate-400">
                  <p>Drag the corners on the image to adjust selection.</p>
                </div>

                <Button
                  onClick={applyCrop}
                  disabled={!completedCrop || !file}
                  loading={processing}
                  leftSection={<CropIcon size={18} />}
                  fullWidth
                  mt="auto"
                >
                  Crop Selection
                </Button>
              </Stack>
            )}
          </Paper>

          {/* Global Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="default"
              onClick={handleReset}
              disabled={!file}
              leftSection={<RefreshCw size={16} />}
            >
              Reset
            </Button>
            <Button
              variant="outline"
              color="yellow"
              onClick={handleUndo}
              disabled={history.length <= 1}
              leftSection={<Undo2 size={16} />}
            >
              Undo
            </Button>
          </div>
        </div>

        {/* Right Area: Preview or Dropzone */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden relative min-h-[400px]">
          {file && currentSrc ? (
            <>
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button
                  onClick={handleDownload}
                  color="green"
                  leftSection={<Download size={18} />}
                  className="shadow-sm"
                >
                  Download Result
                </Button>
              </div>

              <div className="flex-1 overflow-auto flex items-center justify-center p-8">
                {mode === "crop" ? (
                  <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={cropAspect}
                    className="max-h-full max-w-full shadow-2xl"
                  >
                    <img
                      ref={imgRef}
                      alt="Edit"
                      src={currentSrc}
                      onLoad={onImageLoad}
                      style={{
                        maxHeight: "calc(100vh - 250px)",
                        maxWidth: "100%",
                      }}
                    />
                  </ReactCrop>
                ) : (
                  <img
                    alt="Edit"
                    src={currentSrc}
                    onLoad={onImageLoad}
                    className="max-h-[calc(100vh-250px)] max-w-full object-contain shadow-2xl rounded-lg"
                  />
                )}
              </div>

              <div className="p-2 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
                Current Resolution: {Math.round(width)} x {Math.round(height)}{" "}
                px
              </div>
            </>
          ) : (
            <div className="flex-1 p-8 flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                <FileUpload
                  accept="image/*"
                  onFilesSelected={onFileSelected}
                  label="Upload Image to Start Editing"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
