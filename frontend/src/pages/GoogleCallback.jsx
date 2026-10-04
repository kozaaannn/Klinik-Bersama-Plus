import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/auth/google/callback", {
          withCredentials: true,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("loginMethod", "google"); // ⚡ penting biar bisa dibedain

        window.dispatchEvent(new Event("storage"));

        toast.success("Login Google Berhasil!");
        if (res.data.user.role === "admin") navigate("/admin");
        else navigate("/");
      } catch (err) {
        toast.error("Login Google gagal!");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  return <p className="text-center mt-10">Sedang memproses login Google...</p>;
}
