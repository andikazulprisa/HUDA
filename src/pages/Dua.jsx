import { useEffect, useMemo, useState } from "react";
import { Search, Copy, Check, Loader2 } from "lucide-react";

function Dua() {
  const [duas, setDuas] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copiedNumber, setCopiedNumber] = useState(null);

  const API_URL = "https://sunnah.amanahagent.cloud/api/v1/doa";

  useEffect(() => {
    const fetchDuas = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          headers: {
            "X-API-Key": import.meta.env.VITE_SUNNAH_API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data doa.");
        }

        const data = await response.json();

        setDuas(data.results || []);
      } catch (err) {
        console.error(err);
        setError("Doa gagal dimuat. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchDuas();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(duas.map((dua) => dua.category).filter(Boolean)),
    ];

    return ["Semua", ...uniqueCategories];
  }, [duas]);

  const filteredDuas = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return duas.filter((dua) => {
      const matchesCategory =
        selectedCategory === "Semua" || dua.category === selectedCategory;

      const matchesSearch =
        !keyword ||
        dua.title?.toLowerCase().includes(keyword) ||
        dua.category?.toLowerCase().includes(keyword) ||
        dua.text_latin?.toLowerCase().includes(keyword) ||
        dua.text_indonesian?.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [duas, search, selectedCategory]);

  const handleCopy = async (dua) => {
    const text = `${dua.title}

${dua.text_arabic}

${dua.text_latin}

${dua.text_indonesian}

${dua.source}`;

    try {
      await navigator.clipboard.writeText(text);

      setCopiedNumber(dua.number);

      setTimeout(() => {
        setCopiedNumber(null);
      }, 2000);
    } catch (err) {
      console.error("Gagal menyalin doa:", err);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F5EC] text-[#123C32]">
      {/* Hero */}
      <section className="bg-[#123C32] px-6 py-20 text-[#F8F5EC]">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#D6A84F]">
            KUMPULAN DOA
          </p>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
            Doa untuk menemani setiap langkah kehidupan.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#D8E2DD] md:text-lg">
            Temukan doa-doa dari sumber yang sahih lengkap dengan tulisan Arab,
            latin, terjemahan Indonesia, dan sumber hadisnya.
          </p>

          {/* Search */}
          <div className="relative mt-10 max-w-2xl">
            <Search
              size={20}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8EA59D]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari doa..."
              className="w-full rounded-2xl border border-white/10 bg-white px-5 py-4 pl-14 text-[#123C32] outline-none transition placeholder:text-gray-400 focus:border-[#D6A84F]"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          {/* Category */}
          {!loading && !error && (
            <div className="mb-12">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#B68A35]">
                    KATEGORI
                  </p>

                  <h2 className="mt-2 text-2xl font-semibold md:text-3xl">
                    Temukan doa sesuai kebutuhan
                  </h2>
                </div>

                <p className="hidden text-sm text-[#6D7D77] md:block">
                  {filteredDuas.length} doa ditemukan
                </p>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition ${
                      selectedCategory === category
                        ? "bg-[#123C32] text-white"
                        : "border border-[#D9DED9] bg-white text-[#50645D] hover:border-[#123C32] hover:text-[#123C32]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex min-h-75 items-center justify-center">
              <div className="flex items-center gap-3 text-[#567068]">
                <Loader2 className="animate-spin" size={22} />
                <span>Memuat kumpulan doa...</span>
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-red-700">{error}</p>

              <button
                onClick={() => window.location.reload()}
                className="mt-5 rounded-full bg-[#123C32] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && filteredDuas.length === 0 && (
            <div className="rounded-2xl border border-[#E0E4DF] bg-white p-12 text-center">
              <p className="text-lg font-medium">Doa tidak ditemukan.</p>

              <p className="mt-2 text-sm text-[#6D7D77]">
                Coba gunakan kata pencarian atau kategori yang berbeda.
              </p>
            </div>
          )}

          {/* Doa List */}
          {!loading && !error && filteredDuas.length > 0 && (
            <div className="space-y-6">
              {filteredDuas.map((dua) => (
                <article
                  key={dua.number}
                  className="overflow-hidden rounded-3xl border border-[#E1E5DF] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  {/* Card Header */}
                  <div className="flex flex-col gap-4 border-b border-[#EEF0EC] px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
                    <div className="flex items-center gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF0EC] text-sm font-semibold text-[#123C32]">
                        {dua.number}
                      </span>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[#B68A35]">
                          {dua.category}
                        </p>

                        <h3 className="mt-1 text-lg font-semibold md:text-xl">
                          {dua.title}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopy(dua)}
                      className="flex items-center gap-2 self-start rounded-full border border-[#DDE3DE] px-4 py-2 text-sm font-medium text-[#50645D] transition hover:border-[#123C32] hover:text-[#123C32] md:self-auto"
                    >
                      {copiedNumber === dua.number ? (
                        <>
                          <Check size={16} />
                          Tersalin
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          Salin
                        </>
                      )}
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="px-6 py-7 md:px-8 md:py-9">
                    {/* Arabic */}
                    <p
                      dir="rtl"
                      lang="ar"
                      className="text-right text-2xl leading-[2.2] text-[#123C32] md:text-3xl md:leading-[2.3]"
                    >
                      {dua.text_arabic}
                    </p>

                    {/* Latin */}
                    <div className="mt-8 border-l-2 border-[#D6A84F] pl-5">
                      <p className="text-sm font-semibold uppercase tracking-wider text-[#B68A35]">
                        Latin
                      </p>

                      <p className="mt-2 text-base italic leading-8 text-[#536760]">
                        {dua.text_latin}
                      </p>
                    </div>

                    {/* Translation */}
                    <div className="mt-7">
                      <p className="text-sm font-semibold uppercase tracking-wider text-[#B68A35]">
                        Terjemahan
                      </p>

                      <p className="mt-2 text-base leading-8 text-[#40544D]">
                        {dua.text_indonesian}
                      </p>
                    </div>

                    {/* Source */}
                    <div className="mt-7 flex items-start gap-2 border-t border-[#EEF0EC] pt-5">
                      <span className="text-sm font-medium text-[#687A73]">
                        Sumber:
                      </span>

                      <span className="text-sm text-[#40544D]">
                        {dua.source}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Dua;
