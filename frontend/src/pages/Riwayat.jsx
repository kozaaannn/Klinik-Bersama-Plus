import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import { Activity, Calendar, Stethoscope, ChevronRight, Clipboard, User, Briefcase, FileText, CheckCircle2, XCircle, Clock, ExternalLink, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Riwayat() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const requestedTab = searchParams.get("tab") || location.state?.tab || "pemeriksaan";

  const [activeTab, setActiveTab] = useState(requestedTab);
  const [riwayatPemeriksaan, setRiwayatPemeriksaan] = useState([]);
  const [riwayatKunjungan, setRiwayatKunjungan] = useState([]);
  const [riwayatLamaran, setRiwayatLamaran] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qTab = new URLSearchParams(location.search).get("tab");
    if (qTab) {
      setActiveTab(qTab);
    } else if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.search, location.state]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [pemeriksaanRes, kunjunganRes, lamaranRes] = await Promise.all([
          api.get("/user/pemeriksaan/riwayat"),
          api.get("/riwayat-kunjungan-user"),
          api.get("/user/lamaran"),
        ]);

        setRiwayatPemeriksaan(pemeriksaanRes.data.data || pemeriksaanRes.data || []);
        setRiwayatKunjungan(Array.isArray(kunjunganRes.data) ? kunjunganRes.data : (kunjunganRes.data?.data || []));
        setRiwayatLamaran(lamaranRes.data?.data || []);
      } catch (error) {
        console.error("❌ Gagal mengambil data riwayat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-sky-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold animate-pulse text-sm">Memuat data riwayat Anda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 pt-28">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-lg p-6 md:p-8 space-y-8 border border-slate-100">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Riwayat Kesehatan</h1>
            <p className="text-slate-500 text-sm mt-1">Pantau hasil pemeriksaan medis dan riwayat antrean konsultasi Anda.</p>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto font-bold text-sm">
            <button
              onClick={() => setActiveTab("pemeriksaan")}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "pemeriksaan"
                  ? "bg-white text-sky-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <Activity size={16} />
              Riwayat Pemeriksaan
            </button>
            <button
              onClick={() => setActiveTab("kunjungan")}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "kunjungan"
                  ? "bg-white text-sky-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <Calendar size={16} />
              Riwayat Kunjungan
            </button>
            <button
              onClick={() => setActiveTab("lamaran")}
              className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === "lamaran"
                  ? "bg-white text-sky-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              <Briefcase size={16} />
              Status Lamaran Karir
              {riwayatLamaran.length > 0 && (
                <span className="ml-1 px-2 py-0.5 text-xs font-black rounded-full bg-sky-100 text-sky-800">
                  {riwayatLamaran.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab 1 Content: Riwayat Pemeriksaan */}
        {activeTab === "pemeriksaan" && (
          <div className="space-y-6">
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-100">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-4">Tanggal / Waktu</th>
                    <th className="p-4">Nama Pasien</th>
                    <th className="p-4">Tinggi / Berat</th>
                    <th className="p-4">Tekanan Darah</th>
                    <th className="p-4 text-sky-700 bg-sky-50/50">Gula Darah</th>
                    <th className="p-4 text-emerald-700 bg-emerald-50/50">Kolesterol</th>
                    <th className="p-4 text-rose-700 bg-rose-50/50">Asam Urat</th>
                    <th className="p-4">Hasil Diagnosis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {riwayatPemeriksaan.length > 0 ? (
                    riwayatPemeriksaan.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-medium text-slate-500">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                          <span className="block text-[10px] mt-0.5 text-slate-400">{item.waktu_pemeriksaan || "-"}</span>
                        </td>
                        <td className="p-4 font-bold text-slate-800">{item.nama}</td>
                        <td className="p-4 text-slate-600">{item.tinggi_badan} cm / {item.berat_badan} kg</td>
                        <td className="p-4 text-slate-600 font-mono">{item.tekanan_darah} mmHg</td>
                        <td className="p-4 font-bold text-sky-700 bg-sky-50/30">{item.gula_darah} mg/dL</td>
                        <td className="p-4 font-bold text-emerald-700 bg-emerald-50/30">{item.kolesterol} mg/dL</td>
                        <td className="p-4 font-bold text-rose-700 bg-rose-50/30">{item.asam_urat} mg/dL</td>
                        <td className="p-4 font-semibold text-slate-700">{item.hasil_pemeriksaan}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="p-10 text-center text-slate-400 italic">
                        Belum ada riwayat pemeriksaan klinis.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Layout for checkups */}
            <div className="block md:hidden space-y-4">
              {riwayatPemeriksaan.length > 0 ? (
                riwayatPemeriksaan.map((item, i) => (
                  <div key={i} className="border border-slate-150 rounded-2xl p-5 bg-white shadow-sm space-y-3">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="font-bold text-slate-800">{item.nama}</h4>
                        <span className="text-xs text-slate-400">
                          {item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"} | {item.waktu_pemeriksaan || "-"}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 bg-sky-50 text-sky-800 rounded-full font-bold text-[10px] uppercase">Pemeriksaan</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <p><span className="text-slate-400">Tinggi / Berat:</span> <strong className="text-slate-700">{item.tinggi_badan}cm / {item.berat_badan}kg</strong></p>
                      <p><span className="text-slate-400">Tensi:</span> <strong className="text-slate-700 font-mono">{item.tekanan_darah}</strong></p>
                      <p className="bg-sky-50/50 p-1.5 rounded-lg"><span className="text-sky-700 font-semibold block">Gula Darah:</span> <strong className="text-sky-800 text-sm">{item.gula_darah} mg/dL</strong></p>
                      <p className="bg-emerald-50/50 p-1.5 rounded-lg"><span className="text-emerald-700 font-semibold block">Kolesterol:</span> <strong className="text-emerald-800 text-sm">{item.kolesterol} mg/dL</strong></p>
                      <p className="bg-rose-50/50 p-1.5 rounded-lg col-span-2"><span className="text-rose-700 font-semibold block">Asam Urat:</span> <strong className="text-rose-800 text-sm">{item.asam_urat} mg/dL</strong></p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-400 block font-medium">Hasil Diagnosis:</span>
                      <p className="text-slate-800 font-bold mt-0.5">{item.hasil_pemeriksaan}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-400 italic py-6">Belum ada riwayat pemeriksaan klinis.</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 2 Content: Riwayat Kunjungan */}
        {activeTab === "kunjungan" && (
          <div className="space-y-6">
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-100">
              <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-4">Tanggal Kunjungan</th>
                    <th className="p-4">Nama Pasien</th>
                    <th className="p-4">Unit / Poli</th>
                    <th className="p-4">Dokter Konsultan</th>
                    <th className="p-4">Keluhan Utama</th>
                    <th className="p-4">Status / Catatan Dokter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {riwayatKunjungan.length > 0 ? (
                    riwayatKunjungan.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition">
                        <td className="p-4 font-medium text-slate-500">
                          {item.tanggal ? new Date(item.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }) : "-"}
                        </td>
                        <td className="p-4 font-bold text-slate-800">{item.nama_pasien}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-sky-50 text-sky-800 font-bold text-xs rounded-full">
                            {item.poli}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-slate-700">{item.dokter}</td>
                        <td className="p-4 text-slate-600 italic">"{item.keluhan || "-"}"</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 font-bold text-xs rounded-full ${
                            item.catatan?.includes("Menunggu")
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-100"
                          }`}>
                            {item.catatan || "Terdaftar"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-10 text-center text-slate-400 italic">
                        Belum ada riwayat antrean kunjungan/konsultasi.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Layout for visits */}
            <div className="block md:hidden space-y-4">
              {riwayatKunjungan.length > 0 ? (
                riwayatKunjungan.map((item, i) => (
                  <div key={i} className="border border-slate-150 rounded-2xl p-5 bg-white shadow-sm space-y-3">
                    <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                      <div>
                        <h4 className="font-bold text-slate-800">{item.nama_pasien}</h4>
                        <span className="text-xs text-slate-400">
                          {item.tanggal ? new Date(item.tanggal).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full font-bold text-[10px] uppercase">Kunjungan</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <p><span className="text-slate-400">Poli/Unit:</span> <strong className="text-slate-700">{item.poli}</strong></p>
                      <p><span className="text-slate-400">Dokter:</span> <strong className="text-slate-700">{item.dokter}</strong></p>
                      <p><span className="text-slate-400">Keluhan:</span> <span className="italic">"{item.keluhan || "-"}"</span></p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-slate-400 text-xs font-medium">Status & Catatan:</span>
                      <span className={`px-3 py-1 font-bold text-[10px] rounded-full uppercase ${
                        item.catatan?.includes("Menunggu")
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-100"
                      }`}>
                        {item.catatan || "Terdaftar"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-400 italic py-6">Belum ada riwayat antrean kunjungan/konsultasi.</p>
              )}
            </div>
          </div>
        )}

        {/* Tab 3 Content: Status Lamaran Karir */}
        {activeTab === "lamaran" && (
          <div className="space-y-6">
            {riwayatLamaran.length === 0 ? (
              <div className="text-center py-16 px-4 bg-slate-50/70 rounded-3xl border border-dashed border-slate-200">
                <div className="w-16 h-16 rounded-3xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-4">
                  <Briefcase size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  Belum Ada Lamaran Pekerjaan
                </h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                  Anda belum pernah mengirimkan berkas lamaran pekerjaan di Klinik Bersama Plus.
                </p>
                <Link
                  to="/karir"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-2xl text-sm transition shadow-md shadow-sky-600/10"
                >
                  <Briefcase size={16} />
                  Lihat Lowongan Karir Tersedia
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {riwayatLamaran.map((lamaran) => (
                  <div
                    key={lamaran.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:border-sky-200 hover:shadow-md transition duration-300"
                  >
                    {/* Header Card Status */}
                    <div
                      className={`p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        lamaran.status === "diterima"
                          ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100"
                          : lamaran.status === "ditolak"
                          ? "bg-gradient-to-r from-rose-50 to-orange-50 border-rose-100"
                          : lamaran.status === "review"
                          ? "bg-gradient-to-r from-sky-50 to-indigo-50 border-sky-100"
                          : "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                            lamaran.status === "diterima"
                              ? "bg-emerald-600 text-white"
                              : lamaran.status === "ditolak"
                              ? "bg-rose-600 text-white"
                              : lamaran.status === "review"
                              ? "bg-sky-600 text-white"
                              : "bg-amber-500 text-white"
                          }`}
                        >
                          {lamaran.status === "diterima" ? (
                            <CheckCircle2 size={24} />
                          ) : lamaran.status === "ditolak" ? (
                            <XCircle size={24} />
                          ) : lamaran.status === "review" ? (
                            <Clock size={24} />
                          ) : (
                            <Briefcase size={24} />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">
                              {lamaran.posisi}
                            </h3>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Diajukan pada:{" "}
                            <strong>
                              {new Date(lamaran.created_at).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })}
                            </strong>
                          </p>
                        </div>
                      </div>

                      {/* Status Pill */}
                      <div>
                        {lamaran.status === "diterima" ? (
                          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-emerald-600 text-white shadow-sm">
                            <CheckCircle2 size={14} /> DITERIMA
                          </span>
                        ) : lamaran.status === "ditolak" ? (
                          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-rose-600 text-white shadow-sm">
                            <XCircle size={14} /> BELUM DAPAT DITERIMA
                          </span>
                        ) : lamaran.status === "review" ? (
                          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-sky-600 text-white shadow-sm">
                            <Clock size={14} /> SEDANG DITINJAU
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black bg-amber-500 text-white shadow-sm">
                            <Clock size={14} /> MENUNGGU SELEKSI
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Announcement Body */}
                    <div className="p-6 md:p-8 space-y-5">
                      {lamaran.status === "diterima" && (
                        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 text-emerald-900 text-sm leading-relaxed">
                          <h4 className="font-extrabold text-emerald-800 text-base mb-1.5 flex items-center gap-2">
                            🎉 Selamat! Anda Lolos Seleksi & Diterima
                          </h4>
                          <p>
                            Berdasarkan hasil penilaian berkas dan kualifikasi yang Anda kirimkan, kami dengan senang hati menginformasikan bahwa Anda dinyatakan <strong>DITERIMA</strong> untuk posisi <strong>{lamaran.posisi}</strong> di Klinik Bersama Plus.
                          </p>
                          <div className="mt-3 pt-3 border-t border-emerald-200/60 text-xs text-emerald-800 space-y-1">
                            <p>📧 Notifikasi resmi telah dikirim ke email: <strong>{lamaran.email}</strong></p>
                            <p>📱 Tim HRD kami juga telah menghubungi Anda di WhatsApp: <strong>{lamaran.no_telepon}</strong></p>
                          </div>
                        </div>
                      )}

                      {lamaran.status === "ditolak" && (
                        <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-5 text-rose-900 text-sm leading-relaxed">
                          <h4 className="font-extrabold text-rose-800 text-base mb-1.5 flex items-center gap-2">
                            Pemberitahuan Hasil Seleksi
                          </h4>
                          <p>
                            Terima kasih atas minat dan antusiasme Anda melamar posisi <strong>{lamaran.posisi}</strong> di Klinik Bersama Plus. Setelah melalui proses seleksi yang ketat, saat ini kami belum dapat memproses lamaran Anda ke tahap berikutnya. Berkas Anda tetap tersimpan dalam bank data kandidat kami untuk peluang lowongan di masa depan.
                          </p>
                          <div className="mt-3 pt-3 border-t border-rose-200/60 text-xs text-rose-800">
                            <p>📧 Salinan hasil seleksi telah dikirimkan ke email: <strong>{lamaran.email}</strong></p>
                          </div>
                        </div>
                      )}

                      {lamaran.status === "review" && (
                        <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-5 text-sky-900 text-sm leading-relaxed">
                          <h4 className="font-extrabold text-sky-800 text-base mb-1.5 flex items-center gap-2">
                            🔍 Berkas Sedang Ditinjau Tim HRD
                          </h4>
                          <p>
                            Berkas lamaran dan CV Anda untuk posisi <strong>{lamaran.posisi}</strong> saat ini sedang dalam proses review mendalam oleh tim rekrutmen kami. Silakan pantau email dan akun website Anda secara berkala.
                          </p>
                        </div>
                      )}

                      {lamaran.status === "menunggu" && (
                        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 text-amber-900 text-sm leading-relaxed">
                          <h4 className="font-extrabold text-amber-800 text-base mb-1.5 flex items-center gap-2">
                            ⏳ Berkas Masuk Dalam Antrean Seleksi
                          </h4>
                          <p>
                            Berkas lamaran Anda telah berhasil diterima oleh sistem Klinik Bersama Plus dan sedang menunggu giliran peninjauan oleh tim rekrutmen.
                          </p>
                        </div>
                      )}

                      {/* Catatan Khusus HRD jika ada */}
                      {lamaran.catatan && (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
                          <span className="font-bold text-slate-700 block mb-1">
                            Pesan / Catatan Tambahan dari HRD:
                          </span>
                          <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                            {lamaran.catatan}
                          </p>
                        </div>
                      )}

                      {/* Rincian Berkas CV & Kontak */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs text-slate-500">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5">
                            <Mail size={14} className="text-slate-400" />
                            {lamaran.email}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Phone size={14} className="text-slate-400" />
                            {lamaran.no_telepon}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {lamaran.cv_url && (
                            <a
                              href={lamaran.cv_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
                            >
                              <FileText size={14} />
                              Lihat CV Terkirim
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
