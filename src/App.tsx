import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import PretestPage from "./pages/PretestPage";
import Materi from "./pages/Materi";
import Suhu from "./pages/materi/Suhu";
import Kalor from "./pages/materi/Kalor";
import Pemuaian from "./pages/materi/Pemuaian";
import Refleksi from "./pages/Refleksi";
import PosttestPage from "./pages/PosttestPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/pretest" element={<PretestPage />} />
        <Route path="/materi" element={<Materi />} />
        <Route path="/materi/suhu" element={<Suhu />} />
        <Route path="/materi/kalor" element={<Kalor />} />
        <Route path="/materi/pemuaian" element={<Pemuaian />} />
        <Route path="/refleksi" element={<Refleksi />} />
        <Route path="/posttest" element={<PosttestPage />} />
      </Routes>
    </BrowserRouter>
  );
}
