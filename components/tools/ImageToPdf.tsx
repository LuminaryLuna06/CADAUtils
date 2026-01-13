import React, { useState, useEffect } from "react";
import {
  RotateCw,
  X,
  Download,
  Loader2,
  GripVertical,
  FileImage,
  FileText,
  Eye,
} from "lucide-react";
import {
  Select,
  NumberInput,
  Radio,
  Checkbox,
  Group,
  Stack,
  Text,
  Button,
  Paper,
  Modal,
  Center,
  Loader,
} from "@mantine/core";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import JSZip from "jszip";
import FileUpload from "../ui/FileUpload";
import {
  imagesToPdfAdvanced,
  downloadBlob,
  getPdfPageCount,
  type FileItem,
  type PdfGenerationOptions,
  type PaperSize,
  type Rotation,
  type Orientation,
} from "../../services/pdfService";
import { useSettingsContext } from "../../contexts/SettingsContext";

interface FileItemState {
  id: string;
  file: File;
  type: "image" | "pdf";
  rotation: Rotation;
  preview: string;
  pageCount?: number;
}

const ImageToPdf: React.FC = () => {
  const { settings } = useSettingsContext();
  const [items, setItems] = useState<FileItemState[]>([]);
  const [processing, setProcessing] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const [options, setOptions] = useState<PdfGenerationOptions>({
    pageSize: "A4",
    orientation: "portrait",
    margins: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
    separatePdfs: false,
    globalRotation: 0,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewPageCount, setPreviewPageCount] = useState(0);

  const handleFiles = async (newFiles: File[]) => {
    const newItems: FileItemState[] = [];

    for (const file of newFiles) {
      const type = file.type.startsWith("image/") ? "image" : "pdf";
      const id = `${file.name}-${Date.now()}-${Math.random()}`;
      const preview = URL.createObjectURL(file);

      let pageCount: number | undefined;
      if (type === "pdf") {
        try {
          pageCount = await getPdfPageCount(file);
        } catch (err) {
          console.error("Error getting PDF page count:", err);
        }
      }

      newItems.push({
        id,
        file,
        type,
        rotation: 0,
        preview,
        pageCount,
      });
    }

    setItems((prev) => [...prev, ...newItems]);
  };

  // Cleanup preview URLs when component unmounts or items change
  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [items]);

  const rotateItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              rotation: ((item.rotation + 90) % 360) as Rotation,
            }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      URL.revokeObjectURL(item.preview);
    }
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newItems = [...items];
    const [moved] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, moved);
    setItems(newItems);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    moveItem(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleConvert = async () => {
    if (items.length === 0) return;

    setProcessing(true);
    try {
      const fileItems: FileItem[] = items.map((item) => ({
        file: item.file,
        type: item.type,
        rotation: item.rotation,
      }));

      const result = await imagesToPdfAdvanced(fileItems, options);

      if (options.separatePdfs && Array.isArray(result)) {
        // Create ZIP file with individual PDFs
        const zip = new JSZip();
        result.forEach((pdfBytes, index) => {
          const filename = `document-${index + 1}.pdf`;
          zip.file(filename, pdfBytes);
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadBlob(zipBlob, `converted-pdfs-${Date.now()}.zip`);
      } else if (!Array.isArray(result)) {
        // Single PDF
        downloadBlob(result, "combined-document.pdf");
      }
    } catch (err) {
      console.error(err);
      alert("Error converting to PDF");
    } finally {
      setProcessing(false);
    }
  };

  const handlePreview = async () => {
    if (items.length === 0) return;

    // Don't preview if separatePdfs is enabled
    if (options.separatePdfs) {
      alert(
        "Preview is not available for separate PDFs mode. Please disable 'Create separate PDFs' to preview."
      );
      return;
    }

    setProcessing(true);
    try {
      const fileItems: FileItem[] = items.map((item) => ({
        file: item.file,
        type: item.type,
        rotation: item.rotation,
      }));

      const result = await imagesToPdfAdvanced(fileItems, options);

      if (!Array.isArray(result)) {
        // Single PDF - create blob URL for preview
        const blob = new Blob([result as BlobPart], {
          type: "application/pdf",
        });
        const url = URL.createObjectURL(blob);

        // Clean up old preview URL if exists
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(url);
        setShowPreview(true);
      }
    } catch (err) {
      console.error(err);
      alert("Error generating preview");
    } finally {
      setProcessing(false);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const downloadFromPreview = () => {
    if (previewUrl) {
      fetch(previewUrl)
        .then((res) => res.blob())
        .then((blob) => downloadBlob(blob, "preview-document.pdf"));
    }
  };

  // Set up PDF.js worker
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = `/pdf-worker/pdf.worker.mjs`;
  }, []);

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="space-y-6">
      <div className="prose dark:prose-invert">
        <h3 className="text-slate-900 dark:text-white">Image/PDF to PDF</h3>
        <p className="text-slate-500 dark:text-slate-400">
          Convert images and PDF files into customized PDF documents with
          rotation, margins, and layout controls.
        </p>
      </div>

      <FileUpload
        accept=".jpg, .jpeg, .png, .pdf"
        multiple
        onFilesSelected={handleFiles}
        label="Upload Images or PDFs"
      />

      {items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Item List */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-4 space-y-2 border border-slate-200 dark:border-slate-700 shadow-sm">
            <Text size="sm" fw={600} mb="sm">
              Files ({items.length})
            </Text>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 transition-all ${
                    draggedIndex === idx ? "opacity-50" : ""
                  } cursor-move pdf-item-draggable`}
                  style={
                    {
                      // @ts-ignore - CSS custom properties
                      "--hover-border-color": `var(--mantine-color-${settings.primaryColor}-3)`,
                    } as React.CSSProperties
                  }
                >
                  <style>
                    {`
                      .pdf-item-draggable:hover {
                        border-color: var(--hover-border-color) !important;
                      }
                    `}
                  </style>
                  <GripVertical size={16} className="text-slate-400 shrink-0" />

                  {/* Preview Thumbnail */}
                  <div
                    className="w-16 h-16 rounded overflow-hidden bg-slate-200 dark:bg-slate-900 shrink-0 border border-slate-200 dark:border-slate-600 flex items-center justify-center"
                    style={{
                      transform: `rotate(${item.rotation}deg)`,
                      transition: "transform 0.3s",
                    }}
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.preview}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FileText size={32} className="text-slate-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {item.type === "image" ? (
                        <FileImage size={14} className="text-blue-500" />
                      ) : (
                        <FileText size={14} className="text-red-500" />
                      )}
                      <p className="font-medium text-sm truncate text-slate-700 dark:text-slate-200">
                        {item.file.name}
                      </p>
                    </div>
                    <p className="text-xs text-slate-500">
                      {(item.file.size / 1024).toFixed(0)} KB
                      {item.pageCount && ` • ${item.pageCount} pages`}
                      {item.rotation !== 0 && ` • Rotated ${item.rotation}°`}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 shrink-0">
                    <button
                      onClick={() => rotateItem(item.id)}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded transition-colors"
                      title="Rotate 90°"
                    >
                      <RotateCw size={16} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 rounded ml-1"
                      title="Remove"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Panel */}
          <Paper
            p="md"
            radius="lg"
            withBorder
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-fit sticky top-4"
          >
            <Stack gap="md">
              <Text size="sm" fw={600}>
                PDF Settings
              </Text>

              <Select
                label="Paper Size"
                value={options.pageSize}
                onChange={(value) =>
                  setOptions((prev) => ({
                    ...prev,
                    pageSize: (value as PaperSize) || "A4",
                  }))
                }
                data={[
                  { value: "A4", label: "A4 (210 × 297 mm)" },
                  { value: "Letter", label: "Letter (8.5 × 11 in)" },
                  { value: "Legal", label: "Legal (8.5 × 14 in)" },
                  { value: "A3", label: "A3 (297 × 420 mm)" },
                  { value: "A5", label: "A5 (148 × 210 mm)" },
                ]}
                size="sm"
              />

              <div>
                <Text size="sm" fw={500} mb={8}>
                  Orientation
                </Text>
                <Radio.Group
                  value={options.orientation}
                  onChange={(value) =>
                    setOptions((prev) => ({
                      ...prev,
                      orientation: value as Orientation,
                    }))
                  }
                >
                  <Group>
                    <Radio value="portrait" label="Portrait" />
                    <Radio value="landscape" label="Landscape" />
                    <Radio value="auto" label="Auto" />
                  </Group>
                </Radio.Group>
              </div>

              <Select
                label="Global Rotation"
                description="Apply rotation to all items"
                value={options.globalRotation.toString()}
                onChange={(value) =>
                  setOptions((prev) => ({
                    ...prev,
                    globalRotation: parseInt(value || "0") as Rotation,
                  }))
                }
                data={[
                  { value: "0", label: "0°" },
                  { value: "90", label: "90° (Clockwise)" },
                  { value: "180", label: "180°" },
                  { value: "270", label: "270° (Counter-clockwise)" },
                ]}
                size="sm"
              />

              <div>
                <Text size="sm" fw={500} mb={8}>
                  Margins (mm)
                </Text>
                <div className="grid grid-cols-2 gap-2">
                  <NumberInput
                    label="Top"
                    value={options.margins.top}
                    onChange={(value) =>
                      setOptions((prev) => ({
                        ...prev,
                        margins: { ...prev.margins, top: Number(value) || 0 },
                      }))
                    }
                    min={0}
                    max={100}
                    size="xs"
                  />
                  <NumberInput
                    label="Right"
                    value={options.margins.right}
                    onChange={(value) =>
                      setOptions((prev) => ({
                        ...prev,
                        margins: { ...prev.margins, right: Number(value) || 0 },
                      }))
                    }
                    min={0}
                    max={100}
                    size="xs"
                  />
                  <NumberInput
                    label="Bottom"
                    value={options.margins.bottom}
                    onChange={(value) =>
                      setOptions((prev) => ({
                        ...prev,
                        margins: {
                          ...prev.margins,
                          bottom: Number(value) || 0,
                        },
                      }))
                    }
                    min={0}
                    max={100}
                    size="xs"
                  />
                  <NumberInput
                    label="Left"
                    value={options.margins.left}
                    onChange={(value) =>
                      setOptions((prev) => ({
                        ...prev,
                        margins: { ...prev.margins, left: Number(value) || 0 },
                      }))
                    }
                    min={0}
                    max={100}
                    size="xs"
                  />
                </div>
              </div>

              <Checkbox
                label="Create separate PDFs (ZIP)"
                checked={options.separatePdfs}
                onChange={(e) => {
                  const checked = e.currentTarget.checked;
                  setOptions((prev) => ({
                    ...prev,
                    separatePdfs: checked,
                  }));
                }}
              />

              <Button
                onClick={handlePreview}
                disabled={
                  processing || items.length === 0 || options.separatePdfs
                }
                loading={processing}
                leftSection={!processing && <Eye size={18} />}
                fullWidth
                variant="light"
                color="blue"
                size="md"
              >
                {processing ? "Generating..." : "Preview PDF"}
              </Button>

              <Button
                onClick={handleConvert}
                disabled={processing || items.length === 0}
                loading={processing}
                leftSection={!processing && <Download size={18} />}
                fullWidth
                color={settings.primaryColor}
                size="md"
              >
                {processing
                  ? "Generating..."
                  : options.separatePdfs
                  ? "Download ZIP"
                  : "Convert to PDF"}
              </Button>
            </Stack>
          </Paper>
        </div>
      )}

      {/* Preview Modal */}
      <Modal
        opened={showPreview}
        onClose={closePreview}
        size="xl"
        title="PDF Preview"
        centered
      >
        <Stack gap="md">
          {previewUrl && (
            <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-lg max-h-[70vh] overflow-auto flex flex-col items-center gap-4">
              <Document
                file={previewUrl}
                onLoadSuccess={({ numPages }) => setPreviewPageCount(numPages)}
                loading={
                  <Center p="xl">
                    <Loader size="lg" />
                  </Center>
                }
                error={
                  <Center p="xl">
                    <Text c="red">Failed to load PDF preview</Text>
                  </Center>
                }
              >
                {Array.from({ length: previewPageCount }, (_, index) => (
                  <div key={`page-${index + 1}`} className="mb-4 last:mb-0">
                    <Page
                      pageNumber={index + 1}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      className="shadow-lg"
                    />
                    {previewPageCount > 1 && (
                      <Text size="xs" c="dimmed" ta="center" mt="xs">
                        Page {index + 1} of {previewPageCount}
                      </Text>
                    )}
                  </div>
                ))}
              </Document>
            </div>
          )}

          <Group justify="flex-end">
            <Button variant="default" onClick={closePreview}>
              Close
            </Button>
            <Button
              color={settings.primaryColor}
              leftSection={<Download size={18} />}
              onClick={downloadFromPreview}
            >
              Download PDF
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
};

export default ImageToPdf;
