import React from "react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { Sun, Moon, Monitor } from "lucide-react";
import { useSettingsContext } from "../../contexts/SettingsContext";
import { ThemeMode } from "../../types/settings";

const ThemeToggle: React.FC = () => {
  const { settings, updateThemeMode } = useSettingsContext();

  const cycleTheme = () => {
    const modes: ThemeMode[] = ["light", "dark", "system"];
    const currentIndex = modes.indexOf(settings.themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    updateThemeMode(modes[nextIndex]);
  };

  const getIcon = () => {
    switch (settings.themeMode) {
      case "light":
        return <Sun size={20} />;
      case "dark":
        return <Moon size={20} />;
      case "system":
        return <Monitor size={20} />;
    }
  };

  const getLabel = () => {
    switch (settings.themeMode) {
      case "light":
        return "Light Mode";
      case "dark":
        return "Dark Mode";
      case "system":
        return "System Mode";
    }
  };

  return (
    <Tooltip label={getLabel()} position="bottom">
      <ActionIcon
        variant="subtle"
        color={settings.themeMode === "dark" ? "yellow" : settings.primaryColor}
        onClick={cycleTheme}
        size="lg"
      >
        {getIcon()}
      </ActionIcon>
    </Tooltip>
  );
};

export default ThemeToggle;
