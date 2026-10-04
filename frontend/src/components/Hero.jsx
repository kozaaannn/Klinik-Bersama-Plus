import PromoSection from "./PromoSection";
import CTASection from "./CTASection";

export default function Hero() {
  return (
    <>
      {/* Hero Section */}
      <section
        className="relative text-center h-screen bg-cover bg-center bg-no-repeat w-full overflow-hidden"
        style={{
          backgroundImage: "url('/hero-klinik.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Konten tengah */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <h3 className="text-sky-100 font-semibold tracking-wide uppercase mb-2">
            Klinik Bersama Plus
          </h3>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 text-center">
            Sehat Bersama Kami <br /> Konsultasikan Kesehatan Anda
          </h1>
          <p className="text-gray-200 max-w-2xl mx-auto mb-8 text-center">
            Klinik modern dengan layanan medis profesional, nyaman, dan dilengkapi
            teknologi terkini untuk menunjang kesehatan Anda dan keluarga.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-sky-700 hover:bg-sky-800 text-white px-6 py-3 rounded-full font-semibold transition">
              Konsultasi Sekarang
            </button>
            <button className="border border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-semibold transition">
              Lihat Promo
            </button>
          </div>
        </div>
      </section>

      {/* Bagian berikutnya */}
      <PromoSection />
      <CTASection />
    </>
  );
}
