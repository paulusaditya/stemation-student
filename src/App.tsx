import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Materi from "./pages/Materi";
import QuizPage from "./pages/QuizPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/quiz"
          element={
              <QuizPage />
          }
        />
        <Route path="/materi/:id" element={<Materi />} />
      </Routes>
    </BrowserRouter>
  );
}
