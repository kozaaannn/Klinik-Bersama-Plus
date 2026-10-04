import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    no_telepon: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      if (value.includes("@")) {
        const domain = value.split("@")[1];
        if (domain && domain !== "gmail.com") {
          setEmailError("Email harus menggunakan domain @gmail.com!");
        } else {
          setEmailError("");
        }
      } else {
        setEmailError("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.endsWith("@gmail.com")) {
      toast.error("Email hanya boleh menggunakan domain @gmail.com!");
      return;
    }

    if (
      formData.no_telepon.length < 10 ||
      !/^[0-9]+$/.test(formData.no_telepon)
    ) {
      toast.error("Nomor telepon tidak valid (minimal 10 digit angka)!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Kata sandi minimal 6 karakter!");
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      toast.error("Konfirmasi kata sandi tidak cocok!");
      return;
    }

    try {
      const data = {
        name: formData.name,
        email: formData.email,
        no_telepon: formData.no_telepon,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };

      await axios.post("http://localhost:8000/api/signup", data, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success("✅ Pendaftaran berhasil! Silakan login.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      if (error.response?.data?.errors?.email) {
        toast.error("Email sudah terdaftar!");
      } else if (error.response?.data?.errors?.no_telepon) {
        toast.error("Nomor telepon sudah digunakan!");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Pendaftaran gagal, coba lagi.");
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center
      bg-[url('/hero-klinik.jpg')]
      bg-cover bg-center bg-no-repeat relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm z-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="relative z-10 w-full max-w-md bg-white/85 backdrop-blur-xl
        rounded-3xl shadow-2xl p-8 md:p-10 border border-white/30"
      >
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-5 text-gray-400 hover:text-gray-600 text-2xl transition"
        >
          ×
        </button>

        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="logo"
            className="w-16 h-16 object-contain"
          />
        </div>

        <h2 className="text-center text-xl md:text-2xl font-black text-slate-800 tracking-tight mb-2">
          Buat Akun Baru
        </h2>
        <p className="text-center text-slate-500 text-xs mt-1 mb-8 font-medium">
          Daftarkan akun pasien Klinik Bersama Plus Anda.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Nama Lengkap"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl
            focus:ring-4 focus:ring-sky-500/10 focus:border-sky-600 transition outline-none text-sm"
            required
          />

          <input
            type="text"
            name="no_telepon"
            placeholder="Nomor Telepon"
            value={formData.no_telepon}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl
            focus:ring-4 focus:ring-sky-500/10 focus:border-sky-600 transition outline-none text-sm"
            required
          />

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email (hanya @gmail.com)"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl transition outline-none text-sm ${
                emailError
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-600"
              }`}
              required
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Kata Sandi (min. 6 karakter)"
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

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="password_confirmation"
              placeholder="Konfirmasi Kata Sandi"
              value={formData.password_confirmation}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl
              focus:ring-4 focus:ring-sky-500/10 focus:border-sky-600 transition outline-none text-sm"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-sky-600 hover:bg-sky-700
            text-white rounded-xl font-bold transition active:scale-95 shadow-md shadow-sky-600/10"
          >
            Daftar Sekarang
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Sudah punya akun?{" "}
          <a
            href="/login"
            className="text-sky-600 font-bold hover:underline"
          >
            Masuk di sini
          </a>
        </p>
      </motion.div>
    </div>
  );
}
