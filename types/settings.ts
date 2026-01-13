import { ToolId } from "../constants/navigation";

export type ThemeMode = "light" | "dark" | "system";

export type PrimaryColor =
  | "pink"
  | "red"
  | "orange"
  | "yellow"
  | "lime"
  | "green"
  | "teal"
  | "cyan"
  | "blue"
  | "indigo"
  | "violet"
  | "grape";

export interface UserSettings {
  primaryColor: PrimaryColor;
  themeMode: ThemeMode;
  pinnedTools: ToolId[];
}

export const DEFAULT_SETTINGS: UserSettings = {
  primaryColor: "blue",
  themeMode: "system",
  pinnedTools: [],
};

export const AVAILABLE_COLORS: { value: PrimaryColor; label: string }[] = [
  { value: "pink", label: "Pink" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
  { value: "lime", label: "Lime" },
  { value: "green", label: "Green" },
  { value: "teal", label: "Teal" },
  { value: "cyan", label: "Cyan" },
  { value: "blue", label: "Blue" },
  { value: "indigo", label: "Indigo" },
  { value: "violet", label: "Violet" },
  { value: "grape", label: "Grape" },
];
