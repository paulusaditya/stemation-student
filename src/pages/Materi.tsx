import { useParams, useNavigate } from "react-router-dom";
import materiData from "../database/materiData";

type MateriItem = {
  title: string;
  content: string;
};

type MateriDataType = {
  [key: string]: MateriItem;
};

export default function Materi() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const materi = (materiData as MateriDataType)[id || ""];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src="/1fix.png"
        alt="Forest background"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 text-center">
        {materi ? (
          <>
            <h1 className="mb-6 text-4xl font-bold text-white drop-shadow-md pt-10">
              {materi.title}
            </h1>
            <div
              className="mb-10 max-w-4xl overflow-y-auto bg-white/70 p-4 text-green-900 shadow"
              style={{
                maxHeight: "400px",
                scrollbarWidth: "thin" /* Firefox */,
              }}
            >
              <p className="text-lg whitespace-pre-wrap">{materi.content}</p>
            </div>
          </>
        ) : (
          <p className="text-red-600 text-xl font-semibold">
            Materi tidak ditemukan
          </p>
        )}

        <button
          onClick={() => navigate("/")}
          className="rounded-xl bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition"
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}
