import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 Tambahkan interceptor supaya token otomatis dikirim ke server
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // pastikan token tersimpan waktu login

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
