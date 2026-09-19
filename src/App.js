import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'sonner';
import { NOVEL_DATA } from './data/novelData';
import Navbar from './components/Navbar';
import NovelHero from './components/NovelHero';
import EpisodeReader from './components/EpisodeReader';
import TableOfContentsModal from './components/TableOfContentsModal';
import ReaderSettingsModal from './components/ReaderSettingsModal';

const DEFAULT_SETTINGS = {
  theme: 'paper',
  fontFamily: 'serif',
  fontSize: 18,
  lineHeight: '1.85',
  maxWidth: 'max-w-2xl'
};

export default function App() {
  const [activeEpisodeId, setActiveEpisodeId] = useState(() => {
    return localStorage.getItem('novel_active_ep') || null;
  });

  const [isReaderMode, setIsReaderMode] = useState(() => {
    return !!localStorage.getItem('novel_active_ep');
  });

  const [readerSettings, setReaderSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('novel_reader_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [readEpisodes, setReadEpisodes] = useState(() => {
    try {
      const saved = localStorage.getItem('novel_read_episodes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal states (Only TOC & Settings)
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [copiedEpisodeId, setCopiedEpisodeId] = useState(null);

  // Sync settings to document class
  useEffect(() => {
    localStorage.setItem('novel_reader_settings', JSON.stringify(readerSettings));
    const root = document.documentElement;
    root.classList.remove('theme-paper', 'theme-sepia', 'theme-matcha', 'theme-night', 'theme-oat', 'theme-blush', 'theme-dusk', 'dark');
    root.classList.add(`theme-${readerSettings.theme}`);
    if (readerSettings.theme === 'night') {
      root.classList.add('dark');
    }
  }, [readerSettings]);

  // Sync read episodes
  useEffect(() => {
    localStorage.setItem('novel_read_episodes', JSON.stringify(readEpisodes));
  }, [readEpisodes]);

  const currentEpisode =
    NOVEL_DATA.episodes.find((ep) => ep.id === activeEpisodeId) || NOVEL_DATA.episodes[0];

  const handleSelectEpisode = (epId) => {
    setActiveEpisodeId(epId);
    setIsReaderMode(true);
    localStorage.setItem('novel_active_ep', epId);

    if (!readEpisodes.includes(epId)) {
      setReadEpisodes((prev) => [...prev, epId]);
    }
  };

  const handleBackToOverview = () => {
    setIsReaderMode(false);
  };

  const handleUpdateSettings = (newSettings) => {
    setReaderSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Single dedicated handler for copying for Wattpad
  const handleQuickCopyWattpad = useCallback(async (ep) => {
    if (!ep) return;
    try {
      const formattedText = `${ep.title}\n\n${ep.paragraphs.join('\n\n')}`;
      await navigator.clipboard.writeText(formattedText);
      setCopiedEpisodeId(ep.id);

      toast.success(`Bab ${ep.number} Berhasil Disalin!`, {
        description: `Teks (${ep.wordCount.toLocaleString()} kata) siap langsung di-paste ke Wattpad.`,
        duration: 3000,
        position: 'top-center'
      });

      setTimeout(() => {
        setCopiedEpisodeId(null);
      }, 2500);
    } catch (err) {
      console.error('Failed to copy', err);
      toast.error('Gagal menyalin teks');
    }
  }, []);

  // Protected copy notice when user tries manual text copy/selection
  const handleTriggerCopyProtectedNotice = useCallback(() => {
    toast.info('Gunakan Tombol "Salin untuk Wattpad"', {
      description:
        'Seleksi manual dinonaktifkan. Gunakan tombol di pojok kanan atas untuk menyalin isi bab secara rapi.',
      duration: 3000,
      position: 'top-center'
    });
  }, []);

  const getThemeClass = () => {
    switch (readerSettings.theme) {
      case 'sepia':
        return 'bg-[#f6f0e6] text-[#1c1917]';
      case 'matcha':
        return 'bg-[#f1f6f2] text-[#111d14]';
      case 'night':
        return 'bg-[#121316] text-[#f4f4f5]';
      case 'paper':
      default:
        return 'bg-[#fcfbf8] text-[#111827]';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${getThemeClass()}`}>
      <Toaster richColors position="top-center" />

      {/* Single Clean Top Navbar */}
      <Navbar
        novelTitle={NOVEL_DATA.title}
        currentEpisode={currentEpisode}
        onOpenToc={() => setIsTocOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onQuickCopyWattpad={handleQuickCopyWattpad}
        isReaderMode={isReaderMode}
        onBackToOverview={handleBackToOverview}
        theme={readerSettings.theme}
        copiedEpisodeId={copiedEpisodeId}
      />

      {/* Main View Area */}
      <div className="flex-1 w-full">
        {isReaderMode && currentEpisode ? (
          <EpisodeReader
            episode={currentEpisode}
            novelData={NOVEL_DATA}
            onNavigateEpisode={handleSelectEpisode}
            onTriggerCopyProtectedNotice={handleTriggerCopyProtectedNotice}
            readerSettings={readerSettings}
            theme={readerSettings.theme}
          />
        ) : (
          <NovelHero
            novelData={NOVEL_DATA}
            onSelectEpisode={handleSelectEpisode}
            readEpisodes={readEpisodes}
            lastReadEpisodeId={activeEpisodeId}
            theme={readerSettings.theme}
          />
        )}
      </div>

      {/* Minimal Footer */}
      <footer className="w-full border-t border-inherit/15 py-6 px-4 text-center text-xs opacity-50 space-y-1">
        <p className="font-serif">{NOVEL_DATA.title}</p>
        <p>30 Bab Lengkap • Kisah Kinanthi & Garaga</p>
      </footer>

      {/* Table of Contents Modal */}
      <TableOfContentsModal
        isOpen={isTocOpen}
        onClose={() => setIsTocOpen(false)}
        episodes={NOVEL_DATA.episodes}
        currentEpisodeId={activeEpisodeId}
        onSelectEpisode={handleSelectEpisode}
        readEpisodes={readEpisodes}
        theme={readerSettings.theme}
      />

      {/* Reader Settings Modal */}
      <ReaderSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={readerSettings}
        onUpdateSettings={handleUpdateSettings}
        theme={readerSettings.theme}
      />
    </div>
  );
}
