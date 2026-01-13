import { PDFDocument, degrees } from "pdf-lib";

// Helper to parse page ranges like "1-3, 5, 8-10"
export const parsePageRange = (range: string, totalPages: number): number[] => {
  const pageIndices: Set<number> = new Set();
  const parts = range.split(",").map((p) => p.trim());

  parts.forEach((part) => {
    if (part.includes("-")) {
      const [start, end] = part.split("-").map(Number);
      if (!isNaN(start) && !isNaN(end)) {
        for (let i = start; i <= end; i++) {
          if (i > 0 && i <= totalPages) pageIndices.add(i - 1);
        }
      }
    } else {
      const pageNum = Number(part);
      if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
        pageIndices.add(pageNum - 1);
      }
    }
  });

  return Array.from(pageIndices).sort((a, b) => a - b);
};

// Get total page count from a PDF file
export const getPdfPageCount = async (file: File): Promise<number> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  return pdfDoc.getPageCount();
};

// Extract specific pages from a PDF file
export const extractPdfPages = async (
  file: File,
  pageIndices: number[]
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();

  const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
};

// Estimate compressed size based on quality preset
export const estimateCompressedSize = (
  originalSize: number,
  quality: string
): number => {
  const compressionRatios: Record<string, number> = {
    screen: 0.25, // ~25% of original
    ebook: 0.45, // ~45% of original
    printer: 0.65, // ~65% of original
    prepress: 0.85, // ~85% of original
  };

  const ratio = compressionRatios[quality] || 0.5;
  return Math.round(originalSize * ratio);
};

export const mergePdfs = async (files: File[]): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
};

// Merge PDFs with specific page ranges for each file
export const mergePdfsWithRanges = async (
  filesWithRanges: { file: File; range: string }[]
): Promise<Uint8Array> => {
  const mergedPdf = await PDFDocument.create();

  for (const { file, range } of filesWithRanges) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const totalPages = pdf.getPageCount();

    // If range is empty or "all", use all pages
    const pageIndices =
      range.trim() === "" || range.toLowerCase() === "all"
        ? pdf.getPageIndices()
        : parsePageRange(range, totalPages);

    if (pageIndices.length > 0) {
      const copiedPages = await mergedPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
  }

  return await mergedPdf.save();
};

export const splitPdf = async (
  file: File,
  range: string
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();

  const indicesArray = parsePageRange(range, totalPages);

  if (indicesArray.length === 0) {
    throw new Error("Invalid page range");
  }

  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdfDoc, indicesArray);
  copiedPages.forEach((page) => newPdf.addPage(page));

  return await newPdf.save();
};

export const imagesToPdf = async (files: File[]): Promise<Uint8Array> => {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const image =
      file.type === "image/png"
        ? await pdfDoc.embedPng(arrayBuffer)
        : await pdfDoc.embedJpg(arrayBuffer);

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  return await pdfDoc.save();
};

