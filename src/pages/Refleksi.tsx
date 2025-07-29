import { useState } from "react";

interface MoodStats {
  [key: string]: number;
}

interface Vote {
  id: number;
  mood: string;
  timestamp: string;
  date: string;
  time: string;
}

interface RefleksiData {
  moodStats: MoodStats;
  userVotes: Vote[];
}

const Refleksi = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const loadStoredData = (): RefleksiData => {
    try {
      const stored = localStorage.getItem("refleksi-data");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading stored data:", error);
    }
    return {
      moodStats: {
        "sangat-senang": 0,
        senang: 0,
        "cukup-senang": 0,
        "tidak-senang": 0,
        takut: 0,
        bosan: 0,
        ngantuk: 0,
      },
      userVotes: [],
    };
  };

  const [data, setData] = useState<RefleksiData>(loadStoredData);

  const saveData = (newData: RefleksiData) => {
    try {
      localStorage.setItem("refleksi-data", JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const totalVotes = Object.values(data.moodStats).reduce(
    (sum, count) => sum + count,
    0
  );

  const moods = [
    {
      id: "sangat-senang",
      emoji: "😄",
      label: "Sangat Senang",
      color: "bg-blue-200",
      hoverColor: "hover:bg-blue-300",
    },
    {
      id: "senang",
      emoji: "😊",
      label: "Senang",
      color: "bg-orange-400",
      hoverColor: "hover:bg-orange-500",
    },
    {
      id: "cukup-senang",
      emoji: "😐",
      label: "Cukup Senang",
      color: "bg-blue-200",
      hoverColor: "hover:bg-blue-300",
    },
    {
      id: "tidak-senang",
      emoji: "😫",
      label: "Tidak Senang",
      color: "bg-orange-400",
      hoverColor: "hover:bg-orange-500",
    },
    {
      id: "takut",
      emoji: "😰",
      label: "Takut",
      color: "bg-blue-200",
      hoverColor: "hover:bg-blue-300",
    },
    {
      id: "bosan",
      emoji: "😴",
      label: "Bosan",
      color: "bg-orange-400",
      hoverColor: "hover:bg-orange-500",
    },
    {
      id: "ngantuk",
      emoji: "😪",
      label: "Ngantuk",
      color: "bg-blue-200",
      hoverColor: "hover:bg-blue-300",
    },
  ];

  const handleMoodSelect = (moodId: string) => {
    setIsAnimating(true);
    setSelectedMood(moodId);

    const newVote: Vote = {
      id: Date.now() + Math.random(),
      mood: moodId,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString("id-ID"),
      time: new Date().toLocaleTimeString("id-ID"),
    };

    const newData: RefleksiData = {
      moodStats: {
        ...data.moodStats,
        [moodId]: data.moodStats[moodId] + 1,
      },
      userVotes: [...data.userVotes, newVote],
    };

    saveData(newData);

    setTimeout(() => {
      setIsAnimating(false);
      setShowStats(true);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            REFLEKSI PESERTA DIDIK
          </h1>
          <p className="text-xl text-gray-600">
            Bagaimana Pembelajaran Hari Ini?
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {moods.map((mood, index) => (
            <div
              key={mood.id}
              className={`
                relative cursor-pointer transition-all duration-300 ease-in-out
                ${selectedMood === mood.id ? "scale-110 z-10" : "scale-100"}
                ${
                  isAnimating && selectedMood === mood.id
                    ? "animate-bounce"
                    : ""
                }
                hover:scale-105
              `}
              onClick={() => handleMoodSelect(mood.id)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`
                  w-24 h-24 mx-auto mb-3 rounded-full flex items-center justify-center
                  text-4xl transition-all duration-300 ease-in-out
                  ${
                    selectedMood === mood.id
                      ? "bg-yellow-300 shadow-lg"
                      : "bg-yellow-200"
                  }
                  hover:shadow-lg transform hover:-translate-y-1
                  ${
                    isAnimating && selectedMood === mood.id
                      ? "animate-pulse"
                      : ""
                  }
                `}
              >
                <span className="select-none">{mood.emoji}</span>
              </div>
              <div
                className={`
                  px-4 py-2 rounded-full text-center font-semibold text-sm
                  transition-all duration-300 ease-in-out
                  ${mood.color} ${mood.hoverColor}
                  ${
                    selectedMood === mood.id
                      ? "ring-4 ring-yellow-400 ring-opacity-50"
                      : ""
                  }
                  transform hover:-translate-y-1
                `}
              >
                <span className="text-gray-800">{mood.label}</span>
              </div>
              {selectedMood === mood.id && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-ping">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {selectedMood && (
          <div className="text-center bg-gradient-to-r from-blue-50 to-yellow-50 rounded-2xl p-6 animate-fade-in">
            <div className="text-lg font-semibold text-gray-700 mb-2">
              Pilihan Anda:
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-4">
              {moods.find((mood) => mood.id === selectedMood)?.label}
            </div>
            <div className="text-sm text-gray-500 mb-6">
              Terima kasih atas refleksi Anda! 🙏
            </div>

            {showStats && (
              <div className="mb-6 animate-fade-in">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  📊 Statistik Pilihan Semua Peserta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  {moods.map((mood) => {
                    const count = data.moodStats[mood.id];
                    const percentage =
                      totalVotes > 0
                        ? ((count / totalVotes) * 100).toFixed(1)
                        : 0;
                    const isSelected = mood.id === selectedMood;

                    return (
                      <div
                        key={mood.id}
                        className={`
                          flex items-center justify-between p-3 rounded-lg
                          ${
                            isSelected
                              ? "bg-yellow-100 border-2 border-yellow-400"
                              : "bg-gray-50"
                          }
                          transition-all duration-300
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{mood.emoji}</span>
                          <span
                            className={`font-medium ${
                              isSelected ? "text-yellow-800" : "text-gray-700"
                            }`}
                          >
                            {mood.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                isSelected ? "bg-yellow-500" : "bg-blue-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span
                            className={`text-sm font-semibold min-w-[3rem] ${
                              isSelected ? "text-yellow-700" : "text-gray-600"
                            }`}
                          >
                            {percentage}%
                          </span>
                          <span className="text-xs text-gray-500">
                            ({count})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 text-sm text-gray-500">
                  {totalVotes === 0 ? (
                    <span>Anda adalah responden pertama! 🎉</span>
                  ) : (
                    <div className="space-y-1">
                      <div>Total responden: {totalVotes} orang</div>
                      <div>
                        Total penilaian tersimpan: {data.userVotes.length}{" "}
                        penilaian
                      </div>
                    </div>
                  )}
                </div>

                {data.userVotes.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      📝 Penilaian Terbaru
                    </h4>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      {data.userVotes
                        .slice(-5)
                        .reverse()
                        .map((vote: Vote) => {
                          const mood = moods.find((m) => m.id === vote.mood);
                          return (
                            <div
                              key={vote.id}
                              className="text-xs text-gray-600 flex items-center gap-2"
                            >
                              <span>{mood?.emoji}</span>
                              <span>{mood?.label}</span>
                              <span className="text-gray-400">•</span>
                              <span>{vote.time}</span>
                              <span>{vote.date}</span>
                            </div>
                          );
                        })}
                    </div>
                    {data.userVotes.length > 5 && (
                      <div className="text-xs text-gray-400 mt-1">
                        ... dan {data.userVotes.length - 5} penilaian lainnya
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => {
                  setSelectedMood(null);
                  setShowStats(false);
                }}
                className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
              >
                <span>🔄</span>
                Beri Penilaian Lagi
              </button>

              <button
                onClick={() => {
                  window.location.href = "/menu";
                }}
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
              >
                <span>🏠</span>
                Kembali ke Menu
              </button>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Pilih salah satu emoji yang menggambarkan perasaan Anda tentang
            pembelajaran hari ini
          </p>
        </div>
      </div>

      <div className="fixed top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
      <div
        className="fixed bottom-10 right-10 w-16 h-16 bg-orange-200 rounded-full opacity-20 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="fixed top-1/2 left-10 w-12 h-12 bg-blue-200 rounded-full opacity-20 animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>
    </div>
  );
};

export default Refleksi;
