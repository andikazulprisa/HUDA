import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  MapPin,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";

const TOTAL_SURAH = 114;
const API_BASE = "https://quran-api-id.vercel.app";

function timeToSeconds(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 3600 + m * 60;
}

// Ukuran teks Arab menyesuaikan panjang ayat
function getArabicSizeClass(text = "") {
  const length = text.length;

  if (length <= 100) {
    return "text-3xl leading-[1.9] sm:text-4xl lg:text-[2.7rem]";
  }
  if (length <= 200) {
    return "text-2xl leading-[1.9] sm:text-3xl lg:text-4xl";
  }
  if (length <= 350) {
    return "text-xl leading-[1.8] sm:text-2xl lg:text-3xl";
  }
  if (length <= 500) {
    return "text-lg leading-[1.8] sm:text-xl lg:text-2xl";
  }
  return "text-base leading-[1.8] sm:text-lg lg:text-xl";
}

// Ukuran teks terjemahan menyesuaikan panjang terjemahan
function getTranslationSizeClass(text = "") {
  const length = text.length;

  if (length <= 120) {
    return "text-xl leading-snug sm:text-2xl lg:text-3xl";
  }
  if (length <= 250) {
    return "text-lg leading-snug sm:text-xl lg:text-2xl";
  }
  if (length <= 400) {
    return "text-base leading-relaxed sm:text-lg lg:text-xl";
  }
  return "text-sm leading-relaxed sm:text-base lg:text-lg";
}

