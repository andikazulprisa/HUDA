import { Heart, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

function Footer() {
  const exploreLinks = [
    { name: "Al-Qur'an", href: "/quran" },
    { name: "Hadis", href: "/hadis" },
    { name: "Doa", href: "/doa" },
    { name: "Amalan Sunnah", href: "/sunnah" },
  ];

  const informationLinks = [
    { name: "Tentang HUDA", href: "/tentang" },
    { name: "Jelajahi Ilmu", href: "/jelajahi" },
    { name: "Sumber Referensi", href: "/referensi" },
  ];

  return (
    <footer className="bg-[#062b22] text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <a href="#" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-900 text-sm font-bold text-amber-300 ring-1 ring-white/10">
                H
              </div>

              <div>
                <p className="text-xl font-bold tracking-[0.2em] text-white">
                  HUDA
                </p>

                <p className="mt-0.5 text-[10px] tracking-wide text-emerald-100/50">
                  Mulai Hari dengan Petunjuk
                </p>
              </div>
            </a>

            <p className="mt-6 text-sm leading-7 text-emerald-100/60">
              Ruang digital untuk membantu menemukan, membaca, dan mempelajari
              Al-Qur&apos;an, hadis, doa, serta pengetahuan Islam dalam satu
              tempat.
            </p>

            {/* Social & contact links */}
            <div className="mt-7 flex items-center gap-3">
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/andika-zulprisa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-emerald-100/70 transition hover:-translate-y-1 hover:border-amber-200/30 hover:bg-white/10 hover:text-amber-200"
              >
                <FaLinkedinIn size={17} />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/andikazulprisa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-emerald-100/70 transition hover:-translate-y-1 hover:border-amber-200/30 hover:bg-white/10 hover:text-amber-200"
              >
                <FaGithub size={18} />
              </a>

              {/* Email */}
              <a
                href="andikazulprisa27@gmail.com"
                aria-label="Email"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-emerald-100/70 transition hover:-translate-y-1 hover:border-amber-200/30 hover:bg-white/10 hover:text-amber-200"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Explore links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white">
              Jelajahi
            </h3>

            <ul className="mt-6 space-y-4">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-emerald-100/55 transition hover:text-amber-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Information links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white">
              Informasi
            </h3>

            <ul className="mt-6 space-y-4">
              {informationLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-emerald-100/55 transition hover:text-amber-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-emerald-100/40">
            © {new Date().getFullYear()} HUDA. Dibuat untuk belajar dan berbagi
            ilmu.
          </p>

          <p className="flex items-center gap-1.5 text-xs text-emerald-100/40">
            Dibuat dengan
            <Heart size={13} className="fill-amber-300 text-amber-300" />
            untuk perjalanan belajar yang lebih bermakna.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
