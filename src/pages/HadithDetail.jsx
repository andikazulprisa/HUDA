import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useQuranReadingSettings from "../hooks/useQuranReadingSettings";
import QuranReadingSettings from "../components/QuranReadingSettings";

const API = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";

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
  malik: { name: "Malik", arabicApi: "ara-malik", indonesiaApi: "ind-malik" },
};

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
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

const actionButton =
  "inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-xs font-medium text-stone-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700/40";

function HadithDetail() {
  const { collection, number } = useParams();
  const { settings, updateSetting } = useQuranReadingSettings();

  const [retry, setRetry] = useState(0);
  const [data, setData] = useState({
    key: "",
    hadith: null,
    notFound: false,
    error: "",
  });
  const [feedback, setFeedback] = useState(null); // "copied" | "shared" | "failed"
  const feedbackTimer = useRef(null);

  const currentCollection = collections[collection];
  const key = `${collection}/${number}#${retry}`;

  const loading = Boolean(currentCollection) && data.key !== key;
  const error = !currentCollection
    ? "Koleksi hadis tidak ditemukan."
    : data.key === key
      ? data.error
      : "";
  const notFound = data.key === key && data.notFound;
  const hadith = data.key === key ? data.hadith : null;

  useEffect(() => {
    return () => clearTimeout(feedbackTimer.current);
  }, []);

  useEffect(() => {
    const current = collections[collection];

    if (!current) return;

    const controller = new AbortController();

    async function fetchHadith() {
      try {
        const [indonesiaResponse, arabicResponse] = await Promise.all([
          fetch(`${API}/${current.indonesiaApi}/${number}.json`, {
            signal: controller.signal,
          }),
          fetch(`${API}/${current.arabicApi}/${number}.json`, {
            signal: controller.signal,
          }),
        ]);

        if (indonesiaResponse.status === 404) {
          setData({ key, hadith: null, notFound: true, error: "" });
          return;
        }

        if (!indonesiaResponse.ok) {
          throw new Error("Gagal mengambil detail hadis.");
        }

        const indonesiaResult = await indonesiaResponse.json();
        // Teks Arab bersifat opsional: kalau gagal, terjemahan tetap tampil
        const arabicResult = arabicResponse.ok
          ? await arabicResponse.json()
          : null;

        const indonesia = indonesiaResult.hadiths?.[0];

        if (!indonesia) {
          setData({ key, hadith: null, notFound: true, error: "" });
          return;
        }

        setData({
          key,
          hadith: { indonesia, arabic: arabicResult?.hadiths?.[0] ?? null },
          notFound: false,
          error: "",
        });
      } catch (err) {
        if (err.name === "AbortError") return;

        setData({
          key,
          hadith: null,
          notFound: false,
          error: err.message || "Terjadi kesalahan.",
        });
      }
    }

    fetchHadith();

    return () => controller.abort();
  }, [collection, number, key]);

  const numericValue = Number(number);
  const isInteger = Number.isInteger(numericValue);
  const previousNumber =
    isInteger && numericValue > 1 ? numericValue - 1 : null;
  const nextNumber = isInteger ? numericValue + 1 : null;

  const reference = currentCollection
    ? `HR. ${currentCollection.name} no. ${number}`
    : "";

  const hadithUrl = `${window.location.origin}/hadith/${collection}/${number}`;

  const flash = (type) => {
    clearTimeout(feedbackTimer.current);
    setFeedback(type);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 2000);
  };

  const buildText = () => {
    if (!hadith) return "";

    const parts = [];

    if (hadith.arabic?.text) parts.push(hadith.arabic.text);
    parts.push(hadith.indonesia.text);
    parts.push(`(${reference})`);

    return parts.join("\n\n");
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(buildText());
    flash(ok ? "copied" : "failed");
  };

  const handleShare = async () => {
    const text = buildText();

    if (navigator.share) {
      try {
        await navigator.share({ title: reference, text, url: hadithUrl });
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }

    const ok = await copyToClipboard(`${text}\n\n${hadithUrl}`);
    flash(ok ? "shared" : "failed");
  };

  const backTo = currentCollection
    ? `/hadith?koleksi=${collection}`
    : "/hadith";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffdf8]">
        <section className="bg-emerald-950 px-5 pb-16 pt-28 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
            <div className="mt-10 h-12 w-12 animate-pulse rounded-2xl bg-white/10" />
            <div className="mt-6 h-4 w-24 animate-pulse rounded bg-white/10" />
            <div className="mt-4 h-10 w-56 animate-pulse rounded bg-white/10" />
          </div>
        </section>

        <section className="px-5 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl space-y-4">
            <div className="h-56 animate-pulse rounded-3xl border border-stone-200 bg-white" />
            <div className="h-40 animate-pulse rounded-3xl border border-stone-200 bg-white" />
          </div>
        </section>
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-screen bg-[#fffdf8] px-5 py-32 sm:px-6">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-800">
            <BookOpen size={22} aria-hidden="true" />
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-emerald-950">
            Hadis nomor {number} tidak ditemukan
          </h1>

          <p className="mt-3 text-sm leading-7 text-stone-600">
            Nomor ini tidak ada di {currentCollection.name}. Mungkin kamu sudah
            sampai di hadis terakhir koleksi ini.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to={`/hadith/${collection}/1`}
              className="rounded-full bg-emerald-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              Ke hadis pertama
            </Link>

            <Link
              to={backTo}
              className="rounded-full border border-emerald-200 bg-white px-6 py-3 text-sm font-medium text-emerald-900 transition hover:bg-emerald-50"
            >
              Kembali ke daftar
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (error || !hadith) {
    return (
      <main className="min-h-screen bg-[#fffdf8] px-5 py-32 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            <p>{error || "Hadis tidak ditemukan."}</p>

            {currentCollection && (
              <button
                type="button"
                onClick={() => setRetry((count) => count + 1)}
                className="mt-4 rounded-full bg-emerald-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
              >
                Coba Lagi
              </button>
            )}
          </div>

          <Link
            to="/hadith"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-emerald-800"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Kembali ke Hadis
          </Link>
        </div>
      </main>
    );
  }

  const copyLabel =
    feedback === "copied"
      ? "Tersalin"
      : feedback === "failed"
        ? "Gagal menyalin"
        : "Salin";

  const shareLabel = feedback === "shared" ? "Tautan tersalin" : "Bagikan";

  return (
    <main className="min-h-screen bg-[#fffdf8]">
      {/* Header */}
      <section className="bg-emerald-950 px-5 pb-16 pt-28 text-white sm:px-6">
        <div className="mx-auto max-w-4xl">
          <Link
            to={backTo}
            className="mb-10 inline-flex items-center gap-2 text-sm text-emerald-100/70 transition hover:text-white"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            Kembali ke daftar {currentCollection.name}
          </Link>

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
            <BookOpen size={22} aria-hidden="true" />
          </div>

          <p className="mt-6 text-sm font-medium uppercase tracking-[0.2em] text-amber-300">
            Hadis
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Hadis #{number}
          </h1>

          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-emerald-100">
              {currentCollection.name}
            </span>

            <span className="rounded-full bg-amber-400/10 px-3 py-1.5 text-amber-200">
              {reference}
            </span>
          </div>
        </div>
      </section>

      {/* Isi hadis */}
      <section className="px-5 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          {/* Default tampilan (ukuran huruf Arab, terjemahan) */}
          <QuranReadingSettings
            settings={settings}
            updateSetting={updateSetting}
          />

          <article className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
            {/* Arab */}
            {hadith.arabic?.text && (
              <div className="border-b border-stone-200 px-6 py-10 md:px-10 md:py-14">
                <p className="mb-8 text-sm font-medium uppercase tracking-[0.15em] text-emerald-700">
                  Teks Arab
                </p>

                <p
                  dir="rtl"
                  lang="ar"
                  style={{ fontSize: `${settings.arabFontSize}px` }}
                  className="font-serif leading-[2.3] text-emerald-950"
                >
                  {hadith.arabic.text}
                </p>
              </div>
            )}

            {/* Terjemahan */}
            {(settings.showTranslation || !hadith.arabic?.text) && (
              <div className="px-6 py-10 md:px-10 md:py-14">
                <p className="text-sm font-medium uppercase tracking-[0.15em] text-emerald-700">
                  Terjemahan Indonesia
                </p>

                <p
                  style={{ fontSize: `${settings.translationFontSize}px` }}
                  className="mt-6 leading-9 text-stone-700"
                >
                  {hadith.indonesia.text}
                </p>
              </div>
            )}

            {/* Sumber + aksi */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 bg-stone-50/60 px-6 py-4 md:px-10">
              <p className="text-sm font-medium text-emerald-900">
                {reference}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-live="polite"
                  className={actionButton}
                >
                  {feedback === "copied" ? (
                    <Check
                      size={15}
                      aria-hidden="true"
                      className="text-emerald-700"
                    />
                  ) : (
                    <Copy size={15} aria-hidden="true" />
                  )}
                  {copyLabel}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  aria-live="polite"
                  className={actionButton}
                >
                  {feedback === "shared" ? (
                    <Check
                      size={15}
                      aria-hidden="true"
                      className="text-emerald-700"
                    />
                  ) : (
                    <Share2 size={15} aria-hidden="true" />
                  )}
                  {shareLabel}
                </button>
              </div>
            </div>
          </article>

          {/* Navigasi hadis */}
          {isInteger && (
            <nav
              aria-label="Navigasi hadis"
              className="mt-10 grid grid-cols-2 gap-3 border-t border-stone-200 pt-8"
            >
              {previousNumber ? (
                <Link
                  to={`/hadith/${collection}/${previousNumber}`}
                  className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
                >
                  <ChevronLeft
                    size={18}
                    aria-hidden="true"
                    className="shrink-0 text-emerald-800"
                  />

                  <div className="min-w-0">
                    <p className="text-xs text-stone-400">Sebelumnya</p>
                    <p className="mt-1 truncate text-sm font-semibold text-emerald-950">
                      Hadis #{previousNumber}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              <Link
                to={`/hadith/${collection}/${nextNumber}`}
                className="flex items-center justify-end gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-4 text-right transition hover:border-emerald-200 hover:bg-emerald-50"
              >
                <div className="min-w-0">
                  <p className="text-xs text-stone-400">Berikutnya</p>
                  <p className="mt-1 truncate text-sm font-semibold text-emerald-950">
                    Hadis #{nextNumber}
                  </p>
                </div>

                <ChevronRight
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 text-emerald-800"
                />
              </Link>
            </nav>
          )}
        </div>
      </section>
    </main>
  );
}

export default HadithDetail;
