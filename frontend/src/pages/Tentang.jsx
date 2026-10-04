import { Heart, Shield, Award, Sparkles, MapPin, Clock, Phone, Mail } from "lucide-react";

export default function Tentang() {
  const values = [
    {
      icon: <Shield className="text-sky-600" size={24} />,
      title: "Integritas",
      desc: "Menjaga kejujuran, kerahasiaan medis pasien, dan etika kedokteran profesional tingkat tinggi dalam setiap layanan.",
    },
    {
      icon: <Heart className="text-rose-500" size={24} />,
      title: "Empati & Kasih Sayang",
      desc: "Memberikan pelayanan yang ramah, hangat, dan mendengarkan keluhan pasien dengan kepedulian yang tulus.",
    },
    {
      icon: <Award className="text-amber-500" size={24} />,
      title: "Profesionalisme",
      desc: "Didukung oleh tim dokter dan tenaga medis yang bersertifikat resmi, berpengalaman, dan berdedikasi tinggi.",
    },
    {
      icon: <Sparkles className="text-emerald-500" size={24} />,
      title: "Inovasi & Teknologi",
      desc: "Menggunakan peralatan kedokteran modern dan sistem digital untuk diagnosis yang presisi dan cepat.",
    },
  ];

  const doctors = [
    {
      name: "dr. Dicky Adrian, Sp.PD",
      spec: "Spesialis Penyakit Dalam",
      schedule: "Senin - Kamis (09:00 - 13:00)",
      img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
    },
    {
      name: "drg. Amanda Putri",
      spec: "Dokter Gigi & Mulut",
      schedule: "Senin - Sabtu (14:00 - 18:00)",
      img: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300&h=300",
    },
    {
      name: "dr. Rian Hermawan, Sp.A",
      spec: "Spesialis Anak & Tumbuh Kembang",
      schedule: "Selasa, Kamis, Sabtu (10:00 - 14:00)",
      img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8 pt-24 text-slate-700 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-sky-800 to-sky-950 text-white rounded-3xl p-8 md:p-16 text-center md:text-left relative overflow-hidden shadow-xl mb-16">
          <div className="absolute right-0 top-0 w-[450px] h-[450px] bg-white/5 rounded-full blur-3xl"></div>
          <div className="relative z-10 max-w-2xl">
            <span className="text-sky-300 font-bold uppercase tracking-wider text-sm">Profil Klinik</span>
            <h1 className="text-3xl md:text-5xl font-black mt-2 leading-tight tracking-tight">
              Dedikasi Sepenuh Hati untuk Kesehatan Anda
            </h1>
            <p className="text-sky-100/90 mt-6 leading-relaxed text-sm md:text-base">
              Klinik Bersama Plus telah melayani kebutuhan kesehatan keluarga sejak tahun 2018. Kami percaya bahwa setiap orang berhak atas pelayanan kesehatan berkualitas, cepat, aman, dan penuh kepedulian.
            </p>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-rose-500 font-extrabold text-sm uppercase tracking-widest">Arah Kami</span>
              <h3 className="text-2xl font-black text-slate-800 mt-2 mb-4">Visi Klinik</h3>
              <p className="leading-relaxed text-slate-600 text-sm">
                Menjadi klinik pratama unggulan pilihan utama masyarakat yang menyediakan pelayanan kesehatan holistik terpadu berkelanjutan dengan integritas tinggi dan teknologi ramah pengguna.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-sky-600 font-extrabold text-sm uppercase tracking-widest">Aksi Kami</span>
              <h3 className="text-2xl font-black text-slate-800 mt-2 mb-4">Misi Klinik</h3>
              <ul className="space-y-3.5 text-slate-600 text-sm list-disc pl-4">
                <li>Menyelenggarakan pelayanan medis profesional terstandarisasi untuk semua golongan pasien.</li>
                <li>Meningkatkan kesadaran masyarakat akan pencegahan penyakit melalui program cek dini berkala.</li>
                <li>Mengutamakan keramahan, keselamatan pasien, dan keakuratan data rekam medis.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-20 text-center">
          <span className="text-sky-600 font-bold uppercase tracking-wider text-sm">Prinsip Kerja</span>
          <h2 className="text-3xl font-black text-slate-800 mt-1 mb-12">Nilai-Nilai Utama Kami</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-left hover:shadow-md transition">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-5">
                  {v.icon}
                </div>
                <h4 className="font-bold text-slate-800 text-lg mb-2">{v.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Doctors Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-sky-600 font-bold uppercase tracking-wider text-sm">Tenga Medis Terbaik</span>
            <h2 className="text-3xl font-black text-slate-800 mt-1">Kenali Dokter Spesialis Kami</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doc, idx) => (
              <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm group">
                <div className="h-64 overflow-hidden relative bg-slate-200">
                  <img
                    src={doc.img}
                    alt={doc.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                  />
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-slate-800 text-lg">{doc.name}</h4>
                  <p className="text-sky-600 font-semibold text-xs mt-1">{doc.spec}</p>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={14} className="text-slate-400" />
                    <span>Jadwal: {doc.schedule}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact and Info */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-black text-slate-800 mb-6">Informasi Kontak & Lokasi</h3>
            <div className="space-y-5 text-sm">
              <div className="flex gap-4">
                <MapPin className="text-sky-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h5 className="font-bold text-slate-800">Alamat Klinik</h5>
                  <p className="text-slate-500 mt-1">Jl. Bersama Sejahtera No. 12, Kebayoran Baru, Jakarta Selatan, 12130</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="text-sky-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h5 className="font-bold text-slate-800">Jam Operasional</h5>
                  <p className="text-slate-500 mt-1">Senin - Sabtu (08:00 - 21:00) | Minggu (Tutup)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="text-sky-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h5 className="font-bold text-slate-800">Telepon & WhatsApp</h5>
                  <p className="text-slate-500 mt-1">(021) 78945612 / +62 812-3456-7890</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="text-sky-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h5 className="font-bold text-slate-800">E-mail Resmi</h5>
                  <p className="text-slate-500 mt-1">info@klinikbersamaplus.com</p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden h-72 border border-slate-200 shadow-inner">
            {/* Embedded Google Maps Placeholder */}
            <iframe
              title="Lokasi Klinik Bersama Plus"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2731804245645!2d106.80287951532822!3d-6.227690695491873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f14df5a0349f%3A0xe5a1b32d207ec1b2!2sKebayoran%20Baru!5e0!3m2!1sid!2sid!4v1680000000000!5m2!1sid!2sid"
              className="w-full h-full border-none"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}
