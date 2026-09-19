import React, { useState, useEffect, useRef } from "react";
import { X, Search, Check, BookOpen, Clock } from "lucide-react";
import { EPISODES, NOVEL_META } from "../data/episodes";

export function EpisodeDrawer({
  isOpen,
  onClose,
  currentEpisodeId,
  onSelectEpisode,
  theme,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const activeItemRef = useRef(null);
  const inputRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus search or scroll to active episode when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (activeItemRef.current) {
          activeItemRef.current.scrollIntoView({
            block: "center",
            behavior: "smooth",
          });
        }
      }, 150);
    } else {
      setSearchQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredEpisodes = EPISODES.filter((ep) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const numMatch = String(ep.number).includes(query);
    const titleMatch = ep.title.toLowerCase().includes(query);
    const cleanMatch = ep.cleanTitle.toLowerCase().includes(query);
    return numMatch || titleMatch || cleanMatch;
  });

  return (
    <div
      id="episode-drawer-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center bg-black/50 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target.id === "episode-drawer-backdrop") {
          onClose();
        }
      }}
    >
      <div
        id="episode-drawer-panel"
        className={`w-full max-h-[85vh] sm:max-h-[80vh] sm:max-w-lg sm:rounded-2xl rounded-t-2xl flex flex-col shadow-2xl overflow-hidden border transition-transform duration-200 ease-out ${
          theme === "dark"
            ? "bg-[#16181d] border-neutral-800 text-neutral-100"
            : theme === "sepia"
            ? "bg-[#f4ece1] border-[#ded0bb] text-[#1c1917]"
            : "bg-[#ffffff] border-neutral-200 text-neutral-900"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-inherit flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-lg ${
                theme === "dark"
                  ? "bg-neutral-800 text-neutral-200"
                  : theme === "sepia"
                  ? "bg-[#e8dcce] text-[#4a3b2c]"
                  : "bg-neutral-100 text-neutral-800"
              }`}
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold font-serif leading-none">
                Daftar Episode
              </h2>
              <p className="text-xs opacity-60 mt-1">
                {NOVEL_META.totalEpisodes} Episode Lengkap
              </p>
            </div>
          </div>

          <button
            id="drawer-close-btn"
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              theme === "dark"
                ? "hover:bg-neutral-800 text-neutral-400 hover:text-white"
                : theme === "sepia"
                ? "hover:bg-[#e8dcce] text-neutral-600 hover:text-black"
                : "hover:bg-neutral-100 text-neutral-500 hover:text-black"
            }`}
            aria-label="Tutup daftar episode"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2.5 border-b border-inherit shrink-0">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-colors ${
              theme === "dark"
                ? "bg-neutral-900/60 border-neutral-800 focus-within:border-neutral-600 text-neutral-200"
                : theme === "sepia"
                ? "bg-[#ede2d3] border-[#ded0bb] focus-within:border-[#967f66] text-[#1c1917]"
                : "bg-neutral-50 border-neutral-200 focus-within:border-neutral-400 text-neutral-900"
            }`}
          >
            <Search className="w-3.5 h-3.5 opacity-50 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor atau judul episode..."
              className="w-full bg-transparent outline-hidden text-xs sm:text-sm placeholder:opacity-50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs opacity-50 hover:opacity-100"
              >
                Hapus
              </button>
            )}
          </div>
        </div>

        {/* Episode List (Scrollable) */}
        <div className="overflow-y-auto flex-1 p-2 sm:p-3 space-y-1 divide-y divide-inherit divide-opacity-30">
          {filteredEpisodes.length === 0 ? (
            <div className="py-12 text-center text-xs opacity-60">
              Tidak ada episode yang cocok dengan "{searchQuery}"
            </div>
          ) : (
            filteredEpisodes.map((ep) => {
              const isActive = ep.id === currentEpisodeId;
              const isPast = ep.id < currentEpisodeId;

              return (
                <button
                  key={ep.id}
                  ref={isActive ? activeItemRef : null}
                  id={`drawer-episode-item-${ep.id}`}
                  onClick={() => {
                    onSelectEpisode(ep.id);
                    onClose();
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-3 ${
                    isActive
                      ? theme === "dark"
                        ? "bg-neutral-800/90 text-amber-200 ring-1 ring-amber-400/30"
                        : theme === "sepia"
                        ? "bg-[#e5d8c5] text-[#3d2b1f] ring-1 ring-[#8c6b4f]/40"
                        : "bg-neutral-100 text-neutral-900 ring-1 ring-neutral-900/20"
                      : theme === "dark"
                      ? "hover:bg-neutral-800/50 text-neutral-300"
                      : theme === "sepia"
                      ? "hover:bg-[#ebe0d0] text-[#2c241c]"
                      : "hover:bg-neutral-50 text-neutral-700"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md shrink-0 mt-0.5 ${
                        isActive
                          ? theme === "dark"
                            ? "bg-amber-400/20 text-amber-200"
                            : theme === "sepia"
                            ? "bg-[#784c28]/20 text-[#784c28]"
                            : "bg-neutral-900 text-white"
                          : "opacity-60 bg-current/10"
                      }`}
                    >
                      {String(ep.number).padStart(2, "0")}
                    </span>

                    <div className="min-w-0">
                      <p
                        className={`text-xs sm:text-sm font-medium line-clamp-1 ${
                          isActive ? "font-semibold" : ""
                        }`}
                      >
                        {ep.cleanTitle}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] opacity-60">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {ep.readingTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1 ${
                        theme === "dark"
                          ? "bg-amber-400/20 text-amber-200"
                          : theme === "sepia"
                          ? "bg-[#784c28]/20 text-[#784c28]"
                          : "bg-neutral-900/10 text-neutral-900"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      Dibaca
                    </span>
                  )}
                  {!isActive && isPast && (
                    <span className="opacity-40 p-1">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Drawer Footer Info */}
        <div className="p-3 border-t border-inherit text-center text-[11px] opacity-50 shrink-0">
          Klik salah satu episode untuk langsung membaca
        </div>
      </div>
    </div>
  );
}
