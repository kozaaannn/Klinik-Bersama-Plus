import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export default function InputNoTelepon() {
  const [noTelepon, setNoTelepon] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  // 🚨 Jika tidak ada token → redirect ke login
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^08\d{8,13}$/.test(noTelepon)) {
      setMessage("❌ Nomor telepon tidak valid. Gunakan format 08xxxx...");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:8000/api/user/update-no-telepon",
        { no_telepon: noTelepon },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      const userRole = (res.data.user?.role || searchParams.get("role") || "user").toLowerCase();
      localStorage.setItem("role", userRole);

      setMessage("✅ Nomor telepon berhasil disimpan!");
      setTimeout(() => navigate("/login-success?token=" + token + "&role=" + encodeURIComponent(userRole)), 1500);
    } catch (error) {
      console.error(error.response?.data || error.message);

      if (error.response?.status === 401) {
        setMessage("⚠️ Sesi kamu sudah berakhir. Silakan login ulang.");
        setTimeout(() => navigate("/login"), 2000);
      } else if (
        error.response?.data?.message?.includes("has been taken") ||
        error.response?.data?.message?.includes("Nomor telepon sudah digunakan")
      ) {
        setMessage("❌ Nomor telepon sudah digunakan.");
      } else {
        setMessage(
          error.response?.data?.message ||
            "❌ Gagal menyimpan nomor telepon. Coba lagi."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-3">
          Verifikasi Nomor Telepon 
        </h2>
        <p className="text-gray-600 text-center mb-6 text-sm leading-relaxed">
          Masukkan nomor telepon kamu untuk melanjutkan.
          <br />
          <span className="text-blue-500 font-medium">
            Nomor telepon hanya bisa digunakan untuk satu email.
          </span>{" "}
          Pastikan nomor ini digunakan untuk akun pemeriksaan kamu agar data
          tetap tersinkron.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="tel"
            placeholder="Contoh: 08123456789"
            className="border border-gray-300 p-3 rounded-lg w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center text-lg tracking-wide transition"
            value={noTelepon}
            onChange={(e) => setNoTelepon(e.target.value)}
            disabled={loading}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#E21B70] hover:bg-[#E21B70] active:scale-[0.98]"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan Nomor Telepon"}
          </button>
        </form>

        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`mt-4 text-center text-sm font-medium ${
              message.startsWith("✅")
                ? "text-green-600"
                : message.startsWith("⚠️")
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {message}
          </motion.div>
        )}

        <div className="mt-6 text-center text-gray-400 text-xs">
          © {new Date().getFullYear()} Klinik Bersama Plus
        </div>
      </motion.div>
    </div>
  );
}
