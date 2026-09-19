import React from "react";
import { AlertCircle, RotateCcw, Clock, BookOpen } from "lucide-react";
import { NOVEL_META } from "../data/episodes";
import { BottomNavigation } from "./BottomNavigation";

export function Reader({
  episode,
  html,
  loading,
  error,
  onRetry,
  settings,
  onSelectEpisode,
  onScrollToTop,
  onOpenDrawer,
}) {
  const theme = settings.theme || "light";

  // Map settings to concrete Tailwind & CSS styles
  const getFontSizeClass = () => {
    switch (settings.fontSize) {
      case "sm":
        return "text-[16px] sm:text-[17px]";
      case "lg":
        return "text-[20px] sm:text-[21px]";
      case "xl":
        return "text-[22px] sm:text-[23px]";
      case "md":
      default:
        return "text-[18px] sm:text-[19px]";
    }
  };

  const getLineHeightClass = () => {
    switch (settings.lineHeight) {
      case "normal":
        return "leading-[1.65]";
      case "loose":
        return "leading-[2.1]";
      case "relaxed":
      default:
        return "leading-[1.85]";
    }
  };

  const getMaxWidthClass = () => {
    switch (settings.textWidth) {
      case "compact":
        return "max-w-[58ch]";
      case "wide":
        return "max-w-[78ch]";
      case "normal":
      default:
        return "max-w-[68ch]";
    }
  };

  const getFontFamilyClass = () => {
    if (settings.fontFamily === "sans") {
      return "font-sans";
    }
    return "font-serif";
  };

  return (
    <main
      id="novel-reader-viewport"
      className="min-h-screen w-full transition-colors duration-200"
    >
      <div className={`mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-20 ${getMaxWidthClass()}`}>
        {/* CHAPTER HEADER */}
        <header id="chapter-header" className="mb-10 sm:mb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium opacity-70 bg-current/5 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>EPISODE {String(episode?.number || 1).padStart(2, "0")}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold tracking-tight mb-4 leading-tight">
            {episode?.cleanTitle}
          </h1>

          <div className="flex items-center justify-center gap-3 text-xs opacity-60">
            <span className="font-serif italic">{NOVEL_META.title}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {episode?.readingTime || "10 menit"}
            </span>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 opacity-30">
            <span className="h-px w-12 bg-current" />
            <span className="text-xs">✦</span>
            <span className="h-px w-12 bg-current" />
          </div>
        </header>

        {/* LOADING SKELETON */}
        {loading && (
          <div id="reader-skeleton" className="space-y-6 animate-pulse py-4" aria-busy="true">
            <div className="space-y-3">
              <div className="h-4 bg-current opacity-10 rounded-sm w-full" />
              <div className="h-4 bg-current opacity-10 rounded-sm w-[96%]" />
              <div className="h-4 bg-current opacity-10 rounded-sm w-[92%]" />
              <div className="h-4 bg-current opacity-10 rounded-sm w-[98%]" />
            </div>
            <div className="space-y-3 pt-2">
              <div className="h-4 bg-current opacity-10 rounded-sm w-[94%]" />
              <div className="h-4 bg-current opacity-10 rounded-sm w-full" />
              <div className="h-4 bg-current opacity-10 rounded-sm w-[88%]" />
            </div>
            <div className="space-y-3 pt-2">
              <div className="h-4 bg-current opacity-10 rounded-sm w-[97%]" />
              <div className="h-4 bg-current opacity-10 rounded-sm w-[91%]" />
              <div className="h-4 bg-current opacity-10 rounded-sm w-[95%]" />
              <div className="h-4 bg-current opacity-10 rounded-sm w-[84%]" />
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div
            id="reader-error-state"
            className={`p-6 sm:p-8 rounded-2xl border text-center my-8 ${
              theme === "dark"
                ? "bg-red-950/20 border-red-900/40 text-red-200"
                : theme === "sepia"
                ? "bg-[#e8d5c4] border-[#cbb39e] text-[#5e2d1d]"
                : "bg-red-50 border-red-200 text-red-900"
            }`}
          >
            <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-80" />
            <h3 className="text-base font-semibold font-serif mb-2">
              Episode Belum Dapat Dimuat
            </h3>
            <p className="text-xs sm:text-sm opacity-80 max-w-md mx-auto mb-5">
              {error}
            </p>
            <button
              id="reader-retry-btn"
              onClick={onRetry}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
                theme === "dark"
                  ? "bg-neutral-800 text-white hover:bg-neutral-700"
                  : theme === "sepia"
                  ? "bg-[#784c28] text-white hover:bg-[#5d381c]"
                  : "bg-neutral-900 text-white hover:bg-neutral-800"
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Coba Muat Ulang</span>
            </button>
          </div>
        )}

        {/* MAIN NOVEL CONTENT (Rendered Markdown HTML) */}
        {!loading && !error && (
          <article
            id="novel-content-article"
            className={`prose-novel ${getFontFamilyClass()} ${getFontSizeClass()} ${getLineHeightClass()} tracking-[0.01em]`}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}

        {/* BOTTOM NAVIGATION */}
        {!loading && !error && (
          <BottomNavigation
            currentEpisode={episode}
            onSelectEpisode={onSelectEpisode}
            onScrollToTop={onScrollToTop}
            onOpenDrawer={onOpenDrawer}
            theme={theme}
          />
        )}
      </div>
    </main>
  );
}
