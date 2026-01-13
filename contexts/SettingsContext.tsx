import React, { createContext, useContext, useCallback } from "react";
import { useSettings } from "../hooks/useSettings";
import { UserSettings, PrimaryColor, ThemeMode } from "../types/settings";
import { ToolId } from "../constants/navigation";

interface SettingsContextValue {
  settings: UserSettings;
  updatePrimaryColor: (color: PrimaryColor) => void;
  updateThemeMode: (mode: ThemeMode) => void;
  togglePinTool: (toolId: ToolId) => void;
  isPinned: (toolId: ToolId) => boolean;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { settings, updateSettings } = useSettings();

  const updatePrimaryColor = useCallback(
    (color: PrimaryColor) => {
      updateSettings((prev) => ({ ...prev, primaryColor: color }));
    },
    [updateSettings]
  );

  const updateThemeMode = useCallback(
    (mode: ThemeMode) => {
      updateSettings((prev) => ({ ...prev, themeMode: mode }));
    },
    [updateSettings]
  );

  const togglePinTool = useCallback(
    (toolId: ToolId) => {
      updateSettings((prev) => {
        const isPinned = prev.pinnedTools.includes(toolId);
        const newPinnedTools = isPinned
          ? prev.pinnedTools.filter((id) => id !== toolId)
          : [...prev.pinnedTools, toolId];
        return { ...prev, pinnedTools: newPinnedTools };
      });
    },
    [updateSettings]
  );

  const isPinned = useCallback(
    (toolId: ToolId) => {
      return settings.pinnedTools.includes(toolId);
    },
    [settings.pinnedTools]
  );

  const value: SettingsContextValue = {
    settings,
    updatePrimaryColor,
    updateThemeMode,
    togglePinTool,
    isPinned,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettingsContext must be used within SettingsProvider");
  }
  return context;
};
