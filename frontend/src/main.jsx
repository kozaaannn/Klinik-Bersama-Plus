import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// ✅ Tambahkan ini
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="866538921099-12tbvtbtj5relmkkiph7696blrbrqkkeu.apps.googleusercontent.com">
    <>
      <ToastContainer position="top-center" autoClose={2000} /> {/* ✅ Tambah */}
      <App />
    </>
  </GoogleOAuthProvider>
);
