const Materi = () => {
  const handleMateriClick = (materi: string) => {
    window.location.href = `/materi/${materi}`;
  };

  const handleBackClick = () => {
    window.location.href = '/menu';
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-6"
      style={{
        backgroundImage: "url('/materi.png')",
        backgroundAttachment: "fixed", // ❗Background tetap
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">Materi</h1>
          <p className="text-lg text-gray-600">Pilih topik yang ingin dipelajari</p>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 gap-x-100 gap-y-35 max-w-7xl mx-auto">
          {/* Suhu */}
          <div className="relative">
            <button
              onClick={() => handleMateriClick('suhu')}
              className="w-full h-48 bg-gradient-to-br from-green-200 to-cyan-200 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
                <div className="text-6xl mb-4">🌡️</div>
                <h2 className="text-2xl font-bold text-gray-800 tracking-wide">SUHU</h2>
              </div>
            </button>
          </div>

          {/* Kalor */}
          <div className="relative">
            <button
              onClick={() => handleMateriClick('kalor')}
              className="w-full h-48 bg-gradient-to-br from-blue-300 to-purple-300 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
                <div className="text-6xl mb-4">🔥</div>
                <h2 className="text-2xl font-bold text-gray-800 tracking-wide">KALOR</h2>
              </div>
            </button>
          </div>

          {/* Pemuaian */}
          <div className="relative">
            <button
              onClick={() => handleMateriClick('pemuaian')}
              className="w-full h-48 bg-gradient-to-br from-green-300 to-teal-300 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
                <div className="text-6xl mb-4">🎈</div>
                <h2 className="text-2xl font-bold text-gray-800 tracking-wide">PEMUAIAN</h2>
              </div>
            </button>
          </div>

          {/* Energi */}
          <div className="relative">
            <button
              onClick={() => handleMateriClick('energi')}
              className="w-full h-48 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-3xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-4 border-white relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-6">
                <div className="text-6xl mb-4">⚡</div>
                <h2 className="text-2xl font-bold text-gray-800 tracking-wide">ENERGI</h2>
              </div>
            </button>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mt-12">
          <button
            onClick={handleBackClick}
            className="px-8 py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            ← Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default Materi;
