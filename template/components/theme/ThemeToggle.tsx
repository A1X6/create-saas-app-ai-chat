"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ThemeToggleButton, useThemeTransition } from "@/components/ui/theme-toggle-button";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { startTransition } = useThemeTransition();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <ThemeToggleButton
        theme="light"
        variant="circle"
        start="center"
        onClick={() => {}}
      />
    );
  }

  const handleThemeChange = () => {
    const next = theme === "dark" ? "light" : "dark";
    startTransition(() => {
      setTheme(next);
    });
  };

  return (
    <ThemeToggleButton
      theme={theme as 'light' | 'dark'}
      variant="circle"
      start="center"
      onClick={handleThemeChange}
    />
  );
}
