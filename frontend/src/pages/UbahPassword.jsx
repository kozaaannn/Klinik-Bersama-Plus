import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function UbahPassword() {
  const [form, setForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password_confirmation) {
      toast.error("Password baru dan konfirmasi tidak cocok!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/user/change-password`,
        {
          current_password: form.current_password,
          new_password: form.password,
          new_password_confirmation: form.password_confirmation,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Password berhasil diperbarui ✅");
      setForm({ current_password: "", password: "", password_confirmation: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan");
    }
  };

  return (
   <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-6">
  <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-sm md:max-w-md border">

        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Ubah Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password Lama */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password Lama</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Lock size={18} className="text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="current_password"
                value={form.current_password}
                onChange={handleChange}
                className="flex-1 ml-2 outline-none"
                placeholder="Masukkan password lama"
                required
              />
            </div>
          </div>

          {/* Password Baru */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password Baru</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Lock size={18} className="text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="flex-1 ml-2 outline-none"
                placeholder="Masukkan password baru"
                required
              />
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Konfirmasi Password</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Lock size={18} className="text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                className="flex-1 ml-2 outline-none"
                placeholder="Konfirmasi password baru"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}
