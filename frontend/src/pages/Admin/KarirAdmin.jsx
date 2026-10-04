import { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  Briefcase,
  Users,
  Search,
  RefreshCw,
  FileText,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Plus,
  Edit,
  Eye,
  X,
  Phone,
  Mail,
  AlertCircle,
  MessageSquare,
  Send,
  Bell
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

export default function KarirAdmin() {
  const [activeTab, setActiveTab] = useState("pelamar"); // 'pelamar' | 'lowongan'

  // ================= State Pelamar =================
  const [pelamars, setPelamars] = useState([]);
  const [loadingPelamars, setLoadingPelamars] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [selectedPelamar, setSelectedPelamar] = useState(null);

  // ================= State Modal Notifikasi Keputusan =================
  const [notificationModal, setNotificationModal] = useState({
    isOpen: false,
    pelamar: null,
    targetStatus: "",
    catatan: "",
    sendEmail: true,
    sendWhatsApp: true,
    submitting: false,
    completedResult: null,
  });

  // ================= State Lowongan =================
  const [vacancies, setVacancies] = useState([]);
  const [loadingVacancies, setLoadingVacancies] = useState(false);
  const [modalVacancyOpen, setModalVacancyOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState(null);
  const [vacancyForm, setVacancyForm] = useState({
    posisi: "",
    lokasi: "Klinik Pusat",
    tipe: "Full-time",
    deskripsi: "",
    kualifikasi: "",
    is_active: true,
  });

  // ======= Helpers =======
  const getCvUrl = (pelamar) => {
    if (!pelamar) return null;
    if (pelamar.cv_url) return pelamar.cv_url;
    if (pelamar.cv_path) return `http://127.0.0.1:8000/storage/${pelamar.cv_path}`;
    return null;
  };

  const formatWaNumber = (phone) => {
    if (!phone) return "";
    let clean = phone.replace(/\D/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.substring(1);
    } else if (!clean.startsWith("62")) {
      clean = "62" + clean;
    }
    return clean;
  };

  // ======= Fetch Pelamar =======
  const fetchPelamars = async () => {
    setLoadingPelamars(true);
    try {
      const res = await api.get("/admin/pelamar", {
        params: {
          search: search || undefined,
          status: statusFilter !== "semua" ? statusFilter : undefined,
        },
      });
      setPelamars(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data pelamar");
    } finally {
      setLoadingPelamars(false);
    }
  };

  // ======= Fetch Lowongan =======
  const fetchVacancies = async () => {
    setLoadingVacancies(true);
    try {
      const res = await api.get("/admin/karir");
      setVacancies(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat lowongan pekerjaan");
    } finally {
      setLoadingVacancies(false);
    }
  };

  useEffect(() => {
    fetchPelamars();
  }, [statusFilter]);

  useEffect(() => {
    if (activeTab === "lowongan") {
      fetchVacancies();
    }
  }, [activeTab]);

  // ======= Trigger Perubahan Status (dengan Notifikasi Otomatis) =======
  const promptStatusChange = (pelamar, targetStatus) => {
    if (targetStatus === "diterima" || targetStatus === "ditolak") {
      setNotificationModal({
        isOpen: true,
        pelamar: pelamar,
        targetStatus: targetStatus,
        catatan: pelamar.catatan || "",
        sendEmail: true,
        sendWhatsApp: true,
        submitting: false,
        completedResult: null,
      });
    } else {
      executeStatusUpdate(pelamar.id, targetStatus, pelamar.catatan || "", false, false);
    }
  };

  const executeStatusUpdate = async (id, status, catatan = "", sendEmail = true, sendWhatsApp = true) => {
    try {
      const res = await api.put(`/admin/pelamar/${id}/status`, {
        status,
        catatan,
        send_email: sendEmail,
        send_whatsapp: sendWhatsApp,
      });
      toast.success(res.data.message || "Status berhasil diubah");
      setPelamars((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status, catatan } : p))
      );
      if (selectedPelamar && selectedPelamar.id === id) {
        setSelectedPelamar((prev) => ({ ...prev, status, catatan }));
      }
      return res.data;
    } catch (err) {
      console.error(err);
      toast.error("Gagal mengubah status pelamar");
      throw err;
    }
  };

  const handleConfirmNotification = async (e) => {
    e.preventDefault();
    setNotificationModal((prev) => ({ ...prev, submitting: true }));
    try {
      const result = await executeStatusUpdate(
        notificationModal.pelamar.id,
        notificationModal.targetStatus,
        notificationModal.catatan,
        notificationModal.sendEmail,
        notificationModal.sendWhatsApp
      );
      setNotificationModal((prev) => ({
        ...prev,
        submitting: false,
        completedResult: result,
      }));
    } catch (err) {
      setNotificationModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  // ======= Hapus Pelamar =======
  const handleDeletePelamar = async (id, nama) => {
    if (!window.confirm(`Yakin ingin menghapus berkas lamaran dari "${nama}"?`)) return;

    try {
      await api.delete(`/admin/pelamar/${id}`);
      toast.success("Data pelamar berhasil dihapus");
      setPelamars((prev) => prev.filter((p) => p.id !== id));
      if (selectedPelamar && selectedPelamar.id === id) setSelectedPelamar(null);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus pelamar");
    }
  };

  // ======= Simpan / Update Lowongan =======
  const handleSaveVacancy = async (e) => {
    e.preventDefault();
    if (!vacancyForm.posisi || !vacancyForm.lokasi || !vacancyForm.tipe) {
      toast.error("Harap isi semua kolom wajib!");
      return;
    }

    try {
      if (editingVacancy) {
        await api.put(`/admin/karir/${editingVacancy.id}`, vacancyForm);
        toast.success("Lowongan berhasil diperbarui");
      } else {
        await api.post("/admin/karir", vacancyForm);
        toast.success("Lowongan baru berhasil dibuat");
      }
      setModalVacancyOpen(false);
      setEditingVacancy(null);
      fetchVacancies();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan lowongan");
    }
  };

  // ======= Hapus Lowongan =======
  const handleDeleteVacancy = async (id, posisi) => {
    if (!window.confirm(`Hapus lowongan posisi "${posisi}"?`)) return;

    try {
      await api.delete(`/admin/karir/${id}`);
      toast.success("Lowongan berhasil dihapus");
      fetchVacancies();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menghapus lowongan");
    }
  };

  // ======= Metrik Ringkasan Pelamar =======
  const totalPelamar = pelamars.length;
  const menungguCount = pelamars.filter((p) => p.status === "menunggu").length;
  const reviewCount = pelamars.filter((p) => p.status === "review").length;
  const diterimaCount = pelamars.filter((p) => p.status === "diterima").length;
  const ditolakCount = pelamars.filter((p) => p.status === "ditolak").length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "menunggu":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">Menunggu</span>;
      case "review":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-100 text-sky-800 border border-sky-200">Sedang Review</span>;
      case "diterima":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">Diterima</span>;
      case "ditolak":
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800 border border-rose-200">Ditolak</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer theme="colored" position="top-right" autoClose={3000} />

      {/* Header & Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2.5">
            <Briefcase className="text-sky-600" size={28} />
            Kelola Karir & Pelamar
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Pantau berkas lamaran yang masuk dan kelola daftar lowongan pekerjaan klinik.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab("pelamar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${
              activeTab === "pelamar"
                ? "bg-white text-sky-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users size={16} />
            Data Pelamar ({pelamars.length})
          </button>
          <button
            onClick={() => setActiveTab("lowongan")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition ${
              activeTab === "lowongan"
                ? "bg-white text-sky-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Briefcase size={16} />
            Kelola Lowongan
          </button>
        </div>
      </div>

      {/* ========================================================
      | TAB 1: DATA PELAMAR KERJA
      ======================================================== */}
      {activeTab === "pelamar" && (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">Total Pelamar</span>
              <p className="text-2xl font-black text-slate-800 mt-1">{totalPelamar}</p>
            </div>
            <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200/80 shadow-sm">
              <span className="text-xs font-semibold text-amber-700">Menunggu</span>
              <p className="text-2xl font-black text-amber-800 mt-1">{menungguCount}</p>
            </div>
            <div className="bg-sky-50/70 rounded-xl p-4 border border-sky-200/80 shadow-sm">
              <span className="text-xs font-semibold text-sky-700">Sedang Review</span>
              <p className="text-2xl font-black text-sky-800 mt-1">{reviewCount}</p>
            </div>
            <div className="bg-emerald-50/70 rounded-xl p-4 border border-emerald-200/80 shadow-sm">
              <span className="text-xs font-semibold text-emerald-700">Diterima</span>
              <p className="text-2xl font-black text-emerald-800 mt-1">{diterimaCount}</p>
            </div>
            <div className="bg-rose-50/70 rounded-xl p-4 border border-rose-200/80 shadow-sm">
              <span className="text-xs font-semibold text-rose-700">Ditolak</span>
              <p className="text-2xl font-black text-rose-800 mt-1">{ditolakCount}</p>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchPelamars()}
                placeholder="Cari nama, email, posisi..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
              />
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-500 bg-white"
              >
                <option value="semua">Semua Status</option>
                <option value="menunggu">Menunggu</option>
                <option value="review">Review</option>
                <option value="diterima">Diterima</option>
                <option value="ditolak">Ditolak</option>
              </select>

              <button
                onClick={fetchPelamars}
                className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition"
                title="Refresh"
              >
                <RefreshCw size={18} className={loadingPelamars ? "animate-spin text-sky-600" : ""} />
              </button>
            </div>
          </div>

          {/* Table Pelamar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Tanggal</th>
                    <th className="px-5 py-3.5">Pelamar</th>
                    <th className="px-5 py-3.5">Posisi Dilamar</th>
                    <th className="px-5 py-3.5">Berkas CV</th>
                    <th className="px-5 py-3.5">Pesan</th>
                    <th className="px-5 py-3.5 text-center">Status</th>
                    <th className="px-5 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingPelamars ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-slate-400">
                        <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        Memuat data pelamar...
                      </td>
                    </tr>
                  ) : pelamars.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-slate-400">
                        Belum ada pelamar yang mengirimkan berkas lamaran.
                      </td>
                    </tr>
                  ) : (
                    pelamars.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition">
                        <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                          {new Date(p.created_at).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-900">{p.nama}</p>
                          <div className="flex flex-col gap-0.5 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1.5">
                              <Mail size={12} className="text-slate-400" /> {p.email}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Phone size={12} className="text-slate-400" />
                              <a
                                href={`https://wa.me/${formatWaNumber(p.no_telepon)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sky-600 hover:underline font-medium"
                              >
                                {p.no_telepon}
                              </a>
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-semibold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg text-xs">
                            {p.posisi}
                          </span>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          {getCvUrl(p) ? (
                            <a
                              href={getCvUrl(p)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-lg text-xs font-bold transition shadow-xs"
                            >
                              <FileText size={14} />
                              Lihat CV
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Tidak ada file</span>
                          )}
                        </td>

                        <td className="px-5 py-4 max-w-xs">
                          {p.pesan ? (
                            <button
                              onClick={() => setSelectedPelamar(p)}
                              className="text-left text-xs text-slate-600 hover:text-sky-600 line-clamp-2 underline decoration-dotted"
                            >
                              {p.pesan}
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Tanpa pesan</span>
                          )}
                        </td>

                        <td className="px-5 py-4 text-center whitespace-nowrap">
                          <select
                            value={p.status}
                            onChange={(e) => promptStatusChange(p, e.target.value)}
                            className={`text-xs font-bold rounded-lg px-2.5 py-1.5 outline-none border transition cursor-pointer ${
                              p.status === "diterima"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-black"
                                : p.status === "ditolak"
                                ? "bg-rose-50 text-rose-800 border-rose-300 font-black"
                                : p.status === "review"
                                ? "bg-sky-50 text-sky-800 border-sky-300"
                                : "bg-amber-50 text-amber-800 border-amber-300"
                            }`}
                          >
                            <option value="menunggu">⏳ Menunggu</option>
                            <option value="review">🔍 Sedang Review</option>
                            <option value="diterima">✅ Diterima</option>
                            <option value="ditolak">❌ Ditolak</option>
                          </select>
                        </td>

                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`https://wa.me/${formatWaNumber(p.no_telepon)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                              title="Kirim Pesan WhatsApp Langsung"
                            >
                              <MessageSquare size={17} />
                            </a>
                            <button
                              onClick={() => setSelectedPelamar(p)}
                              className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition"
                              title="Lihat Detail"
                            >
                              <Eye size={17} />
                            </button>
                            <button
                              onClick={() => handleDeletePelamar(p.id, p.nama)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Hapus"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
      | TAB 2: KELOLA LOWONGAN PEKERJAAN
      ======================================================== */}
      {activeTab === "lowongan" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-lg">Daftar Lowongan Tersedia</h3>
            <button
              onClick={() => {
                setEditingVacancy(null);
                setVacancyForm({
                  posisi: "",
                  lokasi: "Klinik Pusat",
                  tipe: "Full-time",
                  deskripsi: "",
                  kualifikasi: "",
                  is_active: true,
                });
                setModalVacancyOpen(true);
              }}
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition shadow-sm"
            >
              <Plus size={18} />
              Tambah Lowongan Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loadingVacancies ? (
              <div className="col-span-3 text-center py-12 text-slate-400">
                <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                Memuat lowongan...
              </div>
            ) : vacancies.length === 0 ? (
              <div className="col-span-3 text-center py-12 text-slate-400 bg-white rounded-2xl border border-slate-200">
                Belum ada lowongan pekerjaan. Silakan klik tombol "Tambah Lowongan Baru".
              </div>
            ) : (
              vacancies.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-sky-300 transition"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h4 className="font-bold text-slate-900 text-base leading-snug">{v.posisi}</h4>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          v.is_active
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {v.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                      <p>📍 {v.lokasi}</p>
                      <p>⏰ {v.tipe}</p>
                      <p className="font-semibold text-sky-700">
                        👥 {v.pelamars_count || 0} Pelamar Mendaftar
                      </p>
                    </div>

                    {v.deskripsi && (
                      <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                        {v.deskripsi}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingVacancy(v);
                        setVacancyForm({
                          posisi: v.posisi,
                          lokasi: v.lokasi,
                          tipe: v.tipe,
                          deskripsi: v.deskripsi || "",
                          kualifikasi: v.kualifikasi || "",
                          is_active: v.is_active,
                        });
                        setModalVacancyOpen(true);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteVacancy(v.id, v.posisi)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Trash2 size={14} /> Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================
      | MODAL: DETAIL PELAMAR
      ======================================================== */}
      {selectedPelamar && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setSelectedPelamar(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-4">
              Detail Berkas Pelamar
            </h3>

            <div className="space-y-4 text-sm">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs text-slate-500 font-semibold">Nama Lengkap</span>
                <p className="text-base font-bold text-slate-800 mt-0.5">{selectedPelamar.nama}</p>
                
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200/60 text-xs">
                  <div>
                    <span className="text-slate-400">Email:</span>
                    <p className="font-medium text-slate-700 mt-0.5">{selectedPelamar.email}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">WhatsApp:</span>
                    <p className="font-medium text-slate-700 mt-0.5">{selectedPelamar.no_telepon}</p>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-semibold">Posisi yang Dilamar:</span>
                <p className="text-sm font-bold text-sky-700 mt-1">{selectedPelamar.posisi}</p>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-semibold">Pesan Pengantar dari Pelamar:</span>
                <div className="mt-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 text-slate-700 text-xs leading-relaxed max-h-36 overflow-y-auto">
                  {selectedPelamar.pesan || <span className="italic text-slate-400">Tidak menyertakan pesan pengantar.</span>}
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 font-semibold">File CV / Resume:</span>
                <div className="mt-2">
                  {getCvUrl(selectedPelamar) ? (
                    <a
                      href={getCvUrl(selectedPelamar)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-sm transition shadow-sm"
                    >
                      <FileText size={18} />
                      Buka & Unduh File CV
                      <ExternalLink size={16} />
                    </a>
                  ) : (
                    <p className="text-xs text-rose-500 italic">File CV tidak ditemukan.</p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <span className="text-xs text-slate-500 font-semibold block mb-1.5">Ubah Status Lamaran & Kirim Notifikasi:</span>
                <div className="grid grid-cols-4 gap-2">
                  {["menunggu", "review", "diterima", "ditolak"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => promptStatusChange(selectedPelamar, st)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        selectedPelamar.status === st
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                      }`}
                    >
                      {st === "menunggu" && "Menunggu"}
                      {st === "review" && "Review"}
                      {st === "diterima" && "✅ Diterima"}
                      {st === "ditolak" && "❌ Ditolak"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
      | MODAL: TAMBAH / EDIT LOWONGAN
      ======================================================== */}
      {modalVacancyOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setModalVacancyOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-4">
              {editingVacancy ? "Edit Lowongan Karir" : "Tambah Lowongan Karir Baru"}
            </h3>

            <form onSubmit={handleSaveVacancy} className="space-y-4 text-sm">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Posisi Jabatan *</label>
                <input
                  type="text"
                  value={vacancyForm.posisi}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, posisi: e.target.value })}
                  placeholder="Contoh: Dokter Umum, Perawat, dll."
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Lokasi Penempatan *</label>
                  <input
                    type="text"
                    value={vacancyForm.lokasi}
                    onChange={(e) => setVacancyForm({ ...vacancyForm, lokasi: e.target.value })}
                    placeholder="Contoh: Jakarta Selatan"
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tipe Pekerjaan *</label>
                  <select
                    value={vacancyForm.tipe}
                    onChange={(e) => setVacancyForm({ ...vacancyForm, tipe: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500 bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Kontrak">Kontrak</option>
                    <option value="Magang">Magang</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Deskripsi Tugas</label>
                <textarea
                  value={vacancyForm.deskripsi}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, deskripsi: e.target.value })}
                  placeholder="Uraian tanggung jawab posisi ini..."
                  rows="3"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Kualifikasi Pelamar</label>
                <textarea
                  value={vacancyForm.kualifikasi}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, kualifikasi: e.target.value })}
                  placeholder="Syarat pendidikan, STR/SIP, pengalaman, dll."
                  rows="3"
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                ></textarea>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={vacancyForm.is_active}
                  onChange={(e) => setVacancyForm({ ...vacancyForm, is_active: e.target.checked })}
                  className="w-4 h-4 text-sky-600 rounded"
                />
                <label htmlFor="is_active" className="text-xs font-bold text-slate-700">
                  Tayangkan lowongan ini ke website publik
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setModalVacancyOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-sm transition shadow-sm"
                >
                  {editingVacancy ? "Simpan Perubahan" : "Buat Lowongan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
      | MODAL: KONFIRMASI NOTIFIKASI KEPUTUSAN PELAMAR
      ======================================================== */}
      {notificationModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden relative animate-in fade-in duration-200">
            {/* Header Modal */}
            <div
              className={`p-6 text-white ${
                notificationModal.targetStatus === "diterima"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-700"
                  : "bg-gradient-to-r from-rose-600 to-rose-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    {notificationModal.targetStatus === "diterima" ? (
                      <CheckCircle2 size={24} />
                    ) : (
                      <XCircle size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight">
                      {notificationModal.targetStatus === "diterima"
                        ? "Pemberitahuan: Pelamar Diterima"
                        : "Pemberitahuan: Pelamar Ditolak"}
                    </h3>
                    <p className="text-white/80 text-xs mt-0.5">
                      Kirimkan notifikasi ke Email, WhatsApp, dan Akun Web.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setNotificationModal({ ...notificationModal, isOpen: false })
                  }
                  className="p-1 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            {!notificationModal.completedResult ? (
              <form onSubmit={handleConfirmNotification} className="p-6 space-y-4 text-sm">
                {/* Info Pelamar */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-semibold block">Pelamar</span>
                    <strong className="text-slate-800 text-base">{notificationModal.pelamar?.nama}</strong>
                    <p className="text-xs text-slate-500 mt-0.5">{notificationModal.pelamar?.posisi}</p>
                  </div>
                  <span
                    className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                      notificationModal.targetStatus === "diterima"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-rose-100 text-rose-800 border border-rose-200"
                    }`}
                  >
                    {notificationModal.targetStatus}
                  </span>
                </div>

                {/* 3 Jalur Notifikasi */}
                <div>
                  <span className="text-xs font-bold text-slate-600 block mb-2">
                    Jalur Pemberitahuan Otomatis:
                  </span>
                  <div className="space-y-2">
                    {/* 1. Email */}
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={notificationModal.sendEmail}
                        onChange={(e) =>
                          setNotificationModal({ ...notificationModal, sendEmail: e.target.checked })
                        }
                        className="w-4 h-4 text-sky-600 rounded"
                      />
                      <Mail size={18} className="text-sky-600" />
                      <div className="text-xs">
                        <span className="font-bold text-slate-800">Kirim Email Resmi</span>
                        <p className="text-slate-500 font-mono text-[11px]">{notificationModal.pelamar?.email}</p>
                      </div>
                    </label>

                    {/* 2. WhatsApp */}
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={notificationModal.sendWhatsApp}
                        onChange={(e) =>
                          setNotificationModal({ ...notificationModal, sendWhatsApp: e.target.checked })
                        }
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <MessageSquare size={18} className="text-emerald-600" />
                      <div className="text-xs">
                        <span className="font-bold text-slate-800">Kirim WhatsApp / Telepon</span>
                        <p className="text-slate-500 font-mono text-[11px]">{notificationModal.pelamar?.no_telepon}</p>
                      </div>
                    </label>

                    {/* 3. Akun Website */}
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-sky-100 bg-sky-50/50">
                      <Bell size={18} className="text-sky-700" />
                      <div className="text-xs">
                        <span className="font-bold text-sky-900">Masuk ke Akun Website Pelamar</span>
                        <p className="text-sky-700 text-[11px]">Tercatat di lonceng notifikasi & status riwayat lamaran.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Catatan Khusus HRD */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Catatan / Pesan Tambahan HRD (Opsional):
                  </label>
                  <textarea
                    rows="3"
                    value={notificationModal.catatan}
                    onChange={(e) =>
                      setNotificationModal({ ...notificationModal, catatan: e.target.value })
                    }
                    placeholder={
                      notificationModal.targetStatus === "diterima"
                        ? "Contoh: Jadwal wawancara & tanda tangan kontrak pada hari Senin pukul 09.00 WIB di Klinik Pusat..."
                        : "Tuliskan pesan penutup atau saran untuk kandidat..."
                    }
                    className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                  ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      setNotificationModal({ ...notificationModal, isOpen: false })
                    }
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-50 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={notificationModal.submitting}
                    className={`px-5 py-2 text-white rounded-xl font-bold text-xs transition shadow-sm flex items-center gap-2 ${
                      notificationModal.targetStatus === "diterima"
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-rose-600 hover:bg-rose-700"
                    }`}
                  >
                    {notificationModal.submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Memproses Notifikasi...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Simpan & Kirim Notifikasi
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Success View */
              <div className="p-6 text-center space-y-5 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-800">
                    Pemberitahuan Berhasil Diproses!
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Status lamaran telah diperbarui menjadi{" "}
                    <strong className="uppercase font-bold text-slate-800">
                      {notificationModal.targetStatus}
                    </strong>.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 font-medium">
                    <CheckCircle2 size={15} />
                    <span>Email resmi telah dikirim ke {notificationModal.pelamar?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-medium">
                    <CheckCircle2 size={15} />
                    <span>Notifikasi akun website telah aktif</span>
                  </div>
                  <div className="flex items-center gap-2 text-sky-700 font-medium">
                    <MessageSquare size={15} />
                    <span>Pesan WhatsApp siap dikirimkan</span>
                  </div>
                </div>

                {notificationModal.completedResult.whatsapp_url && (
                  <a
                    href={notificationModal.completedResult.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10"
                  >
                    <MessageSquare size={16} />
                    Kirim Pesan WhatsApp Sekarang ({notificationModal.pelamar?.no_telepon})
                    <ExternalLink size={14} />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() =>
                    setNotificationModal({ ...notificationModal, isOpen: false, completedResult: null })
                  }
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                >
                  Selesai & Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

