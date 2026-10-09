import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logoHuda from "../assets/logo-huda.png";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Beranda", to: "/" },
    { name: "Al-Qur'an", to: "/quran" },
    { name: "Hadis", to: "/hadith" },
    { name: "Doa", to: "/dua" },
    { name: "Sunnah", to: "/sunnah" },
  ];

  const handleMobileLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "border-stone-200/80 bg-[#fffdf8]/95 shadow-md backdrop-blur-lg"
          : "border-stone-200 bg-[#fffdf8]"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="HUDA Beranda"
        >
          <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-emerald-900 ring-1 ring-emerald-900/10">
            <img
              src={logoHuda}
              alt="Logo HUDA"
              className="h-full w-full scale-150 object-cover"
            />
          </div>

          <div>
            <p className="text-xl font-bold tracking-[0.2em] text-emerald-950">
              HUDA
            </p>

            <p className="hidden text-[10px] tracking-wide text-stone-500 sm:block">
              Mulai Hari dengan Petunjuk
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-emerald-900"
                    : "text-stone-600 hover:text-emerald-800"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile button */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-stone-200 bg-[#fffdf8] px-5 py-5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.to}
                end={link.to === "/"}
                onClick={handleMobileLinkClick}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-900"
                      : "text-stone-700 hover:bg-emerald-50 hover:text-emerald-900"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
