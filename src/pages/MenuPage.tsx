import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MenuPage = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState<string>("");

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const menuItems = [
    { path: "/pretest", label: "Pretest", icon: "📝", color: "from-blue-400 to-blue-600" },
    { path: "/materi", label: "Materi", icon: "📚", color: "from-green-400 to-green-600" },
    { path: "/posttest", label: "Posttest", icon: "✅", color: "from-purple-400 to-purple-600" },
    { path: "/refleksi", label: "Refleksi Siswa - Siswi", icon: "💭", color: "from-pink-400 to-pink-600" },
    // { path: "/proyek", label: "Proyek Kelompok", icon: "🤝", color: "from-orange-400 to-orange-600" }
  ];

  return (
    <>
      {/* Custom CSS untuk font dan animasi */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Poppins:wght@400;600;700;800&display=swap');
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.4); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <div
        className="min-h-screen w-full bg-cover bg-center flex items-center justify-center relative"
        style={{ backgroundImage: "url('/menu.png')" }}
      >
        {/* Overlay untuk depth - dibuat lebih transparan */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10" />
        
        {/* Container utama di tengah */}
        <div className="relative z-10 flex flex-col items-center space-y-8 p-6 w-full max-w-2xl">
          
          {/* Header dengan animasi float */}
          <div className="animate-float bg-gradient-to-r from-yellow-200 via-amber-100 to-yellow-200 px-12 py-8 rounded-3xl shadow-2xl border-4 border-amber-300">
            <h1 
              className="text-7xl font-black text-amber-800 text-center"
              style={{ 
                fontFamily: "'Fredoka One', cursive",
                textShadow: "3px 3px 0px rgba(0,0,0,0.1)"
              }}
            >
              🎯 Menu 🎯
            </h1>
          </div>

          {/* Menu buttons */}
          <div className="space-y-6 w-full">
            {menuItems.map((item, index) => (
              <div
                key={item.path}
                className="transform transition-all duration-300 ease-out"
                style={{
                  transform: hoveredButton === item.path 
                    ? "translateY(-8px) scale(1.03)" 
                    : "translateY(0) scale(1)",
                  animationDelay: `${index * 100}ms`
                }}
                onMouseEnter={() => setHoveredButton(item.path)}
                onMouseLeave={() => setHoveredButton("")}
              >
                <button
                  onClick={() => handleNavigate(item.path)}
                  className="w-full relative overflow-hidden rounded-2xl font-bold text-white transition-all duration-300 shadow-xl border-4 border-white/30"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    background: hoveredButton === item.path
                      ? `linear-gradient(135deg, ${item.color.split(' ')[0].replace('from-', '')} 0%, ${item.color.split(' ')[1].replace('to-', '')} 100%)`
                      : `linear-gradient(135deg, rgba(253, 240, 213, 0.95) 0%, rgba(254, 243, 199, 0.95) 100%)`,
                    color: hoveredButton === item.path ? 'white' : '#374151',
                    boxShadow: hoveredButton === item.path
                      ? "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 255, 255, 0.2)"
                      : "0 10px 25px rgba(0, 0, 0, 0.15)",
                    minHeight: "70px"
                  }}
                >
                  <div className="flex items-center justify-center space-x-4 px-8 py-5">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-xl font-bold tracking-wide">
                      {item.label}
                    </span>
                  </div>
                  
                  {/* Efek highlight saat hover */}
                  <div 
                    className="absolute inset-0 opacity-0 transition-opacity duration-300"
                    style={{
                      background: hoveredButton === item.path
                        ? "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 50%, transparent 70%)"
                        : "none",
                      opacity: hoveredButton === item.path ? 1 : 0
                    }}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Back button */}
          <button
            onClick={() => navigate("/")}
            className="mt-8 bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>
    </>
  );
};

export default MenuPage;