function Hero() {
  const [randomAyah, setRandomAyah] = useState(null);
  const [loadingAyah, setLoadingAyah] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshKey, setRefreshKey] = useState(0);

  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loadingPrayer, setLoadingPrayer] = useState(true);

  // ==========================================
  // REALTIME CLOCK
  // ==========================================

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ==========================================
  // RANDOM AYAT
  // ==========================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadAyah() {
      try {
        const randomSurahNumber = Math.floor(Math.random() * TOTAL_SURAH) + 1;

        const detailResponse = await fetch(
          `${API_BASE}/surah/${randomSurahNumber}`,
          {
            signal: controller.signal,
          },
        );

        if (!detailResponse.ok) {
          throw new Error("Gagal mengambil detail surah.");
        }

        const detailData = await detailResponse.json();
        const surah = detailData.data;

        if (!Array.isArray(surah?.verses) || surah.verses.length === 0) {
          throw new Error("Data ayat surah tidak ditemukan.");
        }

        const randomVerse =
          surah.verses[Math.floor(Math.random() * surah.verses.length)];

        if (!randomVerse) {
          throw new Error("Ayat random tidak ditemukan.");
        }

        setRandomAyah({
          surahNumber: surah.number,
          surahName: surah.name?.transliteration?.id,
          ayahNumber: randomVerse.number?.inSurah,
          arabic: randomVerse.text?.arab,
          translation: randomVerse.translation?.id,
        });
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Gagal mengambil ayat random:", error);
        setRandomAyah(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoadingAyah(false);
        }
      }
    }

    loadAyah();

    return () => controller.abort();
  }, [refreshKey]);

  const handleRefreshAyah = () => {
    setLoadingAyah(true);
    setRefreshKey((key) => key + 1);
  };

  // ==========================================
  // WAKTU SALAT DARI ALADHAN
  // ==========================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadPrayerTimes() {
      try {
        setLoadingPrayer(true);

        const response = await fetch(
          "https://api.aladhan.com/v1/timingsByCity?city=Bandung&country=Indonesia&method=20",
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil waktu salat.");
        }

        const data = await response.json();

        if (data.code !== 200 || !data.data?.timings) {
          throw new Error("Data waktu salat tidak valid.");
        }

        const timings = data.data.timings;

        setPrayerTimes([
          {
            name: "Subuh",
            time: timings.Fajr,
          },
          {
            name: "Zuhur",
            time: timings.Dhuhr,
          },
          {
            name: "Asar",
            time: timings.Asr,
          },
          {
            name: "Magrib",
            time: timings.Maghrib,
          },
          {
            name: "Isya",
            time: timings.Isha,
          },
        ]);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Gagal mengambil waktu salat:", error);
        setPrayerTimes(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoadingPrayer(false);
        }
      }
    }

    loadPrayerTimes();

    return () => controller.abort();
  }, []);

  // ==========================================
  // SALAT BERIKUTNYA & COUNTDOWN
  // ==========================================

  const { nextPrayerName, countdownText } = useMemo(() => {
    if (!prayerTimes || prayerTimes.length === 0) {
      return {
        nextPrayerName: "-",
        countdownText: "--j --m lagi",
      };
    }

    const nowSeconds =
      currentTime.getHours() * 3600 +
      currentTime.getMinutes() * 60 +
      currentTime.getSeconds();

    let next = prayerTimes.find(
      (prayer) => timeToSeconds(prayer.time) > nowSeconds,
    );

    let targetSeconds;

    if (next) {
      targetSeconds = timeToSeconds(next.time);
    } else {
      next = prayerTimes[0];
      targetSeconds = timeToSeconds(next.time) + 24 * 3600;
    }

    const diff = targetSeconds - nowSeconds;

    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);

    return {
      nextPrayerName: next.name,
      countdownText: `${String(hours).padStart(2, "0")}j ${String(
        minutes,
      ).padStart(2, "0")}m lagi`,
    };
  }, [currentTime, prayerTimes]);

  // ==========================================
  // DATE & TIME FORMAT
  // ==========================================

  const formattedTime = currentTime.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
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
      <div className="relative mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl items-center px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          {/* ==========================================
              LEFT — RANDOM AYAT
          ========================================== */}

          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-white/10 px-4 py-2 text-sm text-amber-100 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-amber-300" />
              Pengingat untuk hari ini
            </div>

            {loadingAyah ? (
              <div className="space-y-5">
                <div className="h-16 max-w-2xl animate-pulse rounded-xl bg-white/10" />
                <div className="h-20 max-w-2xl animate-pulse rounded-xl bg-white/10" />
                <div className="h-6 w-64 animate-pulse rounded-lg bg-white/10" />
              </div>
            ) : randomAyah ? (
              <>
                {/* Arabic */}
                <p
                  dir="rtl"
                  lang="ar"
                  className={`w-full text-right font-serif text-amber-100 ${getArabicSizeClass(
                    randomAyah.arabic,
                  )}`}
                >
                  {randomAyah.arabic}
                </p>

                {/* Translation */}
                <blockquote
                  className={`mt-5 max-w-2xl font-semibold text-white ${getTranslationSizeClass(
                    randomAyah.translation,
                  )}`}
                >
                  “{randomAyah.translation}”
                </blockquote>

                {/* Reference */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="text-sm font-medium text-emerald-100 sm:text-base">
                    QS. {randomAyah.surahName} · Ayat {randomAyah.ayahNumber}
                  </span>

                  <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />

                  <span className="text-sm text-emerald-200">
                    Al-Qur&apos;an
                  </span>
                </div>

                <p className="mt-6 max-w-xl text-sm leading-6 text-emerald-100/75 sm:text-base">
                  Luangkan sejenak untuk membaca, memahami, dan merenungkan
                  petunjuk-Nya.
                </p>

                {/* Actions */}
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to={`/quran/${randomAyah.surahNumber}`}
                    className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-amber-200"
                  >
                    <BookOpen size={17} />
                    Baca Ayat
                  </Link>

                  <button
                    type="button"
                    onClick={handleRefreshAyah}
                    disabled={loadingAyah}
                    className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
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
                <p>Gagal memuat pengingat. Silakan coba lagi.</p>

                <button
                  type="button"
                  onClick={handleRefreshAyah}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-300 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition hover:bg-amber-200"
                >
                  <RefreshCw size={16} />
                  Coba Lagi
                </button>
              </div>
            )}
          </div>

          {/* ==========================================
              RIGHT — CLOCK & PRAYER
          ========================================== */}

          <div className="w-full lg:max-w-sm lg:justify-self-end">
            <div className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-5">
              {/* Current time */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-emerald-100/65">Waktu saat ini</p>

                  <h2 className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {formattedTime}
                  </h2>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-300/15 text-amber-200">
                  <Clock3 size={20} />
                </div>
              </div>

              {/* Date & location */}
              <div className="mt-4 space-y-1.5 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5 text-xs text-emerald-100">
                  <CalendarDays size={15} className="shrink-0 text-amber-200" />
                  {formattedDate}
                </div>

                <div className="flex items-center gap-2.5 text-xs text-emerald-100">
                  <MapPin size={15} className="shrink-0 text-amber-200" />
                  Bandung, Jawa Barat
                </div>
              </div>

              {/* Prayer times */}
              <div className="mt-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">
                    Waktu Salat
                  </h3>

                  <span className="text-[11px] text-emerald-100/50">
                    Kemenag RI
                  </span>
                </div>

                {loadingPrayer ? (
                  <div className="space-y-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div
                        key={index}
                        className="h-8 animate-pulse rounded-lg bg-white/10"
                      />
                    ))}
                  </div>
                ) : prayerTimes ? (
                  <div className="space-y-0.5">
                    {prayerTimes.map((prayer) => (
                      <div
                        key={prayer.name}
                        className={`flex items-center justify-between rounded-lg px-3 py-1.5 ${
                          prayer.name === nextPrayerName
                            ? "bg-amber-300/15 text-white"
                            : "text-emerald-100"
                        }`}
                      >
                        <span className="text-xs">{prayer.name}</span>

                        <span className="text-sm font-semibold">
                          {prayer.time}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-emerald-100/70">
                    Gagal memuat waktu salat.
                  </div>
                )}
              </div>

              {/* Next prayer */}
              <div className="mt-3 rounded-xl border border-amber-200/10 bg-amber-200/5 px-3 py-2.5">
                <p className="text-[11px] text-amber-100/60">
                  Salat berikutnya
                </p>

                <div className="mt-0.5 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-amber-100">
                    {nextPrayerName}
                  </span>

                  <span className="text-xs font-medium text-amber-200">
                    {countdownText}
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
        className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 text-xs text-white/60 transition hover:text-white"
      >
        Jelajahi Ilmu
        <ChevronDown size={17} className="animate-bounce" />
      </a>
    </section>
  );
}

export default Hero;
