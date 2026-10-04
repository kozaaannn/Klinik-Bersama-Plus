import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleLoginSuccess = async () => {
      const params = new URLSearchParams(location.search);

      const token = params.get("token");
      const roleParam = params.get("role");
      const userParam = params.get("user");
      const isGoogle = params.get("google");

      if (token) {
        localStorage.setItem("token", token);
      }

      if (userParam) {
        try {
          const userObj = JSON.parse(userParam);
          localStorage.setItem("user", JSON.stringify(userObj));
        } catch (error) {
          console.error("Gagal parse user:", error);
        }
      }

      let finalRole = roleParam ? roleParam.toLowerCase() : "";

      // Jika role tidak ada di URL param tapi ada token, ambil dari profile API
      if (!finalRole && token) {
        try {
          const res = await axios.get("http://localhost:8000/api/user/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const fetchedUser = res.data?.user ?? res.data;
          if (fetchedUser?.role) {
            finalRole = fetchedUser.role.toLowerCase();
          }
          if (fetchedUser) {
            localStorage.setItem("user", JSON.stringify(fetchedUser));
          }
        } catch (err) {
          console.error("Gagal mengambil data profil:", err);
        }
      }

      if (!finalRole) {
        finalRole = "user";
      }

      localStorage.setItem("role", finalRole);

      if (isGoogle === "true" || isGoogle === "1") {
        localStorage.setItem("login_method", "google");
      } else {
        localStorage.setItem("login_method", "manual");
      }

      window.dispatchEvent(new Event("storage"));

      const timer = setTimeout(() => {
        if (finalRole === "admin" || finalRole === "owner") {
          navigate("/admin", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }, 500);

      return () => clearTimeout(timer);
    };

    handleLoginSuccess();
  }, [navigate, location]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6"></div>

      <h1 className="text-2xl font-bold text-emerald-700 mb-2">
        Login Berhasil
      </h1>

      <p className="text-gray-600 animate-pulse">
        Mengalihkan ke halaman yang sesuai...
      </p>
    </div>
  );
}
