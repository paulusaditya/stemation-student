import { useState, useEffect, useRef } from "react";

// Mock questions data structure (replace with your actual questions import)
const mockQuestions = [
  {
    id: 1,
    session: "posttest" as const,
    question: "Termometer apa yang paling cocok digunakan untuk mengukur suhu di tempat yang sangat dingin, seperti di kutub?",
    options: [
      { id: "a", text: "Termometer Klinis" },
      { id: "b", text: "Termometer Raksa" },
      { id: "c", text: "Termometer Alkohol" },
      { id: "d", text: "Termometer Digital" }
    ],
    correct: "c"
  },
  {
    id: 2,
    session: "posttest" as const,
    question: "Suhu air mendidih adalah 100°C. Jika diukur dengan termometer Fahrenheit, berapa suhu itu?",
    options: [
      { id: "a", text: "180° F" },
      { id: "b", text: "200° F" },
      { id: "c", text: "212° F" },
      { id: "d", text: "250° F" }
    ],
    correct: "c"
  },
  {
    id: 3,
    session: "posttest" as const,
    question: "Sebuah benda menyerap kalor sebanyak 8.400 Joule. Massa benda 0,5 kg dan kalor jenisnya 420 J/kg°C. Berapa kenaikan suhu benda tersebut?",
    options: [
      { id: "a", text: "10° C" },
      { id: "b", text: "20° C" },
      { id: "c", text: "30° C" },
      { id: "d", text: "40° C" }
    ],
    correct: "d"
  },
  {
    id: 4,
    session: "posttest" as const,
    question: "Seorang siswa memanaskan logam dan mencatat bahwa panjangnya bertambah 1,5 cm. Tapi menurut perhitungan, seharusnya hanya bertambah 1,0 cm. Apa yang sebaiknya dilakukan?",
    options: [
      { id: "a", text: "Mengganti Logam yang digunakan" },
      { id: "b", text: "Menyesuaikan hasil supaya sesuai " },
      { id: "c", text: "Mengecek kembali data dan perhitungannya" },
      { id: "d", text: "Mengabaikan karena selisihnya kecil" }
    ],
    correct: "c"
  },
  {
    id: 5,
    session: "posttest" as const,
    question: "Saat membuat laporan percobaan mengukur suhu air, apa yang sebaiknya ditulis lebih dulu?",
    options: [
      { id: "a", text: "Grafik Hasil Pengamatan" },
      { id: "b", text: "Kesimpulan Akhir" },
      { id: "c", text: "Tujuan percobaan" },
      { id: "d", text: "Tabel suhu" }
    ],
    correct: "c"
  },
  {
    id: 6,
    session: "posttest" as const,
    question: "Kamu menghitung hasil pemuaian panjang logam dan hasilnya salah. Apa yang harus kamu lakukan?",
    options: [
      { id: "a", text: "Dibiarkan saja karena perbedaannya kecil" },
      { id: "b", text: "Menyalin jawaban teman" },
      { id: "c", text: "Mengecek kembali rumus dan langkah perhitungan" },
      { id: "d", text: "Mengulang semua percobaan dari awal" }
    ],
    correct: "c"
  }
];

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: number;
  session: "pretest" | "materi1" | "materi2" | "materi3" | "posttest";
  question: string;
  options: Option[];
  correct: string;
}

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export default function PosttestPage() {
  // Form states
  const [showForm, setShowForm] = useState(true);
  const [username, setUsername] = useState("");
  const [absentNumber, setAbsentNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    username: "",
    absentNumber: ""
  });

  // Quiz states
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes for pretest
  const [questions, setQuestions] = useState<Question[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Debug states
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  const addDebugInfo = (info: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => [...prev, `[${timestamp}] ${info}`]);
    console.log(`[DEBUG ${timestamp}] ${info}`);
  };

  const validateForm = () => {
    const newErrors = {
      username: "",
      absentNumber: ""
    };
    
    if (!username.trim()) {
      newErrors.username = "Username harus diisi";
    } else if (username.trim().length < 2) {
      newErrors.username = "Username minimal 2 karakter";
    }
    
    if (!absentNumber.trim()) {
      newErrors.absentNumber = "Nomor absen harus diisi";
    } else if (!/^\d+$/.test(absentNumber.trim())) {
      newErrors.absentNumber = "Nomor absen harus berupa angka";
    } else if (parseInt(absentNumber) < 1 || parseInt(absentNumber) > 50) {
      newErrors.absentNumber = "Nomor absen harus antara 1-50";
    }
    
    setFormErrors(newErrors);
    return !newErrors.username && !newErrors.absentNumber;
  };

  const startQuiz = async () => {
    if (validateForm()) {
      setIsLoading(true);
      addDebugInfo("Memulai quiz...");
      
      try {
        // PERBAIKAN: Hanya kirim data yang sesuai dengan database schema
        const startPayload = {
          nama: username.trim(),
          absen: Number(absentNumber.trim()),
          score: 0  // Skor awal
        };
        
        addDebugInfo(`Mengirim data awal: ${JSON.stringify(startPayload)}`);
        
        const response = await fetch("https://stemation-backend.vercel.app/api/results", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json" 
          },
          body: JSON.stringify(startPayload),
        });

        addDebugInfo(`Response status: ${response.status} - ${response.statusText}`);
        
        if (!response.ok) {
          const errorText = await response.text();
          addDebugInfo(`Error response: ${errorText}`);
        } else {
          const responseData = await response.json();
          addDebugInfo(`Success response: ${JSON.stringify(responseData)}`);
        }

        // Initialize quiz
        const shuffledQuestions = shuffleArray([...mockQuestions]).map(q => ({
          ...q,
          options: shuffleArray(q.options),
        }));
        
        setQuestions(shuffledQuestions);
        setShowForm(false);
        addDebugInfo("Quiz dimulai, timer diaktifkan");
        
        // Start timer
        timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              handleFinish();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
      } catch (error) {
        addDebugInfo(`Network error: ${error}`);
        console.error("❌ Network error:", error);
        
        // Still start quiz even if backend fails
        const shuffledQuestions = shuffleArray([...mockQuestions]).map(q => ({
          ...q,
          options: shuffleArray(q.options),
        }));
        
        setQuestions(shuffledQuestions);
        setShowForm(false);
        
        // Start timer
        timerRef.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              handleFinish();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const submitQuizResult = async (percentage: number) => {
    try {
      // PERBAIKAN: Gunakan PUT/PATCH untuk update, bukan POST baru
      const updatePayload = {
        nama: username.trim(),
        absen: Number(absentNumber.trim()),
        score: percentage,
      };
      
      addDebugInfo(`Mengirim hasil akhir: ${JSON.stringify(updatePayload)}`);
      
      const response = await fetch("https://stemation-backend.vercel.app/api/results", {
        method: "POST", // Mungkin perlu diubah ke PUT atau PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });
      
      addDebugInfo(`Final submit status: ${response.status} - ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        addDebugInfo(`Final result saved: ${JSON.stringify(data)}`);
        console.log("✅ Hasil tersimpan:", data);
      } else {
        const errorText = await response.text();
        addDebugInfo(`Final submit error: ${errorText}`);
      }
    } catch (err) {
      addDebugInfo(`Final submit network error: ${err}`);
      console.error("❌ Gagal menyimpan hasil:", err);
    }
  };

  const handleFinish = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const correctAnswers = Object.entries(answers).filter(
      ([idx, val]) => val === questions[Number(idx)].correct
    );
    const finalScore = correctAnswers.length;
    const percentage = Math.round((finalScore / questions.length) * 100);
    
    addDebugInfo(`Quiz selesai. Skor: ${finalScore}/${questions.length} (${percentage}%)`);
    
    setScore(finalScore);
    setShowResult(true);
    submitQuizResult(percentage);
  };

  const formatTime = (seconds: number) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setSelected(answers[current + 1] || "");
    } else {
      handleFinish();
    }
  };

  const previousQuestion = () => {
    if (current > 0) {
      setCurrent(current - 1);
      setSelected(answers[current - 1] || "");
    }
  };

  const selectAnswer = (value: string) => {
    setSelected(value);
    setAnswers(prev => ({ ...prev, [current]: value }));
  };

  const goToQuestion = (index: number) => {
    setCurrent(index);
    setSelected(answers[index] || "");
  };

  const restartQuiz = () => {
    setCurrent(0);
    setSelected("");
    setAnswers({});
    setScore(0);
    setShowResult(false);
    setShowForm(true);
    setTimeLeft(600);
    setUsername("");
    setAbsentNumber("");
    setDebugInfo([]);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!showForm && !showResult) {
      setSelected(answers[current] || "");
    }
  }, [current, answers, showForm, showResult]);

  const clearFormErrors = (field: string) => {
    if (formErrors[field as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  // Form Component
  if (showForm) {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <div className="relative z-20 pt-12 text-center">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-2xl mb-4">
            STEMation Quiz
          </h1>
          <h2 className="text-3xl font-bold text-yellow-300 drop-shadow-lg">
            📘 Posttest - Data Peserta
          </h2>
        </div>

        <div className="relative z-20 mx-auto mt-12 w-[500px] max-w-[90%]">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-white/30">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">👤</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Masukkan Data Anda
              </h3>
              <p className="text-gray-600">
                Silakan isi data di bawah ini untuk memulai Posttest
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    clearFormErrors("username");
                  }}
                  placeholder="Masukkan nama lengkap Anda"
                  className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-200 text-lg ${
                    formErrors.username 
                      ? "border-red-400 focus:border-red-500 bg-red-50" 
                      : "border-gray-300 focus:border-green-500 bg-white"
                  }`}
                />
                {formErrors.username && (
                  <p className="mt-2 text-sm text-red-600 flex items-center animate-pulse">
                    <span className="mr-2">⚠️</span>
                    {formErrors.username}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nomor Absen <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={absentNumber}
                  onChange={(e) => {
                    setAbsentNumber(e.target.value);
                    clearFormErrors("absentNumber");
                  }}
                  placeholder="Masukkan nomor absen (1-50)"
                  className={`w-full px-5 py-4 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-200 text-lg ${
                    formErrors.absentNumber 
                      ? "border-red-400 focus:border-red-500 bg-red-50" 
                      : "border-gray-300 focus:border-green-500 bg-white"
                  }`}
                />
                {formErrors.absentNumber && (
                  <p className="mt-2 text-sm text-red-600 flex items-center animate-pulse">
                    <span className="mr-2">⚠️</span>
                    {formErrors.absentNumber}
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => window.location.href = '/menu'}
                  className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-200 text-lg"
                >
                  ← Kembali ke Menu
                </button>
                <button
                  onClick={startQuiz}
                  disabled={isLoading}
                  className={`flex-1 px-6 py-4 rounded-xl text-white font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-200 shadow-lg transform text-lg ${
                    isLoading 
                      ? "bg-gray-400 cursor-not-allowed" 
                      : "bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 hover:scale-105"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Memulai...
                    </div>
                  ) : (
                    "Mulai Posttest →"
                  )}
                </button>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-start">
                <span className="text-blue-500 mr-3 mt-1 text-xl">ℹ️</span>
                <div>
                  <h4 className="text-base font-bold text-blue-800 mb-2">
                    Informasi Posttest
                  </h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>• Waktu pengerjaan: 10 menit</div>
                    <div>• Jumlah soal: 6 soal Posttest</div>
                    <div>• Data akan tersimpan otomatis setelah selesai</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Component
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
      <header className="relative z-20 mt-8 text-center">
        <h1 className="text-3xl font-extrabold text-white drop-shadow-2xl">STEMation Quiz</h1>
        <p className="mt-1 text-yellow-300 drop-shadow font-semibold">Nama: {username} | Absen: {absentNumber}</p>
        <p className="text-red-300 font-bold mt-1 text-xl">Waktu Tersisa: {formatTime(timeLeft)}</p>
      </header>

      <div className="relative z-20 mx-auto mt-4 w-[900px] max-w-[90%]">
        {/* Debug Panel */}
        {debugInfo.length > 0 && (
          <div className="mb-4 bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-semibold">🔍 Debug Info</h3>
              <button
                onClick={() => setDebugInfo([])}
                className="text-white/70 hover:text-white text-sm"
              >
                Clear
              </button>
            </div>
            <div className="max-h-32 overflow-y-auto text-xs text-white/80 space-y-1">
              {debugInfo.map((info, idx) => (
                <div key={idx} className="font-mono">{info}</div>
              ))}
            </div>
          </div>
        )}

        {/* Question Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={`w-8 h-8 rounded-full font-bold text-sm transition-all ${
                answers[index] ? "bg-green-500 text-white" : "bg-white text-gray-700"
              } ${index === current ? "ring-2 ring-yellow-400 scale-110" : ""}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <div className="h-[550px] w-full bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-8 border border-white/20">
            <div className="flex h-full w-full flex-col items-center justify-start">
              {showResult ? (
                <div className="w-full h-[550px] p-8 flex flex-col items-center justify-center text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
                    <h2 className="text-3xl font-bold text-white mb-4">🎉 Hasil Posttest</h2>
                    <p className="text-white mb-4 text-lg">Selamat! Anda telah menyelesaikan Posttest!</p>
                    <div className="text-6xl font-bold text-yellow-300 mb-4">
                      {score} / {questions.length}
                    </div>
                    <p className="text-2xl text-white mb-8">
                      Nilai: {Math.round((score / questions.length) * 100)}%
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button 
                        onClick={restartQuiz} 
                        className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl text-white font-semibold transition-all border border-white/30"
                      >
                        🔄 Ulangi posttest
                      </button>
                      <button 
                        onClick={() => window.location.href = '/menu'} 
                        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl text-white font-semibold transition-all"
                      >
                        🏠 Kembali ke Menu
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-[550px] p-8">
                  <h2 className="text-2xl font-medium text-white mb-2">
                    📘 posttest | Soal {current + 1} / {questions.length}
                  </h2>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 border border-white/20">
                    <p className="text-center text-white text-xl font-medium">
                      {questions[current]?.question}
                    </p>
                  </div>

                  <div className="space-y-3 mb-6">
                    {questions[current]?.options.map(option => (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-center rounded-xl border p-4 transition-all hover:scale-[1.02] ${
                          selected === option.id 
                            ? "border-green-300 bg-white/20 shadow-lg" 
                            : "border-white/30 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={option.id}
                          checked={selected === option.id}
                          onChange={(e) => selectAnswer(e.target.value)}
                          className="mr-4 h-5 w-5 accent-green-400"
                        />
                        <span className="text-white text-lg">{option.text}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={previousQuestion}
                      disabled={current === 0}
                      className="flex-1 rounded-xl bg-gray-300 py-3 text-gray-700 font-semibold hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      ← Sebelumnya
                    </button>
                    <button
                      onClick={nextQuestion}
                      disabled={!selected}
                      className="flex-1 rounded-xl bg-green-500 py-3 text-white font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {current === questions.length - 1 ? "Selesai ✓" : "Selanjutnya →"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}