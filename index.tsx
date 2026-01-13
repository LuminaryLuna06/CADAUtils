import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  MantineProvider,
  createTheme,
  useMantineColorScheme,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "react-image-crop/dist/ReactCrop.css";
import App from "./App";
import {
  SettingsProvider,
  useSettingsContext,
} from "./contexts/SettingsContext";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Component to inject dynamic CSS for input focus states
const GlobalStyles: React.FC<{ primaryColor: string }> = ({ primaryColor }) => (
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
      border-color: var(--mantine-color-${primaryColor}-6) !important;
    }
  `}</style>
);

// Inner component that uses settings context
const ThemedApp: React.FC = () => {
  const { settings } = useSettingsContext();

  // Create theme dynamically based on user settings
  const theme = createTheme({
    primaryColor: settings.primaryColor,
    fontFamily: "Inter, sans-serif",
  });

  // Apply data attribute for dynamic CSS
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-primary-color",
      settings.primaryColor
    );
  }, [settings.primaryColor]);

  return (
    <MantineProvider theme={theme}>
      <GlobalStyles primaryColor={settings.primaryColor} />
      <ThemeUpdater />
      <App />
    </MantineProvider>
  );
};

// Separate component to handle theme updates using Mantine's hook
const ThemeUpdater: React.FC = () => {
  const { settings } = useSettingsContext();
  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    // Update Mantine's color scheme when settings change
    if (settings.themeMode === "system") {
      setColorScheme("auto");
    } else {
      setColorScheme(settings.themeMode);
    }
  }, [settings.themeMode, setColorScheme]);

  return null; // This component only manages side effects
};

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <ThemedApp />
    </SettingsProvider>
  </React.StrictMode>
);
