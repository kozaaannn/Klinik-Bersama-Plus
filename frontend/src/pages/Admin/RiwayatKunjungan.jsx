import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Trash2,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  Pencil,
  X,
  PlusCircle,
  MessageCircle,
  User,
  Phone,
  Stethoscope,
  Building2,
} from "lucide-react";
import { toast } from "react-toastify";

const POLI_DOKTER_MAP = {
  "Poli Umum": ["dr. Dicky Adrian, Sp.PD", "dr. Sarah Wijaya"],
  "Poli Gigi & Mulut": ["drg. Amanda Putri", "drg. Yusuf Hamdan"],
  "Poli Anak (Pediatrik)": ["dr. Rian Hermawan, Sp.A", "dr. Linda Susanti, Sp.A"],
  "Laboratorium Klinik": ["Analis Medis Bayu", "Analis Medis Citra"],
  "Apotek & Farmasi": ["Apoteker Siska, S.Farm", "Apoteker Rian, S.Farm"],
};

const STATUS_OPTIONS = [
  { value: "Menunggu Konfirmasi Antrean", label: "Menunggu Konfirmasi", icon: "⏳" },
  { value: "Dikonfirmasi", label: "Dikonfirmasi", icon: "✅" },
  { value: "Selesai", label: "Selesai", icon: "🩺" },
  { value: "Dibatalkan", label: "Dibatalkan", icon: "❌" },
];

