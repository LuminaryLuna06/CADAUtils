// Ghostscript WASM service for PDF compression
// Uses @zfanta/ghostscript-wasm loaded from CDN

export type CompressionQuality = "screen" | "ebook" | "printer" | "prepress";

interface CompressionOptions {
  quality: CompressionQuality;
  onProgress?: (progress: number, message: string) => void;
}

interface CompressionResult {
  data: Uint8Array;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
}

// Quality preset descriptions
export const QUALITY_PRESETS = {
  screen: {
    label: "Screen",
    description: "Low quality (72 DPI) - Smallest file, best for web viewing",
    dpi: 72,
    compression: "High (70-80%)",
  },
  ebook: {
    label: "eBook",
    description: "Medium quality (150 DPI) - Good balance for digital reading",
    dpi: 150,
    compression: "Medium (50-70%)",
  },
  printer: {
    label: "Printer",
    description: "High quality (300 DPI) - Suitable for printing",
    dpi: 300,
    compression: "Low (30-50%)",
  },
  prepress: {
    label: "Prepress",
    description: "Highest quality (300 DPI) - Professional printing",
    dpi: 300,
    compression: "Minimal (10-30%)",
  },
};

// Ghostscript WASM module interface (simplified)
interface GhostscriptModule {
  FS: {
    writeFile: (path: string, data: Uint8Array) => void;
    readFile: (path: string) => Uint8Array;
    unlink: (path: string) => void;
  };
  callMain: (args: string[]) => number;
}

let ghostscriptModule: GhostscriptModule | null = null;
let loadingPromise: Promise<GhostscriptModule> | null = null;

/**
 * Load Ghostscript WASM module from npm package
 */
async function loadGhostscript(): Promise<GhostscriptModule> {
  // Return cached module if already loaded
  if (ghostscriptModule) {
    return ghostscriptModule;
  }

  // Return existing loading promise if already loading
  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      // Ghostscript WASM is Emscripten-generated, not a standard ES module
      // Load it as a script tag instead

      const script = document.createElement("script");
      script.src = "/node_modules/@zfanta/ghostscript-wasm/dist/gs.js";

      // Wait for script to load
      await new Promise<void>((resolve, reject) => {
        script.onload = () => {
          console.log("Ghostscript script loaded");
          resolve();
        };
        script.onerror = () => reject(new Error("Failed to load script"));
        document.head.appendChild(script);
      });

      // After loading, check for global Module factory
      const globalWindow = window as any;
      const moduleFactory = globalWindow.Module || globalWindow.createModule;

      console.log("Looking for Module in window:", {
        Module: typeof globalWindow.Module,
        createModule: typeof globalWindow.createModule,
        keys: Object.keys(globalWindow).filter((k) =>
          k.toLowerCase().includes("module")
        ),
      });

      if (!moduleFactory) {
        throw new Error("Ghostscript Module factory not found in global scope");
      }

      console.log("Found factory, initializing...");

      // Initialize WASM with config
      const module = await moduleFactory({
        locateFile: (path: string) => {
          if (path.endsWith(".wasm")) {
            return "/node_modules/@zfanta/ghostscript-wasm/dist/" + path;
          }
          return path;
        },
      });

      ghostscriptModule = module;
      return module;
    } catch (error) {
      loadingPromise = null;
      throw new Error(`Failed to load Ghostscript WASM: ${error}`);
    }
  })();

  return loadingPromise;
}

/**
 * Compress PDF using Ghostscript WASM
 */
export async function compressPdf(
  file: File,
  options: CompressionOptions
): Promise<CompressionResult> {
  const { quality, onProgress } = options;

  const originalSize = file.size;

  try {
    // Step 1: Load Ghostscript module
    onProgress?.(10, "Loading compression engine...");
    const gs = await loadGhostscript();

    // Step 2: Read input file
    onProgress?.(20, "Reading PDF file...");
    const inputData = new Uint8Array(await file.arrayBuffer());

    // Step 3: Write to virtual filesystem
    onProgress?.(30, "Preparing compression...");
    const inputPath = "input.pdf";
    const outputPath = "output.pdf";

    gs.FS.writeFile(inputPath, inputData);

    // Step 4: Build Ghostscript arguments
    onProgress?.(40, "Compressing PDF...");
    const args = [
      "-sDEVICE=pdfwrite",
      "-dCompatibilityLevel=1.4",
      `-dPDFSETTINGS=/${quality}`,
      "-dNOPAUSE",
      "-dQUIET",
      "-dBATCH",
      `-sOutputFile=${outputPath}`,
      inputPath,
    ];

    // Step 5: Run Ghostscript
    const exitCode = gs.callMain(args);

    if (exitCode !== 0) {
      throw new Error(`Ghostscript failed with exit code ${exitCode}`);
    }

    // Step 6: Read compressed output
    onProgress?.(90, "Reading compressed file...");
    const outputData = gs.FS.readFile(outputPath);

    // Step 7: Cleanup virtual filesystem
    onProgress?.(95, "Cleaning up...");
    try {
      gs.FS.unlink(inputPath);
      gs.FS.unlink(outputPath);
    } catch (e) {
      // Ignore cleanup errors
    }

    // Step 8: Calculate compression ratio
    const compressedSize = outputData.byteLength;
    const compressionRatio =
      ((originalSize - compressedSize) / originalSize) * 100;

    onProgress?.(100, "Complete!");

    return {
      data: outputData,
      originalSize,
      compressedSize,
      compressionRatio: Math.max(0, compressionRatio),
    };
  } catch (error) {
    console.error("PDF compression error:", error);
    throw new Error(
      `Compression failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Check if Ghostscript WASM is supported in current browser
 */
export function isGhostscriptSupported(): boolean {
  try {
    // Check for WebAssembly support
    if (typeof WebAssembly !== "object") {
      return false;
    }

    // Check for required APIs
    return typeof WebAssembly.instantiate === "function";
  } catch {
    return false;
  }
}
