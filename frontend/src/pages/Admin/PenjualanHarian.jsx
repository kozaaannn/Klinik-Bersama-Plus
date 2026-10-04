import { useState, useEffect } from "react";
import axios from "axios";
import { ShoppingCart, RefreshCcw } from "lucide-react";

export default function PenjualanHarian() {
  const [stokOptions, setStokOptions] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    nama_pasien: "",
    stok_obat_id: "",
    jenis_penjualan: "Eceran",
    jumlah: 1,
    metode_pembayaran: "Tunai",
  });
  const token = localStorage.getItem("token");

  const formatCurrency = (val) => {
    if (val === null || val === undefined) return "Rp 0";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val);
  };

  const fetchStok = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/admin/stok-obat", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStokOptions(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil stok:", err);
    }
  };

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/admin/penjualan-harian", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSales(res.data.data || []);
    } catch (err) {
      console.error("Gagal ambil penjualan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStok();
    fetchSales();
  }, []);

  // ==============================================
  // 🔥 FUNGSI HITUNG HARGA
  // ==============================================
  const selectedStok = stokOptions.find(
    (s) => String(s.id) === String(form.stok_obat_id)
  );

  const getHargaSatuan = () => {
    if (!selectedStok) return 0;

    if (form.jenis_penjualan === "Pack") {
      return Number(selectedStok.harga_pack || 0);
    }

    // Harga Eceran dari model
    return Number(selectedStok.harga_ecer || 0);
  };

  const subtotal =
    selectedStok ? getHargaSatuan() * Number(form.jumlah || 1) : 0;

  const totalPendapatan = sales.reduce(
    (acc, cur) => acc + Number(cur.total_harga || 0),
    0
  );

  // ==============================================
  // 🔥 SUBMIT
  // ==============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.stok_obat_id) return alert("Pilih obat terlebih dahulu");

    const selected = selectedStok;
    const maxAvailable = form.jenis_penjualan === "Pack" ? Number(selected?.stok_pack || 0) : Number(selected?.qty_total || 0);
    if (selected && Number(form.jumlah) > maxAvailable) {
      return alert(`⚠️ Stok tidak mencukupi. Sisa stok: ${maxAvailable} ${form.jenis_penjualan === "Pack" ? "pack" : "ecer"}`);
    }

    const payload = {
      ...form,
      total_harga: subtotal, // dikirim ke backend
    };

    try {
      const res = await axios.post(
        "http://localhost:8000/api/admin/penjualan-harian",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Penjualan berhasil ditambahkan");
      setSales((prev) => [res.data.data, ...prev]);
      fetchStok();

      setForm({
        nama_pasien: "",
        stok_obat_id: "",
        jenis_penjualan: "Eceran",
        jumlah: 1,
        metode_pembayaran: "Tunai",
      });
    } catch (err) {
      console.error("Gagal tambah penjualan:", err);
      alert("Stok tidak cukup");
    }
  };

  // ==============================================
  // 🔥 HAPUS DATA
  // ==============================================
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus penjualan ini?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/penjualan-harian/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Penjualan dihapus");
      setSales((prev) => prev.filter((s) => s.id !== id));
      fetchStok();
    } catch (err) {
      console.error("Gagal hapus:", err);
      alert("❌ Gagal menghapus penjualan");
    }
  };

  // ==============================================
  // 🔍 FILTER TABEL
  // ==============================================
  const filteredSales = sales.filter(
    (s) =>
      s.nama_pasien?.toLowerCase().includes(search.toLowerCase()) ||
      s.nama_obat?.toLowerCase().includes(search.toLowerCase())
  );

  // ==============================================
  // 🔥 RENDER UI
  // ==============================================
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
              <ShoppingCart size={24} className="text-blue-600" /> Penjualan Harian
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Catatan transaksi penjualan obat harian secara eceran maupun pack.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={fetchSales}
              className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center gap-2"
            >
              <RefreshCcw size={16} /> Refresh
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-6 bg-gray-50/50 p-4 rounded-2xl border border-gray-200 text-sm"
        >
          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Nama Pasien
            </label>
            <input
              type="text"
              value={form.nama_pasien}
              onChange={(e) => setForm({ ...form, nama_pasien: e.target.value })}
              placeholder="Masukkan nama pasien"
              className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              required
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Pilih Obat
            </label>
            <select
              value={form.stok_obat_id}
              onChange={(e) => setForm({ ...form, stok_obat_id: e.target.value })}
              className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              required
            >
              <option value="">-- Pilih Obat --</option>
              {stokOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama_obat} — stok {s.stok_pack} pack ({s.qty_total} ecer)
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Jenis
            </label>
            <select
              value={form.jenis_penjualan}
              onChange={(e) =>
                setForm({ ...form, jenis_penjualan: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
            >
              <option value="Eceran">Eceran</option>
              <option value="Pack">Pack</option>
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Jumlah
            </label>
            <input
              type="number"
              min="1"
              value={form.jumlah}
              onChange={(e) => setForm({ ...form, jumlah: Number(e.target.value) })}
              className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Metode
            </label>
            <select
              value={form.metode_pembayaran}
              onChange={(e) =>
                setForm({ ...form, metode_pembayaran: e.target.value })
              }
              className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
            >
              <option value="Tunai">Tunai</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>

          <div className="sm:col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md"
            >
              Tambah
            </button>
          </div>
        </form>

        {/* Subtotal */}
        <div className="text-right mb-4 text-sm text-gray-500">
          Subtotal:{" "}
          <span className="font-bold text-lg text-slate-800">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari pasien atau obat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-1/2 border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-full text-sm text-gray-700 border-collapse text-left">
            <thead className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-bold text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Nama Pasien</th>
                <th className="px-4 py-3">Nama Obat</th>
                <th className="px-4 py-3 text-center">Jumlah</th>
                <th className="px-4 py-3 text-center">Metode</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500 italic">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredSales.length > 0 ? (
                filteredSales.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`transition-colors border-b ${
                      i % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                    } hover:bg-blue-50/30`}
                  >
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(s.created_at).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{s.nama_pasien}</td>
                    <td className="px-4 py-3 text-gray-600">{s.nama_obat}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{s.jumlah}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        s.metode_pembayaran === "Tunai" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}>
                        {s.metode_pembayaran}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-800">
                      {formatCurrency(s.total_harga)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all text-xs font-semibold shadow-sm"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500 italic">
                    Tidak ada data cocok dengan pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total Pendapatan */}
        <div className="mt-6 text-right">
          <p className="text-sm text-gray-500 font-medium">Total Pendapatan Hari Ini</p>
          <p className="text-2xl font-bold text-blue-800">
            {formatCurrency(totalPendapatan)}
          </p>
        </div>
      </div>
    </div>
  );
}
