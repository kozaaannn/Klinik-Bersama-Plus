import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, ChevronDown, Bell, CheckCircle2, XCircle, Clock, Briefcase } from "lucide-react";
import axios from "axios";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar"));
  const [loginMethod, setLoginMethod] = useState(localStorage.getItem("login_method"));

  // 🔔 State Notifikasi Web
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  // ✅ Ambil metode login dari localStorage biar konsisten
  useEffect(() => {
    const storedMethod = localStorage.getItem("login_method");
    if (storedMethod) setLoginMethod(storedMethod);
  }, []);

  // 🧩 Ambil profil user untuk avatar dan metode login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:8000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const user = res.data?.user ?? res.data;

        if (user?.avatar) {
          setAvatar(user.avatar);
          localStorage.setItem("avatar", user.avatar);
        }

        if (user?.role) {
          localStorage.setItem("role", user.role.toLowerCase());
        }

        // ✅ Simpan metode login yang benar ke localStorage
        if (user?.provider === "google") {
          setLoginMethod("google");
          localStorage.setItem("login_method", "google");
        } else {
          setLoginMethod("manual");
          localStorage.setItem("login_method", "manual");
        }
      })
      .catch((err) => console.error("Gagal memuat profil:", err));
  }, []);

  // 🔔 Ambil notifikasi user
  const fetchNotifications = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("http://localhost:8000/api/user/notifikasi", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data?.success) {
          setNotifications(res.data.data || []);
          setUnreadNotifCount(res.data.unread_count || 0);
        }
      })
      .catch((err) => console.error("Gagal memuat notifikasi:", err));
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Polling setiap 15 detik
    return () => clearInterval(interval);
  }, [location]);

  const handleMarkAllRead = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.put(
        "http://localhost:8000/api/user/notifikasi/read-all",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUnreadNotifCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNotificationClick = async (notif) => {
    const token = localStorage.getItem("token");
    if (token && !notif.is_read) {
      try {
        await axios.put(
          `http://localhost:8000/api/user/notifikasi/${notif.id}/read`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
        );
        setUnreadNotifCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error(err);
      }
    }
    setNotifOpen(false);
    navigate(notif.link || "/riwayat?tab=lamaran");
  };

  const handleRiwayatClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) navigate("/login");
    else navigate("/riwayat");
  };

  const handleProfilClick = () => {
    setDropdownOpen(false);
    navigate("/profil");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("avatar");
    localStorage.removeItem("login_method");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setDropdownOpen(false);
    navigate("/logout-success");
  };

  const getLinkClass = (path) =>
    `transition hover:text-sky-600 ${
      location.pathname === path ? "text-sky-600 font-semibold" : "text-gray-700"
    }`;

  return (
    <>
      {/* 🟦 NAVBAR DESKTOP */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          {/* Logo & Menu Button */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 text-gray-800"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 text-sky-700 font-semibold text-lg"
            >
              <img src="/logo.png" alt="Logo" className="w-8 h-8" />
              Klinik <span className="text-rose-600 font-bold">Bersama Plus</span>
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-6 font-medium">
            <Link
              to="/"
              className={getLinkClass("/")}
            >
              Beranda
            </Link>
            <button onClick={handleRiwayatClick} className={getLinkClass("/riwayat")}>
              Riwayat
            </button>
            <Link to="/obat" className={getLinkClass("/obat")}>
              Apotek
            </Link>
            <Link to="/karir" className={getLinkClass("/karir")}>
              Karir
            </Link>
            <Link to="/layanan" className={getLinkClass("/layanan")}>
              Layanan
            </Link>
            <Link to="/tentang" className={getLinkClass("/tentang")}>
              Tentang Kami
            </Link>
          </div>

          {/* Profil & Logout */}
          <div className="hidden md:flex items-center gap-3 relative">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                {/* 🔔 Lonceng Notifikasi */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifOpen(!notifOpen);
                      setDropdownOpen(false);
                    }}
                    className={`relative p-2.5 rounded-xl transition ${
                      notifOpen
                        ? "bg-sky-100 text-sky-700"
                        : "text-slate-600 hover:text-sky-600 hover:bg-slate-100"
                    }`}
                    title="Notifikasi"
                  >
                    <Bell size={20} />
                    {unreadNotifCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-black text-white shadow-sm ring-2 ring-white animate-pulse">
                        {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Notifikasi */}
                  {notifOpen && (
                    <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl py-3 z-50 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-800 text-sm">Notifikasi</h4>
                          {unreadNotifCount > 0 && (
                            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-100 text-rose-700">
                              {unreadNotifCount} Baru
                            </span>
                          )}
                        </div>
                        {unreadNotifCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-sky-600 hover:text-sky-700 font-semibold"
                          >
                            Tandai semua dibaca
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-slate-400 text-xs">
                            <Bell className="mx-auto text-slate-300 mb-2" size={24} />
                            Belum ada notifikasi baru.
                          </div>
                        ) : (
                          notifications.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleNotificationClick(item)}
                              className={`p-3.5 hover:bg-slate-50 transition cursor-pointer flex gap-3 items-start ${
                                !item.is_read ? "bg-sky-50/40" : ""
                              }`}
                            >
                              <div className="mt-0.5 shrink-0">
                                {item.status === "diterima" ? (
                                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <CheckCircle2 size={16} />
                                  </div>
                                ) : item.status === "ditolak" ? (
                                  <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                                    <XCircle size={16} />
                                  </div>
                                ) : item.status === "review" ? (
                                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center">
                                    <Clock size={16} />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                                    <Briefcase size={16} />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <p className="text-xs font-bold text-slate-800 truncate">
                                    {item.judul}
                                  </p>
                                  {!item.is_read && (
                                    <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0"></span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                  {item.pesan}
                                </p>
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                  {new Date(item.created_at).toLocaleString("id-ID", {
                                    day: "2-digit",
                                    month: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="px-4 pt-2.5 border-t border-slate-100 text-center">
                        <button
                          onClick={() => {
                            setNotifOpen(false);
                            navigate("/riwayat?tab=lamaran");
                          }}
                          className="text-xs font-bold text-sky-600 hover:text-sky-700"
                        >
                          Lihat Status Lamaran Lengkap →
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Avatar Dropdown */}
                <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-3 py-2 rounded-lg font-semibold transition"
                >
                  {avatar ? (
                    <img
                      src={`http://localhost:8000/storage/avatars/${avatar}`}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                  )}
                  <ChevronDown size={16} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                    <button
                      onClick={handleProfilClick}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <User size={16} /> Lihat Profil
                    </button>

                    {/* 🔒 Tampilkan hanya jika login manual */}
                    {loginMethod !== "google" && (
                      <button
                        onClick={() => navigate("/ubah-password")}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      >
                       Ubah Password
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-red-600"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
            ) : (
              <Link
                to="/login"
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 🟥 SIDEBAR MOBILE */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header Sidebar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <Link
              to="/"
              className="flex items-center gap-2 text-sky-700 font-semibold text-lg"
              onClick={() => setMenuOpen(false)}
            >
              <img src="/logo.png" alt="Logo" className="w-8 h-8" />
              Klinik <span className="text-rose-600 font-bold">Bersama Plus</span>
            </Link>
            <button
              className="p-2 text-gray-600 hover:text-gray-800"
              onClick={() => setMenuOpen(false)}
            >
              <X size={22} />
            </button>
          </div>

          {/* Menu Sidebar */}
          <nav className="flex flex-col space-y-4 px-6 py-6 text-gray-800 font-medium">
            <Link to="/" className={getLinkClass("/")} onClick={() => setMenuOpen(false)}>
              Beranda
            </Link>
            <button
              onClick={handleRiwayatClick}
              className={`text-left ${getLinkClass("/riwayat")}`}
            >
              Riwayat
            </button>
            <Link to="/obat" className={getLinkClass("/obat")} onClick={() => setMenuOpen(false)}>
              Apotek
            </Link>
            <Link to="/karir" className={getLinkClass("/karir")} onClick={() => setMenuOpen(false)}>
              Karir
            </Link>
            <Link
              to="/layanan"
              className={getLinkClass("/layanan")}
              onClick={() => setMenuOpen(false)}
            >
              Layanan
            </Link>
            <Link
              to="/tentang"
              className={getLinkClass("/tentang")}
              onClick={() => setMenuOpen(false)}
            >
              Tentang Kami
            </Link>
          </nav>

          {/* Profil & Logout di Mobile */}
          {isLoggedIn && (
            <div className="mt-auto px-6 py-6 border-t border-gray-200 space-y-2">
              <button
                onClick={handleProfilClick}
                className="w-full text-left bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-4 py-3 rounded-lg font-semibold transition flex items-center gap-2"
              >
                {avatar ? (
                  <img
                    src={`http://localhost:8000/storage/avatars/${avatar}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                    <User size={16} className="text-white" />
                  </div>
                )}
                Profil Saya
              </button>

              {/* 🔒 Tampilkan hanya jika login manual */}
              {loginMethod !== "google" && (
                <button
                  onClick={() => navigate("/ubah-password")}
                  className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-3 rounded-lg font-semibold transition flex items-center gap-2"
                >
Ubah Password
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full text-left bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-lg font-semibold transition flex items-center gap-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}

          {!isLoggedIn && (
            <div className="mt-auto px-6 py-6 border-t border-gray-200">
              <Link
                to="/login"
                className="block text-center bg-rose-600 hover:bg-rose-700 text-white px-4 py-3 rounded-lg font-semibold transition"
                onClick={() => setMenuOpen(false)}
              >
                Masuk
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}
