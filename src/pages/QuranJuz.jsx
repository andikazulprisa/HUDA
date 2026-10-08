import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import juzData from "../data/juzData";

const API_BASE = "https://quran-api-id.vercel.app";
const LAST_READ_KEY = "huda-last-read";

function getSavedPosition() {
  try {
    const saved = localStorage.getItem(LAST_READ_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function QuranJuz() {
  const { juzNumber } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const targetSurahNumber = searchParams.get("surah");
  const targetAyahNumber = searchParams.get("ayah");
  const surahRefs = useRef({});
  const ayahRefs = useRef({});

  const [lastRead, setLastRead] = useState(getSavedPosition);

  // Data disimpan bersama nomor juz-nya, jadi loading bisa dihitung
  // tanpa setState sinkron di dalam effect
  const [data, setData] = useState({ juz: null, surahs: [], error: "" });

  const selectedJuz = useMemo(() => {
    return juzData.find((item) => item.juz === Number(juzNumber));
  }, [juzNumber]);

  const loading = Boolean(selectedJuz) && data.juz !== selectedJuz.juz;

  const error = !selectedJuz
    ? "Juz tidak ditemukan."
    : data.juz === selectedJuz.juz
      ? data.error
      : "";

  const surahs = useMemo(
    () => (data.juz === selectedJuz?.juz ? data.surahs : []),
    [data.juz, data.surahs, selectedJuz?.juz],
  );

  // Scroll ke atas saat pindah juz
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [juzNumber]);

  // Ambil data juz
  useEffect(() => {
    if (!selectedJuz) return;

    const controller = new AbortController();

    async function fetchJuz() {
      try {
        const results = await Promise.all(
          selectedJuz.ranges.map(async (range) => {
            const response = await fetch(`${API_BASE}/surah/${range.surah}`, {
              signal: controller.signal,
            });

            if (!response.ok) {
              throw new Error("Gagal mengambil data Al-Qur'an.");
            }

            const result = await response.json();

            const filteredVerses = result.data.verses.filter((verse) => {
              const ayahNumber = verse.number.inSurah;

              return (
                ayahNumber >= range.startAyah && ayahNumber <= range.endAyah
              );
            });

            return {
              ...result.data,
              verses: filteredVerses,
              startAyah: range.startAyah,
              endAyah: range.endAyah,
            };
          }),
        );

        setData({ juz: selectedJuz.juz, surahs: results, error: "" });
      } catch (err) {
        if (err.name === "AbortError") return;

        setData({
          juz: selectedJuz.juz,
          surahs: [],
          error: err.message || "Terjadi kesalahan.",
        });
      }
    }

    fetchJuz();

    return () => controller.abort();
  }, [selectedJuz]);

  // Scroll ke surah tujuan (kalau ada ?surah=)
  useEffect(() => {
    if (loading || surahs.length === 0) {
      return;
    }

    // Jika ada nomor ayat, arahkan langsung ke ayat tersebut.
    if (targetSurahNumber && targetAyahNumber) {
      const targetAyah =
        ayahRefs.current[
          `${Number(targetSurahNumber)}-${Number(targetAyahNumber)}`
        ];

      if (targetAyah) {
        targetAyah.scrollIntoView({
          behavior: "instant",
          block: "start",
        });

        return;
      }
    }

    // Jika hanya ada nomor surat, arahkan ke awal surat.
    if (targetSurahNumber) {
      const targetSurah = surahRefs.current[Number(targetSurahNumber)];

      if (targetSurah) {
        targetSurah.scrollIntoView({
          behavior: "instant",
          block: "start",
        });
      }
    }
  }, [loading, targetSurahNumber, targetAyahNumber, surahs]);

  const handleMarkAsRead = (surah, ayahNumber) => {
    const readingPosition = {
      juz: Number(juzNumber),
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
  };

  const previousJuz = Number(juzNumber) - 1;
  const nextJuz = Number(juzNumber) + 1;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdf8]">
        <p className="text-stone-500">Memuat Juz {juzNumber}...</p>
      </main>
    );
  }

  if (error || !selectedJuz) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdf8] px-6">
        <div className="text-center">
          <p className="text-red-600">{error || "Juz tidak ditemukan."}</p>

          <button
            type="button"
            onClick={() => navigate("/quran")}
            className="mt-6 rounded-full bg-emerald-950 px-6 py-3 text-sm font-medium text-white"
          >
            Kembali ke Al-Qur&apos;an
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdf8]">
      {/* Header */}
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

          <div className="flex items-end justify-between gap-8">
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
                Juz {selectedJuz.juz}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-emerald-100/70 sm:text-base">
                Membaca Al-Qur&apos;an berdasarkan pembagian Juz secara
                berurutan.
              </p>
            </div>

            <div
              dir="rtl"
              lang="ar"
              className="hidden font-serif text-5xl text-emerald-100 sm:block"
            >
              الجزء {selectedJuz.juz}
            </div>
          </div>
        </div>
      </section>

      {/* Quran Content */}
      <section className="px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-10">
            {surahs.map((surah) => (
              <section
                key={surah.number}
                ref={(element) => {
                  surahRefs.current[surah.number] = element;
                }}
                className="scroll-mt-24"
              >
                {/* Surah Header */}
                <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-5 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.15em] text-emerald-700">
                        Surat {surah.number}
                      </p>

                      <h2 className="mt-1 text-xl font-semibold text-emerald-950">
                        {surah.name.transliteration.id}
                      </h2>

                      <p className="mt-1 text-sm text-stone-500">
                        {surah.name.translation.id}
                      </p>
                    </div>

                    <div
                      dir="rtl"
                      lang="ar"
                      className="font-serif text-3xl text-emerald-900"
                    >
                      {surah.name.short}
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-emerald-800/70">
                    Ayat {surah.startAyah}–{surah.endAyah}
                  </p>
                </div>

                {/* Verses */}
                <div className="space-y-3">
                  {surah.verses.map((verse) => {
                    const isMarked =
                      lastRead?.juz === Number(juzNumber) &&
                      lastRead?.surah === surah.number &&
                      lastRead?.ayah === verse.number.inSurah;

                    return (
                      <article
                        key={verse.number.inSurah}
                        ref={(element) => {
                          ayahRefs.current[
                            `${surah.number}-${verse.number.inSurah}`
                          ] = element;
                        }}
                        className="scroll-mt-24 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm md:p-7"
                      >
                        {/* Nomor ayat */}
                        <div className="mb-4 flex items-center justify-between">
                          <span
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-800"
                            aria-label={`Ayat ${verse.number.inSurah}`}
                          >
                            {verse.number.inSurah}
                          </span>

                          <span className="text-xs text-stone-400">
                            {surah.name.transliteration.id} :{" "}
                            {verse.number.inSurah}
                          </span>
                        </div>

                        {/* Arabic */}
                        <p
                          dir="rtl"
                          lang="ar"
                          className="text-right font-serif text-2xl leading-[2.15] text-emerald-950 sm:text-3xl md:text-4xl"
                        >
                          {verse.text.arab}
                        </p>

                        {/* Transliteration */}
                        {verse.text.transliteration?.en && (
                          <p className="mt-5 text-sm italic leading-6 text-stone-400">
                            {verse.text.transliteration.en}
                          </p>
                        )}

                        {/* Translation + mark as read */}
                        <div className="mt-4 border-t border-stone-100 pt-4">
                          <p className="text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
                            {verse.translation.id}
                          </p>

                          <button
                            type="button"
                            aria-pressed={isMarked}
                            onClick={() =>
                              handleMarkAsRead(surah, verse.number.inSurah)
                            }
                            className={`mt-4 rounded-full border px-4 py-2 text-xs font-medium transition ${
                              isMarked
                                ? "border-emerald-800 bg-emerald-50 text-emerald-900"
                                : "border-emerald-200 text-emerald-800 hover:bg-emerald-50"
                            }`}
                          >
                            {isMarked
                              ? "✓ Penanda Terakhir Dibaca"
                              : "Tandai Terakhir Dibaca"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Juz Navigation */}
          <div className="mt-12 grid grid-cols-2 gap-3 border-t border-stone-200 pt-8">
            {previousJuz >= 1 ? (
              <button
                type="button"
                onClick={() => navigate(`/quran/juz/${previousJuz}`)}
                className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                <ChevronLeft size={18} className="text-emerald-800" />

                <div>
                  <p className="text-xs text-stone-400">Sebelumnya</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-950">
                    Juz {previousJuz}
                  </p>
                </div>
              </button>
            ) : (
              <div />
            )}

            {nextJuz <= 30 ? (
              <button
                type="button"
                onClick={() => navigate(`/quran/juz/${nextJuz}`)}
                className="flex items-center justify-end gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-4 text-right transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                <div>
                  <p className="text-xs text-stone-400">Berikutnya</p>
                  <p className="mt-1 text-sm font-semibold text-emerald-950">
                    Juz {nextJuz}
                  </p>
                </div>

                <ChevronRight size={18} className="text-emerald-800" />
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default QuranJuz;
