import {
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  HandHeart,
  MoonStar,
  ScrollText,
} from "lucide-react";
import { Link } from "react-router-dom";

function ExploreSection() {
  const categories = [
    {
      title: "Al-Qur'an",
      description:
        "Jelajahi ayat, surah, terjemahan, dan tafsir untuk memperdalam pemahaman.",
      icon: BookOpen,
      href: "/quran",
      label: "Baca Al-Qur'an",
    },
    {
      title: "Hadis",
      description:
        "Temukan hadis berdasarkan kitab, topik, atau kata kunci yang ingin dipelajari.",
      icon: ScrollText,
      href: "/hadith",
      label: "Jelajahi Hadis",
    },
    {
      title: "Doa",
      description:
        "Kumpulan doa untuk berbagai aktivitas dan kebutuhan dalam kehidupan sehari-hari.",
      icon: HandHeart,
      href: "/dua",
      label: "Lihat Kumpulan Doa",
    },
    {
      title: "Amalan Sunnah",
      description:
        "Pelajari amalan sunnah yang dapat menjadi bekal untuk menjalani hari.",
      icon: MoonStar,
      href: "/sunnah",
      label: "Pelajari Sunnah",
    },
  ];

  return (
    <section
      id="jelajahi"
      className="relative overflow-hidden bg-[#fffdf8] py-20 sm:py-24 lg:py-28"
    >
      {/* Decorative background */}
      <div className="absolute -left-32 top-16 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />
      <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-amber-500/70" />

            <span className="text-xs font-semibold tracking-[0.22em] text-emerald-800">
              JELAJAHI ILMU ISLAM
            </span>

            <span className="h-px w-8 bg-amber-500/70" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-emerald-950 sm:text-4xl lg:text-5xl">
            Temukan Pengetahuan
          </h2>

          <p className="mt-4 text-base leading-7 text-stone-600 sm:text-lg">
            Pelajari Al-Qur&apos;an, hadis, doa, dan amalan sunnah dalam satu
            tempat untuk menemani perjalananmu setiap hari.
          </p>
        </div>

        {/* Category cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.title}
                to={category.href}
                className="group relative flex min-h-75 flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
              >
                {/* Decorative circle */}
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-50 transition-transform duration-500 group-hover:scale-125" />

                {/* Icon */}
                <div className="relative flex h-13 w-13 items-center justify-center rounded-2xl bg-emerald-900 text-amber-200 shadow-md shadow-emerald-900/10 transition-transform duration-300 group-hover:scale-[1.03]">
                  <Icon size={24} strokeWidth={1.7} />
                </div>

                {/* Content */}
                <div className="relative mt-6">
                  <h3 className="text-xl font-bold text-emerald-950">
                    {category.title}
                  </h3>

                  <p className="mt-2.5 text-sm leading-6 text-stone-600">
                    {category.description}
                  </p>
                </div>

                {/* Card action */}
                <div className="relative mt-auto flex items-center justify-between pt-7">
                  <span className="text-sm font-semibold text-emerald-800 transition-colors group-hover:text-emerald-950">
                    {category.label}
                  </span>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-800 transition-all duration-300 group-hover:border-emerald-900 group-hover:bg-emerald-900 group-hover:text-amber-200">
                    <ArrowUpRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Scroll indicator */}
        <a
          href="#pengetahuan"
          className="mx-auto mt-14 flex w-fit flex-col items-center gap-1.5 text-xs text-emerald-800/60 transition hover:text-emerald-950"
        >
          Lihat Pengetahuan Pilihan
          <ChevronDown size={17} className="animate-bounce" />
        </a>
      </div>
    </section>
  );
}

export default ExploreSection;
