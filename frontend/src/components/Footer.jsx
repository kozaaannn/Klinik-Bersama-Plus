import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { MapPin, Phone, Mail, Instagram, Facebook, Linkedin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-sky-900 text-white py-12 px-6 md:px-12 lg:px-20">

      {/* BARIS 1 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mb-12 text-sm">

        {/* Logo & Deskripsi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-5">
            <img
              src="/images/logo-asli.png"
              alt="Logo Klinik Bersama Plus"
              className="w-16 md:w-20 lg:w-24 object-contain transition-all duration-300"
            />
            <div>
              <h3 className="text-lg font-semibold leading-tight">Klinik Bersama Plus</h3>
              <p className="text-white/60 text-sm -mt-1">Klinik Modern</p>
            </div>
          </div>
          <p className="text-white/80 leading-relaxed">
            Klinik modern dengan pelayanan cepat, nyaman, dan profesional.  
            Memberikan solusi kesehatan terbaik untuk keluarga Anda.
          </p>
        </motion.div>

        {/* Layanan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h4 className="font-semibold text-lg mb-4">Layanan</h4>
          <ul className="space-y-2 text-white/80">
            <li>Konsultasi Umum</li>
            <li>Laboratorium</li>
            <li>Vaksinasi</li>
            <li>Gigi & Mulut</li>
          </ul>
        </motion.div>

        {/* Halaman */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h4 className="font-semibold text-lg mb-4">Halaman</h4>
          <ul className="space-y-2 text-white/80">
            <li>Home</li>
            <li>Tentang Kami</li>
            <li>Dokter</li>
            <li>Kontak</li>
            <li>Blog</li>
          </ul>
        </motion.div>

      </div>

      {/* BARIS 2 — Kontak, Ikuti Kami, Lokasi */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 text-sm">

        {/* Kontak */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h4 className="font-semibold text-lg mb-4">Kontak</h4>
          <ul className="space-y-3 text-white/80">
            <li className="flex items-start gap-2">
              <MapPin className="text-green-400 w-5 h-5 flex-shrink-0" />
              <span>Jl. Sehat No.123, Jakarta</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="text-green-400 w-5 h-5 flex-shrink-0" />
              <span>(021) 123-4567</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail className="text-green-400 w-5 h-5 flex-shrink-0 mt-[2px]" />
              <span className="break-all">info@klinikbersamaplus.com</span>
            </li>
          </ul>
        </motion.div>

        {/* Ikuti Kami */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h4 className="font-semibold text-lg mb-4">Ikuti Kami</h4>
          <ul className="space-y-3 text-white/80">
            <li className="flex items-center gap-2">
              <Instagram className="text-green-400 w-5 h-5" />
              <span>@klinikbersamaplus</span>
            </li>
            <li className="flex items-center gap-2">
              <Facebook className="text-green-400 w-5 h-5" />
              <span>Klinik Bersama Official</span>
            </li>
            <li className="flex items-center gap-2">
              <Linkedin className="text-green-400 w-5 h-5" />
              <span>Klinik Bersama Plus</span>
            </li>
          </ul>
        </motion.div>

        {/* Lokasi Kami (Tanpa Kotak) */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.5 }}
  viewport={{ once: true }}
>
  <h4 className="font-semibold text-lg mb-4">Lokasi Kami</h4>

  <ul className="space-y-3 text-white/80">

    <li className="flex items-start gap-2">
      <MapPin className="text-green-400 w-5 h-5 flex-shrink-0" />
      <a
        href="https://www.google.com/maps?q=Klinik+Bersama+Plus+Jl.+Sehat+No.+88+Bogor"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-green-300 transition leading-relaxed"
      >
        🏥 Klinik Bersama Plus <br />
        Jl. Sehat No. 88, <br />
        Kel. Bahagia, Kec. Harmoni, <br />
        Kota Bogor, Jawa Barat 16111
      </a>
    </li>

  </ul>
</motion.div>


      </div>

      {/* Footer Bawah */}
      <div className="border-t border-white/20 mt-10 pt-5 text-center text-white/60 text-sm">
        © 2025 <span className="font-semibold">Klinik Bersama Plus</span> | Semua Hak Dilindungi
      </div>

      {/* Tombol WA */}
      <a
  href="https://wa.me/6281234567890"
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-5 right-5 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all"
>
  <FaWhatsapp className="w-8 h-8" />
</a>
    </footer>
  );
}
