<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pemeriksaan;

class PemeriksaanController extends Controller
{
    /* ======================================================
     | 📋 AMBIL SEMUA DATA (untuk Admin)
     ====================================================== */
    public function index()
    {
        $data = Pemeriksaan::orderBy('id', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => '📋 Semua data pemeriksaan berhasil diambil.',
            'data'    => $data
        ]);
    }

    /* ======================================================
     | 🟢 SIMPAN DATA PEMERIKSAAN BARU (oleh Admin)
     ====================================================== */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nama'              => 'required|string|max:255',
                'alamat'            => 'required|string|max:255',
                'tanggal_lahir'     => 'required|date',
                'tinggi_badan'      => 'required|numeric',
                'berat_badan'       => 'required|numeric',
                'waktu_pemeriksaan' => 'nullable|string',
                'tekanan_darah'     => 'required|string',
                'gula_darah'        => 'required|numeric',
                'kolesterol'        => 'required|numeric',
                'asam_urat'         => 'required|numeric',
                'hasil_pemeriksaan' => 'required|string',
                'no_telepon'        => 'required|string|max:20',
            ]);

            $data = Pemeriksaan::create([
                'no_telepon'        => $validated['no_telepon'],
                'nama'              => $validated['nama'],
                'alamat'            => $validated['alamat'],
                'tanggal_lahir'     => $validated['tanggal_lahir'],
                'waktu_pemeriksaan' => $validated['waktu_pemeriksaan'] ?? now()->format('H:i:s'),
                'tinggi_badan'      => $validated['tinggi_badan'],
                'berat_badan'       => $validated['berat_badan'],
                'tekanan_darah'     => $validated['tekanan_darah'],
                'gula_darah'        => $validated['gula_darah'],
                'kolesterol'        => $validated['kolesterol'],
                'asam_urat'         => $validated['asam_urat'],
                'hasil_pemeriksaan' => $validated['hasil_pemeriksaan'],
            ]);

            return response()->json([
                'success' => true,
                'message' => '✅ Data pemeriksaan berhasil disimpan.',
                'data'    => $data
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => '❌ Terjadi kesalahan: ' . $e->getMessage(),
            ], 500);
        }
    }

    /* ======================================================
     | 📄 LIHAT RIWAYAT PEMERIKSAAN USER LOGIN
     | (hanya tampilkan data milik user berdasarkan no_telepon)
     ====================================================== */
    public function riwayatByTelepon(Request $request)
    {
        $user = $request->user(); // 🔒 user yang sedang login

        // Pastikan user memiliki no_telepon
        if (!$user || !$user->no_telepon) {
            return response()->json([
                'success' => false,
                'message' => '⚠️ Nomor telepon tidak ditemukan pada akun Anda.',
                'data'    => [],
            ]);
        }

        $no_telepon = $user->no_telepon;

        $riwayat = Pemeriksaan::where('no_telepon', $no_telepon)
            ->orderBy('id', 'desc')
            ->get();

        if ($riwayat->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => '⚠️ Tidak ada data pemeriksaan untuk akun Anda.',
                'data'    => [],
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => '📋 Riwayat pemeriksaan Anda berhasil diambil.',
            'data'    => $riwayat,
        ]);
    }
}
