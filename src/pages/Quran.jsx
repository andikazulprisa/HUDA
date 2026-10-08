import { BookOpen, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import juzData from "../data/juzData";

function Quran() {
  const [surahs, setSurahs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJuz, setSelectedJuz] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch("https://quran-api-id.vercel.app/surah");

        if (!response.ok) {
          throw new Error("Gagal mengambil daftar surat.");
        }

        const result = await response.json();

        setSurahs(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurahs();
  }, []);

  const selectedJuzData = useMemo(() => {
    if (selectedJuz === "all") {
      return null;
    }

    return juzData.find((item) => item.juz === Number(selectedJuz));
  }, [selectedJuz]);

  const filteredSurahs = useMemo(() => {
    let result = surahs;

    // Filter berdasarkan Juz
    if (selectedJuzData) {
      const juzSurahNumbers = selectedJuzData.ranges.map(
        (range) => range.surah,
      );

      result = result.filter((surah) => juzSurahNumbers.includes(surah.number));
    }

    // Filter berdasarkan pencarian
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return result;
    }

    return result.filter((surah) => {
      const number = String(surah.number);
      const transliteration = surah.name.transliteration.id.toLowerCase();
      const translation = surah.name.translation.id.toLowerCase();
      const arabic = surah.name.short.toLowerCase();

      return (
        number.includes(query) ||
        transliteration.includes(query) ||
        translation.includes(query) ||
        arabic.includes(query)
      );
    });
  }, [surahs, searchQuery, selectedJuzData]);

  const getJuzRange = (surahNumber) => {
    if (!selectedJuzData) {
      return null;
    }

    return selectedJuzData.ranges.find((range) => range.surah === surahNumber);
  };

  return (
    <main className="min-h-screen bg-[#fffdf8]">
      {/* HERO */}
      <section className="bg-emerald-950 px-5 pb-16 pt-28 text-white sm:px-8 sm:pb-20 sm:pt-32">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/10 text-amber-300">
                <BookOpen size={20} />
              </div>

              <span className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300">
                Al-Qur&apos;an
              </span>
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Baca dan temukan petunjuk dalam setiap ayat.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-emerald-100/70 sm:text-lg">
              Jelajahi Al-Qur&apos;an, temukan surat yang ingin kamu baca, dan
              pahami maknanya melalui terjemahan bahasa Indonesia.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-10 max-w-2xl">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-sm transition focus-within:border-amber-300/40 focus-within:bg-white/15">
              <Search size={20} className="shrink-0 text-emerald-200/70" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari surat, arti, atau nomor..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-emerald-100/40"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Hapus pencarian"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-emerald-100/60 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DAFTAR SURAT */}
      <section className="bg-[#fffdf8] px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          {/* Section heading */}
          <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Jelajahi Al-Qur&apos;an
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950 sm:text-4xl">
                Daftar Surat
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-500 sm:text-base">
                Pilih surat atau jelajahi Al-Qur&apos;an berdasarkan Juz.
              </p>
            </div>

            {/* JUZ FILTER */}
            <div className="relative w-full sm:w-64">
              <label
                htmlFor="juz-filter"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-stone-500"
              >
                Pilih Juz
              </label>

              <div className="relative">
                <select
                  id="juz-filter"
                  value={selectedJuz}
                  onChange={(event) => setSelectedJuz(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-stone-200 bg-white px-4 py-3 pr-10 text-sm font-medium text-emerald-950 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="all">Semua Juz</option>

                  {juzData.map((juz) => (
                    <option key={juz.juz} value={juz.juz}>
                      {juz.name}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-stone-400"
                />
              </div>
            </div>
          </div>

          {/* Active filter */}
          {selectedJuzData && (
            <div className="mb-7 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-5 py-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-emerald-950">
                    {selectedJuzData.name}
                  </p>

                  <p className="mt-1 text-xs text-emerald-800/70">
                    Menampilkan surat yang termasuk dalam Juz ini beserta
                    rentang ayatnya.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedJuz("all")}
                  className="w-fit text-xs font-semibold text-emerald-800 transition hover:text-emerald-950"
                >
                  Tampilkan semua
                </button>
              </div>
            </div>
          )}

          {/* Result count */}
          {!loading && !error && (
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs text-stone-400">
                {searchQuery
                  ? `${filteredSurahs.length} surat ditemukan`
                  : selectedJuzData
                    ? `${filteredSurahs.length} surat dalam ${selectedJuzData.name}`
                    : `${surahs.length} surat`}
              </p>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="h-28 animate-pulse rounded-2xl border border-stone-200 bg-white"
                />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Surat list */}
          {!loading && !error && filteredSurahs.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {filteredSurahs.map((surah) => {
                const juzRange = getJuzRange(surah.number);

                return (
                  <button
                    key={surah.number}
                    type="button"
                    onClick={() => {
                      if (selectedJuzData) {
                        navigate(
                          `/quran/juz/${selectedJuzData.juz}?surah=${surah.number}`,
                        );
                      } else {
                        navigate(`/quran/${surah.number}`);
                      }
                    }}
                    className="group flex min-h-28 cursor-pointer items-center gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                  >
                    {/* Number */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xs font-semibold text-emerald-800 transition-colors group-hover:bg-emerald-900 group-hover:text-amber-200">
                      {surah.number}
                    </div>

                    {/* Information */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-semibold text-emerald-950">
                            {surah.name.transliteration.id}
                          </h3>

                          <p className="mt-0.5 truncate text-xs text-stone-500">
                            {surah.name.translation.id}
                          </p>
                        </div>

                        <p
                          dir="rtl"
                          className="shrink-0 font-serif text-lg text-emerald-900"
                        >
                          {surah.name.short}
                        </p>
                      </div>

                      <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px]">
                        {juzRange ? (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                            Ayat {juzRange.startAyah}–{juzRange.endAyah}
                          </span>
                        ) : (
                          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-500">
                            {surah.numberOfVerses} ayat
                          </span>
                        )}

                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-amber-700">
                          {surah.revelation.id}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filteredSurahs.length === 0 && (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
                <Search size={21} />
              </div>

              <h3 className="mt-4 text-lg font-semibold text-emerald-950">
                Surat tidak ditemukan
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                Coba cari dengan nama surat, arti nama, atau nomor surat yang
                berbeda.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedJuz("all");
                }}
                className="mt-5 text-sm font-semibold text-emerald-800 transition hover:text-emerald-950"
              >
                Tampilkan semua surat
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Quran;
