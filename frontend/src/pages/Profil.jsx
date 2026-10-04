import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Home, Phone, Lock, LogOut, Camera } from "lucide-react";

export default function Profil() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginMethod, setLoginMethod] = useState(localStorage.getItem("login_method"));
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const formatAvatarUrl = (avatar) => {
    if (!avatar) {
      return "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    }
    if (avatar.startsWith("http")) {
      return avatar;
    }
    return `http://localhost:8000/storage/avatars/${avatar}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8000/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        let user = res.data.user;
        user.avatar = formatAvatarUrl(user.avatar);

        // ✅ Simpan metode login yang benar ke localStorage (untuk konsistensi dengan Navbar)
        if (user?.provider === "google") {
          setLoginMethod("google");
          localStorage.setItem("login_method", "google");
        } else {
          setLoginMethod("manual");
          localStorage.setItem("login_method", "manual");
        }

        setUserData(user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAvatarChange = async (e) => {
    const token = localStorage.getItem("token");
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await axios.post("http://localhost:8000/api/user/avatar", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Foto profil berhasil diubah!");
      window.location.reload();
    } catch (error) {
      console.error("Gagal upload avatar:", error);
      alert("Gagal mengubah foto profil.");
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:8000/api/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("token");
      localStorage.removeItem("googleUser");
      localStorage.removeItem("login_method");
      window.location.href = "/login";
    } catch (error) {
      console.error("Gagal logout:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-gray-600 animate-pulse">Memuat profil...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-20 text-gray-600">
        Data profil tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-16 mb-20 bg-white shadow-lg rounded-2xl overflow-hidden">
      <div className="bg-sky-100 p-6 flex flex-col items-center relative">
        <div className="relative">
          <img
            src={userData.avatar}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-white shadow-md mb-3 object-cover"
          />

          <button
            className="absolute bottom-4 right-1 bg-sky-600 p-1 rounded-full text-white"
            onClick={() => fileInputRef.current.click()}
          >
            <Camera size={16} />
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleAvatarChange}
          />
        </div>

        <h2 className="text-xl font-black text-slate-800 tracking-tight">{userData.name}</h2>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mt-1">
          {userData.role === "admin"
            ? "Admin Klinik Bersama+"
            : userData.role === "owner"
            ? "Owner Klinik Bersama+"
            : "Pasien Klinik Bersama+"}
        </p>
      </div>

      <div className="px-6 py-5 space-y-3 text-gray-700">
        <div className="flex items-start space-x-2">
          <Home className="text-sky-500 mt-1" size={18} />
          <div>
            <p className="font-semibold text-gray-800">Alamat</p>
            <p>{userData.alamat || "Belum ada data pemeriksaan"}</p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <MapPin className="text-sky-500 mt-1" size={18} />
          <div>
            <p className="font-semibold text-gray-800">Email</p>
            <p>{userData.email}</p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Phone className="text-sky-500 mt-1" size={18} />
          <div>
            <p className="font-semibold text-gray-800">Nomor Telepon</p>
            <p>{userData.no_telepon}</p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t space-y-3">
        {/* 🔒 Tampilkan hanya jika login manual (konsisten dengan Navbar) */}
        {loginMethod !== "google" && (
          <button
            onClick={() => navigate("/ubah-password")}
            className="w-full bg-sky-600 text-white py-3 rounded-xl font-semibold hover:bg-sky-700 transition flex justify-center items-center space-x-2"
          >
            <Lock size={18} />
            <span>Ubah Password</span>
          </button>
        )}

        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition flex justify-center items-center space-x-2"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
