import React, { useState } from 'react';
import { BookOpen, Clock, ChevronRight, Search } from 'lucide-react';

export default function NovelHero({
  novelData,
  onSelectEpisode,
  readEpisodes = [],
  lastReadEpisodeId,
  theme = 'paper'
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFullSynopsis, setShowFullSynopsis] = useState(false);

  const { title, tagline, status, synopsis, episodes } = novelData;
  const lastReadEpisode = episodes.find((ep) => ep.id === lastReadEpisodeId) || episodes[0];

  const filteredEpisodes = episodes.filter((ep) => {
    const term = searchTerm.toLowerCase();
    return (
      ep.title.toLowerCase().includes(term) ||
      ep.cleanTitle.toLowerCase().includes(term) ||
      String(ep.number).includes(term)
    );
  });

  const getAccentBtn = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#784c28] hover:bg-[#5d381c] text-white';
      case 'matcha':
        return 'bg-[#375f42] hover:bg-[#294932] text-white';
      case 'night':
        return 'bg-[#d49b82] hover:bg-[#e0ae97] text-zinc-950 font-semibold';
      case 'paper':
      default:
        return 'bg-[#18181b] hover:bg-[#27272a] text-white';
    }
  };

  const getPillClass = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#ede5d8] text-[#784c28]';
      case 'matcha':
        return 'bg-[#e5ede7] text-[#375f42]';
      case 'night':
        return 'bg-[#252321] text-[#d49b82]';
      case 'paper':
      default:
        return 'bg-[#f4f4f5] text-[#27272a]';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      {/* Novel Header */}
      <section className="text-center space-y-4 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide">
          <span className={`px-2.5 py-0.5 rounded-full font-semibold ${getPillClass()}`}>
            {status}
          </span>
          <span className="opacity-60 text-xs">30 Bab Lengkap • ±53k Kata</span>
        </div>

        <h1 className="font-serif font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight text-zinc-950 dark:text-zinc-50">
          {title}
        </h1>

        <p className="text-sm sm:text-base opacity-75 max-w-lg mx-auto font-serif italic leading-relaxed text-zinc-800 dark:text-zinc-200">
          &ldquo;{tagline}&rdquo;
        </p>

        {/* Primary Action Button */}
        <div className="pt-2 flex justify-center">
          <button
            id="hero-read-btn"
            onClick={() => onSelectEpisode(lastReadEpisode.id)}
            className={`px-7 py-3 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm transition active:scale-95 ${getAccentBtn()}`}
          >
            <BookOpen className="w-4 h-4" />
            <span>
              {lastReadEpisodeId
                ? `Lanjut Bab ${String(lastReadEpisode.number).padStart(2, '0')}: ${lastReadEpisode.cleanTitle}`
                : 'Mulai Membaca (Bab 01)'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Book Synopsis */}
      <section className="p-5 sm:p-6 rounded-2xl border border-black/10 dark:border-white/10 bg-black/[0.015] dark:bg-white/[0.02] space-y-2.5">
        <h2 className="text-xs font-semibold opacity-60 uppercase tracking-widest">Sinopsis Cerita</h2>
        <p className={`font-serif text-sm sm:text-[15px] leading-relaxed text-zinc-900 dark:text-zinc-100 ${showFullSynopsis ? '' : 'line-clamp-3'}`}>
          {synopsis}
        </p>
        <button
          onClick={() => setShowFullSynopsis(!showFullSynopsis)}
          className="text-xs font-medium opacity-70 hover:opacity-100 underline decoration-dotted transition"
        >
          {showFullSynopsis ? 'Tampilkan Lebih Sedikit' : 'Baca Selengkapnya...'}
        </button>
      </section>

      {/* Chapter List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3 border-b border-black/10 dark:border-white/10 pb-3">
          <h2 className="font-serif font-semibold text-lg text-zinc-950 dark:text-zinc-50">Daftar Bab ({episodes.length})</h2>

          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 opacity-40 pointer-events-none" />
            <input
              id="hero-search-input"
              type="text"
              placeholder="Cari judul..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 text-xs rounded-full bg-black/5 dark:bg-white/5 border border-inherit focus:outline-none focus:ring-1 focus:ring-zinc-800/40 w-36 sm:w-48"
            />
          </div>
        </div>

        <div className="divide-y divide-black/5 dark:divide-white/5">
          {filteredEpisodes.map((ep) => {
            const isRead = readEpisodes.includes(ep.id);

            return (
              <div
                key={ep.id}
                id={`chapter-row-${ep.id}`}
                onClick={() => onSelectEpisode(ep.id)}
                className="group flex items-center justify-between py-3.5 px-3 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.03] cursor-pointer transition"
              >
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
                  <span className="font-mono text-xs opacity-50 flex-shrink-0 w-6">
                    {String(ep.number).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="font-serif text-sm sm:text-base font-medium text-zinc-950 dark:text-zinc-100 group-hover:underline decoration-1 underline-offset-4 truncate">
                      {ep.cleanTitle}
                    </p>
                    <span className="text-[11px] opacity-50 flex items-center gap-1 font-sans mt-0.5">
                      <Clock className="w-3 h-3" /> ±{ep.readingTime} mnt
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {isRead && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
                      Dibaca
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
