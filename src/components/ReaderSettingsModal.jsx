import React from 'react';
import { X } from 'lucide-react';

export default function ReaderSettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  theme = 'paper'
}) {
  if (!isOpen) return null;

  const bookThemes = [
    { id: 'paper', name: 'Kertas Novel', desc: 'Putih gading & tinta hitam pekat', bg: 'bg-[#fcfbf8]', border: 'border-[#e4e4e7]', text: 'text-[#111827]' },
    { id: 'sepia', name: 'Kertas Klasik', desc: 'Krem sepia & tinta espresso', bg: 'bg-[#f6f0e6]', border: 'border-[#e0d4c1]', text: 'text-[#1c1917]' },
    { id: 'matcha', name: 'Matcha Sage', desc: 'Hijau lembut & tinta pekat', bg: 'bg-[#f1f6f2]', border: 'border-[#d2dfd5]', text: 'text-[#111d14]' },
    { id: 'night', name: 'Mode Malam', desc: 'Gelap redup & teks terang', bg: 'bg-[#121316]', border: 'border-[#292d34]', text: 'text-[#f4f4f5]' },
  ];

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

  const getAccentPill = () => {
    switch (theme) {
      case 'sepia':
        return 'bg-[#784c28] text-white';
      case 'matcha':
        return 'bg-[#375f42] text-white';
      case 'night':
        return 'bg-[#d49b82] text-zinc-950 font-semibold';
      case 'paper':
      default:
        return 'bg-[#27272a] text-white';
    }
  };

  return (
    <div
      id="reader-settings-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="reader-settings-container"
        className={`w-full max-w-sm rounded-3xl border shadow-xl p-6 space-y-6 ${getThemeBg()}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-inherit/20 pb-3">
          <h3 className="font-serif font-bold text-base">Tampilan Buku Novel</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Paper Theme Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold opacity-60 uppercase tracking-widest">Warna Kertas</label>
          <div className="grid grid-cols-2 gap-2">
            {bookThemes.map((th) => {
              const isSelected = settings.theme === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => onUpdateSettings({ theme: th.id })}
                  className={`p-3 rounded-2xl border text-xs font-medium flex flex-col items-start gap-0.5 transition ${th.bg} ${th.text} ${th.border} ${
                    isSelected ? 'ring-2 ring-zinc-800 dark:ring-zinc-200 shadow-sm font-semibold' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{th.name}</span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Family */}
        <div className="space-y-2">
          <label className="text-xs font-semibold opacity-60 uppercase tracking-widest">Jenis Huruf</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateSettings({ fontFamily: 'serif' })}
              className={`p-2.5 rounded-2xl border text-xs font-serif transition ${
                settings.fontFamily === 'serif' ? getAccentPill() : 'border-inherit opacity-75 hover:opacity-100'
              }`}
            >
              Literata (Serif Buku)
            </button>
            <button
              onClick={() => onUpdateSettings({ fontFamily: 'sans' })}
              className={`p-2.5 rounded-2xl border text-xs font-sans transition ${
                settings.fontFamily === 'sans' ? getAccentPill() : 'border-inherit opacity-75 hover:opacity-100'
              }`}
            >
              Jakarta (Modern Sans)
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs opacity-60 font-semibold uppercase tracking-widest">
            <span>Ukuran Teks</span>
            <span className="font-normal font-mono normal-case">{settings.fontSize}px</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onUpdateSettings({ fontSize: Math.max(15, settings.fontSize - 1) })}
              className="px-3.5 py-1.5 rounded-full border border-inherit text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              A-
            </button>
            <input
              type="range"
              min="15"
              max="24"
              step="1"
              value={settings.fontSize}
              onChange={(e) => onUpdateSettings({ fontSize: Number(e.target.value) })}
              className="flex-1 accent-zinc-800 dark:accent-zinc-200 cursor-pointer"
            />
            <button
              onClick={() => onUpdateSettings({ fontSize: Math.min(24, settings.fontSize + 1) })}
              className="px-3.5 py-1.5 rounded-full border border-inherit text-xs font-medium hover:bg-black/5 dark:hover:bg-white/5 transition"
            >
              A+
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
