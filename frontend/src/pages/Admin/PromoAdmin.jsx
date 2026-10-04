import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Pencil, Trash2, Plus, Image, AlertCircle, CheckCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

export default function PromoAdmin() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    judul: "",
    deskripsi: "",
    harga: "",
    gambar: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/promos");
      setPromos(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengambil daftar promo.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, gambar: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.judul || !form.deskripsi || !form.harga) {
      toast.error("Harap lengkapi semua kolom wajib!");
      return;
    }

    const formData = new FormData();
    formData.append("judul", form.judul);
    formData.append("deskripsi", form.deskripsi);
    formData.append("harga", Number(form.harga));
    if (form.gambar) {
      formData.append("gambar", form.gambar);
    }

    try {
      if (isEditing) {
        // Update menggunakan POST karena PHP multipart/form-data update bug
        await api.post(`/admin/promos/${editId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Promo berhasil diperbarui!");
      } else {
        await api.post("/admin/promos", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Promo baru berhasil ditambahkan!");
      }

      setForm({ judul: "", deskripsi: "", harga: "", gambar: null });
      setImagePreview(null);
      setIsEditing(false);
      setEditId(null);
      fetchPromos();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || "Gagal menyimpan data promo.";
      toast.error(msg);
    }
  };

  const handleEdit = (promo) => {
    setIsEditing(true);
    setEditId(promo.id);
    setForm({
      judul: promo.judul,
      deskripsi: promo.deskripsi,
      harga: promo.harga,
      gambar: null,
    });
    setImagePreview(promo.gambar ? `http://localhost:8000/storage/${promo.gambar}` : null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus promo ini?")) return;

    try {
      await api.delete(`/admin/promos/${id}`);
      toast.success("Promo berhasil dihapus!");
      fetchPromos();
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus promo.");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setForm({ judul: "", deskripsi: "", harga: "", gambar: null });
    setImagePreview(null);
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 text-slate-700">
      <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
            🎉 Kelola Promo Klinik
          </h2>
          <p className="text-gray-500 text-sm mt-1">Tambahkan, ubah, atau hapus promo program kesehatan yang aktif.</p>
        </div>

        {/* FORM PROMO */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-md space-y-6"
        >
          <h3 className="text-lg font-bold text-slate-800 border-b pb-3 border-gray-100">
            {isEditing ? "Mode Edit Promo" : "Tambah Promo Baru"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-slate-600 font-bold mb-1.5 text-xs uppercase tracking-wider">Judul Promo *</label>
                <input
                  type="text"
                  placeholder="Contoh: Paket Medical Check Up Lansia"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5 text-xs uppercase tracking-wider">Harga Promo *</label>
                <input
                  type="number"
                  placeholder="Masukkan nominal angka (Contoh: 150000)"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  value={form.harga}
                  onChange={(e) => setForm({ ...form, harga: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1.5 text-xs uppercase tracking-wider">Deskripsi Lengkap *</label>
                <textarea
                  placeholder="Tulis detail diskon dan syarat ketentuan promo..."
                  rows="4"
                  className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                  value={form.deskripsi}
                  onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Upload Area */}
            <div className="flex flex-col justify-between">
              <div>
                <label className="block text-slate-600 font-bold mb-1.5 text-xs uppercase tracking-wider">Banner Promo (Gambar)</label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-blue-400 transition cursor-pointer relative bg-slate-50 min-h-[180px] flex flex-col justify-center items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full max-h-36 object-contain rounded-xl" />
                  ) : (
                    <>
                      <Image className="mx-auto text-slate-400 mb-2" size={36} />
                      <p className="text-slate-600 font-semibold text-xs">Pilih file gambar banner promo</p>
                      <span className="text-[10px] text-slate-400">JPG, PNG, atau WEBP (Maks. 2MB)</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition active:scale-95 flex items-center justify-center gap-2 shadow-md"
                >
                  <Plus size={18} />
                  {isEditing ? "Simpan Perubahan" : "Terbitkan Promo"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-5 py-3 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl text-sm transition font-bold"
                  >
                    Batal
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* LIST PROMO */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-md">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-3 border-slate-100">Daftar Promo Aktif</h3>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : promos.length === 0 ? (
            <div className="text-center py-8 text-slate-400 italic text-sm">
              Belum ada promo yang terdaftar.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full border-collapse text-sm text-left">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-bold text-xs uppercase">
                    <th className="p-3">Banner</th>
                    <th className="p-3">Judul Promo</th>
                    <th className="p-3">Harga</th>
                    <th className="p-3">Deskripsi</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {promos.map((promo, index) => (
                    <tr
                      key={promo.id}
                      className={`transition-colors border-b ${
                        index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                      } hover:bg-blue-50/30`}
                    >
                      <td className="p-3">
                        {promo.gambar ? (
                          <img
                            src={`http://localhost:8000/storage/${promo.gambar}`}
                            alt={promo.judul}
                            className="w-16 h-10 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-16 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                            <Image size={16} />
                          </div>
                        )}
                      </td>
                      <td className="p-3 font-bold text-slate-800">{promo.judul}</td>
                      <td className="p-3 font-mono font-bold text-rose-600">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(promo.harga)}
                      </td>
                      <td className="p-3 max-w-xs truncate">{promo.deskripsi}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            onClick={() => handleEdit(promo)}
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                            onClick={() => handleDelete(promo.id)}
                          >
                            <Trash2 size={18} />
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
    </div>
  );
}
