import { Heart, Mail } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoHuda from "../assets/logo huda 2.png";

const exploreLinks = [
  { name: "Al-Qur'an", href: "/quran" },
  { name: "Hadis", href: "/hadith" },
  { name: "Doa", href: "/dua" },
  { name: "Amalan Sunnah", href: "/sunnah" },
];

const aboutLinks = [
  { name: "Tentang HUDA", id: "why-huda" },
  { name: "Jelajahi Ilmu", id: "jelajahi" },
  { name: "Pengetahuan Pilihan", id: "pengetahuan" },
];

const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/andika-zulprisa",
    icon: FaLinkedinIn,
    size: 17,
    external: true,
  },
  {
    label: "GitHub",
    href: "https://github.com/andikazulprisa",
    icon: FaGithub,
    size: 18,
    external: true,
  },
  {
    label: "Email",
    href: "mailto:andikazulprisa27@gmail.com",
    icon: Mail,
    size: 18,
    external: false,
  },
];

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll ke section di beranda tanpa reload halaman
  const handleHashClick = (event, id) => {
    event.preventDefault();

    if (location.pathname === "/") {
      scrollToSection(id);
      window.history.replaceState(null, "", `/#${id}`);
      return;
    }

    // Kalau sedang di halaman lain: pindah ke beranda dulu, lalu scroll
    navigate("/");
    setTimeout(() => scrollToSection(id), 150);
  };

  return (
    <footer className="bg-[#062b22] text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-sm md:col-span-2 lg:col-span-1">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-900 ring-1 ring-white/10">
                <img
                  src={logoHuda}
                  alt="Logo HUDA"
                  className="h-full w-full scale-150 object-cover transition-transform duration-300 group-hover:scale-[1.6]"
                />
              </div>

              <div>
                <p className="text-xl font-bold tracking-[0.2em] text-white">
                  HUDA
                </p>

                <p className="mt-0.5 text-[10px] tracking-wide text-emerald-100/60">
                  Mulai Hari dengan Petunjuk
                </p>
              </div>
            </Link>

            <p className="mt-6 text-sm leading-7 text-emerald-100/70">
              Ruang digital untuk membantu menemukan, membaca, dan mempelajari
              Al-Qur&apos;an, hadis, doa, serta pengetahuan Islam dalam satu
              tempat.
            </p>

            {/* Social & contact */}
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map(
                ({ label, href, icon: Icon, size, external }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    {...(external && {
                      target: "_blank",
                      rel: "noopener noreferrer",
                    })}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-emerald-100/70 transition-all duration-300 hover:-translate-y-1 hover:border-amber-200/30 hover:bg-white/10 hover:text-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/60"
                  >
                    <Icon size={size} aria-hidden="true" />
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Explore */}
          <nav aria-label="Jelajahi">
            <h3 className="text-sm font-semibold tracking-wide text-white">
              Jelajahi
            </h3>

            <ul className="mt-6 space-y-4">
              {exploreLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-emerald-100/70 transition-colors hover:text-amber-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* About */}
          <nav aria-label="Tentang">
            <h3 className="text-sm font-semibold tracking-wide text-white">
              Tentang
            </h3>

            <ul className="mt-6 space-y-4">
              {aboutLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={`/#${link.id}`}
                    onClick={(event) => handleHashClick(event, link.id)}
                    className="text-sm text-emerald-100/70 transition-colors hover:text-amber-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom footer */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-emerald-100/55">
            © {new Date().getFullYear()} HUDA. Dibuat untuk belajar dan berbagi
            ilmu.
          </p>

          <p className="flex items-center gap-1.5 text-xs text-emerald-100/55">
            Dibuat dengan
            <Heart
              size={13}
              aria-hidden="true"
              className="fill-amber-300 text-amber-300"
            />
            untuk perjalanan belajar yang lebih bermakna.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
