import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2 } from "lucide-react";
import { Group, Text } from "@mantine/core";
import { useSettingsContext } from "../../contexts/SettingsContext";

// Configure PDF.js worker to use local file
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf-worker/pdf.worker.mjs";

interface PdfPreviewProps {
  file: File | Uint8Array;
  pageNumbers?: number[]; // If specified, only show these pages (1-indexed)
  onLoad?: (totalPages: number) => void;
  maxHeight?: number;
}

const PdfPreview: React.FC<PdfPreviewProps> = ({
  file,
  pageNumbers,
  onLoad,
  maxHeight = 600,
}) => {
  const { settings } = useSettingsContext();
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfData, setPdfData] = useState<{ data: Uint8Array } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (file instanceof File) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          // Convert ArrayBuffer to Uint8Array for react-pdf
          setPdfData({ data: new Uint8Array(reader.result) });
        }
      };
      reader.onerror = () => {
        setError("Failed to read file");
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Uint8Array can be passed directly in the format react-pdf expects
      setPdfData({ data: file });
    }
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
    onLoad?.(numPages);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("PDF load error:", error);
    setError("Failed to load PDF file. Please try again.");
  };

  const pagesToShow =
    pageNumbers || Array.from({ length: numPages }, (_, i) => i + 1);

  return (
    <div className="space-y-4">
      <Group
        justify="center"
        className="sticky top-0 z-10 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700"
      >
        <Text size="sm" c="dimmed">
          {pageNumbers
            ? `Showing ${pagesToShow.length} selected page${
                pagesToShow.length > 1 ? "s" : ""
              }`
            : `Total ${numPages} page${numPages > 1 ? "s" : ""}`}
        </Text>
      </Group>

      <div
        className="space-y-4 overflow-y-auto"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        {error ? (
          <div className="flex items-center justify-center p-8 text-red-500 dark:text-red-400">
            <Text size="sm">{error}</Text>
          </div>
        ) : pdfData ? (
          <Document
            file={pdfData}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center p-8">
                <Loader2
                  className="animate-spin"
                  size={32}
                  style={{
                    color: `var(--mantine-color-${settings.primaryColor}-6)`,
                  }}
                />
              </div>
            }
          >
            {pagesToShow.map((pageNum) => (
              <div key={pageNum} className="mb-4 last:mb-0">
                <Page
                  pageNumber={pageNum}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-lg"
                />
                <Text size="xs" c="dimmed" ta="center" mt="xs">
                  Page {pageNum}
                  {numPages > 0 && ` / ${numPages}`}
                </Text>
              </div>
            ))}
          </Document>
        ) : null}
      </div>
    </div>
  );
};

export default PdfPreview;
