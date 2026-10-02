import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  MapPin,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  const [randomAyah, setRandomAyah] = useState(null);
  const [loadingAyah, setLoadingAyah] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const prayerTimes = [
    { name: "Subuh", time: "04:45" },
    { name: "Zuhur", time: "11:58" },
    { name: "Asar", time: "15:18" },
    { name: "Magrib", time: "17:53" },
    { name: "Isya", time: "19:04" },
  ];

  // Update waktu setiap detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Ambil ayat random
  const fetchRandomAyah = async () => {
    try {
      setLoadingAyah(true);

      // Ambil daftar 114 surah
      const surahResponse = await fetch(
        "https://quran-api-id.vercel.app/surah",
      );

      if (!surahResponse.ok) {
        throw new Error("Gagal mengambil daftar surah.");
      }

      const surahData = await surahResponse.json();

      // Pilih surah secara random
      const randomSurah =
        surahData[Math.floor(Math.random() * surahData.length)];

      // Ambil detail surah
      const detailResponse = await fetch(
        `https://quran-api-id.vercel.app/surah/${randomSurah.number}`,
      );

      if (!detailResponse.ok) {
        throw new Error("Gagal mengambil detail surah.");
      }

      const detailData = await detailResponse.json();
      const surah = detailData.data;

      // Pilih ayat secara random
      const randomVerse =
        surah.verses[Math.floor(Math.random() * surah.verses.length)];

      setRandomAyah({
        surahNumber: surah.number,
        surahName: surah.name?.transliteration?.id,
        ayahNumber: randomVerse.number.inSurah,
        arabic: randomVerse.text?.arab,
        translation: randomVerse.translation?.id,
      });
    } catch (error) {
      console.error("Gagal mengambil ayat random:", error);
    } finally {
      setLoadingAyah(false);
    }
  };

  // Ambil ayat pertama kali
  useEffect(() => {
    fetchRandomAyah();
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formattedDate = currentTime.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="relative min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=2000&q=85')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-emerald-950/80" />

      {/* Gradient */}
      <div className="absolute inset-0 bg-linear-to-r from-emerald-950/95 via-emerald-950/75 to-emerald-950/55" />

      {/* Decorative pattern */}
      <div className="absolute -left-32 top-20 h-96 w-96 rounded-full border border-amber-200/10" />

      <div className="absolute -bottom-40 right-10 h-128 w-lg rounded-full border border-amber-200/10" />

      {/* Content */}
      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left: Reminder */}
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-white/10 px-4 py-2 text-sm text-amber-100 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              Pengingat untuk hari ini
            </div>

            {loadingAyah ? (
              <div className="space-y-5">
                <div className="h-20 max-w-2xl animate-pulse rounded-xl bg-white/10" />

                <div className="h-24 max-w-2xl animate-pulse rounded-xl bg-white/10" />

                <div className="h-6 w-64 animate-pulse rounded-lg bg-white/10" />
              </div>
            ) : randomAyah ? (
              <>
                {/* Arabic */}
                <p
                  dir="rtl"
                  lang="ar"
                  className="mb-7 text-right text-3xl leading-[1.9] text-amber-100 sm:text-4xl lg:text-5xl"
                >
                  {randomAyah.arabic}
                </p>

                {/* Translation */}
                <blockquote className="max-w-2xl text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
                  “{randomAyah.translation}”
                </blockquote>

                {/* Reference */}
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <span className="text-base font-medium text-emerald-100">
                    QS. {randomAyah.surahName} · Ayat {randomAyah.ayahNumber}
                  </span>

                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />

                  <span className="text-sm text-emerald-200">Al-Qur'an</span>
                </div>

                <p className="mt-8 max-w-xl text-base leading-7 text-emerald-100/80">
                  Luangkan sejenak untuk membaca, memahami, dan merenungkan
                  petunjuk-Nya.
                </p>

                {/* Actions */}
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    to={`/quran/${randomAyah.surahNumber}`}
                    className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-amber-200"
                  >
                    <BookOpen size={17} />
                    Baca Ayat
                  </Link>

                  <button
                    type="button"
                    onClick={fetchRandomAyah}
                    disabled={loadingAyah}
                    className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <RefreshCw
                      size={17}
                      className={`transition-transform duration-500 ${
                        loadingAyah ? "animate-spin" : "group-hover:rotate-180"
                      }`}
                    />
                    Pengingat Lain
                  </button>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/10 p-6 text-emerald-100">
                Gagal memuat pengingat. Silakan coba lagi.
              </div>
            )}
          </div>

          {/* Right: Time and prayer */}
          <div className="w-full lg:justify-self-end">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur-xl sm:p-6">
              {/* Date */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-emerald-100/70">Waktu saat ini</p>

                  <h2 className="mt-1 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    {formattedTime}
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300/15 text-amber-200">
                  <Clock3 size={23} />
                </div>
              </div>

              <div className="mt-6 space-y-2 border-b border-white/10 pb-4">
                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <CalendarDays size={17} className="text-amber-200" />
                  {formattedDate}
                </div>

                <div className="flex items-center gap-3 text-sm text-emerald-100">
                  <MapPin size={17} className="text-amber-200" />
                  Bandung, Jawa Barat
                </div>
              </div>

              {/* Prayer times */}
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="font-semibold text-white">Waktu Salat</h3>

                  <span className="text-xs text-emerald-100/60">Hari ini</span>
                </div>

                <div className="space-y-1">
                  {prayerTimes.map((prayer) => (
                    <div
                      key={prayer.name}
                      className={`flex items-center justify-between rounded-xl px-4 py-2 ${
                        prayer.name === "Isya"
                          ? "bg-amber-300/15 text-white"
                          : "text-emerald-100"
                      }`}
                    >
                      <span className="text-sm">{prayer.name}</span>

                      <span className="font-semibold">{prayer.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-amber-200/10 bg-amber-200/5 p-3">
                <p className="text-xs text-amber-100/70">Salat berikutnya</p>

                <div className="mt-1 flex items-center justify-between">
                  <span className="font-semibold text-amber-100">Subuh</span>

                  <span className="text-sm font-medium text-amber-200">
                    09j 03m lagi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#jelajahi"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs text-white/60 transition hover:text-white"
      >
        Jelajahi Ilmu
        <ChevronDown size={18} className="animate-bounce" />
      </a>
    </section>
  );
}

export default Hero;
