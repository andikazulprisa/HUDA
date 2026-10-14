import { ArrowRight, BookOpen, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const API = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";
const PAGE_SIZE = 12;

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
  { id: "malik", name: "Malik", fullName: "Muwatta Malik", api: "ind-malik" },
];

const COLLECTION_MAP = Object.fromEntries(collections.map((c) => [c.id, c]));

const featuredHadiths = [
  { collection: "bukhari", number: 1, label: "Niat dan Amal" },
  { collection: "muslim", number: 1, label: "Dasar-Dasar Islam" },
  { collection: "abudawud", number: 1, label: "Petunjuk Kehidupan" },
  { collection: "tirmidhi", number: 1, label: "Pelajaran dari Sunnah" },
];

const SUGGESTIONS = ["niat", "sabar", "puasa", "shalat", "akhlak", "ilmu"];

function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Cache di memori: koleksi yang sudah diunduh tidak diunduh ulang
const collectionCache = new Map();

async function loadCollection(collection, signal) {
  if (collectionCache.has(collection.id)) {
    return collectionCache.get(collection.id);
  }

  const response = await fetch(`${API}/${collection.api}.json`, { signal });

  if (!response.ok) {
    throw new Error("Gagal mengambil data hadis.");
  }

  const result = await response.json();

  const items = result.hadiths
    .filter((hadith) => hadith.text)
    .map((hadith) => ({
      collection: collection.id,
      collectionName: collection.name,
      fullCollectionName: collection.fullName,
      number: hadith.hadithnumber,
      text: hadith.text,
      searchText: normalizeText(hadith.text),
    }));

  collectionCache.set(collection.id, items);

  return items;
}

// Ambil cuplikan di sekitar kata kunci pertama
function getSnippet(text, words, maxLength = 240) {
  if (words.length === 0) {
    return text.length > maxLength
      ? `${text.slice(0, maxLength).trimEnd()}…`
      : text;
  }

  const lower = text.toLowerCase();
  const positions = words
    .map((word) => lower.indexOf(word))
    .filter((index) => index >= 0);

  const matchIndex = positions.length > 0 ? Math.min(...positions) : 0;

  let start = Math.max(0, matchIndex - 70);

  if (start > 0) {
    const space = text.indexOf(" ", start);
    if (space !== -1 && space < matchIndex) start = space + 1;
  }

  const end = Math.min(text.length, start + maxLength);

  return `${start > 0 ? "…" : ""}${text.slice(start, end).trim()}${
    end < text.length ? "…" : ""
  }`;
}

function Highlight({ text, words }) {
  if (words.length === 0) return text;

  const regex = new RegExp(`(${words.map(escapeRegExp).join("|")})`, "gi");

  return text.split(regex).map((part, index) =>
    index % 2 === 1 ? (
      <mark
        key={index}
        className="rounded bg-amber-200/80 px-0.5 text-emerald-950"
      >
        {part}
      </mark>
    ) : (
      part
    ),
  );
}

function SearchForm({ initialValue, onSearch }) {
  const [value, setValue] = useState(initialValue);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSearch(value.trim());
      }}
      className="mt-10 flex max-w-3xl items-center gap-2 rounded-2xl border border-white/10 bg-white/10 p-2 backdrop-blur-sm transition focus-within:border-amber-300/40"
    >
      <Search
        size={20}
        aria-hidden="true"
        className="ml-3 shrink-0 text-emerald-200/70"
      />

      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        aria-label="Cari hadis"
        placeholder="Cari hadis, misalnya: puasa, sabar, shalat..."
        className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-white outline-none placeholder:text-emerald-100/40"
      />

      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            onSearch("");
          }}
          aria-label="Hapus pencarian"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-emerald-100/60 transition hover:bg-white/10 hover:text-white"
        >
          <X size={16} aria-hidden="true" />
        </button>
      )}

      <button
        type="submit"
        className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-amber-300"
      >
        Cari
      </button>
    </form>
  );
}

