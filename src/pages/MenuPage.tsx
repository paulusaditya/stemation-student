import { useNavigate } from "react-router-dom";

const MenuPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex"
      style={{ backgroundImage: "url('/menu.png')" }}
    >
      <div className="flex-1 flex flex-col justify-center items-start pl-20 space-y-6">
        <div className="bg-[#FDF0D5] px-16 py-6 rounded-3xl shadow-lg mb-6">
          <h1 className="text-6xl font-black text-gray-800">Menu</h1>
        </div>

        <div className="space-y-5 w-full max-w-lg">
          <button
            onClick={() => handleNavigate("/pretest")}
            className="w-full bg-[#FDF0D5] hover:bg-yellow-200 px-10 py-4 rounded-3xl text-2xl font-bold text-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Pretest
          </button>
          <button
            onClick={() => handleNavigate("/materi")}
            className="w-full bg-[#FDF0D5] hover:bg-yellow-200 px-10 py-4 rounded-3xl text-2xl font-bold text-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Materi
          </button>
          <button
            onClick={() => handleNavigate("/posttest")}
            className="w-full bg-[#FDF0D5] hover:bg-yellow-200 px-10 py-4 rounded-3xl text-2xl font-bold text-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Posttest
          </button>
          <button
            onClick={() => handleNavigate("/refleksi")}
            className="w-full bg-[#FDF0D5] hover:bg-yellow-200 px-10 py-4 rounded-3xl text-2xl font-bold text-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Refleksi Siswa - Siswi
          </button>
          <button
            onClick={() => handleNavigate("/proyek")}
            className="w-full bg-[#FDF0D5] hover:bg-yellow-200 px-10 py-4 rounded-3xl text-2xl font-bold text-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Proyek Kelompok
          </button>
        </div>
      </div>

      <div className="flex-1"></div>
    </div>
  );
};

export default MenuPage;
