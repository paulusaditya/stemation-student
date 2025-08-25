import { useState, useEffect, useRef } from "react";

// Mock questions data structure (replace with your actual questions import)
const mockQuestions = [
  {
    id: 1,
    session: "pretest" as const,
    question:
      "Ketika sendok logam dimasukkan ke dalam teh panas, bagian ujung sendok yang tidak terkena teh ikut menjadi panas. Hal ini menunjukkan bahwa perpindahan kalor terjadi melalui mekanisme:",
    options: [
      { id: "a", text: "Radiasi" },
      { id: "b", text: "Konveksi" },
      { id: "c", text: "Konduksi" },
      { id: "d", text: "Evaporasi" },
    ],
    correct: "c",
  },
  {
    id: 2,
    session: "pretest" as const,
    question:
      "Mengapa lantai keramik terasa lebih dingin dibandingkan karpet, padahal keduanya berada di ruangan yang bersuhu sama?",
    options: [
      { id: "a", text: "Karena keramik menyerap panas lebih sedikit" },
      { id: "b", text: "Karena keramik memantulkan panas dari tubuh" },
      {
        id: "c",
        text: "Karena keramik menghantarkan kalor lebih lambat dari karpet",
      },
      {
        id: "d",
        text: "Karena keramik menghantarkan kalor lebih cepat dari tubuh ke lantai",
      },
    ],
    correct: "d",
  },
  {
    id: 3,
    session: "pretest" as const,
    question:
      "Ketika sebuah balon berisi udara diletakkan di bawah sinar matahari, balon tersebut mengembang. Hal ini menunjukkan bahwa:",
    options: [
      { id: "a", text: "Udara menyusut ketika dipanaskan" },
      { id: "b", text: "Kenaikan suhu menyebabkan volume udara bertambah" },
      { id: "c", text: "Tekanan udara di dalam balon berkurang" },
      { id: "d", text: "Udara berubah menjadi zat cair" },
    ],
    correct: "b",
  },
  {
    id: 4,
    session: "pretest" as const,
    question:
      "Dua benda dengan massa sama dipanaskan oleh sumber panas yang sama. Benda A lebih cepat panas dibandingkan benda B. Hal ini terjadi karena:",
    options: [
      { id: "a", text: "Warna benda A lebih gelap" },
      { id: "b", text: "Permukaan benda A lebih besar" },
      {
        id: "c",
        text: "Jenis bahan memengaruhi laju kenaikan suhu karena kalor jenisnya berbeda",
      },
      { id: "d", text: "Letak benda A lebih dekat ke sumber panas" },
    ],
    correct: "c",
  },
  {
    id: 5,
    session: "pretest" as const,
    question:
      "Mengapa rel kereta api diberi celah sambungan logam, meskipun terlihat tidak rapi?",
    options: [
      { id: "a", text: "Agar rel terlihat simetris" },
      { id: "b", text: "Untuk memperindah tampilan rel" },
      { id: "c", text: "Agar rel tidak berkarat saat terkena hujan" },
      {
        id: "d",
        text: "Agar rel tidak melengkung saat logam memuai karena panas",
      },
    ],
    correct: "d",
  },
  {
    id: 6,
    session: "pretest" as const,
    question:
      "Mengapa es dalam termos bisa mencair meskipun termos digunakan untuk mempertahankan suhu?",
    options: [
      {
        id: "a",
        text: "Karena es mencair dengan sendirinya dalam waktu tertentu",
      },
      { id: "b", text: "Karena termos mengeluarkan dingin dari dalam" },
      {
        id: "c",
        text: "Karena kalor dari lingkungan tetap masuk meskipun lambat",
      },
      {
        id: "d",
        text: "Karena dingin di dalam termos keluar melalui celah tutup",
      },
    ],
    correct: "c",
  },
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

export default function PretestPage() {
  // Form states
  const [showForm, setShowForm] = useState(true);
  const [username, setUsername] = useState("");
  const [absentNumber, setAbsentNumber] = useState("");
  const [testType, setTestType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    username: "",
    absentNumber: "",
    testType: "",
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



  const validateForm = () => {
    const newErrors = {
      username: "",
      absentNumber: "",
      testType: "",
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

    if (!testType.trim()) {
      newErrors.testType = "Tipe test harus dipilih";
    }

    setFormErrors(newErrors);
    return (
      !newErrors.username && !newErrors.absentNumber && !newErrors.testType
    );
  };

  const startQuiz = async () => {
    if (validateForm()) {
      setIsLoading(true);

      try {
        const startPayload = {
          nama: username.trim(),
          absen: Number(absentNumber.trim()),
          test_type: testType.trim(),
          score: 0,
        };

        const response = await fetch(
          "https://stemation-backend.vercel.app/api/results",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(startPayload),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Server error:", errorText);
        }

        // Initialize quiz
        const shuffledQuestions = shuffleArray([...mockQuestions]).map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        }));

        setQuestions(shuffledQuestions);
        setShowForm(false);

        // Start timer
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              handleFinish();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (error) {
        console.error("❌ Network error:", error);

        // Still start quiz even if backend fails
        const shuffledQuestions = shuffleArray([...mockQuestions]).map((q) => ({
          ...q,
          options: shuffleArray(q.options),
        }));

        setQuestions(shuffledQuestions);
        setShowForm(false);

        // Start timer
        timerRef.current = setInterval(() => {
          setTimeLeft((prev) => {
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
      const updatePayload = {
        nama: username.trim(),
        absen: Number(absentNumber.trim()),
        test_type: testType.trim(),
        score: percentage,
      };

      const response = await fetch(
        "https://stemation-backend.vercel.app/api/results",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Hasil tersimpan:", data);
      } else {
        const errorText = await response.text();
        console.error("❌ Gagal menyimpan hasil:", errorText);
      }
    } catch (err) {
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
    setAnswers((prev) => ({ ...prev, [current]: value }));
  };

  const goToQuestion = (index: number) => {
    setCurrent(index);
    setSelected(answers[index] || "");
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
      setFormErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Form Component with Enhanced Colors
  if (showForm) {
    return (
      <div
        className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center"
        style={{ backgroundImage: "url('/1.png')" }}
      >
        <div className="w-full max-w-lg">
          <div className="text-center mb-8 animate-fade-in">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl animate-bounce">
                <span className="text-3xl">🧪</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-2xl mb-4 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              STEMation Quiz
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-cyan-200 drop-shadow-lg animate-pulse">
              ✨ Data Peserta ✨
            </h2>
          </div>

          <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border-2 border-white/40 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-r from-pink-300 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-r from-blue-300 to-cyan-400 rounded-full opacity-20 animate-pulse delay-300"></div>

            <div className="text-center mb-8 relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl animate-spin-slow">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                Masukkan Data Anda
              </h3>
              <p className="text-gray-600 text-sm">
                Silakan isi data di bawah ini untuk memulai quiz
              </p>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="group">
                <label className="block text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  🏷️ Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      clearFormErrors("username");
                    }}
                    placeholder="Masukkan nama lengkap Anda"
                    className={`w-full px-5 py-4 rounded-2xl border-3 transition-all duration-300 focus:outline-none focus:ring-4 text-lg font-medium bg-gradient-to-r ${
                      formErrors.username
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200 from-red-50 to-pink-50"
                        : "border-transparent bg-gradient-to-r from-blue-50 to-indigo-50 focus:from-blue-100 focus:to-indigo-100 focus:ring-blue-200 group-hover:from-blue-100 group-hover:to-indigo-100"
                    } shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-2xl">📝</span>
                  </div>
                </div>
                {formErrors.username && (
                  <p className="mt-2 text-sm text-red-600 flex items-center animate-bounce bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                    <span className="mr-2">⚠️</span>
                    {formErrors.username}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
                  🔢 Nomor Absen <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={absentNumber}
                    onChange={(e) => {
                      setAbsentNumber(e.target.value);
                      clearFormErrors("absentNumber");
                    }}
                    placeholder="Masukkan nomor absen (1-50)"
                    className={`w-full px-5 py-4 rounded-2xl border-3 transition-all duration-300 focus:outline-none focus:ring-4 text-lg font-medium ${
                      formErrors.absentNumber
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200 bg-gradient-to-r from-red-50 to-pink-50"
                        : "border-transparent bg-gradient-to-r from-green-50 to-teal-50 focus:from-green-100 focus:to-teal-100 focus:ring-green-200 group-hover:from-green-100 group-hover:to-teal-100"
                    } shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
                {formErrors.absentNumber && (
                  <p className="mt-2 text-sm text-red-600 flex items-center animate-bounce bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                    <span className="mr-2">⚠️</span>
                    {formErrors.absentNumber}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="block text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                  🎯 Tipe Test <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={testType}
                    onChange={(e) => {
                      setTestType(e.target.value);
                      clearFormErrors("testType");
                    }}
                    placeholder="Masukkan tipe test (contoh: pretest atau posttest)"
                    className={`w-full px-5 py-4 rounded-2xl border-3 transition-all duration-300 focus:outline-none focus:ring-4 text-lg font-medium ${
                      formErrors.testType
                        ? "border-red-400 focus:border-red-500 focus:ring-red-200 bg-gradient-to-r from-red-50 to-pink-50"
                        : "border-transparent bg-gradient-to-r from-purple-50 to-pink-50 focus:from-purple-100 focus:to-pink-100 focus:ring-purple-200 group-hover:from-purple-100 group-hover:to-pink-100"
                    } shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className="text-2xl">🚀</span>
                  </div>
                </div>
                {formErrors.testType && (
                  <p className="mt-2 text-sm text-red-600 flex items-center animate-bounce bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                    <span className="mr-2">⚠️</span>
                    {formErrors.testType}
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  onClick={() => (window.location.href = "/menu")}
                  className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] border-2 border-gray-300"
                >
                  ← Kembali ke Menu
                </button>
                <button
                  onClick={startQuiz}
                  disabled={isLoading}
                  className={`flex-1 px-6 py-4 rounded-2xl text-white font-bold transition-all duration-300 focus:outline-none focus:ring-4 shadow-xl text-lg transform ${
                    isLoading
                      ? "bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 focus:ring-emerald-300 hover:scale-[1.02] animate-pulse"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Memulai...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="mr-2">🎮</span>
                      Mulai Test
                      <span className="ml-2">→</span>
                    </div>
                  )}
                </button>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full opacity-30 transform translate-x-8 -translate-y-8"></div>
              <div className="flex items-start relative z-10">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-white text-lg">ℹ️</span>
                </div>
                <div>
                  <h4 className="text-base font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3">
                    📋 Informasi Test
                  </h4>
                  <div className="text-sm text-blue-700 space-y-2">
                    <div className="flex items-center">
                      <span className="mr-2">⏱️</span>
                      <span>Waktu pengerjaan: 10 menit</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📝</span>
                      <span>Jumlah soal: 6 soal</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">💾</span>
                      <span>Data akan tersimpan otomatis setelah selesai</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">✅</span>
                      <span>Pastikan tipe test yang dipilih sudah benar</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Quiz Component with Card Layout
  return (
    <div
      className="min-h-screen w-full p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/1.png')" }}
    >
      {/* Header Card */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border-2 border-white/40 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-r from-purple-300 to-pink-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-300 to-cyan-400 rounded-full opacity-20 animate-pulse delay-300"></div>
          
          <div className="text-center relative z-10">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-xl animate-bounce">
                <span className="text-2xl">🧪</span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-800 to-purple-800 bg-clip-text text-transparent mb-3">
              STEMation Quiz
            </h1>
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 px-6 py-3 rounded-2xl inline-block border-2 border-blue-200 shadow-lg">
              <p className="text-gray-800 font-bold text-sm md:text-base">
                👤 {username} | 📊 Absen: {absentNumber} | 🎯 {testType}
              </p>
            </div>
            <div className="mt-4 bg-gradient-to-r from-red-500 via-rose-600 to-red-700 px-6 py-3 rounded-2xl inline-block shadow-xl border-2 border-red-300">
              <p className="text-white font-bold text-lg md:text-xl animate-pulse">
                ⏰ {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Question Navigation Card */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border-2 border-white/40 relative overflow-hidden">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                📋 Navigasi Soal
              </h3>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-12 h-12 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg border-2 transform hover:scale-110 ${
                    answers[index]
                      ? "bg-gradient-to-r from-green-400 to-emerald-600 text-white border-green-300 shadow-green-400/40"
                      : "bg-gradient-to-r from-blue-100 to-indigo-100 text-gray-700 border-blue-200 hover:from-blue-200 hover:to-indigo-200"
                  } ${
                    index === current
                      ? "ring-4 ring-yellow-400 scale-125 shadow-2xl border-yellow-300"
                      : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Quiz Card */}
        <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/40 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-r from-pink-300 to-purple-400 rounded-full opacity-15 animate-pulse"></div>
          <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-r from-blue-300 to-cyan-400 rounded-full opacity-15 animate-pulse delay-300"></div>
          
          <div className="p-6 md:p-8 relative z-10">
            {showResult ? (
              <div className="text-center py-8">
                <div className="max-w-lg mx-auto">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl animate-bounce">
                      <span className="text-3xl">🎉</span>
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                    Hasil Test
                  </h2>
                  <p className="text-gray-700 mb-2 text-base md:text-lg font-semibold">
                    Selamat! Anda telah menyelesaikan test!
                  </p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6 border-2 border-blue-200">
                    <p className="text-blue-800 font-bold text-sm md:text-base">
                      📊 Tipe Test: {testType}
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-3xl p-8 mb-6 border-2 border-yellow-300 shadow-inner">
                    <div className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
                      {score} / {questions.length}
                    </div>
                    <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Nilai: {Math.round((score / questions.length) * 100)}%
                    </p>
                  </div>
                  
                  <button
                    onClick={() => (window.location.href = "/menu")}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300 text-lg shadow-xl transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center justify-center">
                      <span className="mr-2">🏠</span>
                      Kembali ke Menu
                      <span className="ml-2">→</span>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                {/* Question Header */}
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-4 border-2 border-indigo-200 shadow-lg">
                    <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      📝 {testType} | Soal {current + 1} / {questions.length}
                    </h2>
                  </div>
                </div>

                {/* Question Card */}
                <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 mb-8 border-2 border-blue-200 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full opacity-30 transform translate-x-8 -translate-y-8"></div>
                  <div className="flex items-start relative z-10">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mr-4 shadow-lg flex-shrink-0 mt-1">
                      <span className="text-white text-lg">❓</span>
                    </div>
                    <p className="text-gray-800 text-base md:text-xl font-medium leading-relaxed">
                      {questions[current]?.question}
                    </p>
                  </div>
                </div>

                {/* Options Card */}
                <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-green-200 shadow-inner mb-8 relative overflow-hidden">
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-green-200 to-teal-200 rounded-full opacity-30"></div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent mb-4 text-center">
                    📋 Pilihan Jawaban
                  </h3>
                  <div className="space-y-4 relative z-10">
                    {questions[current]?.options.map((option, index) => (
                      <label
                        key={option.id}
                        className={`group flex cursor-pointer items-center rounded-2xl border-3 p-4 md:p-5 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl ${
                          selected === option.id
                            ? "border-emerald-400 bg-gradient-to-r from-emerald-100 to-teal-100 shadow-emerald-400/40 ring-2 ring-emerald-300"
                            : "border-white bg-gradient-to-r from-white to-gray-50 hover:from-emerald-50 hover:to-teal-50 hover:border-emerald-200"
                        }`}
                      >
                        <div className="relative mr-4 flex-shrink-0">
                          <input
                            type="radio"
                            name="answer"
                            value={option.id}
                            checked={selected === option.id}
                            onChange={(e) => selectAnswer(e.target.value)}
                            className="h-5 w-5 md:h-6 md:w-6 accent-emerald-500 cursor-pointer"
                          />
                          <div className="absolute inset-0 rounded-full border-2 border-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity animate-ping"></div>
                        </div>
                        <div className="flex items-center">
                          <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-3 shadow-lg">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-gray-800 text-sm md:text-lg leading-relaxed font-medium">
                            {option.text}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border-2 border-gray-200 shadow-inner">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={previousQuestion}
                      disabled={current === 0}
                      className="flex-1 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 py-4 text-gray-700 font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm md:text-base transform hover:scale-[1.02] border-2 border-gray-300 shadow-lg"
                    >
                      <div className="flex items-center justify-center">
                        <span className="mr-2">←</span>
                        Soal Sebelumnya
                      </div>
                    </button>
                    <button
                      onClick={nextQuestion}
                      disabled={!selected}
                      className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 py-4 text-white font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm md:text-base transform hover:scale-[1.02] shadow-xl border-2 border-emerald-400"
                    >
                      <div className="flex items-center justify-center">
                        <span className="mr-2">
                          {current === questions.length - 1 ? "✓" : "→"}
                        </span>
                        {current === questions.length - 1
                          ? "Selesai Test"
                          : "Soal Selanjutnya"}
                        <span className="ml-2">
                          {current === questions.length - 1 ? "🎉" : "→"}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}