export const downloadBlob = (data: Uint8Array | Blob, filename: string) => {
  const blob =
    data instanceof Blob ? data : new Blob([data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ===== Advanced Image/PDF to PDF Conversion =====

// Paper sizes in points (1 point = 1/72 inch)
export const PAPER_SIZES = {
  A4: { width: 595.28, height: 841.89 },
  Letter: { width: 612, height: 792 },
  Legal: { width: 612, height: 1008 },
  A3: { width: 841.89, height: 1190.55 },
  A5: { width: 419.53, height: 595.28 },
} as const;

export type PaperSize = keyof typeof PAPER_SIZES;
export type Orientation = "portrait" | "landscape" | "auto";
export type Rotation = 0 | 90 | 180 | 270;

// Conversion factor: 1mm = 2.83465 points
export const MM_TO_POINTS = 2.83465;

export interface PdfGenerationOptions {
  pageSize: PaperSize;
  orientation: Orientation;
  margins: {
    top: number; // in mm
    right: number; // in mm
    bottom: number; // in mm
    left: number; // in mm
  };
  separatePdfs: boolean;
  globalRotation: Rotation;
}

export interface FileItem {
  file: File;
  type: "image" | "pdf";
  rotation: Rotation;
}

// Helper function to calculate page dimensions based on content and orientation
async function calculatePageDimensions(
  item: FileItem,
  rotation: Rotation,
  pageSize: PaperSize,
  orientation: Orientation
): Promise<{ pageWidth: number; pageHeight: number }> {
  let pageWidth: number = PAPER_SIZES[pageSize].width;
  let pageHeight: number = PAPER_SIZES[pageSize].height;

  if (orientation === "auto") {
    // Determine orientation based on content dimensions after rotation
    let contentWidth = 0;
    let contentHeight = 0;

    if (item.type === "image") {
      // Load image to get dimensions
      const arrayBuffer = await item.file.arrayBuffer();
      const blob = new Blob([arrayBuffer]);
      const img = await createImageBitmap(blob);
      contentWidth = img.width;
      contentHeight = img.height;
      img.close();
    } else {
      // For PDFs, use the first page dimensions
      const arrayBuffer = await item.file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      if (pdfDoc.getPageCount() > 0) {
        const page = pdfDoc.getPage(0);
        contentWidth = page.getWidth();
        contentHeight = page.getHeight();
      }
    }

    // Apply rotation to dimensions
    if (rotation === 90 || rotation === 270) {
      [contentWidth, contentHeight] = [contentHeight, contentWidth];
    }

    // Choose orientation based on aspect ratio
    const isWide = contentWidth > contentHeight;
    if (isWide) {
      const temp = pageWidth;
      pageWidth = pageHeight;
      pageHeight = temp; // landscape
    }
    // else portrait (default)
  } else if (orientation === "landscape") {
    const temp = pageWidth;
    pageWidth = pageHeight;
    pageHeight = temp;
  }
  // else portrait (default dimensions)

  return { pageWidth, pageHeight };
}

export const imagesToPdfAdvanced = async (
  items: FileItem[],
  options: PdfGenerationOptions
): Promise<Uint8Array | Uint8Array[]> => {
  const { pageSize, orientation, margins, separatePdfs, globalRotation } =
    options;

  // Convert margins from mm to points
  const marginTop = margins.top * MM_TO_POINTS;
  const marginRight = margins.right * MM_TO_POINTS;
  const marginBottom = margins.bottom * MM_TO_POINTS;
  const marginLeft = margins.left * MM_TO_POINTS;

  if (separatePdfs) {
    // Generate separate PDF for each item
    const pdfs: Uint8Array[] = [];

    for (const item of items) {
      const pdfDoc = await PDFDocument.create();

      // Calculate effective rotation
      const effectiveRotation = ((item.rotation + globalRotation) %
        360) as Rotation;

      // Determine page dimensions based on orientation
      const { pageWidth, pageHeight } = await calculatePageDimensions(
        item,
        effectiveRotation,
        pageSize,
        orientation
      );

      const contentWidth = pageWidth - marginLeft - marginRight;
      const contentHeight = pageHeight - marginTop - marginBottom;

      await addItemToDocument(
        pdfDoc,
        { ...item, rotation: effectiveRotation },
        pageWidth,
        pageHeight,
        contentWidth,
        contentHeight,
        marginLeft,
        marginBottom
      );
      pdfs.push(await pdfDoc.save());
    }

    return pdfs;
  } else {
    // Generate single combined PDF
    const pdfDoc = await PDFDocument.create();

    for (const item of items) {
      // Calculate effective rotation
      const effectiveRotation = ((item.rotation + globalRotation) %
        360) as Rotation;

      // Determine page dimensions based on orientation
      const { pageWidth, pageHeight } = await calculatePageDimensions(
        item,
        effectiveRotation,
        pageSize,
        orientation
      );

      const contentWidth = pageWidth - marginLeft - marginRight;
      const contentHeight = pageHeight - marginTop - marginBottom;

      await addItemToDocument(
        pdfDoc,
        { ...item, rotation: effectiveRotation },
        pageWidth,
        pageHeight,
        contentWidth,
        contentHeight,
        marginLeft,
        marginBottom
      );
    }

    return await pdfDoc.save();
  }
};

async function addItemToDocument(
  pdfDoc: PDFDocument,
  item: FileItem,
  pageWidth: number,
  pageHeight: number,
  contentWidth: number,
  contentHeight: number,
  marginLeft: number,
  marginBottom: number
) {
  if (item.type === "image") {
    // Handle image file
    const arrayBuffer = await item.file.arrayBuffer();
    const image =
      item.file.type === "image/png"
        ? await pdfDoc.embedPng(arrayBuffer)
        : await pdfDoc.embedJpg(arrayBuffer);

    // Calculate scaling to fit within content area
    const imgWidth = image.width;
    const imgHeight = image.height;

    // Dimensions for scaling calculation (swapped if rotated 90/270 to fit correctly)
    let bBoxWidth = imgWidth;
    let bBoxHeight = imgHeight;
    if (item.rotation === 90 || item.rotation === 270) {
      [bBoxWidth, bBoxHeight] = [bBoxHeight, bBoxWidth];
    }

    const scaleX = contentWidth / bBoxWidth;
    const scaleY = contentHeight / bBoxHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't upscale

    const finalWidth = imgWidth * scale;
    const finalHeight = imgHeight * scale;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Calculate position based on rotation
    // Use negative rotation to match CSS clockwise rotation
    const theta = -item.rotation;

    if (item.rotation === 0) {
      // No rotation - simple centering within content area
      const x = marginLeft + (contentWidth - finalWidth) / 2;
      const y = marginBottom + (contentHeight - finalHeight) / 2;

      page.drawImage(image, {
        x,
        y,
        width: finalWidth,
        height: finalHeight,
        rotate: degrees(0),
      });
    } else {
      // With rotation - calculate center position and adjust for rotation pivot
      const centerX = marginLeft + contentWidth / 2;
      const centerY = marginBottom + contentHeight / 2;

      // In pdf-lib, rotation happens around the bottom-left corner of the image
      // We need to position the image such that after rotation, it's centered
      const rad = (theta * Math.PI) / 180;

      // Position of center of image relative to its bottom-left corner
      const imgCenterX = finalWidth / 2;
      const imgCenterY = finalHeight / 2;

      // After rotation, where does the image center end up?
      const rotatedCenterX =
        imgCenterX * Math.cos(rad) - imgCenterY * Math.sin(rad);
      const rotatedCenterY =
        imgCenterX * Math.sin(rad) + imgCenterY * Math.cos(rad);

      // Calculate bottom-left position so rotated center aligns with content center
      const x = centerX - rotatedCenterX;
      const y = centerY - rotatedCenterY;

      page.drawImage(image, {
        x,
        y,
        width: finalWidth,
        height: finalHeight,
        rotate: degrees(theta),
      });
    }
  } else {
    // Handle PDF file - extract each page
    const arrayBuffer = await item.file.arrayBuffer();
    const srcDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = srcDoc.getPageCount();

    for (let i = 0; i < totalPages; i++) {
      const [embeddedPage] = await pdfDoc.copyPages(srcDoc, [i]);

      // Apply rotation to the embedded page (negative to match clockwise)
      if (item.rotation !== 0) {
        embeddedPage.setRotation(degrees(-item.rotation));
      }

      // Add the page directly - it will have its own size and rotation
      pdfDoc.addPage(embeddedPage);
    }
  }
}
