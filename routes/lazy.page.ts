import { lazy as reactLazy } from "react";

const lazy = (componentImport: () => Promise<any>) =>
  reactLazy(async () => {
    const hasForceRefresh = JSON.parse(
      window.localStorage.getItem("has_force_refresh") || "false"
    );

    try {
      const component = await componentImport();

      window.localStorage.setItem("has_force_refresh", "false");

      return component;
    } catch (error) {
      if (!hasForceRefresh) {
        window.localStorage.setItem("has_force_refresh", "true");
        window.location.reload();
        // Return a pending promise to prevent React from crashing before reload completes
        return new Promise(() => {});
      }

      throw error;
    }
  });

export const Dashboard = lazy(() => import("../pages/Dashboard"));
export const PdfMerge = lazy(() => import("../components/tools/PdfMerge"));
export const PdfSplit = lazy(() => import("../components/tools/PdfSplit"));
export const ImageToPdf = lazy(() => import("../components/tools/ImageToPdf"));
export const ImageCompress = lazy(
  () => import("../components/tools/ImageCompress")
);
export const ImageEditor = lazy(
  () => import("../components/tools/ImageEditor")
);
export const ImageConverter = lazy(
  () => import("../components/tools/ImageConverter")
);
export const QrGenerator = lazy(
  () => import("../components/tools/QrGenerator")
);
export const JsonBeautifier = lazy(
  () => import("../components/tools/JsonBeautifier")
);
export const DataConverter = lazy(
  () => import("../components/tools/DataConverter")
);
export const WordCounter = lazy(
  () => import("../components/tools/WordCounter")
);
