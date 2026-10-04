import { Navigate } from "react-router-dom";

/* ======================================================
 | 🔐 ROUTE KHUSUS ADMIN & OWNER (akses halaman admin)
 ====================================================== */
export function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Jika belum login
  if (!token) return <Navigate to="/login" replace />;

  // Jika role admin atau owner → bisa masuk
  if (role === "admin" || role === "owner") {
    return children;
  }

  // Selain itu (role user) → lempar ke home
  return <Navigate to="/" replace />;
}

/* ======================================================
 | 🔐 ROUTE UNTUK USER BIASA
 ====================================================== */
export function UserRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  // Membolehkan user, admin, dan owner mengakses profil / ubah password
  return children;
}

/* ======================================================
 | 🔐 ROUTE KHUSUS OWNER (fitur tambahan khusus owner)
 ====================================================== */
export function OwnerRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  // Hanya owner yang boleh masuk
  if (role === "owner") {
    return children;
  }

  // Selain owner → lempar ke home
  return <Navigate to="/" replace />;
}
