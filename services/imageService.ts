import imageCompression from "browser-image-compression";
import { PixelCrop } from "react-image-crop";

export interface CompressionOptions {
  mode: "quality" | "size";
  quality?: number; // 0 to 100
  targetSizeMB?: number;
  maxWidthOrHeight?: number;
}

export const compressImage = async (
  file: File,
  opts: CompressionOptions
): Promise<File> => {
  // Default options based on library recommendation
  const options: any = {
    useWebWorker: true,
    maxWidthOrHeight: opts.maxWidthOrHeight || 4096,
  };

  if (opts.mode === "size" && opts.targetSizeMB) {
    // Mode: Target Size (e.g., compress until under 1MB)
    options.maxSizeMB = opts.targetSizeMB;
    // When using maxSizeMB, initialQuality is usually not set manually,
    // or set high so the lib iterates down.
    options.initialQuality = 1.0;
  } else {
    // Mode: Manual Quality
    // Ensure maxSizeMB is high enough to not interfere with quality setting
    // or undefined to let quality drive the compression
    options.maxSizeMB = 50; // Set a high cap just in case

    let q = opts.quality || 80;
    if (q > 1) q = q / 100; // Normalize 0-100 to 0-1
    options.initialQuality = q;
  }

  return await imageCompression(file, options);
};

export const resizeImage = async (
  file: File,
  width: number,
  height: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Ensure integer dimensions for canvas
    const safeWidth = Math.round(width);
    const safeHeight = Math.round(height);

    if (safeWidth <= 0 || safeHeight <= 0) {
      return reject(new Error("Invalid dimensions"));
    }

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = safeWidth;
      canvas.height = safeHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context not available"));

      // Use high quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(img, 0, 0, safeWidth, safeHeight);

      // Determine output format.
      // If original type is not supported by toBlob (like empty string), default to PNG.
      const outputType =
        file.type === "image/jpeg" || file.type === "image/webp"
          ? file.type
          : "image/png";

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Resize conversion failed"));
        },
        outputType,
        0.92 // High quality for JPEG/WEBP
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));

    // Create object URL from file
    img.src = URL.createObjectURL(file);
  });
};

export const cropImageCanvas = async (
  image: HTMLImageElement,
  crop: PixelCrop,
  fileName: string,
  mimeType: string = "image/png", // Default to PNG if unknown
  quality: number = 0.9 // High quality default for JPEGs
): Promise<Blob> => {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");

  // If exporting as JPEG, fill background with white to handle transparency
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
};

export const convertImage = async (
  file: File,
  format: "png" | "jpeg" | "webp"
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context not available"));

      // Draw background white for JPEGs (handling transparency)
      if (format === "jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Conversion failed"));
        },
        `image/${format}`,
        0.92
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export interface ImageStyleOptions {
  rotation: number; // 0-360 degrees
  borderRadius: number; // 0-50 percentage
  backgroundColor: string; // hex color
  padding: number; // pixels
}

export const applyImageStyle = async (
  file: File,
  options: ImageStyleOptions
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const { rotation, borderRadius, backgroundColor, padding } = options;

      // Calculate rotated dimensions
      const angleRad = (rotation * Math.PI) / 180;
      const sin = Math.abs(Math.sin(angleRad));
      const cos = Math.abs(Math.cos(angleRad));

      const rotatedWidth = img.width * cos + img.height * sin;
      const rotatedHeight = img.width * sin + img.height * cos;

      // Add padding to dimensions
      const canvasWidth = Math.round(rotatedWidth + padding * 2);
      const canvasHeight = Math.round(rotatedHeight + padding * 2);

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context not available"));

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Fill background color
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      // Save context, move to center, and rotate
      ctx.save();
      ctx.translate(canvasWidth / 2, canvasHeight / 2);
      ctx.rotate(angleRad);

      // Apply border radius if needed
      if (borderRadius > 0) {
        const radius = Math.min(img.width, img.height) * (borderRadius / 100);
        const x = -img.width / 2;
        const y = -img.height / 2;

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + img.width - radius, y);
        ctx.quadraticCurveTo(x + img.width, y, x + img.width, y + radius);
        ctx.lineTo(x + img.width, y + img.height - radius);
        ctx.quadraticCurveTo(
          x + img.width,
          y + img.height,
          x + img.width - radius,
          y + img.height
        );
        ctx.lineTo(x + radius, y + img.height);
        ctx.quadraticCurveTo(x, y + img.height, x, y + img.height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.clip();
      }

      // Draw image centered
      ctx.drawImage(
        img,
        -img.width / 2,
        -img.height / 2,
        img.width,
        img.height
      );
      ctx.restore();

      // Determine output format
      const outputType =
        file.type === "image/jpeg" || file.type === "image/webp"
          ? file.type
          : "image/png";

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Style application failed"));
        },
        outputType,
        0.92
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};
