import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function EpisodeReader({
  episode,
  novelData,
  onNavigateEpisode,
  onTriggerCopyProtectedNotice,
  readerSettings,
  theme = 'paper'
}) {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [episode.id]);

  // Scroll to top when episode changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [episode.id]);

  // Anti-copy protection event handlers as requested: "disable salin selain di tombol itu"
  const handleProtectedAction = (e, actionType) => {
    e.preventDefault();
    if (onTriggerCopyProtectedNotice) {
      onTriggerCopyProtectedNotice(actionType);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'u' || e.key === 'U')) {
      e.preventDefault();
      if (onTriggerCopyProtectedNotice) {
        onTriggerCopyProtectedNotice('shortcut');
      }
    }
  };

  const currentEpIndex = novelData.episodes.findIndex((ep) => ep.id === episode.id);
  const prevEpisode = currentEpIndex > 0 ? novelData.episodes[currentEpIndex - 1] : null;
  const nextEpisode = currentEpIndex < novelData.episodes.length - 1 ? novelData.episodes[currentEpIndex + 1] : null;

  const fontClass = readerSettings.fontFamily === 'serif' ? 'font-serif' : 'font-sans';
  const textContainerStyle = {
    fontSize: `${readerSettings.fontSize}px`,
    lineHeight: readerSettings.lineHeight || '1.85',
  };

  const getProgressColor = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#8d5b38]';
      case 'matcha':
        return 'bg-[#3b6e49]';
      case 'night':
        return 'bg-[#d49b82]';
      case 'paper':
      default:
        return 'bg-[#27272a]';
    }
  };

  return (
    <div
      id="episode-reader-wrapper"
      className="min-h-screen w-full transition-colors duration-200 select-none novel-protected-text"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Top Reading Progress Bar */}
      <div
        id="reading-progress-bar-container"
        className="fixed top-14 left-0 w-full h-0.5 bg-black/5 dark:bg-white/5 z-40 pointer-events-none"
      >
        <div
          id="reading-progress-bar"
          className={`h-full transition-all duration-150 ${getProgressColor()}`}
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <main className={`mx-auto px-4 sm:px-6 py-10 sm:py-16 ${readerSettings.maxWidth || 'max-w-2xl'}`}>
        {/* Minimalist Chapter Header */}
        <header className="space-y-3 text-center mb-12 pb-8 border-b border-black/10 dark:border-white/10">
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Bab {String(episode.number).padStart(2, '0')} • ±{episode.readingTime} Menit Baca
          </p>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight leading-snug text-zinc-950 dark:text-zinc-50">
            {episode.cleanTitle}
          </h1>
        </header>

        {/* Protected Story Text Body: Solid, deep black ink just like a printed novel */}
        <article
          id="protected-story-article"
          className={`space-y-6 text-zinc-950 dark:text-zinc-100 ${fontClass}`}
          style={textContainerStyle}
          onCopy={(e) => handleProtectedAction(e, 'copy')}
          onCut={(e) => handleProtectedAction(e, 'cut')}
          onContextMenu={(e) => handleProtectedAction(e, 'contextmenu')}
        >
          {episode.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="novel-paragraph text-justify sm:text-left leading-relaxed text-zinc-950 dark:text-zinc-100 font-normal"
            >
              {paragraph}
            </p>
          ))}
        </article>

        {/* End of Chapter Divider */}
        <div className="my-14 flex items-center justify-center gap-3 opacity-30">
          <div className="h-px w-12 bg-current" />
          <span className="text-xs font-serif italic">***</span>
          <div className="h-px w-12 bg-current" />
        </div>

        {/* Previous & Next Chapter Navigation */}
        <nav
          id="reader-navigation-controls"
          aria-label="Navigasi Bab"
          className="flex items-center justify-between gap-4 pt-6 border-t border-black/10 dark:border-white/10"
        >
          {prevEpisode ? (
            <button
              id="prev-episode-btn"
              onClick={() => onNavigateEpisode(prevEpisode.id)}
              className="flex items-center gap-2 py-2 px-4 rounded-full border border-black/15 dark:border-white/15 text-xs sm:text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Bab {prevEpisode.number}</span>
            </button>
          ) : (
            <div />
          )}

          {nextEpisode ? (
            <button
              id="next-episode-btn"
              onClick={() => onNavigateEpisode(nextEpisode.id)}
              className="flex items-center gap-2 py-2 px-4 rounded-full border border-black/15 dark:border-white/15 text-xs sm:text-sm font-medium hover:bg-black/5 dark:hover:bg-white/5 transition ml-auto"
            >
              <span>Bab {nextEpisode.number}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="py-2 px-4 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-medium flex items-center gap-1.5 ml-auto">
              <Check className="w-3.5 h-3.5" />
              <span>Tamat</span>
            </div>
          )}
        </nav>
      </main>
    </div>
  );
}
