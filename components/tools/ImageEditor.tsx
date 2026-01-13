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
  Palette,
  RotateCw,
  RotateCcw,
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
  ColorInput,
} from "@mantine/core";
import FileUpload from "../ui/FileUpload";
import {
  resizeImage,
  cropImageCanvas,
  applyImageStyle,
  type ImageStyleOptions,
} from "../../services/imageService";
import { downloadBlob } from "../../services/pdfService";
import { useSettingsContext } from "../../contexts/SettingsContext";

type EditorMode = "resize" | "crop" | "style";

interface HistoryEntry {
  url: string;
  style: {
    rotation: number;
    borderRadius: number;
    backgroundColor: string;
    padding: number;
  };
}

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
  const { settings } = useSettingsContext();
  const [file, setFile] = useState<File | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string>("");
  const [currentSrc, setCurrentSrc] = useState<string>("");
  const [styleBaseSrc, setStyleBaseSrc] = useState<string>(""); // source used for styling (crop/resize applied, style not compounded)
  const [mode, setMode] = useState<EditorMode>("resize");
  const [processing, setProcessing] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

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

  // Style State
  const [rotation, setRotation] = useState(0);
  const [borderRadius, setBorderRadius] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [padding, setPadding] = useState(0);

  // Ref to prevent duplicate style applications
  const isApplyingStyle = useRef(false);

  // Initialize image
  const onFileSelected = (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setOriginalSrc(url);
      setCurrentSrc(url);
      setStyleBaseSrc(url);
      setHistory([
        {
          url,
          style: {
            rotation: 0,
            borderRadius: 0,
            backgroundColor: "#FFFFFF",
            padding: 0,
          },
        },
      ]);
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

      updateImageState(newUrl, { updateStyleBase: true });
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
      updateImageState(newUrl, { updateStyleBase: true });

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

  // --- Style Logic ---
  const adjustRotation = (delta: number) => {
    setRotation((prev) => {
      const next = (prev + delta) % 360;
      return next < 0 ? next + 360 : next;
    });
  };

  const applyStyle = async () => {
    if (!file || isApplyingStyle.current) return;

    isApplyingStyle.current = true;
    setProcessing(true);
    try {
      // Apply style on the latest non-styled image to avoid compounding rotations/styles
      // Prefer styleBaseSrc (set after crop/resize/reset/file change); fallback to original
      const baseSrc = styleBaseSrc || originalSrc;
      const response = await fetch(baseSrc);
      const blob = await response.blob();
      const currentFile = new File([blob], file.name, { type: file.type });

      const styledBlob = await applyImageStyle(currentFile, {
        rotation,
        borderRadius,
        backgroundColor,
        padding,
      });
      const newUrl = URL.createObjectURL(styledBlob);

      updateImageState(newUrl);
    } catch (error) {
      console.error(error);
      alert("Style application failed");
    } finally {
      setProcessing(false);
      isApplyingStyle.current = false;
    }
  };

  // Auto-apply style when in style mode and values change
  useEffect(() => {
    if (mode === "style" && file && originalSrc && !isApplyingStyle.current) {
      // Only apply if at least one style value is non-default
      // This prevents creating duplicate history entry on mode switch

      // Check if current style values match the last history entry
      const lastEntry = history[history.length - 1];
      if (
        lastEntry &&
        lastEntry.style.rotation === rotation &&
        lastEntry.style.borderRadius === borderRadius &&
        lastEntry.style.backgroundColor === backgroundColor &&
        lastEntry.style.padding === padding
      ) {
        return; // Skip if same as last entry
      }

      applyStyle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rotation, borderRadius, backgroundColor, padding]);

  // --- Shared Logic ---
  const updateImageState = (
    newUrl: string,
    options: { updateStyleBase?: boolean } = {}
  ) => {
    setCurrentSrc(newUrl);
    if (options.updateStyleBase) {
      setStyleBaseSrc(newUrl);
    }
    setHistory((prev) => [
      ...prev,
      {
        url: newUrl,
        style: { rotation, borderRadius, backgroundColor, padding },
      },
    ]);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current
      const prevEntry = newHistory[newHistory.length - 1];
      setCurrentSrc(prevEntry.url);
      setHistory(newHistory);

      // Restore style state from history
      setRotation(prevEntry.style.rotation);
      setBorderRadius(prevEntry.style.borderRadius);
      setBackgroundColor(prevEntry.style.backgroundColor);
      setPadding(prevEntry.style.padding);

      // Align style base with the reverted image to prevent compounding
      setStyleBaseSrc(prevEntry.url);
    }
  };

  const handleReset = () => {
    setCurrentSrc(originalSrc);
    setStyleBaseSrc(originalSrc);
    setHistory([
      {
        url: originalSrc,
        style: {
          rotation: 0,
          borderRadius: 0,
          backgroundColor: "#FFFFFF",
          padding: 0,
        },
      },
    ]);
    setPercentage(100);
    setCrop(undefined);
    setCompletedCrop(undefined);

    // Reset style controls to default
    setRotation(0);
    setBorderRadius(0);
    setBackgroundColor("#FFFFFF");
    setPadding(0);
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
                { label: "Style", value: "style" },
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
                // color="#fff"
                backgroundOpacity={0.1}
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
                <div
                  className="flex items-center gap-2 font-medium pb-2 border-b border-slate-100 dark:border-slate-700"
                  style={{
                    color: `var(--mantine-color-${settings.primaryColor}-6)`,
                  }}
                >
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
                  onChange={(e) => {
                    const checked = e.currentTarget.checked;
                    setLockAspect(checked);
                  }}
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
                <div
                  className="flex items-center gap-2 font-medium pb-2 border-b border-slate-100 dark:border-slate-700"
                  style={{
                    color: `var(--mantine-color-${settings.primaryColor}-6)`,
                  }}
                >
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
                      color={
                        cropAspect === undefined
                          ? settings.primaryColor
                          : "gray"
                      }
                      disabled={!file}
                    >
                      Free Form
                    </Button>
                    <Button
                      variant={cropAspect === 1 ? "filled" : "light"}
                      onClick={() => handleAspectClick(1)}
                      fullWidth
                      justify="start"
                      color={cropAspect === 1 ? settings.primaryColor : "gray"}
                      disabled={!file}
                    >
                      Square (1:1)
                    </Button>
                    <Button
                      variant={cropAspect === 16 / 9 ? "filled" : "light"}
                      onClick={() => handleAspectClick(16 / 9)}
                      fullWidth
                      justify="start"
                      color={
                        cropAspect === 16 / 9 ? settings.primaryColor : "gray"
                      }
                      disabled={!file}
                    >
                      Landscape (16:9)
                    </Button>
                    <Button
                      variant={cropAspect === 4 / 3 ? "filled" : "light"}
                      onClick={() => handleAspectClick(4 / 3)}
                      fullWidth
                      justify="start"
                      color={
                        cropAspect === 4 / 3 ? settings.primaryColor : "gray"
                      }
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

            {mode === "style" && (
              <Stack gap="lg">
                <div
                  className="flex items-center gap-2 font-medium pb-2 border-b border-slate-100 dark:border-slate-700"
                  style={{
                    color: `var(--mantine-color-${settings.primaryColor}-6)`,
                  }}
                >
                  <Palette size={20} />
                  <span>Style Options</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Text size="sm" fw={500}>
                      Rotation
                    </Text>
                    <Badge color="gray" variant="light">
                      {rotation}°
                    </Badge>
                  </div>
                  <Group grow>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => adjustRotation(-90)}
                      disabled={!file}
                      leftSection={
                        <RotateCw size={14} className="rotate-180" />
                      }
                    >
                      -90°
                    </Button>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => adjustRotation(90)}
                      disabled={!file}
                      leftSection={<RotateCw size={14} />}
                    >
                      +90°
                    </Button>
                  </Group>
                </div>

                <div>
                  <Text size="sm" fw={500} mb="xs">
                    Border Radius
                  </Text>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={borderRadius === 0 ? "filled" : "light"}
                      size="sm"
                      onClick={() => setBorderRadius(0)}
                      disabled={!file}
                      color={
                        borderRadius === 0 ? settings.primaryColor : "gray"
                      }
                    >
                      0%
                    </Button>
                    <Button
                      variant={borderRadius === 10 ? "filled" : "light"}
                      size="sm"
                      onClick={() => setBorderRadius(10)}
                      disabled={!file}
                      color={
                        borderRadius === 10 ? settings.primaryColor : "gray"
                      }
                    >
                      10%
                    </Button>
                    <Button
                      variant={borderRadius === 25 ? "filled" : "light"}
                      size="sm"
                      onClick={() => setBorderRadius(25)}
                      disabled={!file}
                      color={
                        borderRadius === 25 ? settings.primaryColor : "gray"
                      }
                    >
                      25%
                    </Button>
                    <Button
                      variant={borderRadius === 50 ? "filled" : "light"}
                      size="sm"
                      onClick={() => setBorderRadius(50)}
                      disabled={!file}
                      color={
                        borderRadius === 50 ? settings.primaryColor : "gray"
                      }
                    >
                      50%
                    </Button>
                  </div>
                </div>

                <div>
                  <Text size="sm" fw={500} mb="xs">
                    Background Color
                  </Text>
                  <ColorInput
                    value={backgroundColor}
                    onChange={setBackgroundColor}
                    format="hex"
                    disabled={!file}
                    placeholder="transparent"
                    swatches={[
                      "transparent",
                      "#FFFFFF",
                      "#000000",
                      "#F0F0F0",
                      "#3B82F6",
                      "#EF4444",
                      "#10B981",
                      "#F59E0B",
                    ]}
                  />
                </div>

                <div>
                  <Text size="sm" fw={500} mb="xs">
                    Padding
                  </Text>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={padding === 0 ? "filled" : "light"}
                      size="sm"
                      onClick={() => setPadding(0)}
                      disabled={!file}
                      color={padding === 0 ? settings.primaryColor : "gray"}
                    >
                      0 px
                    </Button>
                    <Button
                      variant={padding === 10 ? "filled" : "light"}
                      size="sm"
                      onClick={() => setPadding(10)}
                      disabled={!file}
                      color={padding === 10 ? settings.primaryColor : "gray"}
                    >
                      10 px
                    </Button>
                    <Button
                      variant={padding === 25 ? "filled" : "light"}
                      size="sm"
                      onClick={() => setPadding(25)}
                      disabled={!file}
                      color={padding === 25 ? settings.primaryColor : "gray"}
                    >
                      25 px
                    </Button>
                    <Button
                      variant={padding === 50 ? "filled" : "light"}
                      size="sm"
                      onClick={() => setPadding(50)}
                      disabled={!file}
                      color={padding === 50 ? settings.primaryColor : "gray"}
                    >
                      50 px
                    </Button>
                  </div>
                </div>
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
                    className="max-h-[calc(100vh-250px)] max-w-full object-contain shadow-2xl"
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
