import React, { useState, useEffect, useCallback } from "react";
import { EPISODES } from "./data/episodes";
import { useReaderSettings } from "./hooks/useReaderSettings";
import { useMarkdownEpisode } from "./hooks/useMarkdownEpisode";
import { useReadingProgress } from "./hooks/useReadingProgress";
import { Header } from "./components/Header";
import { Reader } from "./components/Reader";
import { ReadingProgressBar } from "./components/ReadingProgressBar";
import { EpisodeDrawer } from "./components/EpisodeDrawer";
import { SettingsModal } from "./components/SettingsModal";

function getInitialEpisode() {
  // 1. Check URL hash first (e.g. #episode-03 or #3)
  if (typeof window !== "undefined" && window.location.hash) {
    const hash = window.location.hash.replace("#", "").toLowerCase();
    const match = EPISODES.find(
      (ep) =>
        ep.slug.toLowerCase() === hash ||
        String(ep.number) === hash ||
        ep.slug.toLowerCase() === `episode-${hash.padStart(2, "0")}`
    );
    if (match) return match;
  }

  // 2. Check localStorage for last read active episode
  try {
    const stored = localStorage.getItem("novel_reader_progress_history_v1");
    if (stored) {
      const history = JSON.parse(stored);
      if (history.lastActiveEpisodeId) {
        const found = EPISODES.find((ep) => ep.id === history.lastActiveEpisodeId);
        if (found) return found;
      }
    }
  } catch (e) {
    console.warn("Could not read last active episode", e);
  }

  // 3. Default to first episode
  return EPISODES[0];
}

export default function App() {
  const [currentEpisode, setCurrentEpisode] = useState(getInitialEpisode);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { settings, updateSetting, resetSettings } = useReaderSettings();
  const { progress, isScrolled, scrollToTop } = useReadingProgress(currentEpisode.id);
  const { html, loading, error, retry } = useMarkdownEpisode(currentEpisode);

  const currentIndex = EPISODES.findIndex((ep) => ep.id === currentEpisode.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < EPISODES.length - 1;

  // Change episode handler
  const handleSelectEpisode = useCallback(
    (episodeId) => {
      const selected = EPISODES.find((ep) => ep.id === episodeId);
      if (selected) {
        setCurrentEpisode(selected);
        window.location.hash = selected.slug;
        scrollToTop(false);
      }
    },
    [scrollToTop]
  );

  const handlePrevEpisode = useCallback(() => {
    if (hasPrev) {
      handleSelectEpisode(EPISODES[currentIndex - 1].id);
    }
  }, [hasPrev, currentIndex, handleSelectEpisode]);

  const handleNextEpisode = useCallback(() => {
    if (hasNext) {
      handleSelectEpisode(EPISODES[currentIndex + 1].id);
    }
  }, [hasNext, currentIndex, handleSelectEpisode]);

  // Cycle through themes: light -> sepia -> dark -> light
  const handleToggleTheme = useCallback(() => {
    const themes = ["light", "sepia", "dark"];
    const currentTheme = settings.theme || "light";
    const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    updateSetting("theme", themes[nextIndex]);
  }, [settings.theme, updateSetting]);

  // Listen for hashchange in browser (e.g. back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "").toLowerCase();
      if (!hash) return;
      const match = EPISODES.find(
        (ep) =>
          ep.slug.toLowerCase() === hash ||
          String(ep.number) === hash ||
          ep.slug.toLowerCase() === `episode-${hash.padStart(2, "0")}`
      );
      if (match && match.id !== currentEpisode.id) {
        setCurrentEpisode(match);
        scrollToTop(false);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [currentEpisode.id, scrollToTop]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is in an input or textarea
      if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;

      if (e.key === "ArrowLeft" && !e.altKey && !e.metaKey) {
        if (!isDrawerOpen && !isSettingsOpen) {
          handlePrevEpisode();
        }
      } else if (e.key === "ArrowRight" && !e.altKey && !e.metaKey) {
        if (!isDrawerOpen && !isSettingsOpen) {
          handleNextEpisode();
        }
      } else if ((e.key === "t" || e.key === "T") && !e.ctrlKey && !e.metaKey) {
        if (!isDrawerOpen && !isSettingsOpen) {
          handleToggleTheme();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isDrawerOpen,
    isSettingsOpen,
    handlePrevEpisode,
    handleNextEpisode,
    handleToggleTheme,
  ]);

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-amber-500/20">
      {/* 1. Thin top progress bar */}
      <ReadingProgressBar progress={progress} theme={settings.theme} />

      {/* 2. Header (Minimal Top + Floating Capsule on Scroll) */}
      <Header
        currentEpisode={currentEpisode}
        progress={progress}
        isScrolled={isScrolled}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        theme={settings.theme}
        onToggleTheme={handleToggleTheme}
        onPrevEpisode={handlePrevEpisode}
        onNextEpisode={handleNextEpisode}
        hasPrev={hasPrev}
        hasNext={hasNext}
      />

      {/* 3. Main Novel Reader Viewport */}
      <Reader
        episode={currentEpisode}
        html={html}
        loading={loading}
        error={error}
        onRetry={retry}
        settings={settings}
        onSelectEpisode={handleSelectEpisode}
        onScrollToTop={scrollToTop}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      {/* 4. Episode Table of Contents Drawer */}
      <EpisodeDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        currentEpisodeId={currentEpisode.id}
        onSelectEpisode={handleSelectEpisode}
        theme={settings.theme}
      />

      {/* 5. Typography & Theme Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        updateSetting={updateSetting}
        resetSettings={resetSettings}
      />
    </div>
  );
}
