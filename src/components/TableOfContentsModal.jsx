import React, { useState } from 'react';
import { Search, X, Check } from 'lucide-react';

export default function TableOfContentsModal({
  isOpen,
  onClose,
  episodes,
  currentEpisodeId,
  onSelectEpisode,
  readEpisodes = [],
  theme = 'paper'
}) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredEpisodes = episodes.filter((ep) => {
    const term = searchTerm.toLowerCase();
    return (
      ep.title.toLowerCase().includes(term) ||
      ep.cleanTitle.toLowerCase().includes(term) ||
      String(ep.number).includes(term)
    );
  });

  const getThemeBg = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#f6f0e6] text-[#1c1917] border-[#e0d4c1]';
      case 'matcha':
        return 'bg-[#f1f6f2] text-[#111d14] border-[#d2dfd5]';
      case 'night':
        return 'bg-[#121316] text-[#f4f4f5] border-[#292d34]';
      case 'paper':
      default:
        return 'bg-[#fcfbf8] text-[#111827] border-[#e4e4e7]';
    }
  };

  const getActivePill = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#784c28] text-white';
      case 'matcha':
        return 'bg-[#375f42] text-white';
      case 'night':
        return 'bg-[#d49b82] text-zinc-950 font-semibold';
      case 'paper':
      default:
        return 'bg-[#18181b] text-white';
    }
  };

  return (
    <div
      id="toc-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="toc-modal-container"
        className={`w-full max-w-lg max-h-[80vh] flex flex-col rounded-3xl border shadow-xl overflow-hidden ${getThemeBg()}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-inherit/20">
          <h3 className="font-serif font-bold text-base">Daftar Isi (30 Bab)</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-inherit/20">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3 opacity-40 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari nomor atau judul bab..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-full bg-black/5 dark:bg-white/5 border border-inherit focus:outline-none focus:ring-1 focus:ring-zinc-800/40"
            />
          </div>
        </div>

        {/* List of Chapters */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {filteredEpisodes.map((ep) => {
            const isCurrent = ep.id === currentEpisodeId;
            const isRead = readEpisodes.includes(ep.id);

            return (
              <div
                key={ep.id}
                onClick={() => {
                  onSelectEpisode(ep.id);
                  onClose();
                }}
                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition ${
                  isCurrent
                    ? getActivePill()
                    : 'hover:bg-black/[0.04] dark:hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <span className={`text-xs font-mono w-5 opacity-60 ${isCurrent ? 'text-inherit opacity-90 font-bold' : ''}`}>
                    {String(ep.number).padStart(2, '0')}
                  </span>
                  <p className="font-serif text-sm truncate font-medium">
                    {ep.cleanTitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 text-xs">
                  {isRead && !isCurrent && (
                    <span className="opacity-40">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <span className={`text-[11px] opacity-60 ${isCurrent ? 'text-inherit opacity-90' : ''}`}>
                    ±{ep.readingTime} mnt
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
