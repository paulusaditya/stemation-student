import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { questions } from "../database/questions";

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

export default function QuizPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState<number>(0);
  const [selected, setSelected] = useState<string>("");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [score, setScore] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [absent, setAbsent] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(1200);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const lastSessionAlert = useRef<Question["session"] | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const getSessionLabel = (session: Question["session"]) => {
    switch (session) {
      case "pretest": return "📘 Pretest";
      case "materi1": return "📗 Materi 1";
      case "materi2": return "📙 Materi 2";
      case "materi3": return "📕 Materi 3";
      case "posttest": return "📝 Post-test";
      default: return "";
    }
  };

  useEffect(() => {
    const n = localStorage.getItem("userName");
    const a = localStorage.getItem("userAbsentNumber");
    if (!n || !a) {
      navigate("/");
      return;
    }
    setName(n);
    setAbsent(a);

    const grouped = (session: Question["session"], count: number) =>
      shuffleArray(questions.filter(q => q.session === session)).slice(0, count);

    const randomized = [
      ...grouped("pretest", 5),
      ...grouped("materi1", 10),
      ...grouped("materi2", 10),
      ...grouped("materi3", 10),
      ...grouped("posttest", 5),
    ].map(q => ({
      ...q,
      options: shuffleArray(q.options),
    }));

    setShuffledQuestions(randomized);
  }, [navigate]);

  useEffect(() => {
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
    return () => clearInterval(timerRef.current!);
  }, []);

  useEffect(() => {
    setSelected(answers[current] || "");
  }, [current, answers]);

  const formatTime = (s: number) => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  };

  const submitQuizResult = async (percentage: number) => {
    try {
      const res = await fetch("https://stemation-backend.vercel.app/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: name,
          absen: Number(absent),
          score: percentage,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal submit");
      console.log("✅ Tersimpan:", data.data);
    } catch (err) {
      if (err instanceof Error) {
        alert("Gagal menyimpan hasil. Coba lagi nanti.");
      }
    }
  };

  const handleFinish = () => {
    const correctAnswers = Object.entries(answers).filter(
      ([idx, val]) => val === shuffledQuestions[Number(idx)].correct
    );
    const finalScore = correctAnswers.length;
    const percentage = Math.round((finalScore / shuffledQuestions.length) * 100);
    setScore(finalScore);
    setShowResult(true);
    submitQuizResult(percentage);
  };

  // alert sesi hanya sekali per sesi baru
  const next = () => {
    if (current < shuffledQuestions.length - 1) {
      const nextIndex = current + 1;
      const currentSession = shuffledQuestions[current].session;
      const nextSession = shuffledQuestions[nextIndex].session;

      setCurrent(nextIndex);

      if (currentSession !== nextSession && lastSessionAlert.current !== nextSession) {
        alert(`Sesi ${getSessionLabel(nextSession)} dimulai`);
        lastSessionAlert.current = nextSession;
      }
    } else {
      handleFinish();
    }
  };

  const previous = () => current > 0 && setCurrent(current - 1);

  const selectAnswer = (val: string) => {
    setSelected(val);
    setAnswers(prev => ({ ...prev, [current]: val }));
  };

  const restart = () => {
    setCurrent(0);
    setSelected("");
    setAnswers({});
    setScore(0);
    setShowResult(false);
    setTimeLeft(1200);
    lastSessionAlert.current = null;
    // Reset timer manually
    if (timerRef.current) clearInterval(timerRef.current);
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
  };

  if (!name || !absent || shuffledQuestions.length === 0)
    return <div className="flex h-screen items-center justify-center">Loading…</div>;

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img src="/1.svg" className="absolute inset-0 h-full w-full object-cover" alt="background" />
      <header className="relative z-20 mt-8 text-center">
        <h1 className="text-3xl font-extrabold text-green-900">STEMation Quiz</h1>
        <p className="mt-1 text-white drop-shadow">Nama: {name} | Absen: {absent}</p>
        <p className="text-red-600 font-bold mt-1">Waktu Tersisa: {formatTime(timeLeft)}</p>
      </header>

      <div className="relative z-20 mx-auto mt-4 w-[900px] max-w-[90%]">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {shuffledQuestions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-8 h-8 rounded-full font-bold text-sm ${
                answers[index] ? "bg-green-500 text-white" : "bg-white text-gray-700"
              } ${index === current ? "ring-2 ring-yellow-400" : ""}`}
              aria-label={`Soal nomor ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <div className="h-[550px] w-full bg-transparent px-6 py-8">
            <div className="flex h-full w-full flex-col items-center justify-start">
              {showResult ? (
                <div className="w-full h-[550px] p-8 flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-semibold text-white">Hasil Quiz</h2>
                  <p className="text-white mb-2">Anda telah menyelesaikan quiz!</p>
                  <p className="text-4xl font-bold text-white mb-2">
                    {score} / {shuffledQuestions.length}
                  </p>
                  <p className="text-white mb-6">
                    Nilai: {Math.round((score / shuffledQuestions.length) * 100)}%
                  </p>
                  <div className="flex gap-4">
                    <button onClick={restart} className="border px-6 py-2 text-white hover:bg-white/10">
                      Ulangi Quiz
                    </button>
                    <button onClick={() => navigate("/")} className="bg-emerald-500 px-6 py-2 text-white hover:bg-emerald-600">
                      Beranda
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full h-[550px] rounded-lg bg-transparent p-8">
                  <h2 className="text-2xl font-medium text-white">
                    {getSessionLabel(shuffledQuestions[current].session)} | Soal {current + 1} / {shuffledQuestions.length}
                  </h2>

                  <p className='mb-6 text-center text-white text-2xl font-["Coming Soon",cursive] drop-shadow-[0_0_4px_rgba(0,0,0,0.7)]'>
                    {shuffledQuestions[current].question}
                  </p>

                  <form className="space-y-3">
                    {shuffledQuestions[current].options.map(opt => (
                      <label
                        key={opt.id}
                        className={`flex cursor-pointer items-center rounded-lg border p-3 transition-colors ${
                          selected === opt.id ? "border-green-300 bg-white/10" : "border-white/40 hover:bg-white/5"
                        }`}
                      >
                        <input
                          type="radio"
                          name="answer"
                          value={opt.id}
                          checked={selected === opt.id}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => selectAnswer(e.target.value)}
                          className="mr-3 h-4 w-4 accent-emerald-400"
                        />
                        <span className="text-white">{opt.text}</span>
                      </label>
                    ))}
                  </form>

                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={previous}
                      disabled={current === 0}
                      className="w-full rounded-md bg-gray-300 py-3 text-gray-700 hover:bg-gray-400 disabled:opacity-50"
                    >
                      Sebelumnya
                    </button>
                    <button
                      onClick={next}
                      disabled={!selected}
                      className="w-full rounded-md bg-emerald-500 py-3 text-white hover:bg-emerald-600 disabled:opacity-50"
                    >
                      {current === shuffledQuestions.length - 1 ? "Selesai" : "Selanjutnya"}
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
