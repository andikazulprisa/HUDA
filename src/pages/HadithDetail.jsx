import { ArrowLeft, BookOpen, Copy, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const collections = {
  bukhari: {
    name: "Bukhari",
    arabicApi: "ara-bukhari",
    indonesiaApi: "ind-bukhari",
  },
  muslim: {
    name: "Muslim",
    arabicApi: "ara-muslim",
    indonesiaApi: "ind-muslim",
  },
  abudawud: {
    name: "Abu Dawud",
    arabicApi: "ara-abudawud",
    indonesiaApi: "ind-abudawud",
  },
  tirmidhi: {
    name: "Tirmidzi",
    arabicApi: "ara-tirmidhi",
    indonesiaApi: "ind-tirmidhi",
  },
  nasai: {
    name: "An-Nasa'i",
    arabicApi: "ara-nasai",
    indonesiaApi: "ind-nasai",
  },
  ibnmajah: {
    name: "Ibnu Majah",
    arabicApi: "ara-ibnmajah",
    indonesiaApi: "ind-ibnmajah",
  },
  malik: {
    name: "Malik",
    arabicApi: "ara-malik",
    indonesiaApi: "ind-malik",
  },
};

function HadithDetail() {
  const { collection, number } = useParams();
  const navigate = useNavigate();

  const [hadith, setHadith] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchHadith = async () => {
      setLoading(true);
      setError("");

      try {
        const currentCollection = collections[collection];

        if (!currentCollection) {
          throw new Error("Koleksi hadis tidak ditemukan.");
        }

        const [indonesiaResponse, arabicResponse] = await Promise.all([
          fetch(
            `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${currentCollection.indonesiaApi}/${number}.json`,
          ),
          fetch(
            `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${currentCollection.arabicApi}/${number}.json`,
          ),
        ]);

        if (!indonesiaResponse.ok || !arabicResponse.ok) {
          throw new Error("Gagal mengambil detail hadis.");
        }

        const [indonesiaResult, arabicResult] = await Promise.all([
          indonesiaResponse.json(),
          arabicResponse.json(),
        ]);

        setHadith({
          collectionName: currentCollection.name,
          indonesia: indonesiaResult.hadiths[0],
          arabic: arabicResult.hadiths[0],
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHadith();
  }, [collection, number]);

  const handleCopy = async () => {
    if (!hadith) return;

    const text = `${hadith.arabic.text}\n\n${hadith.indonesia.text}`;

    await navigator.clipboard.writeText(text);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffdf8] px-6 py-32">
        <div className="mx-auto max-w-4xl text-center text-slate-500">
          Memuat hadis...
        </div>
      </main>
    );
  }

  if (error || !hadith) {
    return (
      <main className="min-h-screen bg-[#fffdf8] px-6 py-32">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error || "Hadis tidak ditemukan."}
          </div>

          <button
            type="button"
            onClick={() => navigate("/hadith")}
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-800"
          >
            <ArrowLeft size={18} />
            Kembali ke Hadis
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdf8]">
      {/* Header */}
      <section className="bg-emerald-950 px-6 pb-16 pt-28 text-white">
        <div className="mx-auto max-w-4xl">
          <button
            type="button"
            onClick={() => navigate("/hadith")}
            className="mb-10 inline-flex items-center gap-2 text-sm text-emerald-100/70 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Kembali ke Hadis
          </button>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
            <BookOpen size={22} />
          </div>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-amber-300">
            {hadith.collectionName}
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Hadis #{number}
          </h1>
        </div>
      </section>

      {/* Hadith */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* Arabic */}
            <div className="border-b border-slate-200 px-6 py-10 md:px-10 md:py-14">
              <div className="mb-8 flex items-center justify-between">
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-emerald-700">
                  Teks Arab
                </p>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-emerald-200 hover:text-emerald-800"
                >
                  {copied ? (
                    <>
                      <Check size={15} />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      Salin
                    </>
                  )}
                </button>
              </div>

              <p
                dir="rtl"
                lang="ar"
                className="font-serif text-2xl leading-[2.4] text-emerald-950 md:text-3xl md:leading-[2.5]"
              >
                {hadith.arabic.text}
              </p>
            </div>

            {/* Indonesia */}
            <div className="px-6 py-10 md:px-10 md:py-14">
              <p className="text-sm font-medium uppercase tracking-[0.15em] text-emerald-700">
                Terjemahan Indonesia
              </p>

              <p className="mt-6 text-lg leading-9 text-slate-700">
                {hadith.indonesia.text}
              </p>
            </div>
          </article>

          {/* Metadata */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Koleksi
              </p>
              <p className="mt-1 font-medium text-emerald-950">
                {hadith.collectionName}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400">
                Nomor Hadis
              </p>
              <p className="mt-1 font-medium text-emerald-950">{number}</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HadithDetail;
