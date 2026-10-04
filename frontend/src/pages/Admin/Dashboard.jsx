// DashboardAdmin.jsx
import { useState, useEffect, useRef } from "react";
import {
  LogOut,
  ChevronDown,
  Package,
  FileText,
  Settings,
  Home,
  Menu,
  X,
  Users,
  CalendarDays,
  Percent,
  Briefcase,
} from "lucide-react";
import { useNavigate, useLocation, Routes, Route } from "react-router-dom";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

import SettingAdmin from "./Owner.jsx";
import RiwayatRekam from "./RiwayatRekam";
import PemeriksaanList from "./PemeriksaanList";
import DataStokBarang from "./DataStokBarang";
import PenjualanHarian from "./PenjualanHarian";
import RiwayatKunjungan from "./RiwayatKunjungan";
import PromoAdmin from "./PromoAdmin";
import PemeriksaanEdit from "./PemeriksaanEdit";
import DataPasien from "./DataPasien";
import KarirAdmin from "./KarirAdmin";



export default function DashboardAdmin() {
  const [riwayatOpen, setRiwayatOpen] = useState(false);
  const [kasirOpen, setKasirOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
const role = localStorage.getItem("role");

  const [stokList, setStokList] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const pathTitle = {
    "/admin": "Dashboard",
    "/admin/penjualan-harian": "Penjualan Harian",
    "/admin/data-stok": "Data Stok Barang",
    "/admin/pemeriksaan": "Pemeriksaan List",
    "/admin/riwayat-rekam": "Input Rekam",
    "/admin/owner": "Owner",
    "/admin/data-pasien": "Data Pasien",
    "/admin/riwayat-kunjungan": "Riwayat Kunjungan",
    "/admin/promo": "Kelola Promo",
    "/admin/karir": "Kelola Karir & Pelamar",
  };

  // ======= Helpers =======
  const formatCurrency = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(val || 0);

  const isSameDay = (d1, d2) => {
    const a = new Date(d1);
    const b = new Date(d2);
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const getStartOfMonth = () => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  // ======= Fetch Data =======
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [stokRes, salesRes] = await Promise.all([
        axios.get("http://localhost:8000/api/admin/stok-obat", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:8000/api/admin/penjualan-harian", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setStokList(stokRes.data.data || []);
      setSales(salesRes.data.data || []);
    } catch (err) {
      console.error("Gagal fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ======= Dashboard Metrics =======
  const totalPenjualanHariIni = sales
    .filter((s) => s.created_at && isSameDay(s.created_at, new Date()))
    .reduce((acc, cur) => acc + Number(cur.total_harga || 0), 0);

  const transaksiKeluar = sales.filter((s) =>
    isSameDay(s.created_at, new Date())
  ).length;
  const transaksiMasuk = stokList.filter((s) =>
    isSameDay(s.created_at, new Date())
  ).length;

  const totalTransaksiHariIni = transaksiMasuk + transaksiKeluar;

  const startMonth = getStartOfMonth();
  const totalPenjualanBulanIni = sales
    .filter((s) => new Date(s.created_at) >= startMonth)
    .reduce((acc, cur) => acc + Number(cur.total_harga || 0), 0);

  const obatCount = {};
  sales.forEach((s) => {
    const name = s.nama_obat || "(tidak diketahui)";
    obatCount[name] = (obatCount[name] || 0) + Number(s.jumlah || 0);
  });
  const obatTerlaris =
    Object.entries(obatCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const salesToday = sales.filter((s) => isSameDay(s.created_at, new Date()));
  const perHour = hours.map((h) => ({
    hour: `${h}`,
    value: salesToday
      .filter((s) => new Date(s.created_at).getHours() === h)
      .reduce((acc, cur) => acc + Number(cur.total_harga || 0), 0),
  }));

  // ✅ Rotasi jam agar jam terbaru di kanan
  const now = new Date().getHours();
  const rotatedPerHour = [
    ...perHour.slice(now + 1),
    ...perHour.slice(0, now + 1),
  ];

  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(new Date(d));
  }
  const perDay = days.map((d) => ({
    date: d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" }),
    value: sales
      .filter((s) => isSameDay(s.created_at, d))
      .reduce((acc, cur) => acc + Number(cur.total_harga || 0), 0),
  }));

  // ======= UI =======
  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Topbar */}
      <div className="flex items-center justify-between bg-white shadow px-4 py-3 sticky top-0 z-40">
        <button
          className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">
          {pathTitle[location.pathname] || "Admin Panel"}
        </h1>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white text-gray-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-300">
          <div>
            <h1 className="text-xl font-extrabold tracking-wide text-blue-600">
              Bersama <span className="text-red-600">Plus</span>
            </h1>
            <span className="text-sm text-gray-600 font-medium">
              Admin Panel
            </span>
          </div>
          <button
            className="text-gray-600 hover:text-gray-800 transition"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6 text-sm space-y-1">
          <SidebarButton
            icon={<Home size={18} />}
            label="Dashboard"
            active={location.pathname === "/admin"}
            onClick={() => {
              navigate("/admin");
              setSidebarOpen(false);
            }}
          />
          <SidebarCollapse
            icon={<Package size={18} />}
            label="Kasir"
            open={kasirOpen}
            onToggle={() => setKasirOpen(!kasirOpen)}
          >
            <SidebarSubButton
              label="Penjualan Harian"
              active={location.pathname === "/admin/penjualan-harian"}
              onClick={() => {
                navigate("/admin/penjualan-harian");
                setSidebarOpen(false);
              }}
            />
            <SidebarSubButton
              label="Data Stok Barang"
              active={location.pathname === "/admin/data-stok"}
              onClick={() => {
                navigate("/admin/data-stok");
                setSidebarOpen(false);
              }}
            />
          </SidebarCollapse>
          <SidebarCollapse
            icon={<FileText size={18} />}
            label="Rekam Medis Umum"
            open={riwayatOpen}
            onToggle={() => setRiwayatOpen(!riwayatOpen)}
          >
            <SidebarSubButton
              label="Input"
              active={location.pathname === "/admin/riwayat-rekam"}
              onClick={() => {
                navigate("/admin/riwayat-rekam");
                setSidebarOpen(false);
              }}
            />
            <SidebarSubButton
              label="Rekam Medis"
              active={location.pathname === "/admin/pemeriksaan"}
              onClick={() => {
                navigate("/admin/pemeriksaan");
                setSidebarOpen(false);
              }}
            />
          </SidebarCollapse>
          <SidebarButton
            icon={<CalendarDays size={18} />}
            label="Riwayat Kunjungan"
            active={location.pathname === "/admin/riwayat-kunjungan"}
            onClick={() => {
              navigate("/admin/riwayat-kunjungan");
              setSidebarOpen(false);
            }}
          />
          <SidebarButton
            icon={<Users size={18} />}
            label="Data Pasien"
            active={location.pathname === "/admin/data-pasien"}
            onClick={() => {
              navigate("/admin/data-pasien");
              setSidebarOpen(false);
            }}
          />
          <SidebarButton
            icon={<Percent size={18} />}
            label="Kelola Promo"
            active={location.pathname === "/admin/promo"}
            onClick={() => {
              navigate("/admin/promo");
              setSidebarOpen(false);
            }}
          />
          <SidebarButton
            icon={<Briefcase size={18} />}
            label="Karir & Pelamar"
            active={location.pathname === "/admin/karir"}
            onClick={() => {
              navigate("/admin/karir");
              setSidebarOpen(false);
            }}
          />
         {role === "owner" && (
  <SidebarButton
    icon={<Settings size={18} />}
    label="Owner"
    active={location.pathname === "/admin/owner"}
    onClick={() => {
      navigate("/admin/owner");
      setSidebarOpen(false);
    }}
  />
)}

        </nav>

        <div className="p-5 border-t border-gray-300">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              window.location.href = "/login";
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-500 hover:to-blue-500 text-white py-2 rounded-lg font-semibold transition-all shadow-md"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* ===== Main Content ===== */}
      <main className="p-6">
       <Routes>
  {/* 🏠 Halaman utama dashboard */}
  <Route
    index
    element={
      <DashboardContent
        {...{
          totalPenjualanHariIni,
          totalTransaksiHariIni,
          transaksiMasuk,
          transaksiKeluar,
          obatTerlaris,
          totalPenjualanBulanIni,
          perHour: rotatedPerHour, // ✅ pakai data yang sudah dirotasi
          perDay,
          formatCurrency,
          fetchAll,
        }}
      />
    }
  />

  {/* 💰 Penjualan Harian */}
  <Route path="penjualan-harian" element={<PenjualanHarian />} />

  {/* 📦 Data Stok Barang */}
  <Route path="data-stok" element={<DataStokBarang />} />

  {/* 🩺 Pemeriksaan Pasien */}
  <Route path="pemeriksaan" element={<PemeriksaanList />} />

  {/* 📋 Riwayat Rekam Medis */}
  <Route path="riwayat-rekam" element={<RiwayatRekam />} />

  {/* 🧾 Riwayat Kunjungan Pasien (Baru Ditambahkan) */}
  <Route path="riwayat-kunjungan" element={<RiwayatKunjungan />} />

  {/* 👥 Data Pasien */}
  <Route path="data-pasien" element={<DataPasien />} />

  {/* 🎉 Promo Klinik */}
  <Route path="promo" element={<PromoAdmin />} />

  {/* 💼 Kelola Karir & Pelamar */}
  <Route path="karir" element={<KarirAdmin />} />

  {/* 🩺 Edit Pemeriksaan */}
  <Route path="pemeriksaan/edit/:id" element={<PemeriksaanEdit />} />

  {/* ⚙️ Pengaturan Owner/Admin */}
  <Route path="owner" element={<SettingAdmin />} />
</Routes>

      </main>
    </div>
  );
}

// ===== Reusable Components =====
function DashboardContent({
  totalPenjualanHariIni,
  totalTransaksiHariIni,
  transaksiMasuk,
  transaksiKeluar,
  obatTerlaris,
  totalPenjualanBulanIni,
  perHour,
  perDay,
  formatCurrency,
  fetchAll,
}) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-2 text-blue-700">Dashboard Admin</h2>
      <p className="text-gray-600 mb-6">
        Selamat datang di panel admin. Kelola semua data klinik di sini.
      </p>

      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
          <p className="text-sm text-blue-700 font-medium">
            Total Penjualan Hari Ini
          </p>
          <p className="text-lg font-semibold mt-2">
            {formatCurrency(totalPenjualanHariIni)}
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-700 font-medium">
            Total Transaksi Hari Ini
          </p>
          <p className="text-lg font-semibold mt-2">{totalTransaksiHariIni}</p>
          <p className="text-xs text-gray-500 mt-1">
            {transaksiMasuk} masuk • {transaksiKeluar} keluar
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-700 font-medium">Obat Terlaris</p>
          <p className="text-lg font-semibold mt-2">{obatTerlaris}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-700 font-medium">
            Total Penjualan Bulan Ini
          </p>
          <p className="text-lg font-semibold mt-2">
            {formatCurrency(totalPenjualanBulanIni)}
          </p>
        </div>
      </div>

    {/* Grafik Section */}
<div className="flex flex-col gap-6 w-full overflow-hidden">

  {/* === Grafik Penjualan Hari Ini === */}
  <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
    <h3 className="text-sm font-medium mb-3">Grafik Penjualan Hari Ini (Per Jam)</h3>
    <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={perHour}
          margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="hour"
            tickFormatter={(v) => `${String(v).padStart(2, "0")}.00`}
          />
          <YAxis
            tickFormatter={(v) => v.toLocaleString("id-ID")}
            domain={["auto", "auto"]}
            allowDataOverflow={false}
            width={80}
          />
          <Tooltip formatter={(v) => formatCurrency(v)} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* === Grafik Penjualan Bulan Ini (per 2 Hari) === */}
  <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
    <h3 className="text-sm font-medium mb-3">Grafik Penjualan Bulan Ini (Per 2 Hari)</h3>
    <div className="w-full h-[300px] sm:h-[350px] md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          // Hanya ambil data per 2 hari
          data={perDay.filter((_, i) => i % 2 === 0)}
          margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => String(v).padStart(2, "0")}
          />
          <YAxis
            tickFormatter={(v) => v.toLocaleString("id-ID")}
            domain={["auto", "auto"]}
            allowDataOverflow={false}
            width={80}
          />
          <Tooltip
            formatter={(v) => formatCurrency(v)}
            labelFormatter={(label) => `Tanggal ${String(label).padStart(2, "0")}`}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#4f46e5"
            fill="#e0e7ff"
            strokeWidth={2}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>

</div>


      {/* Tombol Bawah */}
      <div className="mt-6 flex justify-end items-center gap-3">
        <button
          onClick={fetchAll}
          className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-medium transition"
        >
          Refresh Data
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
        >
          Cetak Laporan Bulanan
        </button>
      </div>
    </div>
  );
}

function SidebarButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition ${
        active
          ? "bg-blue-50 text-blue-600 font-medium border-r-4 border-blue-500"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SidebarSubButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-3 py-1.5 rounded-md text-sm ${
        active
          ? "text-blue-600 bg-blue-50 border-r-4 border-blue-400"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}

function SidebarCollapse({ icon, label, open, onToggle, children }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
      >
        <span className="flex items-center gap-3">
          {icon} {label}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="ml-8 mt-1 space-y-1">{children}</div>}
    </div>
  );
}
