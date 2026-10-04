import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Trash2, Eye, Search, X, User, Mail, Phone, Calendar, Clipboard, HeartPulse } from "lucide-react";
import { toast } from "react-toastify";

export default function DataPasien() {
  const [pasienList, setPasienList] = useState([]);
  const [filteredPasien, setFilteredPasien] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // State untuk modal detail riwayat pasien
  const [selectedPasien, setSelectedPasien] = useState(null);
  const [riwayatKunjungan, setRiwayatKunjungan] = useState([]);
  const [riwayatPemeriksaan, setRiwayatPemeriksaan] = useState([]);
  const [modalTab, setModalTab] = useState("pemeriksaan"); // "pemeriksaan" atau "kunjungan"
  const [loadingDetail, setLoadingDetail] = useState(false);

  const navigate = useNavigate();

  const fetchPasien = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/pasien");
      const fetched = response.data.data || [];
      setPasienList(fetched);
      setFilteredPasien(fetched);
    } catch (error) {
      console.error("❌ Gagal mengambil data pasien:", error);
      toast.error("Gagal mengambil data pasien");
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPasien();
  }, []);

  // Filter pencarian
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    if (search.trim() === "") {
      setFilteredPasien(pasienList);
      return;
    }
    const filtered = pasienList.filter(
      (item) =>
        item.name?.toLowerCase().includes(lowerSearch) ||
        item.email?.toLowerCase().includes(lowerSearch) ||
        item.no_telepon?.toLowerCase().includes(lowerSearch)
    );
    setFilteredPasien(filtered);
  }, [search, pasienList]);

  // Hapus pasien
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus akun pasien "${name}"? Semua data rekam medis dan kunjungan pasien tersebut akan tetap ada di database, tetapi akun user akan dihapus.`)) return;

    try {
      await api.delete(`/admin/pasien/${id}`);
      toast.success("Akun pasien berhasil dihapus!");
      setPasienList((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("❌ Gagal menghapus pasien:", error);
      toast.error(error.response?.data?.message || "Gagal menghapus pasien!");
    }
  };

  // Lihat Detail Pasien (Riwayat)
  const handleViewDetail = async (pasien) => {
    setSelectedPasien(pasien);
    setLoadingDetail(true);
    setModalTab("pemeriksaan");
    
    try {
      // 1. Fetch riwayat kunjungan dari endpoint: /api/admin/riwayat-kunjungan/user/{no_telepon}
      let kunjunganData = [];
      if (pasien.no_telepon) {
        try {
          const resKunjungan = await api.get(`/admin/riwayat-kunjungan/user/${pasien.no_telepon}`);
          kunjunganData = resKunjungan.data || [];
        } catch (err) {
          console.error("Gagal mengambil riwayat kunjungan:", err);
        }
      }

      // 2. Fetch pemeriksaan (rekam medis) dari /api/admin/pemeriksaan dan filter berdasarkan no telepon
      let pemeriksaanData = [];
      try {
        const resPemeriksaan = await api.get("/admin/pemeriksaan");
        const allPemeriksaan = resPemeriksaan.data.data || [];
        // Filter di frontend berdasarkan nomor telepon pasien
        if (pasien.no_telepon) {
          pemeriksaanData = allPemeriksaan.filter(
            (p) => p.no_telepon === pasien.no_telepon
          );
        }
      } catch (err) {
        console.error("Gagal mengambil riwayat pemeriksaan:", err);
      }

      setRiwayatKunjungan(kunjunganData);
      setRiwayatPemeriksaan(pemeriksaanData);
    } catch (error) {
      console.error("Gagal memuat detail riwayat:", error);
      toast.error("Gagal memuat riwayat medis pasien.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 text-base animate-pulse">Memuat data pasien...</p>
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
              👥 Data Pasien Terdaftar
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Daftar seluruh pasien yang terdaftar di sistem aplikasi Klinik Bersama Plus.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama, email, no telepon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Patients Table */}
        {filteredPasien.length === 0 ? (
          <div className="p-8 text-center text-gray-500 italic border border-dashed border-gray-200 rounded-2xl bg-gray-50">
            {pasienList.length === 0 ? "Belum ada data pasien terdaftar." : "Pasien tidak ditemukan."}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm border-collapse text-left">
              <thead className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-3 font-semibold text-center w-12">No</th>
                  <th className="p-3 font-semibold">Nama Pasien</th>
                  <th className="p-3 font-semibold">Email</th>
                  <th className="p-3 font-semibold">No. Telepon</th>
                  <th className="p-3 font-semibold">Tanggal Daftar</th>
                  <th className="p-3 font-semibold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredPasien.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`transition-colors border-b ${
                      index % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                    } hover:bg-blue-50/30`}
                  >
                    <td className="p-3 text-center font-medium text-gray-600">{index + 1}</td>
                    <td className="p-3 font-semibold text-gray-800">{item.name}</td>
                    <td className="p-3 text-gray-600">{item.email}</td>
                    <td className="p-3 text-gray-600 font-mono">{item.no_telepon || "-"}</td>
                    <td className="p-3 text-gray-500">{formatDate(item.created_at)}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewDetail(item)}
                          title="Lihat Riwayat Medis"
                          className="flex items-center justify-center p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          title="Hapus Akun Pasien"
                          className="flex items-center justify-center p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
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

      {/* ======================================================
      | 🏥 MODAL DETAIL RIWAYAT MEDIS PASIEN
      ====================================================== */}
      {selectedPasien && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform scale-100 transition-all">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <User size={20} /> Rekam Medis & Riwayat Kunjungan
                </h3>
                <p className="text-xs text-blue-100 mt-1">
                  Pasien: {selectedPasien.name} ({selectedPasien.no_telepon || "No HP tidak ada"})
                </p>
              </div>
              <button
                onClick={() => setSelectedPasien(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content Wrapper */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* Profile Overview Card */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <User className="text-blue-600" size={16} />
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase">Nama Lengkap</p>
                    <p className="font-semibold">{selectedPasien.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="text-blue-600" size={16} />
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase">Email Pasien</p>
                    <p className="font-semibold break-all">{selectedPasien.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="text-blue-600" size={16} />
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase">No. Telepon</p>
                    <p className="font-semibold font-mono">{selectedPasien.no_telepon || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Tabs Selector */}
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  onClick={() => setModalTab("pemeriksaan")}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
                    modalTab === "pemeriksaan"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <HeartPulse size={16} /> Rekam Medis (Checkup)
                </button>
                <button
                  onClick={() => setModalTab("kunjungan")}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold border-b-2 transition-all ${
                    modalTab === "kunjungan"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Clipboard size={16} /> Riwayat Kunjungan & Antrean
                </button>
              </div>

              {/* Loading Detail State */}
              {loadingDetail ? (
                <div className="py-12 flex flex-col justify-center items-center">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-sm text-gray-500">Memuat data medis...</p>
                </div>
              ) : (
                <div>
                  {/* ====== TAB 1: REKAM MEDIS ====== */}
                  {modalTab === "pemeriksaan" && (
                    <div>
                      {riwayatPemeriksaan.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                          Tidak ada data rekam medis untuk pasien ini.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {riwayatPemeriksaan.map((item, index) => (
                            <div
                              key={item.id || index}
                              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-blue-200 transition-colors"
                            >
                              <div className="flex flex-col md:flex-row md:justify-between border-b pb-2 mb-3">
                                <div>
                                  <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
                                    Hasil: {item.hasil_pemeriksaan}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-400 flex items-center gap-1 mt-1 md:mt-0 font-medium">
                                  <Calendar size={12} /> Pemeriksaan: {item.waktu_pemeriksaan || formatDate(item.created_at)}
                                </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div>
                                  <span className="text-xs text-gray-400 block">Tinggi / Berat Badan</span>
                                  <span className="font-medium text-gray-800">{item.tinggi_badan || "-"} cm / {item.berat_badan || "-"} kg</span>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-400 block">Tekanan Darah</span>
                                  <span className="font-medium text-gray-800">{item.tekanan_darah || "-"} mmHg</span>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-400 block">Gula Darah</span>
                                  <span className="font-medium text-gray-800">{item.gula_darah || "-"} mg/dL</span>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-400 block">Kolesterol</span>
                                  <span className="font-medium text-gray-800">{item.kolesterol || "-"} mg/dL</span>
                                </div>
                                <div>
                                  <span className="text-xs text-gray-400 block">Asam Urat</span>
                                  <span className="font-medium text-gray-800">{item.asam_urat || "-"} mg/dL</span>
                                </div>
                                <div className="col-span-2 md:col-span-3">
                                  <span className="text-xs text-gray-400 block">Catatan Tambahan / Hasil</span>
                                  <span className="font-semibold text-blue-700">{item.hasil_pemeriksaan || "-"}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ====== TAB 2: RIWAYAT KUNJUNGAN ====== */}
                  {modalTab === "kunjungan" && (
                    <div>
                      {riwayatKunjungan.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                          Tidak ada riwayat kunjungan untuk pasien ini.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {riwayatKunjungan.map((item, index) => (
                            <div
                              key={item.id || index}
                              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-blue-200 transition-colors"
                            >
                              <div className="flex flex-col md:flex-row md:justify-between border-b pb-2 mb-3">
                                <div className="flex flex-wrap gap-2 items-center">
                                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                    Poli: {item.poli}
                                  </span>
                                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                                    Dokter: {item.dokter}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-400 flex items-center gap-1 mt-1 md:mt-0 font-medium">
                                  <Calendar size={12} /> Tanggal Kunjungan: {formatDate(item.tanggal)}
                                </div>
                              </div>

                              <div className="space-y-2 text-sm text-gray-700">
                                <div>
                                  <span className="text-xs text-gray-400 block">Keluhan</span>
                                  <span className="font-medium text-gray-800">{item.keluhan || "Tidak ada keluhan."}</span>
                                </div>
                                <div className="pt-2 border-t border-gray-50">
                                  <span className="text-xs text-gray-400 block">Catatan Medis / Diagnosa</span>
                                  <span className="font-medium text-blue-700 italic">
                                    {item.catatan || "Belum ada catatan dari dokter."}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
              <button
                onClick={() => setSelectedPasien(null)}
                className="px-5 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
