import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function PromoSection() {
  const defaultPromos = [
    { id: 1, title: "Cek Kesehatan Umum", price: "Rp 150.000", desc: "Nikmati layanan profesional dengan harga terjangkau." },
    { id: 2, title: "Paket Gigi Sehat", price: "Rp 200.000", desc: "Nikmati layanan profesional dengan harga terjangkau." },
    { id: 3, title: "Vaksinasi Anak", price: "Rp 250.000", desc: "Nikmati layanan profesional dengan harga terjangkau." },
    { id: 4, title: "Pemeriksaan Lansia", price: "Rp 300.000", desc: "Nikmati layanan profesional dengan harga terjangkau." },
  ];

  const [promos, setPromos] = useState([]);
  const scrollRef = useRef(null);
  const [activeId, setActiveId] = useState(null);

  const fetchPromos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/public/promos");
      if (res.data && res.data.status === "success" && res.data.data.length > 0) {
        const mapped = res.data.data.map((item) => ({
          id: item.id,
          title: item.judul,
          desc: item.deskripsi,
          price: new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(item.harga),
          gambar: item.gambar ? `http://localhost:8000/storage/${item.gambar}` : null,
        }));
        setPromos(mapped);
      } else {
        setPromos(defaultPromos);
      }
    } catch (error) {
      console.error("Gagal mengambil promo:", error);
      setPromos(defaultPromos);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  // Gandakan data agar loop seamless
  const duplicatedPromos = [...promos, ...promos, ...promos];

  // Infinite auto scroll yang halus dan stabil
  useEffect(() => {
    if (promos.length === 0) return;
    const container = scrollRef.current;
    if (!container) return;

    let scrollSpeed = 0.8;
    let rafId;

    const smoothScroll = () => {
      container.scrollLeft += scrollSpeed;

      // kalau udah sampai tengah list, reset biar gak "lompat"
      if (container.scrollLeft >= container.scrollWidth / 3) {
        container.scrollLeft = 0;
      }

      rafId = requestAnimationFrame(smoothScroll);
    };

    rafId = requestAnimationFrame(smoothScroll);
    return () => cancelAnimationFrame(rafId);
  }, [promos]);

  return (
    <section className="py-16 bg-white text-center overflow-hidden">
      <h2 className="text-2xl font-bold text-sky-800 mb-4">
        Promo & Program Kesehatan
      </h2>
      <p className="text-gray-600 mb-8">
        Dapatkan penawaran terbaik setiap bulan untuk layanan unggulan kami.
      </p>

      {/* Container scroll */}
      {promos.length > 0 && (
        <div
          ref={scrollRef}
          className="flex overflow-x-hidden gap-6 px-4 md:px-0 select-none scrollbar-hide py-4"
        >
          {duplicatedPromos.map((promo, idx) => (
            <div
              key={`${promo.id}-${idx}`}
              onTouchStart={() => setActiveId(promo.id)}
              onTouchEnd={() => setTimeout(() => setActiveId(null), 300)}
              onMouseEnter={() => setActiveId(promo.id)}
              onMouseLeave={() => setActiveId(null)}
              className={`min-w-[280px] max-w-[280px] border border-slate-100 rounded-3xl p-6 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between text-left
                ${
                  activeId === promo.id
                    ? "bg-sky-50/80 scale-105 shadow-xl border-sky-300"
                    : "bg-white hover:bg-slate-50/50 hover:shadow-md"
                }`}
            >
              <div>
                {promo.gambar && (
                  <div className="h-36 rounded-2xl overflow-hidden mb-4 bg-slate-100">
                    <img src={promo.gambar} alt={promo.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <h3 className="font-bold text-sky-800 text-lg leading-snug mb-2">{promo.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed mb-4">
                  {promo.desc}
                </p>
              </div>
              <p className="text-rose-600 font-extrabold text-base tracking-tight">{promo.price}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
