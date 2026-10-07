import { ArrowLeft, BookOpen, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function QuranDetail() {
  const { number } = useParams();
  const navigate = useNavigate();

  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSurah = async () => {
      try {
        const response = await fetch(
          `https://quran-api-id.vercel.app/surah/${number}`,
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data surat.");
        }

        const result = await response.json();

        setSurah(result.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurah();
  }, [number]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdf8]">
        <p className="text-slate-500">Memuat surat...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdf8] px-6">
        <div className="text-center">
          <p className="text-red-600">{error}</p>

          <button
            onClick={() => navigate("/quran")}
            className="mt-6 rounded-full bg-emerald-950 px-6 py-3 text-sm font-medium text-white"
          >
            Kembali ke Daftar Surat
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdf8]">
      {/* HEADER */}
      <section className="bg-emerald-950 px-6 pb-16 pt-28 text-white">
        <div className="mx-auto max-w-4xl">
          <button
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
                  Al-Qur'an
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
                  {surah.numberOfVerses} Ayat
                </span>

                <span className="rounded-full bg-white/10 px-3 py-1.5 text-emerald-100">
                  {surah.revelation.id}
                </span>
              </div>
            </div>

            <div
              dir="rtl"
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
          <div className="space-y-3">
            {surah.verses.map((verse) => (
              <article
                key={verse.number.inSurah}
                className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm md:p-7"
              >
                {/* AYAT HEADER */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-800">
                    {verse.number.inSurah}
                  </div>

                  {verse.audio?.primary && (
                    <a
                      href={verse.audio.primary}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 transition hover:bg-emerald-100"
                    >
                      <Play size={13} />
                      Dengarkan
                    </a>
                  )}
                </div>

                {/* ARABIC */}
                <p
                  dir="rtl"
                  className="text-right font-serif text-2xl leading-[2.15] text-emerald-950 sm:text-3xl md:text-4xl"
                >
                  {verse.text.arab}
                </p>

                {/* TRANSLITERATION */}
                <p className="mt-5 text-sm italic leading-6 text-stone-400">
                  {verse.text.transliteration.en}
                </p>

                {/* TRANSLATION */}
                <div className="mt-4 border-t border-stone-100 pt-4">
                  <p className="text-sm leading-7 text-stone-600 sm:text-base sm:leading-8">
                    {verse.translation.id}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default QuranDetail;
