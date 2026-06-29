import { useEffect, useState } from "react";

// Replace this with your actual image import:
// import EdenPhoto from "./assets/eden.png";

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-[#0d2b27] px-8 py-4 flex items-center justify-between">
        <div
          className="text-[#00e676] text-3xl font-bold"
          style={{ fontFamily: "'UnifrakturMaguntia', cursive" }}
        >
          E
        </div>
        <ul className="flex gap-10 text-white text-base font-light tracking-wide">
          {["Home", "Projects", "About", "Contact"].map((item) => (
            <li
              key={item}
              className="cursor-pointer hover:text-[#00e676] transition-colors duration-200"
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero */}
      <div className="flex-1 relative flex items-center px-16 overflow-hidden">
        {/* Left: Headline + CTA */}
        <div
          className={`z-10 transition-all duration-700 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <h1
            className="text-white text-6xl font-bold leading-tight mb-12 select-none"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            Hey There,
            <br />
            I'm <span className="text-[#00e676]">Eden</span>
          </h1>
          <a
            href="#resume"
            className="inline-block bg-[#00e676] text-black text-sm font-bold px-8 py-3 rounded-full hover:brightness-110 active:scale-95 transition-all duration-150"
          >
            Resume
          </a>
        </div>

        {/* Center: Blob + Photo */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center transition-all duration-700 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: "250ms" }}
        >
          <div className="relative flex items-end justify-center">
            {/* Teal blob */}
            <svg
              viewBox="0 0 420 320"
              className="absolute bottom-0 w-105 h-80"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M210,310 C100,310 30,240 20,160 C10,80 80,10 160,20 C185,23 200,40 210,40 C220,40 235,23 260,20 C340,10 410,80 400,160 C390,240 320,310 210,310Z"
                fill="#0d4a40"
              />
            </svg>
            <img
              alt="Eden"
              className="relative z-10 w-72 object-cover object-top"
              style={{ maxHeight: "400px" }}
            />
          </div>
        </div>

        {/* Right: Bio + Email */}
        <div
          className={`ml-auto z-10 text-right transition-all duration-700 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <p
            className="text-gray-400 text-lg leading-relaxed mb-40"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            I'm a UX/UI Designer
            <br />
            and Front-End Developer
            <br />
            based in Ethiopia
          </p>
          <p
            className="text-gray-400 text-base"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            edengebeta210@gmail.com
          </p>
        </div>
      </div>

      {/* Font loader — move this <link> to your index.html in production */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;700&family=UnifrakturMaguntia&display=swap');
      `}</style>
    </div>
  );
}
