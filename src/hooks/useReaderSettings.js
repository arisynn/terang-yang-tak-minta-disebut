import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "novel_reader_preferences_v1";

const DEFAULT_SETTINGS = {
  theme: "light", // 'light' | 'sepia' | 'dark'
  fontSize: "md", // 'sm' (16px), 'md' (18px), 'lg' (20px), 'xl' (22px)
  lineHeight: "relaxed", // 'normal' (1.6), 'relaxed' (1.85), 'loose' (2.1)
  textWidth: "normal", // 'compact' (58ch), 'normal' (68ch), 'wide' (78ch)
  fontFamily: "serif", // 'serif' (Newsreader/Lora) | 'sans' (Plus Jakarta Sans)
  justifyText: false, // alignment
};

export function useReaderSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Failed to load reading settings from localStorage", e);
    }
    return DEFAULT_SETTINGS;
  });

  // Apply theme class to <html> or document root
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn("Failed to save reading settings", e);
    }

    const root = document.documentElement;
    root.classList.remove("theme-light", "theme-sepia", "theme-dark", "dark");

    if (settings.theme === "dark") {
      root.classList.add("theme-dark", "dark");
    } else if (settings.theme === "sepia") {
      root.classList.add("theme-sepia");
    } else {
      root.classList.add("theme-light");
    }
  }, [settings]);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateSetting,
    resetSettings,
  };
}
