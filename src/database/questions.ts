export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  question: string;
  options: Option[];
  correct: string;
}

export interface Question {
  id: number;
  session: "pretest" | "materi1" | "materi2" | "materi3" | "posttest";
  question: string;
  options: Option[];
  correct: string;
}

export const questions: Question[] = [
  {
    id: 1,
    session: "pretest",
    question: "Apa satuan suhu dalam sistem internasional (SI)?",
    options: [
      { id: "a", text: "Celcius" },
      { id: "b", text: "Fahrenheit" },
      { id: "c", text: "Kelvin" },
      { id: "d", text: "Reamur" },
    ],
    correct: "c",
  },
  {
    id: 6,
    session: "materi1",
    question:
      "Suhu suatu benda adalah 0°C. Jika dikonversi ke Kelvin, menjadi?",
    options: [
      { id: "a", text: "0 K" },
      { id: "b", text: "100 K" },
      { id: "c", text: "273 K" },
      { id: "d", text: "373 K" },
    ],
    correct: "c",
  },
  {
    id: 11,
    session: "materi2",
    question: "Kalor merupakan bentuk...",
    options: [
      { id: "a", text: "Zat" },
      { id: "b", text: "Energi" },
      { id: "c", text: "Gaya" },
      { id: "d", text: "Suhu" },
    ],
    correct: "b",
  },
  {
    id: 21,
    session: "materi3",
    question: "Pemuaian terjadi ketika benda...",
    options: [
      { id: "a", text: "Didinginkan" },
      { id: "b", text: "Dikompresi" },
      { id: "c", text: "Dipanaskan" },
      { id: "d", text: "Ditarik" },
    ],
    correct: "c",
  },
  {
    id: 36,
    session: "posttest",
    question: "Jika logam dipanaskan, maka volumenya akan...",
    options: [
      { id: "a", text: "Berkurang" },
      { id: "b", text: "Tetap" },
      { id: "c", text: "Meningkat" },
      { id: "d", text: "Menguap" },
    ],
    correct: "c",
  },
];
