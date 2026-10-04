import { useState, useEffect } from "react";
import axios from "axios";

export default function Owner() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const token = localStorage.getItem("token");

  const API_URL = "http://localhost:8000/api/admin/owner";

  // GET LIST ADMIN
  const fetchUsers = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.data);
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  };

  // CREATE ADMIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Admin berhasil ditambahkan!");
      setForm({ name: "", email: "", password: "", role: "admin" });
      fetchUsers();
    } catch (err) {
      alert("❌ Gagal menambah admin (kemungkinan email sudah digunakan)");
    }
  };

  // ACTIVATE / DEACTIVATE ADMIN
  const toggleStatus = async (id) => {
    try {
      await axios.put(
        `${API_URL}/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      alert("❌ Gagal update status");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl border border-gray-200">

      <h2 className="text-lg font-bold text-blue-800 mb-4">
        👑 Manajemen Admin (Owner Only)
      </h2>

      {/* Form Tambah Admin */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200"
      >
        <div className="sm:col-span-3">
          <input
            type="text"
            placeholder="Nama Admin"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-3">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-3">
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-3 flex items-end">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-semibold transition"
          >
            Tambah Admin
          </button>
        </div>
      </form>

      {/* Tabel Admin */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-bold">
            <tr>
              <th className="text-left px-4 py-2">Nama</th>
              <th className="text-left px-4 py-2">Email</th>
              <th className="text-center px-4 py-2">Status</th>
              <th className="text-center px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u, i) => (
                <tr
                  key={u.id}
                  className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}
                >
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>

                  <td className="text-center px-4 py-2">
                    {u.is_active ? (
                      <span className="text-green-600 font-semibold">Aktif</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Nonaktif</span>
                    )}
                  </td>

                  <td className="text-center px-4 py-2">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={`${
                        u.is_active
                          ? "text-red-600 hover:text-red-800"
                          : "text-green-600 hover:text-green-800"
                      }`}
                    >
                      {u.is_active ? "Nonaktifkan" : "Aktifkan"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500 italic">
                  Tidak ada admin terdaftar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
