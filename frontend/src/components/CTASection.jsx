// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Phone, ArrowRight, Heart } from "lucide-react";

export default function CTASection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative bg-sky-700 text-white text-center py-24 px-6 shadow-2xl overflow-hidden"
    >
      {/* Subtle Animated Background Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"
      ></motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-xl"
      ></motion.div>

      {/* Overlay for Depth */}
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Icon with Floating Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mb-8"
        >
      
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-2xl md:text-4xl font-extrabold mb-6 leading-tight tracking-tight"
        >
          Siap untuk{" "}
          <span className="text-yellow-300">Kesehatan Optimal</span>{" "}
          Anda?
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/90 mb-10 max-w-3xl mx-auto text-base leading-relaxed font-light"
        >
          Daftarkan diri Anda untuk pemeriksaan kesehatan menyeluruh atau konsultasi dengan dokter ahli kami. Mulai langkah awal menuju hidup sehat hari ini dan rasakan manfaatnya!
        </motion.p>

        {/* Call-to-Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 15px 35px rgba(0,0,0,0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-sky-700 font-bold px-10 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl flex items-center gap-3"
          >
            <Phone size={24} />
            <span>Hubungi Kami</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-white text-white font-semibold px-10 py-4 rounded-full hover:bg-white hover:text-sky-700 transition-all duration-300 flex items-center gap-3"
          >
            <span>Pelajari Lebih Lanjut</span>
            <ArrowRight size={24} />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
}
