import { useEffect, useRef, useState } from "react";
import {
  BookmarkCheck,
  Check,
  Copy,
  Languages,
  Share2,
  Type,
} from "lucide-react";

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback untuk browser lama / konteks non-HTTPS
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    } catch {
      return false;
    }
  }
}

// Tombol ikon dengan tooltip
function IconButton({
  label,
  onClick,
  active = false,
  variant = "default", // "default" | "bookmark"
  pressed,
  forceTooltip = false,
  tooltipAlign = "center", // "center" | "right"
  className = "",
  children,
}) {
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);

  const base =
    "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 active:scale-90 focus:outline-none focus-visible:ring-2";

  const styles =
    variant === "bookmark"
      ? active
        ? "border-amber-300 bg-amber-100 text-amber-800 focus-visible:ring-amber-500/40"
        : "border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50 focus-visible:ring-emerald-700/40"
      : active
        ? "border-emerald-900 bg-emerald-900 text-amber-200 focus-visible:ring-emerald-700/40"
        : "border-stone-200 bg-white text-stone-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900 focus-visible:ring-emerald-700/40";

  const tooltipPosition =
    tooltipAlign === "right" ? "right-0" : "left-1/2 -translate-x-1/2";

  const showTooltip = forceTooltip || hovered || keyboardFocus;

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        aria-pressed={pressed}
        // Hover hanya dihitung untuk mouse (bukan sentuhan)
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
        // Fokus hanya dihitung kalau lewat keyboard
        onFocus={(e) =>
          setKeyboardFocus(e.currentTarget.matches(":focus-visible"))
        }
        onBlur={() => setKeyboardFocus(false)}
        className={`${base} ${styles}`}
      >
        {children}
      </button>

      {showTooltip && (
        <span
          role="tooltip"
          className={`pointer-events-none absolute bottom-full z-30 mb-2 whitespace-nowrap rounded-lg bg-emerald-950 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg ${tooltipPosition}`}
        >
          {label}
        </span>
      )}
    </div>
  );
}

