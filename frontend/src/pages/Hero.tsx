import { useState } from "react";
import { Link } from "react-router-dom";
import heroimage2 from "../assets/heroImg2.jpg";
// const navLinks = ["Home", "About", "Courses", "Contact"];
import { useNavigate } from "react-router-dom";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

export default function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (res: CredentialResponse) => {
    if (!res.credential) {
      console.error("No credential returned from Google");
      return;
    }

    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ credential: res.credential }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        console.error(
          "Google login failed:",
          data?.message || response.statusText,
        );
        return;
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
    }

  }

  return (
    <section className="min-h-screen bg-[#d0cac3]  text-white font-sans overflow-hidden">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 shadow-sm">
        <div className="text-xl font-bold tracking-tight">
          <span className="text-[#661218]">Closet</span>
          <span className="text-[#661218]">Match</span>
        </div>

        <div className="flex justify-center mt-6">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.error("Google login failed")}
          theme="filled_black"
          shape="pill"
          text="continue_with"

        />
      </div>
      </nav>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-6 py-4 flex flex-col justify-end gap-4 text-sm text-gray-200">
          <Link to="/signup" className="ml-auto">
            <button className="mt-2 bg-[#661218] ml-auto hover:bg-blue-400 transition-colors text-white text-sm font-medium px-5 py-2 rounded-full w-fit">
              Sign Up
            </button>
          </Link>
          <Link to="/login" className="ml-auto">
            <button className="mt-2 border-2 border-[#661218] ml-auto hover:bg-blue-400 transition-colors text-[#661218] text-sm font-bold px-5 py-2 rounded-full w-fit">
              Log In
            </button>
          </Link>
        </div>
      )}

      {/* Hero Content */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-2  pt-8 md:pt-50 pb-16 gap-16 max-w-7xl mx-auto">
        {/* Left Side */}
        <div className="flex flex-col gap-6 md:px-1 md:max-w-[34%] z-10">
          {/* Avatars + tag */}
          <div className="flex items-center gap-3">
            {/* <div className="flex -space-x-2">
              {["🧑", "👩", "🧔"].map((emoji, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-base border-2 border-[#0a0a2e]"
                >
                  {emoji}
                </div>
              ))}
            </div> */}
            <span className="text-xs text-[#200705] font-medium hidden md:block">
              #Fashion
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-4xl font-bold leading-tight text-[#661218]">
            <span className="text-[#661218] text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
              Dress Smarter
            </span>{" "}
            with Your Own Closet
            {/* <span className="text-purple-400">Match</span> */}
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#200705] leading-relaxed max-w-sm">
            ClosetMatch uses helps you discover outfit combinations from the
            clothes you already own. Organize your wardrobe, create stylish
            looks, and never wonder what to wear again.
          </p>
        </div>

        {/* Center Image */}
        <div className="relative md:w-auto flex justify-center bg-transparent">
          {/* Glow effect */}
          <div className="relative flex justify-center" />
          <img
            src={heroimage2}
            alt="Fashion model"
            className="relative z-10 w-72 sm:w-96 md:w-[28rem] lg:w-[34rem] md:scale-138 xl:w-[38rem] object-cover"
          />
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-4 md:px-3 md:max-w-[30%] text-sm text-[#200705] ">
          <p className="leading-relaxed">
            Upload your wardrobe, let AI find matching combinations, and build
            outfits tailored to your style all in seconds.
          </p>
        </div>
      </div>
    </section>
  );
}
