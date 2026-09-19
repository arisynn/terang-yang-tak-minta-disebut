import React from "react";
import { BookOpen, SlidersHorizontal, Sun, Moon, Coffee, ChevronLeft, ChevronRight } from "lucide-react";
import { NOVEL_META } from "../data/episodes";

export function Header({
  currentEpisode,
  progress,
  isScrolled,
  onOpenDrawer,
  onOpenSettings,
  theme,
  onToggleTheme,
  onPrevEpisode,
  onNextEpisode,
  hasPrev,
  hasNext,
}) {
  const getThemeIcon = () => {
    if (theme === "dark") return <Moon className="w-4 h-4 text-amber-200" />;
    if (theme === "sepia") return <Coffee className="w-4 h-4 text-amber-900" />;
    return <Sun className="w-4 h-4 text-neutral-800" />;
  };

  const nextThemeTitle = () => {
    if (theme === "light") return "Ganti ke tema Sepia";
    if (theme === "sepia") return "Ganti ke tema Malam";
    return "Ganti ke tema Terang";
  };

  return (
    <>
      {/* 1. TOP HEADER (Expanded view when near top) */}
      <header
        id="reader-top-header"
        className={`w-full transition-all duration-300 ease-in-out border-b ${
          isScrolled ? "opacity-0 -translate-y-4 pointer-events-none absolute" : "opacity-100 translate-y-0 relative"
        } ${
          theme === "dark"
            ? "bg-[#121316]/95 border-neutral-800/80 text-neutral-100"
            : theme === "sepia"
            ? "bg-[#f6f0e6]/95 border-[#e0d4c1] text-[#1c1917]"
            : "bg-[#fcfbf8]/95 border-neutral-200/80 text-neutral-900"
        } backdrop-blur-md sticky top-0 z-40`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          {/* Left: Novel Title & Subtitle */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              id="header-open-drawer-btn"
              onClick={onOpenDrawer}
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${
                theme === "dark"
                  ? "hover:bg-neutral-800 text-neutral-200"
                  : theme === "sepia"
                  ? "hover:bg-[#ebe2d3] text-[#4a3b2c]"
                  : "hover:bg-neutral-100 text-neutral-700"
              }`}
              title="Buka Daftar Episode"
              aria-label="Buka Daftar Episode"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Daftar Isi</span>
            </button>

            <div className="h-4 w-px bg-current opacity-20 hidden sm:block" />

            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-serif font-semibold tracking-tight truncate">
                {NOVEL_META.title}
              </h1>
              <p className="text-xs opacity-70 truncate">
                {currentEpisode ? `Episode ${String(currentEpisode.number).padStart(2, "0")} • ${currentEpisode.cleanTitle}` : "Memuat..."}
              </p>
            </div>
          </div>

          {/* Right: Quick Actions (Theme, Settings) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              id="header-theme-toggle-btn"
              onClick={onToggleTheme}
              className={`p-2 rounded-lg transition-colors text-xs flex items-center gap-1.5 ${
                theme === "dark"
                  ? "hover:bg-neutral-800"
                  : theme === "sepia"
                  ? "hover:bg-[#ebe2d3]"
                  : "hover:bg-neutral-100"
              }`}
              title={nextThemeTitle()}
              aria-label={nextThemeTitle()}
            >
              {getThemeIcon()}
              <span className="hidden md:inline capitalize">{theme}</span>
            </button>

            <button
              id="header-open-settings-btn"
              onClick={onOpenSettings}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium ${
                theme === "dark"
                  ? "hover:bg-neutral-800 text-neutral-200"
                  : theme === "sepia"
                  ? "hover:bg-[#ebe2d3] text-[#4a3b2c]"
                  : "hover:bg-neutral-100 text-neutral-700"
              }`}
              title="Pengaturan Tampilan & Tipografi"
              aria-label="Pengaturan Tampilan"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Tampilan</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. COMPACT FLOATING CAPSULE HEADER (When user scrolls down) */}
      <div
        id="reader-compact-capsule"
        className={`fixed top-3 left-0 right-0 z-40 flex justify-center pointer-events-none transition-all duration-300 ease-out ${
          isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div
          className={`pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg border backdrop-blur-md transition-colors ${
            theme === "dark"
              ? "bg-[#1a1c22]/90 border-neutral-700/80 text-neutral-100 shadow-black/40"
              : theme === "sepia"
              ? "bg-[#ede5d8]/95 border-[#d6c7b0] text-[#1c1917] shadow-amber-950/10"
              : "bg-white/95 border-neutral-200/90 text-neutral-900 shadow-neutral-900/10"
          }`}
        >
          {/* Previous Episode arrow */}
          <button
            id="capsule-prev-btn"
            onClick={onPrevEpisode}
            disabled={!hasPrev}
            className={`p-1 rounded-full transition-colors ${
              !hasPrev
                ? "opacity-30 cursor-not-allowed"
                : theme === "dark"
                ? "hover:bg-neutral-800 text-neutral-300"
                : theme === "sepia"
                ? "hover:bg-[#dfd4c1] text-amber-900"
                : "hover:bg-neutral-100 text-neutral-700"
            }`}
            title={hasPrev ? "Episode Sebelumnya" : "Ini episode pertama"}
            aria-label="Episode Sebelumnya"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Episode Info & TOC Click */}
          <button
            id="capsule-toc-btn"
            onClick={onOpenDrawer}
            className={`flex items-center gap-2 px-2 py-0.5 rounded-full text-xs font-medium transition-colors ${
              theme === "dark"
                ? "hover:bg-neutral-800"
                : theme === "sepia"
                ? "hover:bg-[#dfd4c1]"
                : "hover:bg-neutral-100"
            }`}
            title="Buka Daftar Episode"
          >
            <span className="font-serif font-semibold">
              Ep. {currentEpisode ? String(currentEpisode.number).padStart(2, "0") : "01"}
            </span>
            <span className="opacity-40">•</span>
            <span className="opacity-80 tabular-nums">{progress}%</span>
          </button>

          {/* Next Episode arrow */}
          <button
            id="capsule-next-btn"
            onClick={onNextEpisode}
            disabled={!hasNext}
            className={`p-1 rounded-full transition-colors ${
              !hasNext
                ? "opacity-30 cursor-not-allowed"
                : theme === "dark"
                ? "hover:bg-neutral-800 text-neutral-300"
                : theme === "sepia"
                ? "hover:bg-[#dfd4c1] text-amber-900"
                : "hover:bg-neutral-100 text-neutral-700"
            }`}
            title={hasNext ? "Episode Selanjutnya" : "Ini episode terakhir"}
            aria-label="Episode Selanjutnya"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="h-3.5 w-px bg-current opacity-20 mx-0.5" />

          {/* Settings in Capsule */}
          <button
            id="capsule-settings-btn"
            onClick={onOpenSettings}
            className={`p-1.5 rounded-full transition-colors ${
              theme === "dark"
                ? "hover:bg-neutral-800 text-neutral-300"
                : theme === "sepia"
                ? "hover:bg-[#dfd4c1] text-amber-900"
                : "hover:bg-neutral-100 text-neutral-700"
            }`}
            title="Pengaturan Tampilan"
            aria-label="Pengaturan Tampilan"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  );
}
