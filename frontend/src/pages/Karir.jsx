import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { Briefcase, MapPin, Clock, FileText, Send, X, CheckCircle2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

export default function Karir() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applied, setApplied] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    cv: null,
    message: "",
  });

  const fetchVacancies = async () => {
    try {
      const res = await api.get("/public/karir");
      setVacancies(res.data || []);
    } catch (error) {
      console.error("Gagal memuat lowongan:", error);
      // Fallback data jika server offline atau error
      setVacancies([
        { id: 1, posisi: "Perawat Klinik", lokasi: "Jakarta Selatan", tipe: "Full-time" },
        { id: 2, posisi: "Dokter Umum", lokasi: "Bandung Kota", tipe: "Full-time" },
        { id: 3, posisi: "Apoteker", lokasi: "Surabaya Pusat", tipe: "Part-time" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();

    // Ambil data user yang sedang login untuk auto-fill
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/user/profile")
        .then((res) => {
          const u = res.data?.user || res.data;
          setCurrentUser(u);
        })
        .catch(() => {});
    }
  }, []);

  const [submitting, setSubmitting] = useState(false);

  const handleApply = (job) => {
    setSelectedJob(job);
    setApplied(false);
    setForm({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      phone: currentUser?.no_telepon || "",
      cv: null,
      message: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, cv: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.cv) {
      toast.error("Harap isi semua kolom wajib!");
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("nama", form.name);
      data.append("email", form.email);
      data.append("no_telepon", form.phone);
      data.append("posisi", selectedJob.posisi);
      if (selectedJob.id) {
        data.append("karir_id", selectedJob.id);
      }
      if (form.message) {
        data.append("pesan", form.message);
      }
      data.append("cv", form.cv);

      const res = await api.post("/public/karir/apply", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setApplied(true);
        toast.success(res.data.message || "Lamaran berhasil dikirim!");
        setTimeout(() => {
          setSelectedJob(null);
          setApplied(false);
        }, 2500);
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Gagal mengirim lamaran. Pastikan format file sesuai.";
      toast.error(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8 pt-24">
      <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-sky-600 font-bold uppercase tracking-wider text-sm">Bergabung Bersama Kami</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mt-2 tracking-tight">
            Bangun Karir Anda di <br />
            <span className="bg-gradient-to-r from-sky-600 to-rose-600 bg-clip-text text-transparent">
              Klinik Bersama Plus
            </span>
          </h1>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-base">
            Kami mencari tenaga medis dan profesional berbakat untuk memberikan pelayanan kesehatan terbaik kepada masyarakat. Temukan lowongan yang sesuai dengan keahlian Anda.
          </p>
        </div>

        {/* Career Status Check Banner for Logged-in User */}
        {currentUser && (
          <div className="bg-sky-50/80 border border-sky-200/90 rounded-3xl p-5 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-600/20">
                <Briefcase size={22} />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">
                  Sudah Pernah Mengajukan Lamaran?
                </h4>
                <p className="text-slate-500 text-xs mt-0.5">
                  Pantau pengumuman hasil seleksi, status lamaran, dan instruksi interview di akun web Anda.
                </p>
              </div>
            </div>
            <Link
              to="/riwayat?tab=lamaran"
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow-sm whitespace-nowrap"
            >
              Cek Status Lamaran Saya →
            </Link>
          </div>
        )}

        {/* Vacancies Section */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vacancies.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 hover:border-sky-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 mb-6">
                    <Briefcase size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 tracking-tight leading-snug">
                    {job.posisi}
                  </h3>
                  <div className="flex flex-col gap-2.5 mt-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-slate-400" />
                      <span>{job.lokasi || "Klinik Pusat"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-400" />
                      <span>{job.tipe || "Full-time"}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mt-5 leading-relaxed">
                    {job.deskripsi ||
                      `Bergabunglah sebagai ${job.posisi} dan berkontribusi langsung dalam memberikan pelayanan medis bermutu tinggi bagi pasien kami.`}
                  </p>
                </div>
                <div className="mt-8 border-t border-slate-100 pt-6">
                  <button
                    onClick={() => handleApply(job)}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl text-sm transition active:scale-95 shadow-md shadow-sky-600/10 hover:shadow-sky-600/20"
                  >
                    Lamar Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-20 bg-gradient-to-br from-sky-700 to-sky-800 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 max-w-3xl">
            <h3 className="text-2xl font-extrabold mb-4">Tidak Menemukan Posisi yang Sesuai?</h3>
            <p className="text-sky-100 text-base leading-relaxed">
              Kirimkan CV dan portofolio Anda ke email rekrutmen kami di <strong className="text-white">careers@klinikbersamaplus.com</strong>. Kami akan menghubungi Anda jika ada posisi baru yang cocok dengan latar belakang Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/55 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={20} />
            </button>

            {!applied ? (
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-slate-800 pr-8 leading-snug">
                  Formulir Lamaran: <span className="text-sky-600 block mt-1">{selectedJob.posisi}</span>
                </h3>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-sm">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1.5">Nama Lengkap *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleFormChange}
                      placeholder="Masukkan nama lengkap Anda"
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 font-bold mb-1.5">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleFormChange}
                        placeholder="nama@email.com"
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-bold mb-1.5">Nomor Telepon *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleFormChange}
                        placeholder="081234567890"
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1.5">Unggah CV (PDF / DOC / DOCX) *</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:border-sky-400 transition cursor-pointer relative bg-slate-50">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        required
                        disabled={submitting}
                      />
                      <FileText className="mx-auto text-slate-400 mb-2" size={32} />
                      <p className="text-slate-600 font-semibold text-xs">
                        {form.cv ? form.cv.name : "Klik untuk memilih file CV Anda"}
                      </p>
                      <span className="text-[10px] text-slate-400">PDF, DOC, DOCX (Maks. 10MB)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-bold mb-1.5">Pesan / Pengantar (Opsional)</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleFormChange}
                      placeholder="Tulis pesan singkat untuk HRD kami"
                      rows="3"
                      disabled={submitting}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-sky-600/10"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Mengirim Berkas...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Kirim Lamaran Pekerjaan</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="p-8 text-center flex flex-col items-center">
                <CheckCircle2 className="text-emerald-500 w-16 h-16 mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-slate-800">Lamaran Dikirim!</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-sm">
                  Terima kasih telah melamar. Tim HRD kami akan meninjau lamaran Anda dan segera menghubungi Anda melalui email atau telepon.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
