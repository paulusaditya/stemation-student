import { useState } from "react";

const Materi = () => {
  const [hoveredButton, setHoveredButton] = useState<string>("");

  const handleMateriClick = (materi: string) => {
    window.location.href = `/materi/${materi}`;
  };

  const handleBackClick = () => {
    window.location.href = '/menu';
  };

  const materiItems = [
    { 
      id: 'suhu', 
      title: 'SUHU', 
      icon: '🌡️', 
      gradient: 'from-red-300 via-orange-300 to-yellow-300',
      description: 'Pelajari konsep suhu dan pengukurannya'
    },
    { 
      id: 'kalor', 
      title: 'KALOR', 
      icon: '🔥', 
      gradient: 'from-orange-400 via-red-400 to-pink-400',
      description: 'Memahami perpindahan energi panas'
    },
    { 
      id: 'pemuaian', 
      title: 'PEMUAIAN', 
      icon: '🎈', 
      gradient: 'from-blue-300 via-cyan-300 to-teal-300',
      description: 'Eksplorasi perubahan ukuran benda'
    }
  ];

  return (
    <>
      {/* Custom CSS untuk font dan animasi */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Poppins:wght@400;600;700;800&display=swap');
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes pulse-border {
          0%, 100% { border-color: rgba(255, 255, 255, 0.6); }
          50% { border-color: rgba(255, 255, 255, 1); }
        }
        
        .animate-float-gentle {
          animation: float-gentle 4s ease-in-out infinite;
        }
        
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>

      <div
        className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
        style={{
          backgroundImage: "url('/materi.png')",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Overlay gradien untuk readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20" />
        
        {/* Container utama */}
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="animate-float-gentle bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 inline-block px-8 py-6 rounded-3xl shadow-2xl border-4 border-amber-300 mb-6">
              <h1 
                className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-800"
                style={{ 
                  fontFamily: "'Fredoka One', cursive",
                  textShadow: "2px 2px 0px rgba(0,0,0,0.1)"
                }}
              >
                📚 Materi 📚
              </h1>
            </div>
            <p 
              className="text-base sm:text-lg md:text-xl text-gray-700 font-semibold bg-white/80 inline-block px-6 py-3 rounded-full shadow-lg"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              ✨ Pilih topik yang ingin dipelajari ✨
            </p>
          </div>

          {/* Grid Layout - Responsif untuk semua ukuran */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {materiItems.map((item, index) => (
              <div
                key={item.id}
                className={`relative ${index === 2 ? 'md:col-span-2 lg:col-span-1 md:mx-auto lg:mx-0' : ''}`}
                style={{
                  transform: hoveredButton === item.id 
                    ? "translateY(-12px) scale(1.05)" 
                    : "translateY(0) scale(1)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  animationDelay: `${index * 150}ms`
                }}
                onMouseEnter={() => setHoveredButton(item.id)}
                onMouseLeave={() => setHoveredButton("")}
              >
                <button
                  onClick={() => handleMateriClick(item.id)}
                  className={`w-full h-56 sm:h-64 bg-gradient-to-br ${item.gradient} rounded-3xl shadow-xl hover:shadow-2xl border-4 border-white/60 relative overflow-hidden group transition-all duration-300 ${
                    hoveredButton === item.id ? 'animate-pulse-border' : ''
                  }`}
                  style={{
                    maxWidth: index === 2 ? '400px' : 'none',
                    boxShadow: hoveredButton === item.id
                      ? "0 25px 50px rgba(0, 0, 0, 0.25), 0 0 30px rgba(255, 255, 255, 0.3)"
                      : "0 15px 35px rgba(0, 0, 0, 0.15)"
                  }}
                >
                  {/* Overlay efek hover */}
                  <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-all duration-300" />
                  
                  {/* Efek cahaya saat hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)"
                    }}
                  />
                  
                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                    <div className="text-5xl sm:text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h2 
                      className="text-xl sm:text-2xl md:text-3xl font-black text-gray-800 tracking-wide mb-2"
                      style={{ fontFamily: "'Fredoka One', cursive" }}
                    >
                      {item.title}
                    </h2>
                    <p 
                      className="text-sm sm:text-base text-gray-700 font-medium px-2"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Border glow effect */}
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      border: "2px solid rgba(255, 255, 255, 0.8)",
                      background: "transparent"
                    }}
                  />
                </button>
              </div>
            ))}
          </div>

          {/* Back Button */}
          <div className="text-center">
            <button
              onClick={handleBackClick}
              className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-sm sm:text-base"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              ← Kembali ke Menu
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Materi;