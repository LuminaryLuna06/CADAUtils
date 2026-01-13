import { useState, useEffect } from "react";
import { UserSettings, DEFAULT_SETTINGS } from "../types/settings";

const STORAGE_KEY = "cadautils-settings";

/**
 * Custom hook to manage user settings with localStorage persistence
 */
export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle new settings added in updates
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage:", error);
    }
    return DEFAULT_SETTINGS;
  });

  // Persist settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage:", error);
    }
  }, [settings]);

  return {
    settings,
    updateSettings: setSettings,
  };
}
