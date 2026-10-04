import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Stethoscope, Activity, Heart, ShieldAlert, Pill, Calendar, User, Phone, Edit3, X, Check } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

export default function Layanan() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [bookingModal, setBookingModal] = useState(null); // stores active service to book, e.g., Poli Umum
  const [form, setForm] = useState({
    nama_pasien: "",
    no_telepon: "",
    tanggal: "",
    dokter: "",
    keluhan: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  const services = [
    {
      id: "umum",
      icon: <Stethoscope className="text-sky-600" size={32} />,
      title: "Poli Umum",
      price: "Rp 50.000",
      desc: "Layanan konsultasi kesehatan dasar, pemeriksaan fisik menyeluruh, penulisan resep obat, dan surat rujukan medis.",
      doctors: ["dr. Dicky Adrian, Sp.PD", "dr. Sarah Wijaya"],
    },
    {
      id: "gigi",
      icon: <Activity className="text-emerald-600" size={32} />,
      title: "Poli Gigi & Mulut",
      price: "Rp 120.000",
      desc: "Perawatan kesehatan gigi rutin, pembersihan karang gigi (scaling), tambal gigi, pencabutan gigi, dan konsultasi ortodonti.",
      doctors: ["drg. Amanda Putri", "drg. Yusuf Hamdan"],
    },
    {
      id: "anak",
      icon: <Heart className="text-rose-500" size={32} />,
      title: "Poli Anak (Pediatrik)",
      price: "Rp 100.000",
      desc: "Konsultasi tumbuh kembang anak, imunisasi/vaksinasi wajib dan tambahan, serta penanganan penyakit anak umum.",
      doctors: ["dr. Rian Hermawan, Sp.A", "dr. Linda Susanti, Sp.A"],
    },
    {
      id: "lab",
      icon: <ShieldAlert className="text-amber-500" size={32} />,
      title: "Laboratorium Klinik",
      price: "Rp 80.000",
      desc: "Pemeriksaan gula darah instan, kadar kolesterol total, asam urat, tes urine, dan pengambilan sampel darah klinis.",
      doctors: ["Analis Medis Bayu", "Analis Medis Citra"],
    },
    {
      id: "farmasi",
      icon: <Pill className="text-purple-600" size={32} />,
      title: "Apotek & Farmasi",
      price: "Harga Obat Variatif",
      desc: "Penyediaan obat-obatan resep dokter maupun obat bebas (OTC) berkualitas tinggi yang terjamin keasliannya.",
      doctors: ["Apoteker Siska, S.Farm", "Apoteker Rian, S.Farm"],
    },
  ];

  const handleBookingInit = (service) => {
    if (!isLoggedIn) {
      toast.info("Silakan masuk (login) terlebih dahulu untuk mendaftar antrean!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    const storedUser = localStorage.getItem("user");
    let initialName = "";
    let initialPhone = "";
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        initialName = u.name || "";
        initialPhone = u.no_telepon || "";
      } catch (e) {}
    }

    setBookingModal(service);
    setForm({
      nama_pasien: initialName,
      no_telepon: initialPhone,
      tanggal: new Date().toISOString().split("T")[0],
      dokter: service.doctors[0],
      keluhan: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama_pasien || !form.tanggal || !form.dokter) {
      toast.error("Harap isi semua kolom wajib!");
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        tanggal: form.tanggal,
        nama_pasien: form.nama_pasien,
        no_telepon: form.no_telepon,
        dokter: form.dokter,
        poli: bookingModal.title,
        keluhan: form.keluhan,
      };

      const res = await api.post("/riwayat-kunjungan-user", payload);

      if (res.data.success) {
        toast.success("Pendaftaran Antrean Layanan Berhasil!");
        setTimeout(() => {
          setBookingModal(null);
          navigate("/riwayat", { state: { tab: "kunjungan" } }); // Langsung buka tab Riwayat Kunjungan
        }, 1200);
      } else {
        toast.error(res.data.message || "Gagal melakukan pendaftaran antrean.");
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Terjadi kesalahan sistem saat mendaftar.";
      toast.error(errMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8 pt-24">
      <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      <div className="max-w-6xl mx-auto">
        
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-sky-600 font-bold uppercase tracking-wider text-sm">Layanan Medis Kami</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mt-2 tracking-tight">
            Pelayanan Profesional Untuk <br />
            <span className="bg-gradient-to-r from-sky-600 to-emerald-600 bg-clip-text text-transparent">
              Kesehatan Keluarga Anda
            </span>
          </h1>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-base">
            Klinik Bersama Plus menghadirkan berbagai jenis poli dan unit penunjang medis yang siap melayani kebutuhan konsultasi dan pengobatan Anda dengan standar kualitas tinggi.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:border-sky-200 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                  {srv.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">{srv.title}</h3>
                <span className="inline-block mt-2 px-3 py-1 bg-sky-50 text-sky-800 font-bold text-xs rounded-full">
                  Biaya Konsul: {srv.price}
                </span>
                <p className="text-slate-500 text-sm mt-4 leading-relaxed">{srv.desc}</p>
              </div>
              <div className="mt-8 border-t border-slate-50 pt-6">
                <button
                  onClick={() => handleBookingInit(srv)}
                  className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl text-sm transition active:scale-95 shadow-md shadow-sky-600/10 hover:shadow-sky-600/20"
                >
                  Daftar Antrean
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Booking Form Modal */}
      {bookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden relative animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setBookingModal(null)}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={20} />
            </button>

            <div className="p-6 md:p-8">
              <h3 className="text-xl font-bold text-slate-800">
                Pendaftaran Antrean: <span className="text-sky-600 block mt-1">{bookingModal.title}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">Harap lengkapi formulir pendaftaran konsultasi berikut ini.</p>

              <form onSubmit={handleFormSubmit} className="mt-6 space-y-4 text-sm">
                <div>
                  <label className="block text-slate-600 font-bold mb-1.5">Nama Pasien *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="nama_pasien"
                      value={form.nama_pasien}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama lengkap pasien"
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1.5">Nomor WhatsApp / HP *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type="tel"
                      name="no_telepon"
                      value={form.no_telepon}
                      onChange={handleInputChange}
                      placeholder="Contoh: 081234567890"
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1.5">Tanggal Kunjungan *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input
                        type="date"
                        name="tanggal"
                        value={form.tanggal}
                        onChange={handleInputChange}
                        className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1.5">Dokter Tujuan *</label>
                    <select
                      name="dokter"
                      value={form.dokter}
                      onChange={handleInputChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition bg-white"
                      required
                    >
                      {bookingModal.doctors.map((doc, idx) => (
                        <option key={idx} value={doc}>
                          {doc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1.5">Keluhan Utama (Opsional)</label>
                  <div className="relative">
                    <Edit3 className="absolute left-3 top-3 text-slate-400" size={18} />
                    <textarea
                      name="keluhan"
                      value={form.keluhan}
                      onChange={handleInputChange}
                      placeholder="Tuliskan keluhan atau gejala yang dirasakan..."
                      rows="3"
                      className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition"
                    ></textarea>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 active:scale-95 shadow-md shadow-sky-600/10 disabled:opacity-50"
                >
                  {bookingLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Check size={18} />
                      Konfirmasi Pendaftaran
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
