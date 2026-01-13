import React, { useState } from "react";
import {
  Modal,
  Tabs,
  Stack,
  Group,
  Text,
  ColorSwatch,
  Button,
  Switch,
  Badge,
  ScrollArea,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { Palette, Pin, Sun, Moon, Monitor, X } from "lucide-react";
import { useSettingsContext } from "../../contexts/SettingsContext";
import { AVAILABLE_COLORS, ThemeMode } from "../../types/settings";
import { NAV_ITEMS } from "../../constants/navigation";

interface SettingsModalProps {
  opened: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ opened, onClose }) => {
  const {
    settings,
    updatePrimaryColor,
    updateThemeMode,
    togglePinTool,
    isPinned,
  } = useSettingsContext();
  const [activeTab, setActiveTab] = useState<string | null>("appearance");

  const themeOptions: {
    mode: ThemeMode;
    icon: React.ReactNode;
    label: string;
  }[] = [
    { mode: "light", icon: <Sun size={20} />, label: "Light" },
    { mode: "dark", icon: <Moon size={20} />, label: "Dark" },
    { mode: "system", icon: <Monitor size={20} />, label: "System" },
  ];

  const availableTools = NAV_ITEMS.filter((item) => item.id !== "dashboard");

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <Palette size={20} />
          <Text fw={600}>Settings</Text>
        </Group>
      }
      size="lg"
      centered
    >
      <Tabs value={activeTab} onChange={setActiveTab}>
        <Tabs.List grow>
          <Tabs.Tab value="appearance" leftSection={<Palette size={16} />}>
            Appearance
          </Tabs.Tab>
          <Tabs.Tab value="pinned" leftSection={<Pin size={16} />}>
            Pinned Tools
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="appearance" pt="lg">
          <Stack gap="xl">
            {/* Primary Color Selector */}
            <div>
              <Text size="sm" fw={600} mb="xs">
                Primary Color
              </Text>
              <Text size="xs" c="dimmed" mb="md">
                Choose your favorite accent color for the interface
              </Text>
              <div className="grid grid-cols-6 gap-3">
                {AVAILABLE_COLORS.map((color) => (
                  <Tooltip key={color.value} label={color.label} position="top">
                    <button
                      onClick={() => updatePrimaryColor(color.value)}
                      className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="relative">
                        <ColorSwatch
                          color={`var(--mantine-color-${color.value}-6)`}
                          size={40}
                          style={{ cursor: "pointer" }}
                        />
                        {settings.primaryColor === color.value && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white dark:bg-slate-900 rounded-full border-2 border-current" />
                          </div>
                        )}
                      </div>
                      <Text size="xs" c="dimmed">
                        {color.label}
                      </Text>
                    </button>
                  </Tooltip>
                ))}
              </div>
            </div>

            {/* Theme Mode Selector */}
            <div>
              <Text size="sm" fw={600} mb="xs">
                Theme Mode
              </Text>
              <Text size="xs" c="dimmed" mb="md">
                Choose between light, dark, or system preference
              </Text>
              <Group gap="md">
                {themeOptions.map((option) => (
                  <Button
                    key={option.mode}
                    variant={
                      settings.themeMode === option.mode ? "filled" : "light"
                    }
                    color={settings.primaryColor}
                    leftSection={option.icon}
                    onClick={() => updateThemeMode(option.mode)}
                    flex={1}
                  >
                    {option.label}
                  </Button>
                ))}
              </Group>
            </div>
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="pinned" pt="lg">
          <Stack gap="md">
            <div>
              <Text size="sm" fw={600} mb="xs">
                Pinned Tools
              </Text>
              <Text size="xs" c="dimmed" mb="md">
                Pin your frequently used tools for quick access
              </Text>
              {settings.pinnedTools.length > 0 && (
                <Group gap="xs" mb="md">
                  {settings.pinnedTools.map((toolId) => {
                    const tool = NAV_ITEMS.find((item) => item.id === toolId);
                    if (!tool) return null;
                    return (
                      <Badge
                        key={toolId}
                        size="lg"
                        color={settings.primaryColor}
                        variant="light"
                        rightSection={
                          <ActionIcon
                            size="xs"
                            color={settings.primaryColor}
                            variant="transparent"
                            onClick={() => togglePinTool(toolId)}
                          >
                            <X size={12} />
                          </ActionIcon>
                        }
                      >
                        {tool.label}
                      </Badge>
                    );
                  })}
                </Group>
              )}
            </div>

            <ScrollArea h={300}>
              <Stack gap="xs">
                {availableTools.map((tool) => {
                  const pinned = isPinned(tool.id);
                  return (
                    <Group
                      key={tool.id}
                      justify="space-between"
                      className="p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Group gap="sm">
                        <div className="text-slate-600 dark:text-slate-400">
                          {tool.icon}
                        </div>
                        <div>
                          <Text size="sm" fw={500}>
                            {tool.label}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {tool.category}
                          </Text>
                        </div>
                      </Group>
                      <Switch
                        checked={pinned}
                        onChange={() => togglePinTool(tool.id)}
                        color={settings.primaryColor}
                        thumbIcon={
                          pinned ? (
                            <Pin size={12} className="text-current" />
                          ) : undefined
                        }
                      />
                    </Group>
                  );
                })}
              </Stack>
            </ScrollArea>
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Modal>
  );
};

export default SettingsModal;
