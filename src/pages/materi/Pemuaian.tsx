import { useState } from "react";

const Pemuaian = () => {
  // Array berisi path gambar slide materi pemuaian
  const slides = Array.from({ length: 9 }, (_, i) => `/pemuaian/${i + 100}.png`);

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      window.location.href = "/materi"; // kembali ke halaman materi setelah selesai
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleMenuClick = () => {
    window.location.href = "/menu";
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image - Full Screen */}
      <div
        className="absolute inset-0 bg-no-repeat bg-center"
        style={{
          backgroundImage: `url('${slides[currentSlide]}')`,
          backgroundSize: "contain"
        }}
      />

      {/* Overlay untuk kontrol */}
      <div className="relative z-10 h-screen flex flex-col">
        {/* Header dengan Menu Button */}
        <div className="flex justify-between items-center p-6">
          <button
            onClick={handleMenuClick}
            className="px-6 py-3 bg-white bg-opacity-90 text-gray-800 rounded-full hover:bg-opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
          >
            🏠 Menu
          </button>

          {/* Slide Counter */}
          <div className="px-4 py-2 bg-white bg-opacity-90 rounded-full text-gray-800 font-semibold">
            {currentSlide + 1} / {slides.length}
          </div>
        </div>

        {/* Navigation Controls - Bottom */}
        <div className="flex-1 flex items-end justify-between p-6">
          <button
            onClick={handlePrevious}
            disabled={currentSlide === 0}
            className={`px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 ${
              currentSlide === 0
                ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                : "bg-blue-500 text-white hover:bg-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            ← Previous
          </button>

          <button
            onClick={handleNext}
            className="px-8 py-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
          >
            {currentSlide === slides.length - 1 ? "Selesai" : "Next →"}
          </button>
        </div>
      </div>

      {/* Touch/Swipe Area */}
      <div className="absolute inset-0 z-5 flex">
        <div className="w-1/3 h-full cursor-pointer" onClick={handlePrevious} />
        <div className="w-1/3 h-full" />
        <div className="w-1/3 h-full cursor-pointer" onClick={handleNext} />
      </div>
    </div>
  );
};

export default Pemuaian;