export default function RiwayatKunjungan() {
  const [riwayat, setRiwayat] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isCustomDoctor, setIsCustomDoctor] = useState(false);

  const initialForm = {
    nama_pasien: "",
    no_telepon: "",
    tanggal: new Date().toISOString().split("T")[0],
    poli: "Poli Umum",
    dokter: POLI_DOKTER_MAP["Poli Umum"][0],
    keluhan: "",
    catatan: "Menunggu Konfirmasi Antrean",
  };

  const [form, setForm] = useState(initialForm);

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/riwayat-kunjungan");
      setRiwayat(res.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePoliChange = (e) => {
    const selectedPoli = e.target.value;
    const docs = POLI_DOKTER_MAP[selectedPoli] || [];
    setForm((prev) => ({
      ...prev,
      poli: selectedPoli,
      dokter: docs.length > 0 ? docs[0] : "",
    }));
    setIsCustomDoctor(false);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    const docs = POLI_DOKTER_MAP[item.poli] || [];
    const isCustom = item.dokter && !docs.includes(item.dokter);
    setIsCustomDoctor(isCustom);
    setForm({
      nama_pasien: item.nama_pasien || "",
      no_telepon: item.no_telepon || "",
      tanggal: item.tanggal ? item.tanggal.split("T")[0] : "",
      poli: item.poli || "Poli Umum",
      dokter: item.dokter || "",
      keluhan: item.keluhan || "",
      catatan: item.catatan || "Menunggu Konfirmasi Antrean",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsCustomDoctor(false);
    setForm(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/riwayat-kunjungan/${editingId}`, form);
        toast.success("Riwayat kunjungan berhasil diperbarui!");
      } else {
        await api.post("/admin/riwayat-kunjungan", form);
        toast.success("Riwayat kunjungan berhasil ditambahkan!");
      }

      handleCancelEdit();
      fetchData();
    } catch (error) {
      toast.error(editingId ? "Gagal memperbarui data!" : "Gagal menyimpan data!");
      console.error(error);
    }
  };

  const handleUpdateStatus = async (id, newCatatan) => {
    try {
      await api.put(`/admin/riwayat-kunjungan/${id}`, { catatan: newCatatan });
      toast.success("Status kunjungan diperbarui!");
      setRiwayat((prev) =>
        prev.map((item) => (item.id === id ? { ...item, catatan: newCatatan } : item))
      );
    } catch (error) {
      toast.error("Gagal memperbarui status!");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus data riwayat kunjungan ini?")) return;

    try {
      await api.delete(`/admin/riwayat-kunjungan/${id}`);
      toast.success("Data berhasil dihapus!");
      if (editingId === id) handleCancelEdit();
      fetchData();
    } catch (error) {
      toast.error("Gagal menghapus data!");
      console.error(error);
    }
  };

  const getWhatsAppUrl = (phone, name, tanggal, poli) => {
    if (!phone) return null;
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.slice(1);
    }
    const msg = encodeURIComponent(
      `Halo ${name}, kami dari Klinik Pratama Bersama mengonfirmasi jadwal kunjungan Anda di ${poli} pada tanggal ${tanggal}.`
    );
    return `https://wa.me/${clean}?text=${msg}`;
  };

  const availableDoctors = form.poli ? POLI_DOKTER_MAP[form.poli] || [] : [];

  const filteredData = riwayat.filter((item) => {
    const text = search.toLowerCase();
    return (
      item.nama_pasien?.toLowerCase().includes(text) ||
      item.dokter?.toLowerCase().includes(text) ||
      item.poli?.toLowerCase().includes(text) ||
      item.keluhan?.toLowerCase().includes(text) ||
      item.no_telepon?.toLowerCase().includes(text)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
              <Calendar size={24} className="text-blue-600" /> Riwayat Kunjungan Pasien
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Catatan dan riwayat pendaftaran antrean kunjungan pasien klinik.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama / keluhan / poli..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm transition-all"
            />
          </div>
        </div>

        {/* FORM CARD */}
        <div
          className={`rounded-2xl p-5 mb-6 border transition-all ${
            editingId
              ? "bg-amber-50/50 border-amber-300 shadow-md ring-2 ring-amber-200"
              : "bg-gray-50/50 border-gray-200 text-sm"
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {editingId ? (
                  <>
                    <Pencil size={18} className="text-amber-600" />
                    <h3 className="font-bold text-amber-900 text-base">
                      Edit Riwayat Kunjungan Pasien
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                      ID #{editingId}
                    </span>
                  </>
                ) : (
                  <>
                    <PlusCircle size={18} className="text-blue-600" />
                    <h3 className="font-semibold text-slate-800 text-base">
                      Tambah Riwayat Kunjungan
                    </h3>
                  </>
                )}
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 bg-white border border-gray-300 px-3 py-1.5 rounded-lg shadow-sm font-medium transition"
                >
                  <X size={14} /> Batalkan Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* BARIS 1: Pasien, HP, Tanggal */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Nama Pasien <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="nama_pasien"
                      value={form.nama_pasien}
                      onChange={handleChange}
                      placeholder="Nama Lengkap Pasien"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-sm transition-all bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      name="no_telepon"
                      value={form.no_telepon}
                      onChange={handleChange}
                      placeholder="Contoh: 08123456789"
                      className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-sm transition-all bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Tanggal Kunjungan <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    value={form.tanggal}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-sm transition-all bg-white"
                    required
                  />
                </div>
              </div>

              {/* BARIS 2: Poli, Dokter, Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Poli / Layanan <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="poli"
                    value={form.poli}
                    onChange={handlePoliChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-sm transition-all bg-white"
                    required
                  >
                    <option value="">Pilih Poli / Layanan *</option>
                    {Object.keys(POLI_DOKTER_MAP).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-600">
                      Dokter / Tenaga Medis <span className="text-rose-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomDoctor(!isCustomDoctor);
                        if (!isCustomDoctor) setForm({ ...form, dokter: "" });
                      }}
                      className="text-[11px] text-blue-600 hover:underline font-medium"
                    >
                      {isCustomDoctor ? "Pilih dari daftar" : "Ketik manual"}
                    </button>
                  </div>

                  {isCustomDoctor ? (
                    <input
                      type="text"
                      name="dokter"
                      value={form.dokter}
                      onChange={handleChange}
                      placeholder="Ketik nama dokter..."
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-sm transition-all bg-white"
                      required
                    />
                  ) : (
                    <select
                      name="dokter"
                      value={form.dokter}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-sm transition-all bg-white"
                      required
                    >
                      <option value="">Pilih Dokter / Petugas *</option>
                      {availableDoctors.map((doc) => (
                        <option key={doc} value={doc}>
                          {doc}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Status Kunjungan
                  </label>
                  <select
                    name="catatan"
                    value={form.catatan}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-sm transition-all bg-white"
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st.value} value={st.value}>
                        {st.icon} {st.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* BARIS 3: Keluhan */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Keluhan Pasien (Opsional)
                </label>
                <input
                  type="text"
                  name="keluhan"
                  value={form.keluhan}
                  onChange={handleChange}
                  placeholder="Keluhan utama pasien (contoh: Pusing, demam 3 hari, konsultasi rutin)"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm text-sm transition-all bg-white"
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex items-center justify-end gap-2 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all"
                  >
                    Batal
                  </button>
                )}
                <button
                  type="submit"
                  className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md transition-all flex items-center gap-2 ${
                    editingId
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {editingId ? (
                    <>
                      <CheckCircle2 size={16} /> Simpan Perubahan
                    </>
                  ) : (
                    <>
                      <PlusCircle size={16} /> Simpan Data
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* TABEL */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full border-collapse text-sm text-left">
            <thead className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white text-xs uppercase font-semibold">
              <tr>
                <th className="p-3">Tanggal</th>
                <th className="p-3">Pasien & Kontak</th>
                <th className="p-3">Poli / Layanan</th>
                <th className="p-3">Dokter / Petugas</th>
                <th className="p-3">Keluhan</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => {
                  const waUrl = getWhatsAppUrl(
                    item.no_telepon,
                    item.nama_pasien,
                    item.tanggal,
                    item.poli
                  );

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors border-b ${
                        editingId === item.id
                          ? "bg-amber-50/70 border-amber-300"
                          : index % 2 === 0
                          ? "bg-gray-50/50"
                          : "bg-white"
                      } hover:bg-blue-50/40`}
                    >
                      <td className="p-3 font-medium text-gray-700 whitespace-nowrap">
                        {item.tanggal}
                      </td>

                      <td className="p-3">
                        <div className="font-semibold text-gray-800">{item.nama_pasien}</div>
                        {item.no_telepon ? (
                          <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Phone size={11} className="text-gray-400" />
                            {item.no_telepon}
                          </div>
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">-</span>
                        )}
                      </td>

                      <td className="p-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          <Building2 size={12} /> {item.poli}
                        </span>
                      </td>

                      <td className="p-3 text-gray-700">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Stethoscope size={14} className="text-sky-600 flex-shrink-0" />
                          <span>{item.dokter}</span>
                        </div>
                      </td>

                      <td className="p-3 text-gray-600 max-w-xs truncate">
                        {item.keluhan || <span className="italic text-gray-400">-</span>}
                      </td>

                      <td className="p-3">
                        <select
                          value={item.catatan || "Menunggu Konfirmasi Antrean"}
                          onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1.5 border outline-none cursor-pointer transition ${
                            item.catatan?.includes("Menunggu")
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : item.catatan?.includes("Selesai")
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : item.catatan?.includes("Dibatalkan")
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : "bg-sky-50 text-sky-800 border-sky-200"
                          }`}
                        >
                          <option value="Menunggu Konfirmasi Antrean">⏳ Menunggu Konfirmasi</option>
                          <option value="Dikonfirmasi">✅ Dikonfirmasi</option>
                          <option value="Selesai">🩺 Selesai</option>
                          <option value="Dibatalkan">❌ Dibatalkan</option>
                        </select>
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {waUrl && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white transition shadow-sm"
                              title="Hubungi via WhatsApp"
                            >
                              <MessageCircle size={15} />
                            </a>
                          )}

                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition shadow-sm"
                            title="Edit Data Kunjungan"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition shadow-sm"
                            title="Hapus Kunjungan"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-gray-500 italic bg-gray-50/30">
                    Tidak ada data kunjungan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
