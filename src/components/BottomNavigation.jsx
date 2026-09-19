import React from "react";
import { ChevronLeft, ChevronRight, ArrowUp, Sparkles, BookOpen } from "lucide-react";
import { EPISODES } from "../data/episodes";

export function BottomNavigation({
  currentEpisode,
  onSelectEpisode,
  onScrollToTop,
  onOpenDrawer,
  theme,
}) {
  const currentIndex = EPISODES.findIndex((ep) => ep.id === currentEpisode?.id);
  const prevEp = currentIndex > 0 ? EPISODES[currentIndex - 1] : null;
  const nextEp = currentIndex < EPISODES.length - 1 ? EPISODES[currentIndex + 1] : null;

  return (
    <nav
      id="reader-bottom-navigation"
      className="mt-16 pt-8 border-t border-inherit"
      aria-label="Navigasi Episode"
    >
      {/* End of chapter indicator */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="flex items-center gap-2 mb-2 opacity-50">
          <span className="h-px w-8 bg-current" />
          <span className="text-xs font-serif italic">Akhir {currentEpisode?.cleanTitle}</span>
          <span className="h-px w-8 bg-current" />
        </div>
        <p className="text-xs opacity-60">
          Episode {String(currentEpisode?.number || 1).padStart(2, "0")} dari {EPISODES.length} Episode
        </p>
      </div>

      {/* Prev / Next Buttons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
        {/* Previous Episode Card */}
        {prevEp ? (
          <button
            id="bottom-prev-episode-btn"
            onClick={() => onSelectEpisode(prevEp.id)}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3.5 group ${
              theme === "dark"
                ? "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850"
                : theme === "sepia"
                ? "bg-[#efe6d8]/80 border-[#ded0bb] hover:border-[#cbba9f] hover:bg-[#ebdcc8]"
                : "bg-neutral-50/80 border-neutral-200/90 hover:border-neutral-300 hover:bg-white"
            }`}
          >
            <div
              className={`p-2.5 rounded-xl shrink-0 transition-transform group-hover:-translate-x-1 ${
                theme === "dark"
                  ? "bg-neutral-800 text-neutral-300"
                  : theme === "sepia"
                  ? "bg-[#ded0bb] text-[#4a3b2c]"
                  : "bg-neutral-200/70 text-neutral-700"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] opacity-60 uppercase font-mono tracking-wider block">
                Episode Sebelumnya ({String(prevEp.number).padStart(2, "0")})
              </span>
              <span className="text-sm font-serif font-medium line-clamp-1 mt-0.5">
                {prevEp.cleanTitle}
              </span>
            </div>
          </button>
        ) : (
          <div
            className={`p-4 rounded-2xl border border-dashed opacity-40 text-center flex items-center justify-center text-xs ${
              theme === "dark" ? "border-neutral-800" : "border-neutral-300"
            }`}
          >
            Ini adalah awal kisah (Episode 01)
          </div>
        )}

        {/* Next Episode Card */}
        {nextEp ? (
          <button
            id="bottom-next-episode-btn"
            onClick={() => onSelectEpisode(nextEp.id)}
            className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3.5 group ${
              theme === "dark"
                ? "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-850"
                : theme === "sepia"
                ? "bg-[#efe6d8]/80 border-[#ded0bb] hover:border-[#cbba9f] hover:bg-[#ebdcc8]"
                : "bg-neutral-50/80 border-neutral-200/90 hover:border-neutral-300 hover:bg-white"
            }`}
          >
            <div className="min-w-0">
              <span className="text-[11px] opacity-60 uppercase font-mono tracking-wider block">
                Episode Selanjutnya ({String(nextEp.number).padStart(2, "0")})
              </span>
              <span className="text-sm font-serif font-medium line-clamp-1 mt-0.5">
                {nextEp.cleanTitle}
              </span>
            </div>
            <div
              className={`p-2.5 rounded-xl shrink-0 transition-transform group-hover:translate-x-1 ${
                theme === "dark"
                  ? "bg-amber-400/20 text-amber-200"
                  : theme === "sepia"
                  ? "bg-[#784c28]/20 text-[#784c28]"
                  : "bg-neutral-900 text-white"
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        ) : (
          <div
            className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center text-xs ${
              theme === "dark"
                ? "bg-amber-400/10 border-amber-400/30 text-amber-200"
                : theme === "sepia"
                ? "bg-[#784c28]/10 border-[#784c28]/30 text-[#784c28]"
                : "bg-neutral-900/5 border-neutral-900/20 text-neutral-900"
            }`}
          >
            <Sparkles className="w-4 h-4 mb-1 animate-pulse" />
            <span className="font-serif font-semibold">Tamat (Episode 30)</span>
            <span className="text-[11px] opacity-70 mt-0.5">Terima kasih telah membaca hingga akhir.</span>
          </div>
        )}
      </div>

      {/* Auxiliary Actions: Back to Top & Open TOC */}
      <div className="flex items-center justify-between py-4 text-xs opacity-70">
        <button
          onClick={onOpenDrawer}
          className="flex items-center gap-1.5 hover:opacity-100 transition-opacity p-2 rounded-lg"
        >
          <BookOpen className="w-4 h-4" />
          <span>Lihat Semua Episode</span>
        </button>

        <button
          onClick={() => onScrollToTop(true)}
          className="flex items-center gap-1.5 hover:opacity-100 transition-opacity p-2 rounded-lg"
          title="Kembali ke Bagian Atas Halaman"
        >
          <span>Kembali ke Atas</span>
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
