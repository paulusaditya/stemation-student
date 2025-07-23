import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Materi from "./pages/Materi";
import QuizPage from "./pages/QuizPage";
import MenuPage from "./pages/MenuPage";

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
        <Route path="/menu" element={< MenuPage/>} />
      </Routes>
    </BrowserRouter>
  );
}
