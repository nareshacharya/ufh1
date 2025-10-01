"use client";

import { useTheme } from "@/components/ThemeProvider";
import { useState } from "react";
import Link from "next/link";

type Theme = "light" | "light-warm" | "dark" | "dark-cool" | "system";

const themeOptions = [
  {
    id: "light" as Theme,
    name: "Clean Light",
    description:
      "A crisp, modern light theme perfect for daytime work and professional environments.",
    category: "Light Themes",
    preview: "bg-white",
    colors: ["#ffffff", "#f8fafc", "#e2e8f0", "#64748b"],
    significance:
      "Ideal for detailed work, reading, and when working in well-lit environments. Reduces eye strain during daytime use.",
    userPreference:
      "Best for users who prefer traditional light interfaces and work primarily during daytime hours.",
  },
  {
    id: "light-warm" as Theme,
    name: "Warm Light",
    description:
      "A cozy, warm-toned light theme that's easier on the eyes with cream and amber accents.",
    category: "Light Themes",
    preview: "bg-amber-50",
    colors: ["#fefcf5", "#fef3c7", "#f59e0b", "#92400e"],
    significance:
      "Provides a softer, warmer alternative to stark white themes. Reduces blue light exposure while maintaining clarity.",
    userPreference:
      "Perfect for users sensitive to bright whites or those who prefer warmer, more comfortable color palettes.",
  },
  {
    id: "dark" as Theme,
    name: "Deep Dark",
    description:
      "A sophisticated dark theme with purple accents, perfect for extended coding sessions.",
    category: "Dark Themes",
    preview: "bg-slate-900",
    colors: ["#0f172a", "#1e293b", "#64748b", "#cbd5e1"],
    significance:
      "Reduces eye strain in low-light conditions and provides better focus during extended work sessions.",
    userPreference:
      "Ideal for night owls, developers, and users who work in dimly lit environments or prefer dark interfaces.",
  },
  {
    id: "dark-cool" as Theme,
    name: "Cool Dark",
    description:
      "A modern dark theme with blue-grey tones and crisp blue accents for a professional look.",
    category: "Dark Themes",
    preview: "bg-slate-800",
    colors: ["#081419", "#0f172a", "#334155", "#3b82f6"],
    significance:
      "Offers a cooler, more professional alternative to warm dark themes with enhanced readability.",
    userPreference:
      "Great for users who prefer cooler color temperatures and need a dark theme for professional presentations.",
  },
  {
    id: "system" as Theme,
    name: "System Default",
    description:
      "Automatically switches between light and dark based on your system preferences.",
    category: "Adaptive",
    preview: "bg-gradient-to-r from-white to-slate-900",
    colors: ["#ffffff", "#64748b", "#1e293b", "#0f172a"],
    significance:
      "Adapts to your device's theme settings and time of day, providing optimal viewing conditions automatically.",
    userPreference:
      "Perfect for users who want seamless integration with their system settings and automatic theme switching.",
  },
];

