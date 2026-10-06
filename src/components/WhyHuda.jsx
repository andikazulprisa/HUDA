import { BookOpen, Heart, Sparkles } from "lucide-react";

function WhyHuda() {
  return (
    <section
      id="why-huda"
      className="relative overflow-hidden  bg-[#fffdf8] py-24 sm:py-28 lg:py-32"
    >
      {/* Decorative background */}
      <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-amber-100/30 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-8 lg:px-10">
        {/* Label */}
        <div className="mb-5 inline-flex items-center gap-3">
          <span className="h-px w-8 bg-amber-500/70" />

          <span className="text-xs font-semibold tracking-[0.22em] text-emerald-800">
            TENTANG HUDA
          </span>

          <span className="h-px w-8 bg-amber-500/70" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-emerald-950 sm:text-4xl lg:text-5xl">
          Sebuah Pengingat untuk Kembali Dekat kepada Allah
        </h2>

        {/* Main message */}
        <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-stone-600 sm:text-lg">
          HUDA dibuat dari sebuah keinginan sederhana: menjadi pengingat kecil
          di tengah kesibukan sehari-hari untuk kembali membaca, memahami, dan
          merenungkan ilmu Islam.
        </p>

        <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-stone-500 sm:text-lg">
          Terkadang kita hanya membutuhkan satu ayat, satu hadis, satu doa, atau
          satu nasihat untuk mengingat kembali kepada siapa kita akan kembali.
        </p>

        {/* Divider */}
        <div className="mx-auto my-10 flex items-center justify-center gap-4">
          <span className="h-px w-16 bg-stone-200" />

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900 text-amber-200 shadow-sm">
            <Heart size={18} strokeWidth={1.7} />
          </div>

          <span className="h-px w-16 bg-stone-200" />
        </div>

        {/* Closing message */}
        <p className="mx-auto max-w-2xl text-base font-medium leading-8 text-emerald-900 sm:text-lg">
          Semoga HUDA dapat menjadi ruang kecil yang menemani langkah untuk
          terus belajar, mengingat, dan mendekat kepada Allah — sedikit demi
          sedikit, setiap hari.
        </p>

        {/* Simple principles */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-stone-500">
          <span className="inline-flex items-center gap-2">
            <BookOpen size={16} className="text-emerald-800" />
            Membaca
          </span>

          <span className="hidden text-stone-300 sm:inline">•</span>

          <span className="inline-flex items-center gap-2">
            <Sparkles size={16} className="text-amber-600" />
            Merenungkan
          </span>

          <span className="hidden text-stone-300 sm:inline">•</span>

          <span className="inline-flex items-center gap-2">
            <Heart size={16} className="text-emerald-800" />
            Mendekat
          </span>
        </div>
      </div>
    </section>
  );
}

export default WhyHuda;
