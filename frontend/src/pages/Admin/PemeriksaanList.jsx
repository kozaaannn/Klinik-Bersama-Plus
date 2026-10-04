import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PencilLine, Trash2, Clipboard } from "lucide-react";

export default function PemeriksaanList() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/admin/pemeriksaan", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetched = response.data.data || [];
        setData(fetched);
        setFilteredData(fetched);
      } catch (error) {
        console.error("❌ Gagal mengambil data pemeriksaan:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    if (search.trim() === "") {
      setFilteredData(data);
      return;
    }
    const filtered = data.filter(
      (item) =>
        item.nama?.toLowerCase().includes(lowerSearch) ||
        item.no_telepon?.toLowerCase().includes(lowerSearch) ||
        item.alamat?.toLowerCase().includes(lowerSearch) ||
        item.hasil_pemeriksaan?.toLowerCase().includes(lowerSearch)
    );
    setFilteredData(filtered);
  }, [search, data]);

  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8000/api/admin/pemeriksaan/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("❌ Gagal menghapus data:", error);
      alert("Gagal menghapus data!");
    }
  }

  function handleEdit(id) {
    navigate(`/admin/pemeriksaan/edit/${id}`);
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 text-base animate-pulse">Memuat data pemeriksaan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
              <Clipboard size={24} className="text-blue-600" /> Daftar Pemeriksaan Pasien
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Data rekam medis umum, riwayat pemeriksaan fisik, dan diagnosa pasien.
            </p>
          </div>

          <input
            type="text"
            placeholder="Cari nama, no telepon, atau hasil..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-80 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-sm transition-all"
          />
        </div>

        {/* Tabel Responsif */}
        {filteredData.length === 0 ? (
          <div className="p-8 text-center text-gray-500 italic border border-dashed border-gray-200 rounded-2xl bg-gray-50">
            {data.length === 0 ? "Belum ada data pemeriksaan." : "Data tidak ditemukan."}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
            <table className="w-full min-w-[1200px] text-xs md:text-sm border-collapse text-left">
              <thead className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white uppercase tracking-wide text-xs">
                <tr>
                  {[
                    "No",
                    "Nama",
                    "Alamat",
                    "No. Telepon",
                    "Tanggal Lahir",
                    "Waktu",
                    "Tinggi",
                    "Berat",
                    "Tekanan Darah",
                    "Gula Darah",
                    "Kolesterol",
                    "Asam Urat",
                    "Hasil",
                    "Aksi",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="p-3 border-b border-indigo-500/20 text-center whitespace-nowrap font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, i) => (
                  <tr
                    key={i}
                    className={`transition-colors border-b ${
                      i % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                    } hover:bg-blue-50/30`}
                  >
                    <td className="p-3 text-center font-medium text-gray-600">{i + 1}</td>
                    <td className="p-3 font-semibold text-gray-800">{item.nama}</td>
                    <td className="p-3 text-gray-600">{item.alamat}</td>
                    <td className="p-3 text-gray-600 font-mono">{item.no_telepon}</td>
                    <td className="p-3 text-gray-500 text-center">{item.tanggal_lahir}</td>
                    <td className="p-3 text-gray-500 text-center">{item.waktu_pemeriksaan}</td>
                    <td className="p-3 text-gray-600 text-center">{item.tinggi_badan} cm</td>
                    <td className="p-3 text-gray-600 text-center">{item.berat_badan} kg</td>
                    <td className="p-3 text-gray-600 text-center">{item.tekanan_darah} mmHg</td>
                    <td className="p-3 text-gray-600 text-center">{item.gula_darah} mg/dL</td>
                    <td className="p-3 text-gray-600 text-center">{item.kolesterol} mg/dL</td>
                    <td className="p-3 text-gray-600 text-center">{item.asam_urat} mg/dL</td>
                    <td className="p-3 font-semibold text-blue-700">
                      {item.hasil_pemeriksaan}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="flex items-center justify-center p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          onClick={() => handleEdit(item.id)}
                          title="Edit Pemeriksaan"
                        >
                          <PencilLine size={16} />
                        </button>
                        <button
                          className="flex items-center justify-center p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          onClick={() => handleDelete(item.id)}
                          title="Hapus Pemeriksaan"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
