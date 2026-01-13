import React from "react";
import { ExternalLink, BookOpen, Package } from "lucide-react";
import { Badge, Card, Text, Group, Stack, Anchor } from "@mantine/core";
import { useSettingsContext } from "../contexts/SettingsContext";

interface Library {
  name: string;
  version: string;
  description: string;
  link: string;
  category: "UI" | "PDF" | "Image" | "Data" | "Utilities" | "Dev Tools";
}

const License: React.FC = () => {
  const { settings } = useSettingsContext();

  const libraries: Library[] = [
    // UI Libraries
    {
      name: "@mantine/core",
      version: "8.3.0",
      description:
        "A fully featured React components library with 100+ customizable components",
      link: "https://mantine.dev",
      category: "UI",
    },
    {
      name: "@mantine/hooks",
      version: "8.3.0",
      description: "Collection of essential React hooks for Mantine",
      link: "https://mantine.dev/hooks/use-counter",
      category: "UI",
    },
    {
      name: "lucide-react",
      version: "0.344.0",
      description: "Beautiful & consistent icon toolkit made by the community",
      link: "https://lucide.dev",
      category: "UI",
    },
    {
      name: "react",
      version: "19.2.3",
      description: "A JavaScript library for building user interfaces",
      link: "https://react.dev",
      category: "UI",
    },
    {
      name: "react-dom",
      version: "19.2.3",
      description: "React package for working with the DOM",
      link: "https://react.dev",
      category: "UI",
    },
    {
      name: "react-router-dom",
      version: "6.22.3",
      description: "Declarative routing for React web applications",
      link: "https://reactrouter.com",
      category: "UI",
    },

    // PDF Libraries
    {
      name: "pdf-lib",
      version: "1.17.1",
      description:
        "Create and modify PDF documents in any JavaScript environment",
      link: "https://pdf-lib.js.org",
      category: "PDF",
    },
    {
      name: "pdfjs-dist",
      version: "5.4.530",
      description: "PDF.js is a PDF viewer built with HTML5",
      link: "https://mozilla.github.io/pdf.js",
      category: "PDF",
    },
    {
      name: "react-pdf",
      version: "10.3.0",
      description:
        "Display PDFs in your React app as easily as if they were images",
      link: "https://github.com/wojtekmaj/react-pdf",
      category: "PDF",
    },
    {
      name: "@zfanta/ghostscript-wasm",
      version: "0.1.0",
      description: "Ghostscript compiled to WebAssembly for PDF compression",
      link: "https://www.npmjs.com/package/@zfanta/ghostscript-wasm",
      category: "PDF",
    },

    // Image Libraries
    {
      name: "browser-image-compression",
      version: "2.0.2",
      description: "Compress images in the browser using JavaScript",
      link: "https://github.com/Donaldcwl/browser-image-compression",
      category: "Image",
    },
    {
      name: "react-image-crop",
      version: "11.0.5",
      description: "A responsive image cropping tool for React",
      link: "https://github.com/DominicTobias/react-image-crop",
      category: "Image",
    },
    {
      name: "qrcode",
      version: "1.5.3",
      description: "QR code/2d barcode generator",
      link: "https://github.com/soldair/node-qrcode",
      category: "Image",
    },

    // Data Processing
    {
      name: "jszip",
      version: "3.10.1",
      description: "Create, read and edit .zip files with JavaScript",
      link: "https://stuk.github.io/jszip",
      category: "Data",
    },
    {
      name: "papaparse",
      version: "5.4.1",
      description: "Fast and powerful CSV (delimited text) parser",
      link: "https://www.papaparse.com",
      category: "Data",
    },
    {
      name: "js-yaml",
      version: "4.1.0",
      description: "JavaScript YAML parser and dumper",
      link: "https://github.com/nodeca/js-yaml",
      category: "Data",
    },
    {
      name: "react-json-view",
      version: "1.21.3",
      description: "Interactive JSON viewer component for React",
      link: "https://github.com/mac-s-g/react-json-view",
      category: "Data",
    },

    // Utilities
    {
      name: "clsx",
      version: "2.1.0",
      description:
        "A tiny utility for constructing className strings conditionally",
      link: "https://github.com/lukeed/clsx",
      category: "Utilities",
    },

    // Dev Tools
    {
      name: "vite",
      version: "6.2.0",
      description: "Next generation frontend tooling",
      link: "https://vitejs.dev",
      category: "Dev Tools",
    },
    {
      name: "typescript",
      version: "5.8.2",
      description: "TypeScript is a language for application scale JavaScript",
      link: "https://www.typescriptlang.org",
      category: "Dev Tools",
    },
    {
      name: "tailwindcss",
      version: "3.4.1",
      description: "A utility-first CSS framework",
      link: "https://tailwindcss.com",
      category: "Dev Tools",
    },
  ];

  const categories = Array.from(new Set(libraries.map((lib) => lib.category)));

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen size={32} className="text-slate-600 dark:text-slate-400" />
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Open Source Libraries
          </h2>
        </div>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          CadaUtils is built with amazing open source libraries. We are grateful
          to the developers and contributors who make these tools available.
        </p>
      </div>

      {categories.map((category) => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-4">
            <Package size={20} className="text-slate-600 dark:text-slate-400" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              {category}
            </h3>
            <Badge size="sm" color={settings.primaryColor} variant="light">
              {libraries.filter((lib) => lib.category === category).length}{" "}
              libraries
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {libraries
              .filter((lib) => lib.category === category)
              .map((lib) => (
                <Card
                  key={lib.name}
                  padding="lg"
                  radius="md"
                  withBorder
                  className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow"
                >
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <div className="flex-1">
                        <Text
                          size="lg"
                          fw={600}
                          className="font-mono text-slate-900 dark:text-white"
                        >
                          {lib.name}
                        </Text>
                        <Badge
                          size="xs"
                          color={settings.primaryColor}
                          variant="light"
                          mt={4}
                        >
                          v{lib.version}
                        </Badge>
                      </div>
                      <Anchor
                        href={lib.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0"
                      >
                        <ExternalLink
                          size={20}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        />
                      </Anchor>
                    </Group>

                    <Text size="sm" c="dimmed" lineClamp={2}>
                      {lib.description}
                    </Text>
                  </Stack>
                </Card>
              ))}
          </div>
        </div>
      ))}

      <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
          License Information
        </h3>
        <Text size="sm" c="dimmed">
          CadaUtils is an open source project. All dependencies listed above are
          used in accordance with their respective licenses. Please refer to
          each library's documentation for specific license terms.
        </Text>
      </div>
    </div>
  );
};

export default License;