// Hadis pilihan: hanya dimuat (dan dirender) saat halaman dalam keadaan awal
function FeaturedHadiths() {
  const [featured, setFeatured] = useState(null); // null = loading

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const items = await Promise.all(
          featuredHadiths.map(async (item) => {
            const collection = COLLECTION_MAP[item.collection];

            const response = await fetch(
              `${API}/${collection.api}/${item.number}.json`,
              { signal: controller.signal },
            );

            if (!response.ok) throw new Error("Gagal mengambil hadis pilihan.");

            const result = await response.json();

            return {
              ...item,
              title: collection.fullName,
              text: result.hadiths[0]?.text ?? "",
            };
          }),
        );

        setFeatured({ items, error: false });
      } catch (err) {
        if (err.name === "AbortError") return;

        console.error("Featured Hadith Error:", err);
        setFeatured({ items: [], error: true });
      }
    }

    load();

    return () => controller.abort();
  }, []);

  return (
    <section className="px-5 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
              Hadis Pilihan
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950 md:text-4xl">
              Temukan pelajaran dari sunnah
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-stone-600">
              Beberapa hadis yang bisa kamu baca untuk memulai perjalanan
              belajar hari ini.
            </p>
          </div>

          <BookOpen
            size={42}
            strokeWidth={1.2}
            aria-hidden="true"
            className="hidden text-emerald-200 md:block"
          />
        </div>

        {featured === null ? (
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-2xl border border-stone-200 bg-white"
              />
            ))}
          </div>
        ) : featured.error ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-6 text-sm text-stone-600">
            Hadis pilihan belum bisa dimuat. Kamu tetap bisa mencari atau
            memilih kitab hadis di bawah.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {featured.items.map((item) => (
              <Link
                key={`${item.collection}-${item.number}`}
                to={`/hadith/${item.collection}/${item.number}`}
                className="group rounded-2xl border border-stone-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
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

                <p className="mt-5 line-clamp-3 leading-7 text-stone-600">
                  {item.text}
                </p>

                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-700">
                  Baca hadis
                  <ArrowRight
                    size={16}
                    aria-hidden="true"
                    className="transition group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Hadith() {
  const [searchParams, setSearchParams] = useSearchParams();

  const q = (searchParams.get("q") ?? "").trim();
  const koleksiParam = searchParams.get("koleksi");
  const selected =
    koleksiParam && COLLECTION_MAP[koleksiParam] ? koleksiParam : "all";

  const hasQuery = q.length > 0;
  const isBrowsing = selected !== "all";
  const active = hasQuery || isBrowsing;

  const [retry, setRetry] = useState(0);
  const [data, setData] = useState({ key: "", hadiths: [], error: "" });
  const [more, setMore] = useState({ key: "", count: PAGE_SIZE });

  // Koleksi yang perlu diunduh. Kosong = belum ada yang perlu diunduh (lazy)
  const fetchIds = useMemo(() => {
    if (!active) return [];
    return selected === "all" ? collections.map((c) => c.id) : [selected];
  }, [active, selected]);

  const requestKey =
    fetchIds.length > 0 ? `${fetchIds.join(",")}#${retry}` : "";

  const loading = active && data.key !== requestKey;
  const fetchError = active && data.key === requestKey ? data.error : "";

  const hadiths = useMemo(
    () => (data.key === requestKey ? data.hadiths : []),
    [data.key, data.hadiths, requestKey],
  );

  useEffect(() => {
    if (!requestKey) return;

    const controller = new AbortController();
    const ids = requestKey.split("#")[0].split(",");

    async function load() {
      try {
        const lists = await Promise.all(
          ids.map((id) =>
            loadCollection(COLLECTION_MAP[id], controller.signal),
          ),
        );

        setData({ key: requestKey, hadiths: lists.flat(), error: "" });
      } catch (err) {
        if (err.name === "AbortError") return;

        setData({
          key: requestKey,
          hadiths: [],
          error: err.message || "Terjadi kesalahan.",
        });
      }
    }

    load();

    return () => controller.abort();
  }, [requestKey]);

  const searchWords = useMemo(
    () => (hasQuery ? normalizeText(q).split(" ").filter(Boolean) : []),
    [hasQuery, q],
  );

  const highlightWords = useMemo(
    () => (hasQuery ? q.toLowerCase().split(/\s+/).filter(Boolean) : []),
    [hasQuery, q],
  );

  const results = useMemo(() => {
    if (!active) return [];
    if (searchWords.length === 0) return hadiths;

    return hadiths.filter((hadith) =>
      searchWords.every((word) => hadith.searchText.includes(word)),
    );
  }, [active, hadiths, searchWords]);

  const resultsKey = `${q}|${selected}`;
  const visibleCount = more.key === resultsKey ? more.count : PAGE_SIZE;
  const visibleResults = results.slice(0, visibleCount);

  const updateParams = ({ q: nextQ = q, koleksi: nextKoleksi = selected }) => {
    const params = new URLSearchParams();

    if (nextQ) params.set("q", nextQ);
    if (nextKoleksi && nextKoleksi !== "all") {
      params.set("koleksi", nextKoleksi);
    }

    setSearchParams(params);
  };

  const selectedCollection = isBrowsing ? COLLECTION_MAP[selected] : null;

  return (
    <main className="min-h-screen bg-[#fffdf8]">
      {/* HERO */}
      <section className="bg-emerald-950 px-5 pb-14 pt-28 text-white sm:px-6 sm:pb-16 sm:pt-32">
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

          <SearchForm
            key={q}
            initialValue={q}
            onSearch={(value) => updateParams({ q: value })}
          />

          <div className="mt-5 flex max-w-3xl flex-wrap items-center gap-2">
            <span className="text-xs text-emerald-100/50">Coba cari:</span>

            {SUGGESTIONS.map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => updateParams({ q: word })}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-emerald-100/80 transition hover:border-amber-300/40 hover:bg-white/10 hover:text-amber-200"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      </section>

      {active ? (
        /* HASIL / DAFTAR KOLEKSI */
        <section className="px-5 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-6xl">
            {/* Filter koleksi */}
            <div
              role="group"
              aria-label="Filter kitab hadis"
              className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
            >
              {[{ id: "all", name: "Semua" }, ...collections].map((item) => {
                const isActive = selected === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => updateParams({ koleksi: item.id })}
                    className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-emerald-900 bg-emerald-900 text-amber-200"
                        : "border-stone-200 bg-white text-stone-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>

            {/* Judul hasil */}
            <div className="mb-8">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
                {hasQuery ? "Hasil Pencarian" : "Koleksi"}
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950">
                {loading
                  ? hasQuery
                    ? "Mencari hadis..."
                    : "Memuat hadis..."
                  : hasQuery
                    ? `${results.length} hadis ditemukan`
                    : selectedCollection?.fullName}
              </h2>

              {hasQuery && (
                <p className="mt-3 text-stone-600">
                  Hasil untuk{" "}
                  <span className="font-semibold text-emerald-800">
                    &quot;{q}&quot;
                  </span>
                  {selectedCollection && <> di {selectedCollection.fullName}</>}
                </p>
              )}

              {loading && selected === "all" && (
                <p className="mt-2 text-xs text-stone-400">
                  Pertama kali mencari di semua kitab memerlukan waktu sedikit
                  lebih lama. Setelah itu langsung cepat.
                </p>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-28 animate-pulse rounded-2xl border border-stone-200 bg-white"
                  />
                ))}
              </div>
            ) : fetchError ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
                <p>{fetchError}</p>

                <button
                  type="button"
                  onClick={() => setRetry((count) => count + 1)}
                  className="mt-4 rounded-full bg-emerald-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
                >
                  Coba Lagi
                </button>
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
                  <Search size={21} aria-hidden="true" />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-emerald-950">
                  Belum ada hadis yang sesuai
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
                  Coba kata kunci yang lebih singkat atau cari di semua kitab.
                </p>

                <button
                  type="button"
                  onClick={() => setSearchParams(new URLSearchParams())}
                  className="mt-5 text-sm font-semibold text-emerald-800 transition hover:text-emerald-950"
                >
                  Hapus pencarian dan filter
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {visibleResults.map((hadith) => (
                    <Link
                      key={`${hadith.collection}-${hadith.number}`}
                      to={`/hadith/${hadith.collection}/${hadith.number}`}
                      className="group flex items-start justify-between gap-5 rounded-2xl border border-stone-200 bg-white px-5 py-5 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md md:px-6"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                            {hadith.fullCollectionName}
                          </span>

                          <span className="text-xs text-stone-400">
                            Hadis #{hadith.number}
                          </span>
                        </div>

                        <p className="mt-3 text-sm leading-7 text-stone-700 sm:text-base">
                          <Highlight
                            text={getSnippet(hadith.text, highlightWords)}
                            words={highlightWords}
                          />
                        </p>
                      </div>

                      <ArrowRight
                        size={20}
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-stone-300 transition group-hover:translate-x-1 group-hover:text-emerald-700"
                      />
                    </Link>
                  ))}
                </div>

                {visibleCount < results.length && (
                  <div className="mt-10 flex justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        setMore({
                          key: resultsKey,
                          count: visibleCount + PAGE_SIZE,
                        })
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-50"
                    >
                      Muat lebih banyak
                      <ChevronDown size={17} aria-hidden="true" />
                    </button>
                  </div>
                )}

                <p className="mt-5 text-center text-xs text-stone-400">
                  Menampilkan {visibleResults.length} dari {results.length}{" "}
                  hadis
                </p>
              </>
            )}
          </div>
        </section>
      ) : (
        /* KEADAAN AWAL: hadis pilihan + daftar kitab */
        <>
          <FeaturedHadiths />

          <section className="border-t border-stone-200 bg-white px-5 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-6xl">
              <div className="mb-10">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
                  Koleksi
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950 md:text-4xl">
                  Jelajahi Kitab Hadis
                </h2>

                <p className="mt-4 max-w-2xl leading-7 text-stone-600">
                  Pilih satu kitab untuk langsung membaca daftar hadisnya.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {collections.map((collection) => (
                  <button
                    key={collection.id}
                    type="button"
                    onClick={() => updateParams({ koleksi: collection.id })}
                    className="group rounded-2xl border border-stone-200 bg-[#fffdf8] p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 transition-colors group-hover:bg-emerald-900 group-hover:text-amber-200">
                      <BookOpen size={19} aria-hidden="true" />
                    </div>

                    <h3 className="mt-5 font-semibold text-emerald-950">
                      {collection.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-stone-500">
                      {collection.fullName}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default Hadith;
