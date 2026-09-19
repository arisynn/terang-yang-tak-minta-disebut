import { useState, useEffect, useCallback } from "react";

const PROGRESS_STORAGE_KEY = "novel_reader_progress_history_v1";

export function useReadingProgress(currentEpisodeId) {
  const [progress, setProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const calculateProgress = useCallback(() => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    if (scrollHeight > 0) {
      const percentage = Math.min(100, Math.max(0, Math.round((scrollTop / scrollHeight) * 100)));
      setProgress(percentage);
    } else {
      setProgress(0);
    }

    setIsScrolled(scrollTop > 90);
  }, []);

  // Update progress on scroll
  useEffect(() => {
    let timeoutId = null;
    const handleScroll = () => {
      if (!timeoutId) {
        timeoutId = requestAnimationFrame(() => {
          calculateProgress();
          timeoutId = null;
        });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    calculateProgress();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) cancelAnimationFrame(timeoutId);
    };
  }, [calculateProgress]);

  // Save last read progress
  useEffect(() => {
    if (!currentEpisodeId) return;

    try {
      const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
      const history = stored ? JSON.parse(stored) : {};
      
      history[currentEpisodeId] = {
        episodeId: currentEpisodeId,
        progress: progress,
        lastReadAt: new Date().toISOString(),
      };

      // Also store current active episode
      history.lastActiveEpisodeId = currentEpisodeId;

      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn("Could not save progress to localStorage", e);
    }
  }, [currentEpisodeId, progress]);

  const scrollToTop = useCallback((smooth = true) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  return {
    progress,
    isScrolled,
    scrollToTop,
  };
}
