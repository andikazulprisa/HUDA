import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import juzData from "../data/juzData";

function QuranJuz() {
  const { juzNumber } = useParams();
  const navigate = useNavigate();

  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const selectedJuz = useMemo(() => {
    return juzData.find((item) => item.juz === Number(juzNumber));
  }, [juzNumber]);

  useEffect(() => {
    const fetchJuz = async () => {
      if (!selectedJuz) {
        setError("Juz tidak ditemukan.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const results = await Promise.all(
          selectedJuz.ranges.map(async (range) => {
            const response = await fetch(
              `https://quran-api-id.vercel.app/surah/${range.surah}`,
            );

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

        setSurahs(results);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJuz();
  }, [selectedJuz]);

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
            Kembali ke Al-Qur'an
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
              <section key={surah.number}>
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
                  {surah.verses.map((verse) => (
                    <article
                      key={verse.number.inSurah}
                      className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm md:p-7"
                    >
                      <div className="mb-5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-800">
                          {verse.number.inSurah}
                        </div>
                      </div>

                      <p
                        dir="rtl"
                        className="text-right font-serif text-2xl leading-[2.15] text-emerald-950 sm:text-3xl md:text-4xl"
                      >
                        {verse.text.arab}
                      </p>

                      <p className="mt-5 text-sm italic leading-6 text-stone-400">
                        {verse.text.transliteration.en}
                      </p>

                      <div className="mt-4 border-t border-stone-100 pt-4">
                        <p className="text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
                          {verse.translation.id}
                        </p>
                      </div>
                    </article>
                  ))}
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
