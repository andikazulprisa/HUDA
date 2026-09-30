import { BookOpen, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Quran() {
  const [surahs, setSurahs] = useState([]);
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

  return (
    <main className="min-h-screen bg-[#fffdf8]">
      {/* HERO */}
      <section className="bg-emerald-950 px-6 pb-20 pt-32 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/10 text-amber-300">
                <BookOpen size={20} />
              </div>

              <span className="text-sm font-medium uppercase tracking-[0.2em] text-amber-300">
                Al-Qur'an
              </span>
            </div>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Baca dan temukan petunjuk dalam setiap ayat.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-emerald-100/70 md:text-lg">
              Jelajahi Al-Qur'an, temukan surat yang ingin kamu baca, dan pahami
              maknanya melalui terjemahan bahasa Indonesia.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-10 max-w-2xl">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-sm">
              <Search size={20} className="shrink-0 text-emerald-200/70" />

              <input
                type="text"
                placeholder="Cari surat..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-emerald-100/40"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DAFTAR SURAT */}
      <section className="bg-[#fffdf8] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-700">
              Jelajahi Al-Qur'an
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-emerald-950 md:text-4xl">
              Daftar Surat
            </h2>

            <p className="mt-4 max-w-2xl leading-7 text-slate-600">
              Temukan surat yang ingin kamu baca dan pelajari lebih lanjut.
            </p>
          </div>

          {loading && (
            <div className="py-12 text-center text-slate-500">
              Memuat daftar surat...
            </div>
          )}

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {surahs.map((surah) => (
                <button
                  key={surah.number}
                  type="button"
                  onClick={() => navigate(`/quran/${surah.number}`)}
                  className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-semibold text-emerald-800">
                      {surah.number}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold text-emerald-950">
                            {surah.name.transliteration.id}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {surah.name.translation.id}
                          </p>
                        </div>

                        <p
                          dir="rtl"
                          className="shrink-0 font-serif text-xl text-emerald-900"
                        >
                          {surah.name.short}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                          {surah.numberOfVerses} Ayat
                        </span>

                        <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">
                          {surah.revelation.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Quran;
