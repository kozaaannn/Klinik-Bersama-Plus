import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = (localStorage.getItem("role") || "").toLowerCase();

    if (!token) return;

    if (role === "admin" || role === "owner") {
      navigate("/admin", { replace: true });
      return;
    }

    if (role === "user") {
      navigate("/", { replace: true });
      return;
    }
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      return toast.error("Password minimal 6 karakter!");
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      const userRole = (res.data.user?.role || "user").toLowerCase();

      // ✅ Simpan data login manual
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("login_method", "manual");

      window.dispatchEvent(new Event("storage"));

      // ✅ Arahkan sesuai role
      if (userRole === "admin" || userRole === "owner") {
        toast.success("Login sebagai Admin / Owner");
        navigate("/admin", { replace: true });
      } else {
        toast.success("Login Berhasil!");
        navigate("/", { replace: true });
      }

    } catch (err) {
      toast.error("Email atau password salah!");
    }
  };

  // ✅ Login Google (tanpa password)
  const handleGoogleLogin = () => {
    localStorage.setItem("login_method", "google"); // simpan sebelum redirect
    window.location.href = "http://localhost:8000/api/auth/google";
  };
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center 
      bg-[url('/hero-klinik.jpg')]
      bg-cover bg-center bg-no-repeat"
    >
      {/* ✅ Lapisan gelap tipis di atas background */}
      <div className="absolute inset-0 bg-black/45 z-0"></div>
  
      {/* ✅ Card Login */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md mx-4 
        bg-white/85 backdrop-blur-xl
        rounded-3xl shadow-2xl p-8 md:p-10 border border-white/30"
      >
        {/* Tombol close */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-2xl transition"
        >
          ×
        </button>
  
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="logo"
            className="w-16 h-16 object-contain"
          />
        </div>
  
        {/* Judul */}
        <h2 className="text-center text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          Masuk ke Akun Anda
        </h2>
        <p className="text-center text-slate-500 text-xs mt-1 mb-8 font-medium">
          Gunakan email & password atau akun Google Anda.
        </p>
  
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl 
            focus:ring-4 focus:ring-sky-500/10 focus:border-sky-600 transition outline-none text-sm"
            required
          />
  
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Kata Sandi"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl 
              focus:ring-4 focus:ring-sky-500/10 focus:border-sky-600 transition outline-none text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
  
          <button
            type="submit"
            className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white 
            rounded-xl font-bold transition active:scale-95 shadow-md shadow-sky-600/10"
          >
            Masuk Sekarang
          </button>
        </form>
  
        {/* Garis pembatas */}
        <div className="flex items-center justify-center gap-2 my-6">
          <hr className="flex-1 border-gray-200" />
          <span className="text-gray-400 text-xs font-semibold uppercase">atau</span>
          <hr className="flex-1 border-gray-200" />
        </div>
  
        {/* Tombol Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3.5 border border-gray-300 rounded-xl flex items-center 
          justify-center gap-3 hover:bg-gray-100 transition active:scale-95 font-bold text-sm"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-gray-700">Masuk dengan Google</span>
        </button>
  
        <p className="text-center text-sm text-gray-600 mt-6">
          Belum punya akun?{" "}
          <a href="/signup" className="text-sky-600 font-bold hover:underline">
            Daftar Sekarang
          </a>
        </p>
      </motion.div>
    </div>
  );
}