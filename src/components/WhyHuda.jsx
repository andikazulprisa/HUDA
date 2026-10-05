import { ArrowRight, BookOpenCheck, Compass, Sparkles } from "lucide-react";

function WhyHuda() {
  const benefits = [
    {
      icon: Compass,
      title: "Mudah Dijelajahi",
      description:
        "Temukan Al-Qur'an, hadis, doa, dan amalan dalam pengalaman yang sederhana dan nyaman.",
    },
    {
      icon: BookOpenCheck,
      title: "Ilmu yang Terorganisir",
      description:
        "Konten disusun berdasarkan kategori agar lebih mudah ditemukan dan dipelajari.",
    },
    {
      icon: Sparkles,
      title: "Pengingat Setiap Hari",
      description:
        "Temukan ayat, hadis, dan doa pilihan yang dapat menemani aktivitas harianmu.",
    },
  ];

  return (
    <section
      id="why-huda"
      className="relative overflow-hidden bg-[#fffdf8] py-24 sm:py-28"
    >
      {/* Decorative background */}
      <div className="absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-amber-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Left content */}
          <div>
            <div className="mb-5 inline-flex items-center gap-3">
              <span className="h-px w-8 bg-amber-500/70" />

              <span className="text-xs font-semibold tracking-[0.22em] text-emerald-800">
                KENAPA HUDA?
              </span>
            </div>

            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-emerald-950 sm:text-4xl lg:text-5xl">
              Ilmu yang Lebih Dekat dengan Kehidupan Sehari-hari
            </h2>

            <p className="mt-6 max-w-xl text-base leading-8 text-stone-600 sm:text-lg">
              HUDA hadir sebagai ruang digital untuk membantu kamu menemukan,
              membaca, dan mempelajari pengetahuan Islam dengan lebih mudah.
            </p>

            <p className="mt-4 max-w-xl text-base leading-8 text-stone-500">
              Mulai dari pengingat singkat hingga materi yang bisa dijelajahi
              lebih dalam, semuanya tersedia dalam satu tempat yang sederhana.
            </p>

            <a
              href="#jelajahi"
              className="group mt-9 inline-flex items-center gap-3 rounded-full bg-emerald-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Mulai Menjelajah
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </div>

          {/* Right benefits */}
          <div className="space-y-5">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;

              return (
                <div
                  key={benefit.title}
                  className="group relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg sm:p-7"
                >
                  {/* Number */}
                  <span className="absolute right-6 top-5 text-5xl font-bold text-emerald-950/4">
                    0{index + 1}
                  </span>

                  <div className="relative flex gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-900 text-amber-200 shadow-lg shadow-emerald-900/10">
                      <Icon size={24} strokeWidth={1.7} />
                    </div>

                    <div className="pr-8">
                      <h3 className="text-lg font-bold text-emerald-950">
                        {benefit.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-stone-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyHuda;
