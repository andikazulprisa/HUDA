import {
  ArrowUpRight,
  BookOpen,
  HandHeart,
  Quote,
  ScrollText,
} from "lucide-react";

function FeaturedKnowledge() {
  const knowledgeItems = [
    {
      category: "AL-QUR'AN",
      title:
        "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya.",
      source: "QS. Al-Baqarah · Ayat 286",
      description:
        "Setiap ujian datang bersama kemampuan yang Allah berikan untuk menghadapinya.",
      icon: BookOpen,
      href: "/quran",
    },
    {
      category: "HADIS",
      title: "Sesungguhnya setiap amalan tergantung pada niatnya.",
      source: "HR. Bukhari dan Muslim",
      description:
        "Niat menjadi dasar yang menentukan nilai dan tujuan dari setiap amal.",
      icon: ScrollText,
      href: "/hadith",
    },
    {
      category: "DOA",
      title: "Rabbana atina fid-dunya hasanah...",
      source: "Doa kebaikan dunia dan akhirat",
      description:
        "Memohon kebaikan dalam kehidupan dunia serta keselamatan di akhirat.",
      icon: HandHeart,
      href: "/dua",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-emerald-950 py-24 sm:py-28">
      {/* Decorative background */}
      <div className="absolute -left-32 top-10 h-96 w-96 rounded-full border border-amber-200/10" />

      <div className="absolute -bottom-40 -right-24 h-120 w-120 rounded-full border border-amber-200/10" />

      <div className="absolute left-1/2 top-1/2 h-128 w-lg -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-800/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-amber-300/70" />

            <span className="text-xs font-semibold tracking-[0.22em] text-amber-200">
              PENGETAHUAN PILIHAN
            </span>

            <span className="h-px w-8 bg-amber-300/70" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Satu Ilmu untuk Hari Ini
          </h2>

          <p className="mt-5 text-base leading-7 text-emerald-100/70 sm:text-lg">
            Luangkan sejenak untuk membaca, memahami, dan mengambil hikmah dari
            ayat, hadis, serta doa pilihan.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {knowledgeItems.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.category}
                href={item.href}
                className="group relative flex min-h-97.5 flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-amber-200/30 hover:bg-white/10"
              >
                {/* Quote decoration */}
                <Quote
                  className="absolute -right-3 -top-3 text-white/5"
                  size={130}
                  strokeWidth={1}
                />

                {/* Category */}
                <div className="relative flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300/10 text-amber-200">
                    <Icon size={23} strokeWidth={1.7} />
                  </div>

                  <span className="text-[11px] font-semibold tracking-[0.18em] text-amber-200/80">
                    {item.category}
                  </span>
                </div>

                {/* Content */}
                <div className="relative mt-8">
                  <h3 className="text-xl font-semibold leading-8 text-white">
                    “{item.title}”
                  </h3>

                  <p className="mt-5 text-sm leading-6 text-emerald-100/65">
                    {item.description}
                  </p>
                </div>

                {/* Bottom */}
                <div className="relative mt-auto border-t border-white/10 pt-5">
                  <p className="text-sm font-medium text-amber-100">
                    {item.source}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">
                      Baca Selengkapnya
                    </span>

                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-amber-200 transition-all duration-300 group-hover:bg-amber-300 group-hover:text-emerald-950">
                      <ArrowUpRight
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <a
            href="/jelajahi"
            className="inline-flex items-center gap-2 rounded-full border border-amber-200/20 bg-white/5 px-6 py-3 text-sm font-semibold text-amber-100 transition hover:bg-white/10"
          >
            Jelajahi Lebih Banyak
            <ArrowUpRight size={17} />
          </a>
        </div>
      </div>
    </section>
  );
}

export default FeaturedKnowledge;
