import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Edit } from "lucide-react";

export default function PemeriksaanEdit() {
  const { id } = useParams();
  const [form, setForm] = useState({
    nama: "",
    alamat: "",
    no_telepon: "",
    tanggal_lahir: "",
    waktu_pemeriksaan: "",
    tinggi_badan: "",
    berat_badan: "",
    tekanan_darah: "",
    gula_darah: "",
    kolesterol: "",
    asam_urat: "",
    hasil_pemeriksaan: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // === FETCH DATA PEMERIKSAAN BERDASARKAN ID ===
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/admin/pemeriksaan/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = res.data.data || res.data;
        setForm({
          nama: data.nama || "",
          alamat: data.alamat || "",
          no_telepon: data.no_telepon || "",
          tanggal_lahir: data.tanggal_lahir || "",
          waktu_pemeriksaan: data.waktu_pemeriksaan || "",
          tinggi_badan: data.tinggi_badan || "",
          berat_badan: data.berat_badan || "",
          tekanan_darah: data.tekanan_darah || "",
          gula_darah: data.gula_darah || "",
          kolesterol: data.kolesterol || "",
          asam_urat: data.asam_urat || "",
          hasil_pemeriksaan: data.hasil_pemeriksaan || "",
        });
      } catch (error) {
        console.error("❌ Gagal mengambil data:", error);
        alert("Gagal memuat data pemeriksaan!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // === HANDLE PERUBAHAN INPUT ===
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // === HANDLE SUBMIT (UPDATE DATA) ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:8000/api/admin/pemeriksaan/${id}`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Data berhasil diperbarui!");
      navigate("/admin/pemeriksaan", { replace: true }); // kembali ke list
    } catch (error) {
      console.error("❌ Gagal update data:", error);
      alert("Gagal memperbarui data!");
    }
  };

  // === LOADING STATE ===
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 text-base animate-pulse">Memuat data...</p>
      </div>
    );
  }

  // === RENDER FORM ===
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center md:text-left flex items-center gap-2">
          <Edit size={24} className="text-blue-600" /> Edit Pemeriksaan
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            { label: "Nama", name: "nama" },
            { label: "Alamat", name: "alamat" },
            { label: "No. Telepon", name: "no_telepon" },
            { label: "Tanggal Lahir", name: "tanggal_lahir", type: "date" },
            { label: "Waktu Pemeriksaan", name: "waktu_pemeriksaan" },
            { label: "Tinggi Badan (cm)", name: "tinggi_badan" },
            { label: "Berat Badan (kg)", name: "berat_badan" },
            { label: "Tekanan Darah", name: "tekanan_darah" },
            { label: "Gula Darah", name: "gula_darah" },
            { label: "Kolesterol", name: "kolesterol" },
            { label: "Asam Urat", name: "asam_urat" },
          ].map(({ label, name, type = "text" }) => (
            <div key={name} className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-1">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={form[name] || ""}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-sm transition-all"
                required
              />
            </div>
          ))}

          <div className="md:col-span-2 flex flex-col">
            <label className="text-sm font-semibold text-slate-700 mb-1">
              Hasil Pemeriksaan
            </label>
            <textarea
              name="hasil_pemeriksaan"
              value={form.hasil_pemeriksaan || ""}
              onChange={handleChange}
              rows="3"
              className="border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-sm resize-none transition-all"
              required
            ></textarea>
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate("/admin/pemeriksaan")}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all text-sm"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-all text-sm"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
