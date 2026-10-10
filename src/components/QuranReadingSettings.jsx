import { useState } from "react";
import {
  ChevronDown,
  Minus,
  Plus,
  RotateCcw,
  Settings2,
  X,
} from "lucide-react";

// Harus sama dengan DEFAULT_SETTINGS di useQuranReadingSettings.js
const DEFAULT_SETTINGS = {
  arabFontSize: 36,
  translationFontSize: 16,
  showTransliteration: true,
  showTranslation: true,
  verseSpacing: "normal",
};

const SPACING_OPTIONS = [
  { value: "tight", label: "Rapat" },
  { value: "normal", label: "Normal" },
  { value: "loose", label: "Renggang" },
];

function FontSizeControl({
  id,
  label,
  value,
  min,
  max,
  step,
  unit = "px",
  onChange,
}) {
  const change = (amount) => {
    onChange(Math.min(max, Math.max(min, value + amount)));
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-emerald-950">
          {label}
        </label>

        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
          {value}
          {unit}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => change(-step)}
          disabled={value <= min}
          aria-label={`Perkecil ${label.toLowerCase()}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-stone-200 disabled:hover:bg-white"
        >
          <Minus size={15} aria-hidden="true" />
        </button>

        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="h-2 w-full cursor-pointer accent-emerald-700"
        />

        <button
          type="button"
          onClick={() => change(step)}
          disabled={value >= max}
          aria-label={`Perbesar ${label.toLowerCase()}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-stone-200 disabled:hover:bg-white"
        >
          <Plus size={15} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function ToggleRow({ id, label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <label
          htmlFor={id}
          className="block cursor-pointer text-sm font-medium text-emerald-950"
        >
          {label}
        </label>

        {description && (
          <p className="mt-0.5 text-xs text-stone-500">{description}</p>
        )}
      </div>

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/40 focus-visible:ring-offset-2 ${
          checked ? "bg-emerald-800" : "bg-stone-300"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function QuranReadingSettings({ settings, updateSetting }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    Object.entries(DEFAULT_SETTINGS).forEach(([key, value]) => {
      updateSetting(key, value);
    });
  };

  const isDefault = Object.entries(DEFAULT_SETTINGS).every(
    ([key, value]) => settings[key] === value,
  );

  return (
    <div className="relative z-20 mb-6">
      {/* Tombol pemicu */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="quran-reading-settings-panel"
        className={`inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-semibold shadow-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/40 focus-visible:ring-offset-2 ${
          isOpen
            ? "border-emerald-900 bg-emerald-900 text-amber-200"
            : "border-emerald-200 bg-white text-emerald-900 hover:border-emerald-300 hover:bg-emerald-50"
        }`}
      >
        <Settings2 size={17} aria-hidden="true" />
        Pengaturan Tampilan
        <ChevronDown
          size={16}
          aria-hidden="true"
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          id="quran-reading-settings-panel"
          className="mt-3 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-lg shadow-emerald-950/5"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-stone-100 bg-emerald-50/60 px-5 py-4 sm:px-6">
            <div>
              <h3 className="text-base font-semibold text-emerald-950">
                Kenyamanan Membaca
              </h3>

              <p className="mt-0.5 text-xs text-stone-500">
                Atur tampilan sesuai yang paling nyaman untukmu. Tersimpan
                otomatis.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup pengaturan"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-500 transition hover:bg-white hover:text-emerald-900"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-6 px-5 py-6 sm:px-6">
            {/* Pratinjau */}
            <div className="rounded-2xl border border-amber-200/60 bg-amber-50/40 p-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
                Pratinjau
              </p>

              <p
                dir="rtl"
                lang="ar"
                style={{ fontSize: `${settings.arabFontSize}px` }}
                className="text-right font-serif leading-loose text-emerald-950"
              >
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </p>

              {settings.showTranslation && (
                <p
                  style={{ fontSize: `${settings.translationFontSize}px` }}
                  className="mt-3 border-t border-amber-200/60 pt-3 leading-7 text-stone-600"
                >
                  Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.
                </p>
              )}
            </div>

            {/* Ukuran huruf */}
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
              <FontSizeControl
                id="arab-font-size"
                label="Ukuran huruf Arab"
                value={settings.arabFontSize}
                min={24}
                max={56}
                step={2}
                onChange={(value) => updateSetting("arabFontSize", value)}
              />

              <FontSizeControl
                id="translation-font-size"
                label="Ukuran terjemahan"
                value={settings.translationFontSize}
                min={12}
                max={28}
                step={1}
                onChange={(value) =>
                  updateSetting("translationFontSize", value)
                }
              />
            </div>

            {/* Toggle */}
            <div className="space-y-4 rounded-2xl border border-stone-100 bg-stone-50/60 p-4">
              <ToggleRow
                id="toggle-transliteration"
                label="Tulisan Latin"
                description="Cara baca ayat dengan huruf Latin"
                checked={settings.showTransliteration}
                onChange={(value) =>
                  updateSetting("showTransliteration", value)
                }
              />

              <div className="h-px bg-stone-200/70" />

              <ToggleRow
                id="toggle-translation"
                label="Terjemahan Indonesia"
                description="Arti ayat dalam bahasa Indonesia"
                checked={settings.showTranslation}
                onChange={(value) => updateSetting("showTranslation", value)}
              />
            </div>

            {/* Jarak antar ayat */}
            <div>
              <p
                id="verse-spacing-label"
                className="mb-3 text-sm font-medium text-emerald-950"
              >
                Jarak antar ayat
              </p>

              <div
                role="radiogroup"
                aria-labelledby="verse-spacing-label"
                className="grid grid-cols-3 gap-1 rounded-full bg-stone-100 p-1"
              >
                {SPACING_OPTIONS.map((option) => {
                  const isActive = settings.verseSpacing === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      onClick={() =>
                        updateSetting("verseSpacing", option.value)
                      }
                      className={`rounded-full px-3 py-2 text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-emerald-900 text-amber-200 shadow-sm"
                          : "text-stone-600 hover:text-emerald-900"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 border-t border-stone-100 bg-stone-50/60 px-5 py-3.5 sm:px-6">
            <button
              type="button"
              onClick={handleReset}
              disabled={isDefault}
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-emerald-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-stone-600"
            >
              <RotateCcw size={15} aria-hidden="true" />
              Atur ulang
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-emerald-900 px-5 py-2 text-sm font-semibold text-amber-200 transition hover:bg-emerald-800 active:scale-95"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
