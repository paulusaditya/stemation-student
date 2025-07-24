// Home.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [isHoveredMateri, setIsHoveredMateri] = useState(false);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src="/fix.png"
        alt="Educational forest background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-between p-6">
        <header className="pt-8 text-center">
          <h1
            className="text-5xl font-bold text-green-900 drop-shadow-lg md:text-6xl lg:text-7xl"
            style={{ textShadow: "2px 2px 4px rgba(255,255,255,.7)" }}
          >
            STEMation
          </h1>
        </header>

        <div className="flex-grow" />

        {/* Button Menu */}
        <div
          className="mb-24 transform transition-transform duration-300"
          style={{
            transform: isHoveredMateri ? "translateY(-5px)" : "translateY(0)",
          }}
          onMouseEnter={() => setIsHoveredMateri(true)}
          onMouseLeave={() => setIsHoveredMateri(false)}
        >
          <button
            onClick={() => navigate("/menu")}
            className="h-16 w-48 rounded-xl border-2 border-blue-400 bg-blue-300 text-xl font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-400"
          >
            MENU
          </button>
        </div>
      </div>
    </div>
  );
}
