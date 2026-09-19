import React, { useEffect } from "react";
import { X, Sun, Moon, Coffee, RotateCcw, Type, AlignLeft, MoveHorizontal } from "lucide-react";

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  updateSetting,
  resetSettings,
}) {
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

  if (!isOpen) return null;

  const currentTheme = settings.theme || "light";

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center bg-black/50 backdrop-blur-xs transition-opacity duration-200"
      onClick={(e) => {
        if (e.target.id === "settings-modal-backdrop") {
          onClose();
        }
      }}
    >
      <div
        id="settings-modal-panel"
        className={`w-full max-h-[85vh] sm:max-w-md sm:rounded-2xl rounded-t-2xl flex flex-col shadow-2xl overflow-hidden border transition-transform duration-200 ease-out ${
          currentTheme === "dark"
            ? "bg-[#16181d] border-neutral-800 text-neutral-100"
            : currentTheme === "sepia"
            ? "bg-[#f4ece1] border-[#ded0bb] text-[#1c1917]"
            : "bg-[#ffffff] border-neutral-200 text-neutral-900"
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-inherit flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold font-serif leading-none">
              Pengaturan Tampilan Baca
            </h2>
          </div>
          <button
            id="settings-close-btn"
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${
              currentTheme === "dark"
                ? "hover:bg-neutral-800 text-neutral-400 hover:text-white"
                : currentTheme === "sepia"
                ? "hover:bg-[#e8dcce] text-neutral-600 hover:text-black"
                : "hover:bg-neutral-100 text-neutral-500 hover:text-black"
            }`}
            aria-label="Tutup Pengaturan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Settings */}
        <div className="p-4 sm:p-5 space-y-5 overflow-y-auto">
          {/* 1. Tema Warna (Light, Sepia, Dark) */}
          <div>
            <label className="text-xs font-semibold opacity-70 uppercase tracking-wider block mb-2.5">
              Tema Tampilan
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="theme-btn-light"
                onClick={() => updateSetting("theme", "light")}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                  currentTheme === "light"
                    ? "bg-white text-neutral-900 border-neutral-900 shadow-xs ring-2 ring-neutral-900/10"
                    : "bg-white/80 text-neutral-700 border-neutral-200 hover:border-neutral-300"
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-[#fcfbf8] border border-neutral-300 flex items-center justify-center">
                  <Sun className="w-3 h-3 text-amber-500" />
                </div>
                <span>Terang</span>
              </button>

              <button
                id="theme-btn-sepia"
                onClick={() => updateSetting("theme", "sepia")}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                  currentTheme === "sepia"
                    ? "bg-[#ede5d8] text-[#3e2c1e] border-[#784c28] shadow-xs ring-2 ring-[#784c28]/20"
                    : "bg-[#f4ece1] text-[#6d5b4a] border-[#ded0bb] hover:border-[#cbba9f]"
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-[#f6f0e6] border border-[#ded0bb] flex items-center justify-center">
                  <Coffee className="w-3 h-3 text-[#784c28]" />
                </div>
                <span>Sepia</span>
              </button>

              <button
                id="theme-btn-dark"
                onClick={() => updateSetting("theme", "dark")}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                  currentTheme === "dark"
                    ? "bg-[#1f232b] text-neutral-100 border-neutral-500 shadow-xs ring-2 ring-neutral-400/20"
                    : "bg-[#181a1f] text-neutral-400 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-[#121316] border border-neutral-700 flex items-center justify-center">
                  <Moon className="w-3 h-3 text-amber-200" />
                </div>
                <span>Malam</span>
              </button>
            </div>
          </div>

          {/* 2. Jenis Huruf (Font Family) */}
          <div>
            <label className="text-xs font-semibold opacity-70 uppercase tracking-wider block mb-2.5">
              Gaya Font
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                id="font-btn-serif"
                onClick={() => updateSetting("fontFamily", "serif")}
                className={`p-3 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between ${
                  settings.fontFamily === "serif"
                    ? currentTheme === "dark"
                      ? "bg-neutral-800 border-neutral-500 text-white"
                      : currentTheme === "sepia"
                      ? "bg-[#e5d8c5] border-[#784c28] text-[#1c1917]"
                      : "bg-neutral-100 border-neutral-900 text-neutral-900"
                    : "border-inherit bg-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <span className="font-serif text-sm">Serif Buku</span>
                <span className="text-[11px] opacity-60 font-serif italic">Abc</span>
              </button>

              <button
                id="font-btn-sans"
                onClick={() => updateSetting("fontFamily", "sans")}
                className={`p-3 rounded-xl border text-xs font-medium text-left transition-all flex items-center justify-between ${
                  settings.fontFamily === "sans"
                    ? currentTheme === "dark"
                      ? "bg-neutral-800 border-neutral-500 text-white"
                      : currentTheme === "sepia"
                      ? "bg-[#e5d8c5] border-[#784c28] text-[#1c1917]"
                      : "bg-neutral-100 border-neutral-900 text-neutral-900"
                    : "border-inherit bg-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <span className="font-sans text-sm">Sans Modern</span>
                <span className="text-[11px] opacity-60 font-sans">Abc</span>
              </button>
            </div>
          </div>

          {/* 3. Ukuran Font */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold opacity-70 uppercase tracking-wider flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5" />
                Ukuran Teks
              </label>
              <span className="text-xs opacity-60 font-mono">
                {settings.fontSize === "sm" && "16px (Kecil)"}
                {settings.fontSize === "md" && "18px (Standar)"}
                {settings.fontSize === "lg" && "20px (Besar)"}
                {settings.fontSize === "xl" && "22px (Ekstra)"}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { key: "sm", label: "A-", desc: "16px" },
                { key: "md", label: "A", desc: "18px" },
                { key: "lg", label: "A+", desc: "20px" },
                { key: "xl", label: "A++", desc: "22px" },
              ].map((item) => (
                <button
                  key={item.key}
                  id={`fontsize-btn-${item.key}`}
                  onClick={() => updateSetting("fontSize", item.key)}
                  className={`py-2 px-1 rounded-lg border text-xs font-medium transition-all text-center ${
                    settings.fontSize === item.key
                      ? currentTheme === "dark"
                        ? "bg-neutral-800 border-neutral-500 text-white font-bold"
                        : currentTheme === "sepia"
                        ? "bg-[#e5d8c5] border-[#784c28] text-[#1c1917] font-bold"
                        : "bg-neutral-100 border-neutral-900 text-neutral-900 font-bold"
                      : "border-inherit bg-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <span className="block text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Jarak Baris (Line Height) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold opacity-70 uppercase tracking-wider flex items-center gap-1.5">
                <AlignLeft className="w-3.5 h-3.5" />
                Spasi Baris
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "normal", label: "Rapat", val: "1.65" },
                { key: "relaxed", label: "Nyaman", val: "1.85" },
                { key: "loose", label: "Longgar", val: "2.1" },
              ].map((item) => (
                <button
                  key={item.key}
                  id={`lineheight-btn-${item.key}`}
                  onClick={() => updateSetting("lineHeight", item.key)}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-center ${
                    settings.lineHeight === item.key
                      ? currentTheme === "dark"
                        ? "bg-neutral-800 border-neutral-500 text-white"
                        : currentTheme === "sepia"
                        ? "bg-[#e5d8c5] border-[#784c28] text-[#1c1917]"
                        : "bg-neutral-100 border-neutral-900 text-neutral-900"
                      : "border-inherit bg-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Lebar Kolom Teks (Desktop / Tablet) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold opacity-70 uppercase tracking-wider flex items-center gap-1.5">
                <MoveHorizontal className="w-3.5 h-3.5" />
                Lebar Halaman
              </label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: "compact", label: "Ramping", desc: "60ch" },
                { key: "normal", label: "Standar", desc: "68ch" },
                { key: "wide", label: "Lebar", desc: "76ch" },
              ].map((item) => (
                <button
                  key={item.key}
                  id={`textwidth-btn-${item.key}`}
                  onClick={() => updateSetting("textWidth", item.key)}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-center ${
                    settings.textWidth === item.key
                      ? currentTheme === "dark"
                        ? "bg-neutral-800 border-neutral-500 text-white"
                        : currentTheme === "sepia"
                        ? "bg-[#e5d8c5] border-[#784c28] text-[#1c1917]"
                        : "bg-neutral-100 border-neutral-900 text-neutral-900"
                      : "border-inherit bg-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Reset Button */}
        <div className="p-3.5 border-t border-inherit flex items-center justify-between shrink-0 bg-current/5">
          <button
            id="settings-reset-btn"
            onClick={resetSettings}
            className="flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 transition-opacity"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset ke Pengaturan Awal
          </button>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentTheme === "dark"
                ? "bg-neutral-200 text-black hover:bg-white"
                : currentTheme === "sepia"
                ? "bg-[#784c28] text-white hover:bg-[#5d381c]"
                : "bg-neutral-900 text-white hover:bg-neutral-800"
            }`}
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
