// Home.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [isHoveredMateri, setIsHoveredMateri] = useState(false);

  return (
    <>
      {/* Custom CSS untuk animasi */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Poppins:wght@400;600;700&display=swap');
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(45deg); }
          50% { transform: translateX(200%) rotate(45deg); }
          100% { transform: translateX(-100%) rotate(45deg); }
        }
        
        @keyframes bounce-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-bounce-gentle {
          animation: bounce-gentle 2s ease-in-out infinite;
        }
      `}</style>
      
      <div className="relative min-h-screen w-full overflow-hidden">
        <img
          src="/fix.png"
          alt="Educational forest background"
          className="absolute inset-0 h-full w-full object-cover"
        />
        
        {/* Overlay gradien untuk efek depth */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, rgba(16,185,129,0.05) 50%, rgba(0,0,0,0.1) 100%)"
          }}
        />
        
        {/* Main content container - menggunakan grid untuk layout yang lebih clean */}
        <div className="relative z-10 grid min-h-screen grid-rows-[1fr_auto_1fr] items-center p-4 sm:p-6">
          
          {/* Empty space atas */}
          <div></div>

          {/* Title - di tengah vertikal dengan gaya yang lebih menarik */}
          <header className="text-center">
            <h1
              className="relative text-6xl font-black tracking-wider sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem]"
              style={{
                fontFamily: "'Fredoka One', 'Comic Sans MS', cursive",
                filter: "drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.4))"
              }}
            >
              <span className="relative">
                <span 
                  className="text-emerald-600"
                  style={{
                    textShadow: "0 0 20px rgba(16, 185, 129, 0.5), 2px 2px 4px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  STEM
                </span>
                <span 
                  className="text-orange-500"
                  style={{
                    textShadow: "0 0 20px rgba(249, 115, 22, 0.5), 2px 2px 4px rgba(0, 0, 0, 0.3)"
                  }}
                >
                  ation
                </span>
              </span>
            </h1>
            
            {/* Subtitle kecil */}
            <p 
              className="mt-2 text-sm font-semibold text-emerald-700 sm:text-base md:text-lg opacity-90"
              style={{ 
                fontFamily: "'Poppins', sans-serif",
                textShadow: "1px 1px 2px rgba(255, 255, 255, 0.8)"
              }}
            >
              ✨ Learn • Explore • Discover ✨
            </p>
          </header>

          {/* Button Menu - di bagian bawah dengan styling yang lebih menarik */}
          <div className="flex justify-center pb-8 sm:pb-12 md:pb-16">
            <div
              className="transform transition-all duration-300 ease-out"
              style={{
                transform: isHoveredMateri 
                  ? "translateY(-8px) scale(1.05)" 
                  : "translateY(0) scale(1)",
              }}
              onMouseEnter={() => setIsHoveredMateri(true)}
              onMouseLeave={() => setIsHoveredMateri(false)}
            >
              <button
                onClick={() => navigate("/menu")}
                className="relative h-12 w-40 overflow-hidden rounded-2xl border-4 font-bold text-white shadow-2xl transition-all duration-300 sm:h-14 sm:w-44 sm:text-xl md:h-16 md:w-48 md:text-xl"
                style={{
                  fontFamily: "'Fredoka One', 'Comic Sans MS', cursive",
                  background: isHoveredMateri 
                    ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 25%, #1d4ed8 50%, #1e40af 75%, #1e3a8a 100%)"
                    : "linear-gradient(135deg, #60a5fa 0%, #3b82f6 25%, #2563eb 50%, #1d4ed8 75%, #1e40af 100%)",
                  border: isHoveredMateri 
                    ? "4px solid #93c5fd" 
                    : "4px solid #bfdbfe",
                  boxShadow: isHoveredMateri
                    ? "0 20px 40px rgba(59, 130, 246, 0.4), 0 0 20px rgba(147, 197, 253, 0.3)"
                    : "0 10px 25px rgba(59, 130, 246, 0.3)"
                }}
              >
                <span className="relative z-10">
                  🚀 MENU 🎯
                </span>
                
                {/* Efek kilau pada button - juga dihilangkan */}
                <div 
                  className="absolute inset-0 opacity-0"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}