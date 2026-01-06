import React from "react";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { Sun, Moon } from "lucide-react";

const ThemeToggle: React.FC = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <ActionIcon
      variant="subtle"
      color={dark ? "yellow" : "pink"}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
      size="lg"
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </ActionIcon>
  );
};

export default ThemeToggle;
