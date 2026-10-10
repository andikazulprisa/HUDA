import {
  ArrowLeft,
  BookOpen,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import juzData from "../data/juzData";
import useQuranReadingSettings from "../hooks/useQuranReadingSettings";
import QuranReadingSettings from "../components/QuranReadingSettings";

const API_BASE = "https://quran-api-id.vercel.app";
const LAST_READ_KEY = "huda-last-read";
const TOTAL_SURAH = 114;

function getSavedPosition() {
  try {
    const saved = localStorage.getItem(LAST_READ_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function QuranDetail() {
  const { number } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { settings, updateSetting } = useQuranReadingSettings();

  const juzNumber = searchParams.get("juz");
  const targetAyahNumber = searchParams.get("ayah");

  const ayahRefs = useRef({});
  const markTimerRef = useRef(null);

  const [lastRead, setLastRead] = useState(getSavedPosition);
  const [justMarked, setJustMarked] = useState(null);

  const [data, setData] = useState({
    number: null,
    surah: null,
    error: "",
  });

  const [surahList, setSurahList] = useState([]);

  const loading = data.number !== number;
  const surah = data.number === number ? data.surah : null;
  const error = data.number === number ? data.error : "";

  // Sinkronkan penanda saat tab kembali difokuskan
  useEffect(() => {
    const syncLastRead = () => setLastRead(getSavedPosition());

    window.addEventListener("focus", syncLastRead);

    return () => window.removeEventListener("focus", syncLastRead);
  }, []);

  // Bersihkan timer saat halaman ditinggalkan
  useEffect(() => {
    return () => clearTimeout(markTimerRef.current);
  }, []);

  // Ambil data surat
  useEffect(() => {
    const controller = new AbortController();

    async function fetchSurah() {
      try {
        const response = await fetch(`${API_BASE}/surah/${number}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data surat.");
        }

        const result = await response.json();

        setData({
          number,
          surah: result.data,
          error: "",
        });
      } catch (err) {
        if (err.name === "AbortError") return;

        setData({
          number,
          surah: null,
          error: err.message || "Terjadi kesalahan.",
        });
      }
    }

    fetchSurah();

    return () => controller.abort();
  }, [number]);

  // Ambil daftar surat untuk navigasi
  useEffect(() => {
    const controller = new AbortController();

    async function fetchSurahList() {
      try {
        const response = await fetch(`${API_BASE}/surah`, {
          signal: controller.signal,
        });

        if (!response.ok) return;

        const result = await response.json();

        if (Array.isArray(result.data)) {
          setSurahList(result.data);
        }
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Gagal mengambil daftar surat:", err);
      }
    }

    fetchSurahList();

    return () => controller.abort();
  }, []);

  const selectedJuzData = useMemo(() => {
    if (!juzNumber) return null;

    return juzData.find((item) => item.juz === Number(juzNumber));
  }, [juzNumber]);

  const currentJuzRange = useMemo(() => {
    if (!selectedJuzData) return null;

    return selectedJuzData.ranges.find(
      (range) => range.surah === Number(number),
    );
  }, [selectedJuzData, number]);

  const displayedVerses = useMemo(() => {
    if (!surah) return [];

    if (!currentJuzRange) return surah.verses;

    return surah.verses.filter((verse) => {
      const ayahNumber = verse.number.inSurah;

      return (
        ayahNumber >= currentJuzRange.startAyah &&
        ayahNumber <= currentJuzRange.endAyah
      );
    });
  }, [surah, currentJuzRange]);

  // Surat sebelumnya dan berikutnya
  const currentSurahNumber = Number(number);
  const previousSurahNumber = currentSurahNumber - 1;
  const nextSurahNumber = currentSurahNumber + 1;

  const previousSurah = surahList.find((s) => s.number === previousSurahNumber);

  const nextSurah = surahList.find((s) => s.number === nextSurahNumber);

  // Scroll otomatis ke ayat tujuan
  useEffect(() => {
    if (loading || !targetAyahNumber || displayedVerses.length === 0) {
      return;
    }

    const targetAyah = ayahRefs.current[Number(targetAyahNumber)];

    if (targetAyah) {
      targetAyah.scrollIntoView({
        behavior: "instant",
        block: "start",
      });
    }
  }, [loading, targetAyahNumber, displayedVerses]);

  // Cari Juz yang memuat ayat
  const getJuzForAyah = (surahNumber, ayahNumber) => {
    const matchingJuz = juzData.find((juz) =>
      juz.ranges.some(
        (range) =>
          range.surah === Number(surahNumber) &&
          ayahNumber >= range.startAyah &&
          ayahNumber <= range.endAyah,
      ),
    );

    return matchingJuz?.juz ?? 1;
  };

  // Simpan penanda terakhir dibaca
  const handleMarkLastRead = (ayahNumber) => {
    if (!surah) return;

    const readingPosition = {
      mode: "surah",
      juz: getJuzForAyah(surah.number, ayahNumber),
      surah: surah.number,
      surahName: surah.name.transliteration.id,
      ayah: ayahNumber,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(LAST_READ_KEY, JSON.stringify(readingPosition));
    } catch (err) {
      console.error("Gagal menyimpan penanda baca:", err);
    }

    setLastRead(readingPosition);

    clearTimeout(markTimerRef.current);
    setJustMarked(ayahNumber);

    markTimerRef.current = setTimeout(() => {
      setJustMarked(null);
    }, 1000);
  };

  // Loading
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdf8]">
        <p className="text-stone-500">Memuat surat...</p>
      </main>
    );
  }

  // Error
  if (error || !surah) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdf8] px-6">
        <div className="text-center">
          <p className="text-red-600">{error || "Surat tidak ditemukan."}</p>

          <button
            type="button"
            onClick={() => navigate("/quran")}
            className="mt-6 rounded-full bg-emerald-950 px-6 py-3 text-sm font-medium text-white"
          >
            Kembali ke Daftar Surat
          </button>
        </div>
      </main>
    );
  }

  const spacingClass =
    {
      tight: "space-y-2",
      normal: "space-y-3",
      loose: "space-y-6",
    }[settings.verseSpacing] || "space-y-3";

  return (
    <main className="min-h-screen bg-[#fffdf8]">
      {/* HEADER */}
      <section className="bg-emerald-950 px-5 pb-16 pt-28 text-white sm:px-6 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-4xl">
          <button
            type="button"
            onClick={() => navigate("/quran")}
            className="mb-10 flex items-center gap-2 text-sm text-emerald-200 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Kembali ke Daftar Surat
          </button>

          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/10 text-amber-300">
                  <BookOpen size={20} />
                </div>

                <span className="text-sm uppercase tracking-[0.2em] text-amber-300">
                  Al-Qur&apos;an
                </span>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                {surah.name.transliteration.id}
              </h1>

              <p className="mt-3 text-emerald-100/70">
                {surah.name.translation.id}
              </p>

              <div className="mt-5 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-white/10 px-3 py-1.5 text-emerald-100">
                  {currentJuzRange
                    ? `Ayat ${currentJuzRange.startAyah}–${currentJuzRange.endAyah}`
                    : `${surah.numberOfVerses} Ayat`}
                </span>

                <span className="rounded-full bg-white/10 px-3 py-1.5 text-emerald-100">
                  {surah.revelation.id}
                </span>

                {selectedJuzData && (
                  <span className="rounded-full bg-amber-400/10 px-3 py-1.5 text-amber-200">
                    {selectedJuzData.name}
                  </span>
                )}
              </div>
            </div>

            <div
              dir="rtl"
              lang="ar"
              className="font-serif text-4xl text-emerald-100 md:text-5xl"
            >
              {surah.name.long}
            </div>
          </div>
        </div>
      </section>

      {/* AYAT */}
      <section className="px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          {selectedJuzData && currentJuzRange && (
            <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-5 py-4">
              <p className="text-sm font-semibold text-emerald-950">
                {selectedJuzData.name}
              </p>

              <p className="mt-1 text-xs leading-6 text-emerald-800/70">
                Menampilkan ayat {currentJuzRange.startAyah}–
                {currentJuzRange.endAyah} dari surat ini.
              </p>
            </div>
          )}

          {/* PENGATURAN TAMPILAN */}
          <QuranReadingSettings
            settings={settings}
            updateSetting={updateSetting}
          />

          {/* DAFTAR AYAT */}
          <div className={spacingClass}>
            {displayedVerses.map((verse) => {
              const ayahNumber = verse.number.inSurah;

              const isLastRead =
                lastRead?.surah === Number(surah.number) &&
                lastRead?.ayah === ayahNumber;

              const isJustMarked = justMarked === ayahNumber;

              return (
                <article
                  key={ayahNumber}
                  ref={(element) => {
                    ayahRefs.current[ayahNumber] = element;
                  }}
                  className={`scroll-mt-24 rounded-2xl border p-5 shadow-sm transition-all duration-500 md:p-7 ${
                    isLastRead
                      ? "border-amber-300 bg-amber-50/40 ring-1 ring-amber-200"
                      : "border-stone-200/80 bg-white"
                  }`}
                >
                  {/* NOMOR AYAT */}
                  <div className="mb-5 flex items-center justify-between">
                    <div
                      className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-semibold transition-colors duration-500 ${
                        isLastRead
                          ? "bg-amber-300 text-emerald-950"
                          : "bg-emerald-50 text-emerald-800"
                      }`}
                      aria-label={`Ayat ${ayahNumber}`}
                    >
                      {ayahNumber}
                    </div>

                    {isLastRead && (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
                        <BookmarkCheck size={15} aria-hidden="true" />
                        Terakhir Dibaca
                      </span>
                    )}
                  </div>

                  {/* TEKS ARAB */}
                  <p
                    dir="rtl"
                    lang="ar"
                    style={{
                      fontSize: `${settings.arabFontSize}px`,
                    }}
                    className="text-right font-serif leading-[2.15] text-emerald-950"
                  >
                    {verse.text.arab}
                  </p>

                  {/* TRANSLITERASI LATIN */}
                  {settings.showTransliteration &&
                    verse.text.transliteration?.en && (
                      <p className="mt-5 text-sm italic leading-6 text-stone-400">
                        {verse.text.transliteration.en}
                      </p>
                    )}

                  {/* TERJEMAHAN INDONESIA */}
                  {settings.showTranslation && (
                    <div
                      className={`mt-4 border-t pt-4 transition-colors duration-500 ${
                        isLastRead ? "border-amber-200/70" : "border-stone-100"
                      }`}
                    >
                      <p
                        style={{
                          fontSize: `${settings.translationFontSize}px`,
                        }}
                        className="leading-7 text-stone-600 sm:leading-8"
                      >
                        {verse.translation.id}
                      </p>
                    </div>
                  )}

                  {/* PENANDA TERAKHIR DIBACA */}
                  <div
                    className={`mt-5 border-t pt-4 transition-colors duration-500 ${
                      isLastRead ? "border-amber-200/70" : "border-stone-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleMarkLastRead(ayahNumber)}
                      aria-pressed={isLastRead}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-medium transition-all duration-300 active:scale-95 ${
                        isLastRead
                          ? "border-amber-300 bg-amber-100 text-amber-800"
                          : "border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100"
                      }`}
                    >
                      <BookmarkCheck
                        size={15}
                        aria-hidden="true"
                        className={`transition-transform duration-300 ${
                          isJustMarked ? "animate-bounce" : ""
                        } ${isLastRead ? "scale-110" : ""}`}
                      />

                      {isLastRead
                        ? "Penanda Terakhir Dibaca"
                        : "Tandai Terakhir Dibaca"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* NAVIGASI SURAT */}
          <nav
            aria-label="Navigasi surat"
            className="mt-12 grid grid-cols-2 gap-3 border-t border-stone-200 pt-8"
          >
            {previousSurahNumber >= 1 ? (
              <button
                type="button"
                onClick={() => navigate(`/quran/${previousSurahNumber}`)}
                className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                <ChevronLeft size={18} className="shrink-0 text-emerald-800" />

                <div className="min-w-0">
                  <p className="text-xs text-stone-400">Surat Sebelumnya</p>

                  <p className="mt-1 truncate text-sm font-semibold text-emerald-950">
                    {previousSurah
                      ? previousSurah.name.transliteration.id
                      : `Surat ${previousSurahNumber}`}
                  </p>
                </div>
              </button>
            ) : (
              <div />
            )}

            {nextSurahNumber <= TOTAL_SURAH ? (
              <button
                type="button"
                onClick={() => navigate(`/quran/${nextSurahNumber}`)}
                className="flex items-center justify-end gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-4 text-right transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                <div className="min-w-0">
                  <p className="text-xs text-stone-400">Surat Berikutnya</p>

                  <p className="mt-1 truncate text-sm font-semibold text-emerald-950">
                    {nextSurah
                      ? nextSurah.name.transliteration.id
                      : `Surat ${nextSurahNumber}`}
                  </p>
                </div>

                <ChevronRight size={18} className="shrink-0 text-emerald-800" />
              </button>
            ) : (
              <div />
            )}
          </nav>
        </div>
      </section>
    </main>
  );
}

export default QuranDetail;
