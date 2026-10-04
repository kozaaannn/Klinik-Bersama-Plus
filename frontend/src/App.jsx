  import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
    useNavigate,
    Navigate,
  } from "react-router-dom";
  import { useEffect } from "react";

  import Navbar from "./components/Navbar";
  import Hero from "./components/Hero";
  import Footer from "./components/Footer";

  import Login from "./pages/Login";
  import Signup from "./pages/Signup";
  import LoginSuccess from "./pages/LoginSuccess";
  import Riwayat from "./pages/Riwayat";
  import DashboardAdmin from "./pages/admin/Dashboard";
  import PemeriksaanEdit from "./pages/admin/PemeriksaanEdit";
  import InputNoTelepon from "./pages/InputNoTelepon";

  import { AdminRoute, UserRoute } from "./components/ProtectedRoute";

  import Profil from "./pages/Profil";
  import UbahPassword from "./pages/UbahPassword";
  import Layanan from "./pages/Layanan";
  import PromoAdmin from "./pages/admin/PromoAdmin";
  import Karir from "./pages/Karir";
  import Tentang from "./pages/Tentang";
  import Obat from "./pages/Obat";



  /* ======================================================
  | 🔴 Halaman "Logout Berhasil"
  ====================================================== */
  function LogoutSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      const timer = setTimeout(() => navigate("/"), 1000);
      return () => clearTimeout(timer);
    }, [navigate]);

    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-6"></div>
        <h1 className="text-2xl font-bold text-red-700 mb-2">Logout Berhasil</h1>
        <p className="text-gray-600 animate-pulse">Mengalihkan ke halaman utama...</p>
      </div>
    );
  }

  /* ======================================================
  | 🎨 Layout Utama (Navbar + Footer)
  ====================================================== */
  function Layout() {
    const location = useLocation();

    const hideLayout =
      ["/login", "/signup", "/login-success", "/logout-success", "/isi-no-telepon"]
        .includes(location.pathname) ||
      location.pathname.startsWith("/admin");

    return (
      <>
        {!hideLayout ? (
          <div className="min-h-screen flex flex-col bg-white text-gray-800">
            <Navbar />
            <main className="pt-16 flex-1">
              <Routes>
                {/* ===== USER PAGES ===== */}
                <Route path="/" element={<Hero />} />

                <Route
                  path="/riwayat"
                  element={
                    <UserRoute>
                      <Riwayat />
                    </UserRoute>
                  }
                />

                <Route
                  path="/profil"
                  element={
                    <UserRoute>
                      <Profil />
                    </UserRoute>
                  }
                />

                <Route
                  path="/ubah-password"
                  element={
                    <UserRoute>
                      <UbahPassword />
                    </UserRoute>
                  }
                />

                <Route path="/layanan" element={<Layanan />} />
                <Route path="/karir" element={<Karir />} />
                <Route path="/tentang" element={<Tentang />} />
                <Route path="/obat" element={<Obat />} />

                {/* Auth Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login-success" element={<LoginSuccess />} />
                <Route path="/logout-success" element={<LogoutSuccess />} />
                <Route path="/isi-no-telepon" element={<InputNoTelepon />} />

                {/* ===== ADMIN PAGES ===== */}
                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <DashboardAdmin />
                    </AdminRoute>
                  }
                />


              </Routes>
            </main>
            <Footer />
          </div>
        ) : (
          /* Layout Tanpa Navbar */
          <main className="min-h-screen">
            <Routes>
              {/* Auth Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login-success" element={<LoginSuccess />} />
              <Route path="/logout-success" element={<LogoutSuccess />} />
              <Route path="/isi-no-telepon" element={<InputNoTelepon />} />

              {/* ADMIN PAGES TANPA NAVBAR */}
              <Route
                path="/admin/*"
                element={
                  <AdminRoute>
                    <DashboardAdmin />
                  </AdminRoute>
                }
              />


            </Routes>
          </main>
        )}
      </>
    );
  }

  /* ======================================================
  | 🚀 WRAPPER ROUTER
  ====================================================== */
  export default function App() {
    return (
      <Router>
        <Layout />
      </Router>
    );
  }
