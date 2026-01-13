import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import * as Pages from "./lazy.page";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Pages.Dashboard />} />

        {/* PDF Tools */}
        <Route path="/pdf-merge" element={<Pages.PdfMerge />} />
        <Route path="/pdf-split" element={<Pages.PdfSplit />} />
        <Route path="/pdf-compress" element={<Pages.PdfCompress />} />
        <Route path="/img-to-pdf" element={<Pages.ImageToPdf />} />

        {/* Image Tools */}
        <Route path="/img-editor" element={<Pages.ImageEditor />} />
        <Route path="/img-compress" element={<Pages.ImageCompress />} />
        <Route path="/img-convert" element={<Pages.ImageConverter />} />

        {/* Data/Text Tools */}
        <Route path="/qr-generator" element={<Pages.QrGenerator />} />
        <Route path="/json-beauty" element={<Pages.JsonBeautifier />} />
        <Route path="/data-convert" element={<Pages.DataConverter />} />
        <Route path="/word-count" element={<Pages.WordCounter />} />

        {/* General */}
        <Route path="/license" element={<Pages.License />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
