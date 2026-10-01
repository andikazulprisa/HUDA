import { ArrowRight, BookOpen, ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const collections = [
  {
    id: "bukhari",
    name: "Bukhari",
    fullName: "Shahih Bukhari",
    api: "ind-bukhari",
  },
  {
    id: "muslim",
    name: "Muslim",
    fullName: "Shahih Muslim",
    api: "ind-muslim",
  },
  {
    id: "abudawud",
    name: "Abu Dawud",
    fullName: "Sunan Abu Dawud",
    api: "ind-abudawud",
  },
  {
    id: "tirmidhi",
    name: "Tirmidzi",
    fullName: "Jami' at-Tirmidzi",
    api: "ind-tirmidhi",
  },
  {
    id: "nasai",
    name: "An-Nasa'i",
    fullName: "Sunan An-Nasa'i",
    api: "ind-nasai",
  },
  {
    id: "ibnmajah",
    name: "Ibnu Majah",
    fullName: "Sunan Ibnu Majah",
    api: "ind-ibnmajah",
  },
  {
    id: "malik",
    name: "Malik",
    fullName: "Muwatta Malik",
    api: "ind-malik",
  },
];

const featuredHadiths = [
  {
    collection: "bukhari",
    number: 1,
    title: "Shahih Bukhari",
    label: "Niat dan Amal",
  },
  {
    collection: "muslim",
    number: 1,
    title: "Shahih Muslim",
    label: "Dasar-Dasar Islam",
  },
  {
    collection: "abudawud",
    number: 1,
    title: "Sunan Abu Dawud",
    label: "Petunjuk Kehidupan",
  },
  {
    collection: "tirmidhi",
    number: 1,
    title: "Jami' at-Tirmidzi",
    label: "Pelajaran dari Sunnah",
  },
];

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function Hadith() {
  const navigate = useNavigate();

  const [hadiths, setHadiths] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("all");

  const [featured, setFeatured] = useState([]);

  const [loading, setLoading] = useState(true);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [error, setError] = useState("");

  const [visibleCount, setVisibleCount] = useState(12);

  // =========================
  // FETCH HADITH DATA
  // =========================

  useEffect(() => {
    const fetchHadiths = async () => {
      setLoading(true);
      setError("");
      setVisibleCount(12);

      try {
        if (selectedCollection === "all") {
          const responses = await Promise.all(
            collections.map((collection) =>
              fetch(
                `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${collection.api}.json`,
              ),
            ),
          );

          const results = await Promise.all(
            responses.map((response) => {
              if (!response.ok) {
                throw new Error("Gagal mengambil data hadis.");
              }

              return response.json();
            }),
          );

          const combinedHadiths = results.flatMap((result, index) =>
            result.hadiths.map((hadith) => ({
              ...hadith,
              collection: collections[index].id,
              collectionName: collections[index].name,
              fullCollectionName: collections[index].fullName,
            })),
          );

          setHadiths(combinedHadiths);
        } else {
          const collection = collections.find(
            (item) => item.id === selectedCollection,
          );

          const response = await fetch(
            `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${collection.api}.json`,
          );

          if (!response.ok) {
            throw new Error("Gagal mengambil data hadis.");
          }

          const result = await response.json();

          const formattedHadiths = result.hadiths.map((hadith) => ({
            ...hadith,
            collection: collection.id,
            collectionName: collection.name,
            fullCollectionName: collection.fullName,
          }));

          setHadiths(formattedHadiths);
        }
      } catch (error) {
        setError(error.message);
        setHadiths([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHadiths();
  }, [selectedCollection]);

  // =========================
  // FETCH HADIS PILIHAN
  // =========================

  useEffect(() => {
    const fetchFeatured = async () => {
      setFeaturedLoading(true);

      try {
        const results = await Promise.all(
          featuredHadiths.map(async (item) => {
            const collection = collections.find(
              (collection) => collection.id === item.collection,
            );

            const response = await fetch(
              `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${collection.api}/${item.number}.json`,
            );

            if (!response.ok) {
              throw new Error("Gagal mengambil hadis pilihan.");
            }

            const result = await response.json();

            return {
              ...item,
              hadith: result.hadiths[0],
            };
          }),
        );

        setFeatured(results);
      } catch (error) {
        console.error("Featured Hadith Error:", error);
      } finally {
        setFeaturedLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  // =========================
  // SMART SEARCH
  // =========================

  const searchResults = useMemo(() => {
    if (!searchKeyword) {
      return [];
    }

    const normalizedQuery = normalizeText(searchKeyword);

    const queryWords = normalizedQuery.split(" ").filter(Boolean);

    return hadiths.filter((hadith) => {
      const searchableText = normalizeText(
        `${hadith.text} ${hadith.collectionName} ${hadith.fullCollectionName}`,
      );

      return queryWords.every((word) => searchableText.includes(word));
    });
  }, [hadiths, searchKeyword]);

  const visibleResults = searchResults.slice(0, visibleCount);

  const handleSearch = (event) => {
    event.preventDefault();

    setSearchKeyword(keyword.trim());
    setVisibleCount(12);
  };

  const handleCollectionChange = (collectionId) => {
    setSelectedCollection(collectionId);
    setSearchKeyword("");
    setKeyword("");
    setVisibleCount(12);
  };

  const handleLoadMore = () => {
    setVisibleCount((current) => current + 12);
  };

  return (
    <main className="min-h-screen bg-[#fffdf8]">
      {/* ========================================
          HERO
      ======================================== */}

      <section className="bg-emerald-950 px-6 pb-16 pt-32 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300">
              Hadis
            </p>

            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Temukan ilmu dari sunnah Nabi ﷺ
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-emerald-100/70 md:text-lg">
              Jelajahi hadis dan temukan pembelajaran yang relevan dengan
              kehidupan sehari-hari.
            </p>
          </div>

          {/* SEARCH */}

          <form
            onSubmit={handleSearch}
            className="mt-10 flex max-w-3xl items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-2 backdrop-blur-sm"
          >
            <Search size={20} className="ml-3 shrink-0 text-emerald-200/70" />

            <input
              type="text"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Cari hadis, misalnya: puasa, sabar, shalat..."
              className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-emerald-100/40"
            />

            <button
              type="submit"
              className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-amber-300"
            >
              Cari
            </button>
          </form>
        </div>
      </section>

      {/* ========================================
          HADIS PILIHAN
      ======================================== */}

      {!searchKeyword && (
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
                Hadis Pilihan
              </p>

              <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-emerald-950 md:text-4xl">
                    Temukan pelajaran dari sunnah
                  </h2>

                  <p className="mt-4 max-w-2xl leading-7 text-slate-600">
                    Beberapa hadis yang bisa kamu baca untuk memulai perjalanan
                    belajar hari ini.
                  </p>
                </div>

                <BookOpen
                  size={42}
                  strokeWidth={1.2}
                  className="hidden text-emerald-200 md:block"
                />
              </div>
            </div>

            {featuredLoading ? (
              <div className="py-10 text-center text-slate-500">
                Memuat hadis pilihan...
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">
                {featured.map((item) => (
                  <button
                    key={`${item.collection}-${item.number}`}
                    type="button"
                    onClick={() =>
                      navigate(`/hadith/${item.collection}/${item.number}`)
                    }
                    className="group rounded-2xl border border-slate-200 bg-white p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="text-xs font-medium uppercase tracking-[0.15em] text-emerald-700">
                          {item.label}
                        </span>

                        <h3 className="mt-2 font-semibold text-emerald-950">
                          {item.title}
                        </h3>
                      </div>

                      <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        #{item.number}
                      </span>
                    </div>

                    <p className="mt-5 line-clamp-3 leading-7 text-slate-600">
                      {item.hadith?.text}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-700">
                      Baca hadis
                      <ArrowRight
                        size={16}
                        className="transition group-hover:translate-x-1"
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================
          KOLEKSI HADIS
      ======================================== */}

      <section className="border-y border-slate-200 bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
              Koleksi
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950 md:text-4xl">
              Jelajahi Kitab Hadis
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Pilih koleksi hadis yang ingin kamu telusuri.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* SEMUA */}

            <button
              type="button"
              onClick={() => handleCollectionChange("all")}
              className={`rounded-2xl border p-5 text-left transition duration-300 ${
                selectedCollection === "all"
                  ? "border-emerald-300 bg-emerald-50 shadow-sm"
                  : "border-slate-200 bg-[#fffdf8] hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  <BookOpen size={19} />
                </div>

                {selectedCollection === "all" && (
                  <span className="text-xs font-medium text-emerald-700">
                    Dipilih
                  </span>
                )}
              </div>

              <h3 className="mt-5 font-semibold text-emerald-950">
                Semua Hadis
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Jelajahi seluruh koleksi
              </p>
            </button>

            {collections.map((collection) => {
              const isActive = selectedCollection === collection.id;

              return (
                <button
                  key={collection.id}
                  type="button"
                  onClick={() => handleCollectionChange(collection.id)}
                  className={`rounded-2xl border p-5 text-left transition duration-300 ${
                    isActive
                      ? "border-emerald-300 bg-emerald-50 shadow-sm"
                      : "border-slate-200 bg-[#fffdf8] hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                      <BookOpen size={19} />
                    </div>

                    {isActive && (
                      <span className="text-xs font-medium text-emerald-700">
                        Dipilih
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 font-semibold text-emerald-950">
                    {collection.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {collection.fullName}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================
          HASIL SEARCH
      ======================================== */}

      {searchKeyword && (
        <section className="px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
                Hasil Pencarian
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950">
                {searchResults.length} hadis ditemukan
              </h2>

              <p className="mt-3 text-slate-600">
                Hasil untuk{" "}
                <span className="font-semibold text-emerald-800">
                  "{searchKeyword}"
                </span>
              </p>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500">
                Mencari hadis...
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
                {error}
              </div>
            ) : searchResults.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <p className="text-slate-600">
                  Belum ditemukan hadis yang sesuai.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {visibleResults.map((hadith) => (
                    <button
                      key={`${hadith.collection}-${hadith.hadithnumber}`}
                      type="button"
                      onClick={() =>
                        navigate(
                          `/hadith/${hadith.collection}/${hadith.hadithnumber}`,
                        )
                      }
                      className="group flex w-full items-center justify-between gap-5 rounded-2xl border border-slate-200 bg-white px-5 py-5 text-left transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md md:px-6"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                            {hadith.fullCollectionName}
                          </span>

                          <span className="text-xs text-slate-400">
                            Hadis #{hadith.hadithnumber}
                          </span>
                        </div>

                        <p className="mt-3 text-sm font-medium text-slate-700">
                          Lihat hadis lengkap
                        </p>
                      </div>

                      <ArrowRight
                        size={20}
                        className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-700"
                      />
                    </button>
                  ))}
                </div>

                {visibleCount < searchResults.length && (
                  <div className="mt-10 flex justify-center">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-50"
                    >
                      Muat lebih banyak
                      <ChevronDown size={17} />
                    </button>
                  </div>
                )}

                <p className="mt-5 text-center text-xs text-slate-400">
                  Menampilkan {visibleResults.length} dari{" "}
                  {searchResults.length} hasil
                </p>
              </>
            )}
          </div>
        </section>
      )}

      {/* ========================================
          DEFAULT EMPTY STATE
      ======================================== */}

      {!searchKeyword && (
        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
              Mulai Menjelajah
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-emerald-950">
              Apa yang ingin kamu pelajari hari ini?
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              Gunakan pencarian di atas atau pilih salah satu koleksi hadis
              untuk mulai membaca.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}

export default Hadith;
