import { useEffect, useState } from "react";
import axios from "axios";
import { Pill, Search, ShieldAlert, HeartPulse, RefreshCw, AlertCircle, ShoppingBag } from "lucide-react";

export default function Obat() {
  const [obatList, setObatList] = useState([]);
  const [filteredObat, setFilteredObat] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchObat = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8000/api/public/obat");
      const fetched = res.data.data || [];
      setObatList(fetched);
      setFilteredObat(fetched);
    } catch (error) {
      console.error("❌ Gagal memuat daftar obat:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObat();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    if (search.trim() === "") {
      setFilteredObat(obatList);
      return;
    }
    const filtered = obatList.filter((item) =>
      item.nama_obat?.toLowerCase().includes(lowerSearch)
    );
    setFilteredObat(filtered);
  }, [search, obatList]);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(number)
      .replace(",00", "");
  };

  const getStockBadge = (qtyTotal) => {
    if (qtyTotal > 50) {
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          Stok Tersedia
        </span>
      );
    } else if (qtyTotal > 0) {
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          Stok Terbatas
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 border border-red-200">
          Habis
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8 pt-24">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Title */}
        <div className="text-center mb-12">
          <span className="text-sky-600 font-bold uppercase tracking-wider text-sm">Informasi Apotek Klinik</span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mt-2 tracking-tight">
            Katalog Obat & <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">Farmasi Kami</span>
          </h1>
          <p className="text-slate-600 mt-4 max-w-2xl mx-auto text-base">
            Cari ketersediaan obat dan informasi harga resmi di Apotek Klinik Bersama Plus secara transparan.
          </p>
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-3 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama obat (misal: Paracetamol)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 outline-none shadow-sm transition"
            />
          </div>

          <button
            onClick={fetchObat}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-2xl text-sm font-semibold transition active:scale-95 shadow-sm"
          >
            <RefreshCw size={16} /> Refresh Katalog
          </button>
        </div>

        {/* Warning Notice Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 mb-10 flex gap-4 items-start shadow-sm max-w-4xl mx-auto">
          <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={22} />
          <div>
            <h4 className="font-bold text-blue-900 text-sm md:text-base">Informasi Pembelian Obat</h4>
            <p className="text-blue-700 text-xs md:text-sm mt-1 leading-relaxed">
              Demi keselamatan pasien, pembelian obat-obatan dengan logo resep dokter wajib menyertakan resep resmi dari dokter Klinik Bersama Plus. Transaksi pembelian dapat langsung dilayani di Apotek Klinik fisik kami.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 flex flex-col justify-center items-center">
            <div className="w-12 h-12 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 text-sm animate-pulse">Menghubungkan ke apotek...</p>
          </div>
        ) : (
          <div>
            {filteredObat.length === 0 ? (
              <div className="py-16 text-center text-slate-500 italic bg-white border border-dashed border-slate-200 rounded-3xl">
                {obatList.length === 0 ? "Katalog obat saat ini sedang kosong." : "Obat yang Anda cari tidak ditemukan."}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredObat.map((item) => {
                  // Hitung harga jual per pack dan unit
                  const modal = Number(item.harga_modal) || 0;
                  const ppn = Number(item.ppn) || 0;
                  const margin = Number(item.margin) || 0;
                  const qtyPack = Number(item.qty_pack) || 1;

                  const hargaJualPerPack = modal + (modal * ppn) / 100 + (modal * margin) / 100;
                  const hargaJualPerUnit = hargaJualPerPack / qtyPack;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-xl hover:border-sky-100 transition duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Card Header (Icon & Badge) */}
                        <div className="flex justify-between items-start mb-5">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <Pill size={24} />
                          </div>
                          {getStockBadge(item.qty_total)}
                        </div>

                        {/* Medicine Info */}
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-snug">
                          {item.nama_obat}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 font-semibold uppercase tracking-wider">
                          Kemasan: {qtyPack} unit / pack
                        </p>

                        {/* Pricing Details */}
                        <div className="mt-5 space-y-2 border-t border-slate-50 pt-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Harga per Pack</span>
                            <span className="font-bold text-slate-800">
                              {formatRupiah(hargaJualPerPack)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Estimasi per Tablet/Unit</span>
                            <span className="font-bold text-indigo-600">
                              {formatRupiah(hargaJualPerUnit)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Call-to-action details */}
                      <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50/50 -mx-6 -mb-6 p-4 rounded-b-3xl">
                        <ShoppingBag size={14} className="text-slate-400" />
                        <span>Dapatkan langsung di Apotek Klinik</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