export default function VerseCard({
  verse,
  surahNumber,
  surahName,
  settings,
  isMarked,
  isJustMarked,
  onMark,
  registerRef,
  showSurahLabel = false,
}) {
  const ayahNumber = verse.number.inSurah;
  const latinText = verse.text.transliteration?.en;

  // Override per ayat. null = ikut pengaturan global
  const [override, setOverride] = useState({ latin: null, translation: null });
  const [feedback, setFeedback] = useState(null); // "copied" | "shared" | "failed"
  const feedbackTimer = useRef(null);

  useEffect(() => {
    return () => clearTimeout(feedbackTimer.current);
  }, []);

  const showLatin = Boolean(
    latinText && (override.latin ?? settings.showTransliteration),
  );
  const showTranslation = override.translation ?? settings.showTranslation;

  const flash = (type) => {
    clearTimeout(feedbackTimer.current);
    setFeedback(type);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 2000);
  };

  const reference = `QS. ${surahName}: ${ayahNumber}`;

  const buildText = () => {
    const parts = [verse.text.arab];

    if (showLatin) parts.push(latinText);
    if (verse.translation?.id) parts.push(`"${verse.translation.id}"`);

    parts.push(`(${reference})`);

    return parts.join("\n\n");
  };

  const ayahUrl = `${window.location.origin}/quran/${surahNumber}?ayah=${ayahNumber}`;

  const handleCopy = async () => {
    const ok = await copyToClipboard(buildText());
    flash(ok ? "copied" : "failed");
  };

  const handleShare = async () => {
    const text = buildText();

    if (navigator.share) {
      try {
        await navigator.share({ title: reference, text, url: ayahUrl });
        return;
      } catch (err) {
        // Pengguna menutup menu share: bukan error
        if (err.name === "AbortError") return;
      }
    }

    const ok = await copyToClipboard(`${text}\n\n${ayahUrl}`);
    flash(ok ? "shared" : "failed");
  };

  const copyLabel =
    feedback === "copied"
      ? "Tersalin"
      : feedback === "failed"
        ? "Gagal menyalin"
        : "Salin ayat";

  const shareLabel =
    feedback === "shared"
      ? "Tautan tersalin"
      : feedback === "failed"
        ? "Gagal membagikan"
        : "Bagikan";

  return (
    <article
      ref={registerRef}
      className={`scroll-mt-24 rounded-2xl border p-5 shadow-sm transition-all duration-500 md:p-7 ${
        isMarked
          ? "border-amber-300 bg-amber-50/40 ring-1 ring-amber-200"
          : "border-stone-200/80 bg-white"
      }`}
    >
      {/* Nomor ayat */}
      <div className="mb-4 flex items-center justify-between">
        <span
          className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-semibold transition-colors duration-500 ${
            isMarked
              ? "bg-amber-300 text-emerald-950"
              : "bg-emerald-50 text-emerald-800"
          }`}
          aria-label={`Ayat ${ayahNumber}`}
        >
          {ayahNumber}
        </span>

        {isMarked ? (
          <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
            <BookmarkCheck size={15} aria-hidden="true" />
            Terakhir Dibaca
          </span>
        ) : (
          showSurahLabel && (
            <span className="text-xs text-stone-400">
              {surahName} : {ayahNumber}
            </span>
          )
        )}
      </div>

      {/* Arab */}
      <p
        dir="rtl"
        lang="ar"
        style={{ fontSize: `${settings.arabFontSize}px` }}
        className="text-right font-serif leading-[2.15] text-emerald-950"
      >
        {verse.text.arab}
      </p>

      {/* Latin */}
      {showLatin && (
        <p className="mt-5 text-sm italic leading-6 text-stone-400">
          {latinText}
        </p>
      )}

      {/* Terjemahan */}
      {showTranslation && (
        <div
          className={`mt-4 border-t pt-4 transition-colors duration-500 ${
            isMarked ? "border-amber-200/70" : "border-stone-100"
          }`}
        >
          <p
            style={{ fontSize: `${settings.translationFontSize}px` }}
            className="leading-7 text-stone-600 sm:leading-8"
          >
            {verse.translation.id}
          </p>
        </div>
      )}

      {/* Toolbar ayat (ikon saja, teks muncul saat hover) */}
      <div
        role="toolbar"
        aria-label={`Aksi ayat ${ayahNumber}`}
        className={`mt-5 flex items-center gap-2 border-t pt-4 transition-colors duration-500 ${
          isMarked ? "border-amber-200/70" : "border-stone-100"
        }`}
      >
        {latinText && (
          <IconButton
            label={showLatin ? "Sembunyikan Latin" : "Tampilkan Latin"}
            pressed={showLatin}
            active={showLatin}
            onClick={() =>
              setOverride((current) => ({ ...current, latin: !showLatin }))
            }
          >
            <Type size={16} aria-hidden="true" />
          </IconButton>
        )}

        <IconButton
          label={
            showTranslation ? "Sembunyikan terjemahan" : "Tampilkan terjemahan"
          }
          pressed={showTranslation}
          active={showTranslation}
          onClick={() =>
            setOverride((current) => ({
              ...current,
              translation: !showTranslation,
            }))
          }
        >
          <Languages size={16} aria-hidden="true" />
        </IconButton>

        <span className="mx-0.5 h-5 w-px bg-stone-200" aria-hidden="true" />

        <IconButton
          label={copyLabel}
          onClick={handleCopy}
          forceTooltip={feedback === "copied" || feedback === "failed"}
        >
          {feedback === "copied" ? (
            <Check size={16} aria-hidden="true" className="text-emerald-700" />
          ) : (
            <Copy size={16} aria-hidden="true" />
          )}
        </IconButton>

        <IconButton
          label={shareLabel}
          onClick={handleShare}
          forceTooltip={feedback === "shared"}
        >
          {feedback === "shared" ? (
            <Check size={16} aria-hidden="true" className="text-emerald-700" />
          ) : (
            <Share2 size={16} aria-hidden="true" />
          )}
        </IconButton>

        <IconButton
          label={
            isMarked ? "Penanda terakhir dibaca" : "Tandai terakhir dibaca"
          }
          variant="bookmark"
          active={isMarked}
          pressed={isMarked}
          onClick={onMark}
          tooltipAlign="right"
          className="ml-auto"
        >
          <BookmarkCheck
            size={16}
            aria-hidden="true"
            className={`transition-transform duration-300 ${
              isJustMarked ? "animate-bounce" : ""
            } ${isMarked ? "scale-110" : ""}`}
          />
        </IconButton>
      </div>
    </article>
  );
}
