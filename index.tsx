import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";

import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const theme = createTheme({
  primaryColor: "pink",
  fontFamily: "Inter, sans-serif",
});

// Explicitly target Mantine input classes to override default dark mode styles
// We use !important to ensure these styles win over Mantine's specific component styles
const GlobalStyles = () => (
  <style>{`
    [data-mantine-color-scheme="dark"] .mantine-Input-input,
    [data-mantine-color-scheme="dark"] .mantine-TextInput-input,
    [data-mantine-color-scheme="dark"] .mantine-Textarea-input,
    [data-mantine-color-scheme="dark"] .mantine-Select-input,
    [data-mantine-color-scheme="dark"] .mantine-NumberInput-input,
    [data-mantine-color-scheme="dark"] .mantine-JsonInput-input,
    [data-mantine-color-scheme="dark"] .mantine-ColorInput-input,
    [data-mantine-color-scheme="dark"] .mantine-PasswordInput-input {
      background-color: #151b28 !important;
      border-color: #334155 !important;
      color: #f8fafc !important;
    }

    [data-mantine-color-scheme="dark"] .mantine-Input-input:focus,
    [data-mantine-color-scheme="dark"] .mantine-TextInput-input:focus,
    [data-mantine-color-scheme="dark"] .mantine-Textarea-input:focus,
    [data-mantine-color-scheme="dark"] .mantine-Select-input:focus,
    [data-mantine-color-scheme="dark"] .mantine-NumberInput-input:focus,
    [data-mantine-color-scheme="dark"] .mantine-JsonInput-input:focus,
    [data-mantine-color-scheme="dark"] .mantine-ColorInput-input:focus,
    [data-mantine-color-scheme="dark"] .mantine-PasswordInput-input:focus {
      border-color: var(--mantine-color-pink-6) !important;
    }
  `}</style>
);

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <GlobalStyles />
      <App />
    </MantineProvider>
  </React.StrictMode>
);
