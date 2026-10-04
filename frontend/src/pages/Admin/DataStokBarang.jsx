import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, RefreshCcw, Edit, Trash, Search, FileText, Package } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function DataStokBarang() {
  const [stok, setStok] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nama_obat: "",
    qty_pack: "",
    stok_pack: "",
    harga_modal: "",
    ppn: "",
    margin: "",
  });
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  const formatRupiah = (number) => {
    if (!number && number !== 0) return "-";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(number)
      .replace(",00", "");
  };

  const getStok = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/admin/stok-obat", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      // qty_total dihitung otomatis di frontend
      const dataWithTotal = (res.data.data || []).map((item) => ({
        ...item,
        qty_total: (item.qty_pack || 0) * (item.stok_pack || 0),
      }));

      setStok(dataWithTotal);
    } catch (err) {
      console.error("Gagal mengambil data stok:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8000/api/admin/stok-obat/${editingId}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        alert("✅ Data berhasil diperbarui!");
        setEditingId(null);
      } else {
        const res = await axios.post(
          "http://localhost:8000/api/admin/stok-obat",
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        const newData = res.data.data;

        // qty_total otomatis
        newData.qty_total = newData.qty_pack * newData.stok_pack;

        setStok((prev) => [newData, ...prev]);
        alert("✅ Data stok obat berhasil ditambahkan!");
      }

      setForm({
        nama_obat: "",
        qty_pack: "",
        stok_pack: "",
        harga_modal: "",
        ppn: "",
        margin: "",
      });

      getStok();
    } catch (err) {
      console.error("Gagal menyimpan data stok:", err);
      alert("❌ Gagal menyimpan data stok.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/stok-obat/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      alert("✅ Data berhasil dihapus!");
      setStok((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("❌ Gagal menghapus data.");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      nama_obat: item.nama_obat,
      qty_pack: item.qty_pack,
      stok_pack: item.stok_pack,
      harga_modal: item.harga_modal,
      ppn: item.ppn,
      margin: item.margin,
    });
  };

  useEffect(() => {
    getStok();
  }, []);

  const filteredStok = stok.filter((item) =>
    item.nama_obat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
              <Package size={24} className="text-blue-600" /> Data Stok Barang
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Kelola data stok obat, harga modal, PPN, margin, dan total harga.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama obat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm shadow-sm transition-all"
            />
          </div>
        </div>

        {/* FORM INPUT */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 bg-gray-50/50 p-4 rounded-2xl mb-6 border border-gray-200"
        >
          <input
            type="text"
            placeholder="Nama Obat"
            className="p-2 border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white"
            value={form.nama_obat}
            onChange={(e) => setForm({ ...form, nama_obat: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Qty/Pack"
            className="p-2 border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white"
            value={form.qty_pack}
            onChange={(e) => setForm({ ...form, qty_pack: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Stok (Pack)"
            className="p-2 border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white"
            value={form.stok_pack}
            onChange={(e) => setForm({ ...form, stok_pack: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Harga Modal"
            className="p-2 border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white"
            value={form.harga_modal}
            onChange={(e) => setForm({ ...form, harga_modal: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="PPN (%)"
            className="p-2 border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white"
            value={form.ppn}
            onChange={(e) => setForm({ ...form, ppn: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Margin (%)"
            className="p-2 border border-gray-300 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all bg-white"
            value={form.margin}
            onChange={(e) => setForm({ ...form, margin: e.target.value })}
            required
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl flex items-center justify-center transition-all text-sm font-semibold shadow-md"
          >
            <Plus size={16} className="mr-1" />
            {editingId ? "Simpan" : "Tambah"}
          </button>
        </form>

        {/* TABEL */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full text-xs sm:text-sm text-left border-collapse">
            <thead className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-bold text-xs uppercase">
              <tr>
                <th className="p-3 font-semibold">Nama Obat</th>
                <th className="p-3 font-semibold text-center">Qty/Pack</th>
                <th className="p-3 font-semibold text-center">Stok (Pack)</th>
                <th className="p-3 font-semibold text-center">Qty Total</th>
                <th className="p-3 font-semibold">Harga Modal</th>
                <th className="p-3 font-semibold text-center">PPN (%)</th>
                <th className="p-3 font-semibold text-center">Margin (%)</th>
                <th className="p-3 font-semibold">Total Harga</th>
                <th className="p-3 font-semibold">Tanggal Input</th>
                <th className="p-3 font-semibold text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="text-center p-8 text-gray-500 italic">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredStok.length > 0 ? (
                filteredStok.map((item, i) => (
                  <tr
                    key={item.id}
                    className={`transition-colors border-b ${
                      i % 2 === 0 ? "bg-gray-50/50" : "bg-white"
                    } hover:bg-blue-50/30`}
                  >
                    <td className="p-3 font-semibold text-gray-800">{item.nama_obat}</td>
                    <td className="p-3 text-center text-gray-600">{item.qty_pack}</td>
                    <td className="p-3 text-center text-gray-600">{item.stok_pack}</td>

                    <td className="p-3 text-center font-bold text-blue-600">
                      {item.qty_total}
                    </td>

                    <td className="p-3 text-gray-600">
                      {formatRupiah(item.harga_modal)}
                    </td>
                    <td className="p-3 text-center text-gray-600">{item.ppn}%</td>
                    <td className="p-3 text-center text-gray-600">{item.margin}%</td>

                    <td className="p-3 text-emerald-600 font-bold">
                      {formatRupiah(item.total_harga)}
                    </td>

                    <td className="p-3 text-gray-500">
                      {item.created_at
                        ? new Date(item.created_at).toLocaleString("id-ID")
                        : "-"}
                    </td>

                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex items-center justify-center p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          title="Edit Stok"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex items-center justify-center p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Hapus Stok"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center p-8 text-gray-500 italic">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={getStok}
            className="flex items-center border border-gray-300 bg-white px-4 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 transition font-semibold text-sm shadow-sm"
          >
            <RefreshCcw size={16} className="mr-2 text-gray-500" />
            Refresh Data
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl transition font-semibold text-sm shadow-md"
          >
            <FileText size={16} className="mr-2" />
            Cetak PDF
          </button>
        </div>
      </div>
    </div>
  );
}
