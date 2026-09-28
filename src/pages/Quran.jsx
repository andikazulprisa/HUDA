import { BookOpen, Search } from "lucide-react";

function Quran() {
  const surahs = [
    {
      number: 1,
      name: "Al-Fatihah",
      arabic: "الفاتحة",
      verses: 7,
      meaning: "Pembukaan",
    },
    {
      number: 2,
      name: "Al-Baqarah",
      arabic: "البقرة",
      verses: 286,
      meaning: "Sapi Betina",
    },
    {
      number: 3,
      name: "Ali 'Imran",
      arabic: "آل عمران",
      verses: 200,
      meaning: "Keluarga Imran",
    },
    {
      number: 4,
      name: "An-Nisa",
      arabic: "النساء",
      verses: 176,
      meaning: "Wanita",
    },
    {
      number: 5,
      name: "Al-Ma'idah",
      arabic: "المائدة",
      verses: 120,
      meaning: "Hidangan",
    },
    {
      number: 6,
      name: "Al-An'am",
      arabic: "الأنعام",
      verses: 165,
      meaning: "Binatang Ternak",
    },
  ];

  return (
    <div className="min-h-screen bg-[#fffdf8]">
      {/* Hero */}
      <section className="bg-emerald-950 px-5 pb-16 pt-14 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-2 text-amber-300">
              <BookOpen size={18} />
              <span className="text-sm font-semibold tracking-[0.18em]">
                AL-QUR'AN
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Baca dan temukan petunjuk dalam setiap ayat.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-emerald-100/70">
              Jelajahi surah-surah Al-Qur'an dan dekatkan diri dengan firman
              Allah, kapan pun dan di mana pun.
            </p>
          </div>

          {/* Search */}
          <div className="mt-10 max-w-2xl">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
              <Search size={20} className="shrink-0 text-emerald-100/60" />

              <input
                type="text"
                placeholder="Cari nama surah..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-emerald-100/40"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Surah List */}
      <section className="px-5 py-14 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-xs font-bold tracking-[0.2em] text-amber-600">
              DAFTAR SURAH
            </p>

            <h2 className="mt-2 text-2xl font-bold text-emerald-950 sm:text-3xl">
              Jelajahi Al-Qur'an
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {surahs.map((surah) => (
              <div
                key={surah.number}
                className="group rounded-2xl border border-stone-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-sm font-bold text-emerald-800">
                      {surah.number}
                    </div>

                    <div>
                      <h3 className="font-semibold text-emerald-950">
                        {surah.name}
                      </h3>

                      <p className="mt-1 text-xs text-stone-500">
                        {surah.meaning} · {surah.verses} ayat
                      </p>
                    </div>
                  </div>

                  <p dir="rtl" className="font-serif text-xl text-emerald-900">
                    {surah.arabic}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Quran;
