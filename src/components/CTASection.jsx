import { ArrowRight, Sparkles } from "lucide-react";

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-emerald-950 py-24 sm:py-28">
      {/* Decorative background */}
      <div className="absolute left-1/2 top-1/2 h-128 w-lg -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-700/20 blur-3xl" />

      <div className="absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-amber-200/10" />

      <div className="absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-amber-200/10" />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        {/* Label */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200/15 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-amber-200">
          <Sparkles size={15} />
          MULAI PERJALANANMU
        </div>

        {/* Title */}
        <h2 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          Temukan Ilmu,
          <br />
          Dekatkan Diri
        </h2>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-emerald-100/70 sm:text-lg">
          Jadikan setiap hari sebagai kesempatan untuk membaca, memahami,
          merenungkan, dan mengambil hikmah dari ilmu yang dipelajari.
        </p>

        {/* Button */}
        <a
          href="#jelajahi"
          className="group mt-10 inline-flex items-center gap-3 rounded-full bg-amber-300 px-7 py-4 text-sm font-bold text-emerald-950 transition-all duration-300 hover:-translate-y-1 hover:bg-amber-200 hover:shadow-xl hover:shadow-amber-300/10"
        >
          Mulai Menjelajah
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </a>

        {/* Small text */}
        <p className="mt-6 text-xs text-emerald-100/45">
          Mulai dari satu ayat, satu hadis, atau satu doa hari ini.
        </p>
      </div>
    </section>
  );
}

export default CTASection;