export default function ThemePage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<Theme>(theme);

  const handleThemeSelect = (newTheme: Theme) => {
    setSelectedTheme(newTheme);
    setTheme(newTheme);
  };

  const lightThemes = themeOptions.filter((t) => t.category === "Light Themes");
  const darkThemes = themeOptions.filter((t) => t.category === "Dark Themes");
  const adaptiveThemes = themeOptions.filter((t) => t.category === "Adaptive");

  return (
    <div className="min-h-screen bg-rgb-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-rgb-fg-tertiary mb-2">
            <Link
              href="/settings"
              className="hover:text-primary transition-colors"
            >
              Settings
            </Link>
            <i className="ri-arrow-right-s-line"></i>
            <span>Theme & Appearance</span>
          </div>
          <h1 className="text-3xl font-bold text-rgb-fg-primary mb-2">
            Choose Your Theme
          </h1>
          <p className="text-rgb-fg-secondary">
            Select a theme that matches your preference and working environment.
            Current theme:{" "}
            <span className="font-semibold text-primary">{theme}</span>
            {theme === "system" && (
              <span className="text-rgb-fg-tertiary">
                {" "}
                (displaying as {resolvedTheme})
              </span>
            )}
          </p>
        </div>

        {/* Theme Categories */}
        <div className="space-y-12">
          {/* Light Themes */}
          <section>
            <h2 className="text-xl font-semibold text-rgb-fg-primary mb-6 flex items-center gap-2">
              <i className="ri-sun-line text-amber-500"></i>
              Light Themes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {lightThemes.map((themeOption) => (
                <div
                  key={themeOption.id}
                  className={`theme-card ${
                    selectedTheme === themeOption.id ? "selected" : ""
                  }`}
                  onClick={() => handleThemeSelect(themeOption.id)}
                >
                  <div className="theme-preview">
                    <div className="flex gap-1 mb-3">
                      {themeOption.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-rgb-border-primary"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                    <div className="theme-mockup">
                      <div
                        className="mockup-header"
                        style={{ backgroundColor: themeOption.colors[0] }}
                      >
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-400"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        </div>
                      </div>
                      <div
                        className="mockup-content"
                        style={{ backgroundColor: themeOption.colors[1] }}
                      >
                        <div
                          className="h-2 rounded"
                          style={{
                            backgroundColor: themeOption.colors[2],
                            width: "60%",
                          }}
                        ></div>
                        <div
                          className="h-1 rounded mt-1"
                          style={{
                            backgroundColor: themeOption.colors[3],
                            width: "40%",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="theme-info">
                    <h3 className="font-semibold text-rgb-fg-primary mb-1">
                      {themeOption.name}
                    </h3>
                    <p className="text-sm text-rgb-fg-secondary mb-3">
                      {themeOption.description}
                    </p>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-medium text-rgb-fg-tertiary">
                          Significance:
                        </span>
                        <p className="text-rgb-fg-quaternary">
                          {themeOption.significance}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-rgb-fg-tertiary">
                          Best for:
                        </span>
                        <p className="text-rgb-fg-quaternary">
                          {themeOption.userPreference}
                        </p>
                      </div>
                    </div>

                    {selectedTheme === themeOption.id && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                        <i className="ri-check-line"></i>
                        <span className="font-medium">Currently Active</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Dark Themes */}
          <section>
            <h2 className="text-xl font-semibold text-rgb-fg-primary mb-6 flex items-center gap-2">
              <i className="ri-moon-line text-indigo-500"></i>
              Dark Themes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {darkThemes.map((themeOption) => (
                <div
                  key={themeOption.id}
                  className={`theme-card ${
                    selectedTheme === themeOption.id ? "selected" : ""
                  }`}
                  onClick={() => handleThemeSelect(themeOption.id)}
                >
                  <div className="theme-preview">
                    <div className="flex gap-1 mb-3">
                      {themeOption.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-rgb-border-primary"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                    <div className="theme-mockup">
                      <div
                        className="mockup-header"
                        style={{ backgroundColor: themeOption.colors[0] }}
                      >
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-400"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        </div>
                      </div>
                      <div
                        className="mockup-content"
                        style={{ backgroundColor: themeOption.colors[1] }}
                      >
                        <div
                          className="h-2 rounded"
                          style={{
                            backgroundColor: themeOption.colors[2],
                            width: "60%",
                          }}
                        ></div>
                        <div
                          className="h-1 rounded mt-1"
                          style={{
                            backgroundColor: themeOption.colors[3],
                            width: "40%",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="theme-info">
                    <h3 className="font-semibold text-rgb-fg-primary mb-1">
                      {themeOption.name}
                    </h3>
                    <p className="text-sm text-rgb-fg-secondary mb-3">
                      {themeOption.description}
                    </p>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-medium text-rgb-fg-tertiary">
                          Significance:
                        </span>
                        <p className="text-rgb-fg-quaternary">
                          {themeOption.significance}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-rgb-fg-tertiary">
                          Best for:
                        </span>
                        <p className="text-rgb-fg-quaternary">
                          {themeOption.userPreference}
                        </p>
                      </div>
                    </div>

                    {selectedTheme === themeOption.id && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                        <i className="ri-check-line"></i>
                        <span className="font-medium">Currently Active</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Adaptive Themes */}
          <section>
            <h2 className="text-xl font-semibold text-rgb-fg-primary mb-6 flex items-center gap-2">
              <i className="ri-computer-line text-blue-500"></i>
              Adaptive Theme
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adaptiveThemes.map((themeOption) => (
                <div
                  key={themeOption.id}
                  className={`theme-card ${
                    selectedTheme === themeOption.id ? "selected" : ""
                  }`}
                  onClick={() => handleThemeSelect(themeOption.id)}
                >
                  <div className="theme-preview">
                    <div className="flex gap-1 mb-3">
                      {themeOption.colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-rgb-border-primary"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                    <div className="theme-mockup">
                      <div className="mockup-header bg-gradient-to-r from-white to-slate-700">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-red-400"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                          <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        </div>
                      </div>
                      <div className="mockup-content bg-gradient-to-r from-gray-50 to-slate-800">
                        <div
                          className="h-2 rounded bg-gradient-to-r from-gray-400 to-slate-400"
                          style={{ width: "60%" }}
                        ></div>
                        <div
                          className="h-1 rounded mt-1 bg-gradient-to-r from-gray-300 to-slate-500"
                          style={{ width: "40%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="theme-info">
                    <h3 className="font-semibold text-rgb-fg-primary mb-1">
                      {themeOption.name}
                    </h3>
                    <p className="text-sm text-rgb-fg-secondary mb-3">
                      {themeOption.description}
                    </p>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-medium text-rgb-fg-tertiary">
                          Significance:
                        </span>
                        <p className="text-rgb-fg-quaternary">
                          {themeOption.significance}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-rgb-fg-tertiary">
                          Best for:
                        </span>
                        <p className="text-rgb-fg-quaternary">
                          {themeOption.userPreference}
                        </p>
                      </div>
                    </div>

                    {selectedTheme === themeOption.id && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-primary">
                        <i className="ri-check-line"></i>
                        <span className="font-medium">Currently Active</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="mt-12 flex items-center justify-between pt-8 border-t border-rgb-border-primary">
          <Link
            href="/settings"
            className="flex items-center gap-2 text-rgb-fg-secondary hover:text-primary transition-colors"
          >
            <i className="ri-arrow-left-line"></i>
            <span>Back to Settings</span>
          </Link>
          <div className="text-sm text-rgb-fg-tertiary">
            Theme preferences are saved automatically
          </div>
        </div>
      </div>
    </div>
  );
}
