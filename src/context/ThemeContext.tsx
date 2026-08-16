/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemePreset = "cosmic-orange" | "neon-purple" | "clean-light";
type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  preset: ThemePreset;
  setPreset: (preset: ThemePreset) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preset, setPresetState] = useState<ThemePreset>(() => {
    if (typeof window !== "undefined") {
      const savedPreset = localStorage.getItem("portfolio-theme-preset") as ThemePreset;
      if (savedPreset === "cosmic-orange" || savedPreset === "neon-purple" || savedPreset === "clean-light") {
        return savedPreset;
      }
    }
    return "cosmic-orange";
  });

  const [lastDarkPreset, setLastDarkPreset] = useState<"cosmic-orange" | "neon-purple">(() => {
    if (typeof window !== "undefined") {
      const savedLastDark = localStorage.getItem("portfolio-last-dark-preset") as "cosmic-orange" | "neon-purple";
      if (savedLastDark === "cosmic-orange" || savedLastDark === "neon-purple") {
        return savedLastDark;
      }
    }
    return "cosmic-orange";
  });

  const theme = preset === "clean-light" ? "light" : "dark";

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme-preset", preset);
    localStorage.setItem("portfolio-theme-preset", preset);

    if (theme === "dark") {
      root.classList.remove("light");
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }
    localStorage.setItem("portfolio-theme", theme);

    if (preset !== "clean-light") {
      setLastDarkPreset(preset as "cosmic-orange" | "neon-purple");
      localStorage.setItem("portfolio-last-dark-preset", preset);
    }
  }, [preset, theme]);

  const toggleTheme = () => {
    if (theme === "dark") {
      setPresetState("clean-light");
    } else {
      setPresetState(lastDarkPreset);
    }
  };

  const setTheme = (newTheme: Theme) => {
    if (newTheme === "light") {
      setPresetState("clean-light");
    } else {
      setPresetState(lastDarkPreset);
    }
  };

  const setPreset = (newPreset: ThemePreset) => {
    setPresetState(newPreset);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, preset, setPreset }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
