import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import PretestPage from "./pages/PretestPage";
import Materi from "./pages/Materi";
import Suhu from "./pages/materi/suhu";
import Kalor from "./pages/materi/kalor";

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
      </Routes>
    </BrowserRouter>
  );
}
