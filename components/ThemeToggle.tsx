"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = () => {
    const themes = ["light", "dark", "blue", "green", "system"] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return "ri-sun-line";
      case "dark":
        return "ri-moon-line";
      case "blue":
        return "ri-water-line";
      case "green":
        return "ri-leaf-line";
      case "system":
        return "ri-computer-line";
      default:
        return "ri-sun-line";
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "blue":
        return "Ocean";
      case "green":
        return "Nature";
      case "system":
        return "System";
      default:
        return "Light";
    }
  };

  return (
    <button
      onClick={handleThemeChange}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-rgb(var(--bg-tertiary)) hover:bg-rgb(var(--bg-quaternary)) border border-rgb(var(--border-primary)) theme-transition cursor-pointer whitespace-nowrap hover:scale-105"
      aria-label={`Switch to ${getThemeLabel()} theme`}
      title={`Current: ${getThemeLabel()}`}
    >
      <i
        className={`${getThemeIcon()} w-4 h-4 flex items-center justify-center`}
      ></i>
      <span className="hidden sm:inline">{getThemeLabel()}</span>
    </button>
  );
}
