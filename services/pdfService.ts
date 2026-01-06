import { PDFDocument } from "pdf-lib";

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

export const splitPdf = async (
  file: File,
  range: string
): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const newPdf = await PDFDocument.create();
  const totalPages = pdfDoc.getPageCount();

  // Parse range "1-3, 5" -> [0, 1, 2, 4] (0-indexed)
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

  const indicesArray = Array.from(pageIndices).sort((a, b) => a - b);

  if (indicesArray.length === 0) {
    throw new Error("Invalid page range");
  }

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
