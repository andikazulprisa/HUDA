import { ArrowRight, Sparkles } from "lucide-react";

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#fffdf8] py-20 sm:py-24 lg:py-28">
      {/* Decorative background */}
      <div className="absolute left-1/2 top-1/2 h-128 w-lg -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-emerald-900/5" />

      <div className="absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full border border-amber-500/10" />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8">
        {/* Label */}
        <div className="mb-5 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-emerald-800">
          <Sparkles size={15} strokeWidth={1.8} className="text-amber-600" />
          <span>MULAI PERJALANANMU</span>
        </div>

        {/* Title */}
        <h2 className="text-4xl font-bold leading-tight tracking-tight text-emerald-950 sm:text-5xl lg:text-6xl">
          Temukan Ilmu,
          <br />
          Dekatkan Diri
        </h2>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
          Jadikan setiap hari sebagai kesempatan untuk membaca, memahami,
          merenungkan, dan mengambil hikmah dari ilmu yang dipelajari.
        </p>

        {/* Button */}
        <a
          href="#jelajahi"
          className="group mt-9 inline-flex items-center gap-3 rounded-full bg-emerald-900 px-7 py-3.5 text-sm font-bold text-amber-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow-lg hover:shadow-emerald-900/10"
        >
          Mulai Menjelajah
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </a>

        {/* Supporting text */}
        <p className="mt-5 text-xs leading-5 text-stone-400">
          Mulai dari satu ayat, satu hadis, atau satu doa hari ini.
        </p>
      </div>
    </section>
  );
}

export default CTASection;
