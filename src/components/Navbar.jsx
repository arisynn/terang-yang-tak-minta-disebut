import React from 'react';
import { ArrowLeft, Copy, Check, List, Sliders } from 'lucide-react';

export default function Navbar({
  novelTitle,
  currentEpisode,
  onOpenToc,
  onOpenSettings,
  onQuickCopyWattpad,
  isReaderMode,
  onBackToOverview,
  theme = 'paper',
  copiedEpisodeId
}) {
  const isCopied = copiedEpisodeId === currentEpisode?.id;

  const getThemeClass = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#f6f0e6]/95 text-[#1c1917] border-[#e0d4c1]';
      case 'matcha':
        return 'bg-[#f1f6f2]/95 text-[#111d14] border-[#d2dfd5]';
      case 'night':
        return 'bg-[#121316]/95 text-[#f4f4f5] border-[#292d34]';
      case 'paper':
      default:
        return 'bg-[#fcfbf8]/95 text-[#111827] border-[#e4e4e7]';
    }
  };

  const getCopyBtnClass = () => {
    if (isCopied) {
      return 'bg-emerald-600 text-white shadow-sm';
    }
    switch (theme) {
      case 'sepia':
        return 'bg-[#784c28] hover:bg-[#5d381c] text-white shadow-sm';
      case 'matcha':
        return 'bg-[#375f42] hover:bg-[#294932] text-white shadow-sm';
      case 'night':
        return 'bg-[#d49b82] hover:bg-[#e0ae97] text-zinc-950 font-semibold shadow-sm';
      case 'paper':
      default:
        return 'bg-[#18181b] hover:bg-[#27272a] text-white shadow-sm';
    }
  };

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-30 w-full backdrop-blur-md border-b transition-colors duration-200 ${getThemeClass()}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Left: Navigation or Brand */}
        <div className="flex items-center gap-2.5 min-w-0">
          {isReaderMode ? (
            <button
              id="nav-back-btn"
              onClick={onBackToOverview}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Daftar Bab</span>
            </button>
          ) : (
            <button
              onClick={onBackToOverview}
              className="font-serif font-bold text-sm sm:text-base tracking-tight truncate hover:opacity-80 transition text-left"
            >
              {novelTitle}
            </button>
          )}

          {isReaderMode && currentEpisode && (
            <button
              id="nav-chapter-pill"
              onClick={onOpenToc}
              className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/5 text-xs font-medium hover:bg-black/10 dark:hover:bg-white/10 transition truncate max-w-[180px] sm:max-w-xs"
              title="Ganti Bab"
            >
              Bab {currentEpisode.number}: {currentEpisode.cleanTitle}
            </button>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Wattpad Copy Button (Prominent in Reader Mode) */}
          {isReaderMode && currentEpisode && (
            <button
              id="nav-copy-wattpad-btn"
              onClick={() => onQuickCopyWattpad(currentEpisode)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition active:scale-95 ${getCopyBtnClass()}`}
              title="Salin konten bab ini untuk ditempel ke Wattpad"
            >
              {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Tersalin!' : 'Salin untuk Wattpad'}</span>
            </button>
          )}

          {/* Reader Settings (Theme & Font) */}
          <button
            id="nav-settings-btn"
            onClick={onOpenSettings}
            className="p-2 rounded-full opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition text-xs"
            title="Pengaturan Tampilan & Warna Kertas"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Table of Contents Drawer */}
          <button
            id="nav-toc-drawer-btn"
            onClick={onOpenToc}
            className="p-2 rounded-full opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition text-xs"
            title="Daftar Isi"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
