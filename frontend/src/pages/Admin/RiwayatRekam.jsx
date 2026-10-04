import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function RiwayatRekam() {
  const [form, setForm] = useState({
    nama: "",
    no_telepon: "",
    alamat: "",
    tanggal_lahir: "",
    tinggi_badan: "",
    berat_badan: "",
    waktu_pemeriksaan: "",
    tekanan_darah: "",
    gula_darah: "",
    kolesterol: "",
    asam_urat: "",
    hasil_pemeriksaan: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validasi nomor telepon
    const regexTelepon = /^08[0-9]{8,}$/;
    if (!regexTelepon.test(form.no_telepon)) {
      return toast.error(
        "Nomor telepon harus diawali 08, hanya angka, dan minimal 10 digit!"
      );
    }

    try {
      console.log("Data dikirim:", form);

      await axios.post("http://localhost:8000/api/admin/pemeriksaan", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("✅ Data pemeriksaan berhasil disimpan!");

      // Reset form setelah kirim
      setForm({
        nama: "",
        no_telepon: "",
        alamat: "",
        tanggal_lahir: "",
        tinggi_badan: "",
        berat_badan: "",
        waktu_pemeriksaan: "",
        tekanan_darah: "",
        gula_darah: "",
        kolesterol: "",
        asam_urat: "",
        hasil_pemeriksaan: "",
      });
    } catch (error) {
      console.log(error.response?.data || error);
      toast.error("❌ Gagal menyimpan data. Periksa kembali input Anda!");
    }
  };

  return (
    <div className="w-full flex justify-center py-10">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-3xl">
        <h2 className="text-center text-2xl font-bold text-blue-800 mb-8">
          Form Pemeriksaan Kesehatan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama */}
          <div>
            <label className="block font-medium text-gray-700">
              Nama Lengkap Pasien
            </label>
            <input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan nama pasien"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Nomor Telepon */}
          <div>
            <label className="block font-medium text-gray-700">
              Nomor Telepon
            </label>
            <input
              type="text"
              name="no_telepon"
              value={form.no_telepon}
              onChange={(e) => {
                // hanya izinkan angka
                const val = e.target.value.replace(/[^0-9]/g, "");
                setForm({ ...form, no_telepon: val });
              }}
              placeholder="Contoh: 081234567890"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Alamat */}
          <div>
            <label className="block font-medium text-gray-700">Alamat</label>
            <input
              type="text"
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              placeholder="Masukkan alamat lengkap"
              className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Tanggal Lahir & Waktu Pemeriksaan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-medium text-gray-700">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="tanggal_lahir"
                value={form.tanggal_lahir}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Waktu Pemeriksaan
              </label>
              <input
                type="time"
                name="waktu_pemeriksaan"
                value={form.waktu_pemeriksaan}
                onChange={handleChange}
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Tinggi & Berat */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-medium text-gray-700">
                Tinggi Badan (cm)
              </label>
              <input
                type="number"
                name="tinggi_badan"
                value={form.tinggi_badan}
                onChange={handleChange}
                placeholder="Contoh: 170"
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Berat Badan (kg)
              </label>
              <input
                type="number"
                name="berat_badan"
                value={form.berat_badan}
                onChange={handleChange}
                placeholder="Contoh: 65"
                className="w-full mt-2 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          {/* Pemeriksaan Medis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-medium text-gray-700">
                Tekanan Darah (mmHg)
              </label>
              <input
                type="text"
                name="tekanan_darah"
                value={form.tekanan_darah}
                onChange={handleChange}
                placeholder="Contoh: 120/80"
                className="w-full mt-2 p-3 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Gula Darah (mg/dL)
              </label>
              <input
                type="number"
                name="gula_darah"
                value={form.gula_darah}
                onChange={handleChange}
                placeholder="Contoh: 100"
                className="w-full mt-2 p-3 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Kolesterol (mg/dL)
              </label>
              <input
                type="number"
                name="kolesterol"
                value={form.kolesterol}
                onChange={handleChange}
                placeholder="Contoh: 150"
                className="w-full mt-2 p-3 border rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700">
                Asam Urat (mg/dL)
              </label>
              <input
                type="number"
                name="asam_urat"
                value={form.asam_urat}
                onChange={handleChange}
                placeholder="Contoh: 5.2"
                className="w-full mt-2 p-3 border rounded-lg"
                required
              />
            </div>
          </div>

          {/* Hasil Pemeriksaan */}
          <div>
            <label className="block font-medium text-gray-700">
              Hasil Pemeriksaan
            </label>
            <textarea
              name="hasil_pemeriksaan"
              value={form.hasil_pemeriksaan}
              onChange={handleChange}
              placeholder="Contoh: Kondisi stabil..."
              rows="4"
              className="w-full mt-2 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 outline-none"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition shadow-md"
          >
            Simpan Data Pemeriksaan
          </button>
        </form>
      </div>
    </div>
  );
}
