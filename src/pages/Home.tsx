import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredMateri, setIsHoveredMateri] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [absentNumber, setAbsentNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ name: "", absentNumber: "" });

  const handleStartClick = () => setShowForm(true);

  const validateForm = () => {
    const newErrors = { name: "", absentNumber: "" };
    let ok = true;

    if (!name.trim()) {
      newErrors.name = "Nama harus diisi";
      ok = false;
    }

    if (!absentNumber.trim()) {
      newErrors.absentNumber = "Nomor absen harus diisi";
      ok = false;
    } else if (!/^\d+$/.test(absentNumber)) {
      newErrors.absentNumber = "Nomor absen harus berupa angka";
      ok = false;
    }

    setErrors(newErrors);
    return ok;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      localStorage.setItem("userName", name);
      localStorage.setItem("userAbsentNumber", absentNumber);
      navigate("/quiz");
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src="/1fix.png"
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

        {showForm ? (
          <div className="mb-24 w-full max-w-md rounded-lg bg-white/90 p-6 shadow-xl backdrop-blur-sm">
            <h2 className="mb-4 text-center text-2xl text-green-800">
              Masukkan Identitas
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <span className="block text-lg font-medium">Nama</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className={`w-full rounded-md border p-3 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="mb-6">
                <span className="block text-lg font-medium">Nomor Absen</span>
                <input
                  value={absentNumber}
                  onChange={(e) => setAbsentNumber(e.target.value)}
                  placeholder="Masukkan nomor absen"
                  className={`w-full rounded-md border p-3 ${
                    errors.absentNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.absentNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.absentNumber}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Memproses…" : "Mulai Quiz"}
              </button>
            </form>
            {/* Tombol batal/kembali */}
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="mt-4 w-full rounded-md border border-gray-400 bg-gray-100 py-3 font-semibold text-gray-700 hover:bg-gray-200"
            >
              Batal
            </button>
          </div>
        ) : (
          <>
            {/* Tombol MULAI */}
            <div
              className="mb-4 transform transition-transform duration-300"
              style={{
                transform: isHovered ? "translateY(-5px)" : "translateY(0)",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <button
                onClick={handleStartClick}
                className="h-16 w-48 rounded-xl border-2 border-amber-400 bg-amber-300 text-xl font-bold text-green-900 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-amber-400"
              >
                MULAI
              </button>
            </div>

            {/* Dropdown MATERI */}
            <div className="relative mb-40">
              <div
                onMouseEnter={() => setIsHoveredMateri(true)}
                onMouseLeave={() => setIsHoveredMateri(false)}
                className="relative inline-block text-left"
              >
                <button className="h-16 w-48 rounded-xl border-2 border-blue-400 bg-blue-300 text-xl font-bold text-green-900 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-blue-400">
                  MATERI
                </button>

                {isHoveredMateri && (
                  <div className="absolute left-0 mt-2 w-48 rounded-md border border-blue-200 bg-white shadow-lg z-50">
                    <button
                      onClick={() => navigate("/materi/1")}
                      className="block w-full px-4 py-2 text-left text-green-800 hover:bg-blue-100"
                    >
                      Materi 1 : Suhu
                    </button>
                    <button
                      onClick={() => navigate("/materi/2")}
                      className="block w-full px-4 py-2 text-left text-green-800 hover:bg-blue-100"
                    >
                      Materi 2 : Kalor
                    </button>
                    <button
                      onClick={() => navigate("/materi/3")}
                      className="block w-full px-4 py-2 text-left text-green-800 hover:bg-blue-100"
                    >
                      Materi 3 : Pemuaian
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
