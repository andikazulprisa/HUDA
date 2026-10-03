import { Menu, Moon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

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
    { name: "Jelajahi", to: "/#jelajahi" },
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900 text-sm font-bold text-amber-300">
            <img
              src="assets/logo huda 2.png"
              alt="logo Huda"
              className="h-full w-full object-cover object-center"
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

        {/* Right menu */}
        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
            aria-label="Ubah tema"
          >
            <Moon size={18} />
          </button>

          <Link
            to="/quran"
            className="rounded-full bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Mulai Jelajahi
          </Link>
        </div>

        {/* Mobile button */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 text-stone-700 lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Buka menu"
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
              <Link
                key={link.name}
                to={link.to}
                onClick={handleMobileLinkClick}
                className="rounded-xl px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-emerald-50 hover:text-emerald-900"
              >
                {link.name}
              </Link>
            ))}

            <Link
              to="/quran"
              onClick={handleMobileLinkClick}
              className="mt-3 rounded-xl bg-emerald-900 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Mulai Jelajahi
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
