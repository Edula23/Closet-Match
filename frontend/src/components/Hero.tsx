import { useState } from "react";

const navLinks = ["Home", "About", "Courses", "Contact"];

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className="min-h-screen bg-linear-to-br from-[#0a0a2e] via-[#0d1b6e] to-[#0a0a2e] text-white font-sans overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5">
        <div className="text-xl font-bold tracking-tight">
          <span className="text-white">Closet</span>
          <span className="text-blue-400">Match</span>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-8 text-sm text-gray-300">
          {navLinks.map((link) => (
            <li key={link}>
              <a href="#" className="hover:text-white transition-colors">
                {link}
              </a>
            </li>
          ))}
        </ul>

        <button className="hidden md:block bg-blue-500 hover:bg-blue-400 transition-colors text-white text-sm font-medium px-5 py-2 rounded-full">
          Sign Up
        </button>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0d1b6e]/95 px-6 py-4 flex flex-col gap-4 text-sm text-gray-200">
          {navLinks.map((link) => (
            <a key={link} href="#" className="hover:text-white transition-colors">
              {link}
            </a>
          ))}
          <button className="mt-2 bg-blue-500 hover:bg-blue-400 transition-colors text-white text-sm font-medium px-5 py-2 rounded-full w-fit">
            Sign Up
          </button>
        </div>
      )}

      {/* Hero Content */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 pt-8 md:pt-12 pb-16 gap-10 max-w-7xl mx-auto">
        {/* Left Side */}
        <div className="flex flex-col gap-6 md:max-w-[45%] z-10">
          {/* Avatars + tag */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["🧑", "👩", "🧔"].map((emoji, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-base border-2 border-[#0a0a2e]"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <span className="text-xs text-gray-400 font-medium">#Fashion</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            <span className="text-blue-400">Closet</span>
            <span className="text-purple-400">Match</span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-sm">
            Lorem ipsum dolor sit amet consectetur. Amet in dictum odio magna ut
            feugiat. Bibendum hac facilisi feugiat pellentesque nisl eu fringilla
            mattis sem.
          </p>

          {/* Secondary text block (mobile only shown below image) */}
          <div className="hidden md:block space-y-3">
            <p className="text-sm text-gray-400 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur. Amet in dictum odio magna
              ut feugiat.
            </p>
            <p className="text-sm text-gray-400 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur. Amet in dictum odio magna
              ut feugiat.
            </p>
          </div>
        </div>

        {/* Center Image */}
        <div className="relative w-full md:w-auto flex justify-center">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-blue-600/30 blur-3xl scale-75 md:scale-100" />
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80"
            alt="Fashion model"
            className="relative z-10 w-56 sm:w-72 md:w-80 lg:w-96 object-cover rounded-2xl shadow-2xl"
          />
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-4 md:max-w-[20%] text-sm text-gray-400 md:text-right">
          <span className="text-blue-300 font-semibold text-xs uppercase tracking-widest">
            #Fashion
          </span>
          <p className="leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Amet in dictum odio magna ut
            feugiat.
          </p>
        </div>
      </div>

      {/* Mobile secondary text */}
      <div className="md:hidden px-6 pb-12 space-y-3">
        <p className="text-sm text-gray-400 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur. Amet in dictum odio magna ut
          feugiat.
        </p>
        <p className="text-sm text-gray-400 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur. Amet in dictum odio magna ut
          feugiat.
        </p>
      </div>
    </section>
  );
}
