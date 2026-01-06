import React from "react";
import {
  Files,
  Scissors,
  Image as ImageIcon,
  Minimize2,
  Settings2,
  Repeat,
  QrCode,
  Braces,
  FileJson,
  Type,
  Wrench,
} from "lucide-react";

export type ToolId =
  | "dashboard"
  | "pdf-merge"
  | "pdf-split"
  | "img-to-pdf"
  | "img-compress"
  | "img-editor"
  | "img-convert"
  | "qr-generator"
  | "json-beauty"
  | "data-convert"
  | "word-count";

export interface NavItem {
  id: ToolId;
  path: string;
  label: string;
  icon: React.ReactNode;
  category:
    | "PDF Tools"
    | "Image Tools"
    | "Data Tools"
    | "Text Tools"
    | "General";
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    path: "/",
    label: "Dashboard",
    icon: <Wrench size={18} />,
    category: "General",
  },

  {
    id: "pdf-merge",
    path: "/pdf-merge",
    label: "Merge PDF",
    icon: <Files size={18} />,
    category: "PDF Tools",
  },
  {
    id: "pdf-split",
    path: "/pdf-split",
    label: "Split PDF",
    icon: <Scissors size={18} />,
    category: "PDF Tools",
  },
  {
    id: "img-to-pdf",
    path: "/img-to-pdf",
    label: "Image to PDF",
    icon: <ImageIcon size={18} />,
    category: "PDF Tools",
  },

  {
    id: "img-editor",
    path: "/img-editor",
    label: "Image Editor",
    icon: <Settings2 size={18} />,
    category: "Image Tools",
  },
  {
    id: "img-compress",
    path: "/img-compress",
    label: "Compress Image",
    icon: <Minimize2 size={18} />,
    category: "Image Tools",
  },
  {
    id: "img-convert",
    path: "/img-convert",
    label: "Convert Format",
    icon: <Repeat size={18} />,
    category: "Image Tools",
  },

  {
    id: "data-convert",
    path: "/data-convert",
    label: "Data Converter",
    icon: <FileJson size={18} />,
    category: "Data Tools",
  },
  {
    id: "json-beauty",
    path: "/json-beauty",
    label: "JSON Formatter",
    icon: <Braces size={18} />,
    category: "Data Tools",
  },

  {
    id: "qr-generator",
    path: "/qr-generator",
    label: "QR Generator",
    icon: <QrCode size={18} />,
    category: "Text Tools",
  },
  {
    id: "word-count",
    path: "/word-count",
    label: "Word Counter",
    icon: <Type size={18} />,
    category: "Text Tools",
  },
];
