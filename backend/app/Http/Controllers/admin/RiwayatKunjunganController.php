<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RiwayatKunjungan;

class RiwayatKunjunganController extends Controller
{
    // 🟢 Ambil semua riwayat kunjungan (untuk admin)
    public function index()
    {
        $riwayat = RiwayatKunjungan::orderBy('tanggal', 'desc')->get();
        return response()->json($riwayat);
    }

    // 🟢 Tambah data baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'nama_pasien' => 'required|string|max:255',
            'no_telepon' => 'nullable|string|max:30',
            'dokter' => 'required|string|max:255',
            'poli' => 'required|string|max:255',
            'keluhan' => 'nullable|string',
            'catatan' => 'nullable|string',
        ]);

        $riwayat = RiwayatKunjungan::create($validated);
        return response()->json($riwayat, 201);
    }

    // 🔴 Hapus data
    public function destroy($id)
    {
        $riwayat = RiwayatKunjungan::find($id);
        if (!$riwayat) {
            return response()->json(['message' => 'Data tidak ditemukan'], 404);
        }

        $riwayat->delete();
        return response()->json(['message' => 'Data berhasil dihapus']);
    }
    // 🟡 Update data kunjungan (status antrean, catatan, dll)
    public function update(Request $request, $id)
    {
        $riwayat = RiwayatKunjungan::findOrFail($id);

        $validated = $request->validate([
            'tanggal'     => 'sometimes|date',
            'nama_pasien' => 'sometimes|string|max:255',
            'no_telepon'  => 'nullable|string|max:30',
            'dokter'      => 'sometimes|string|max:255',
            'poli'        => 'sometimes|string|max:255',
            'keluhan'     => 'nullable|string',
            'catatan'     => 'nullable|string',
        ]);

        $riwayat->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Data kunjungan berhasil diperbarui.',
            'data'    => $riwayat,
        ]);
    }

    public function userRiwayat(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json([]);
        }

        $noTelepon = $user->no_telepon;
        $query = RiwayatKunjungan::query();

        if ($noTelepon) {
            $clean = preg_replace('/[^0-9]/', '', $noTelepon);
            $variants = [$noTelepon, $clean];
            if (str_starts_with($clean, '0')) {
                $variants[] = '62' . substr($clean, 1);
                $variants[] = '+62' . substr($clean, 1);
            } elseif (str_starts_with($clean, '62')) {
                $variants[] = '0' . substr($clean, 2);
                $variants[] = '+' . $clean;
            }

            $query->where(function ($q) use ($variants, $user) {
                $q->whereIn('no_telepon', array_unique($variants))
                  ->orWhere('nama_pasien', $user->name);
            });
        } else {
            $query->where('nama_pasien', $user->name);
        }

        $riwayat = $query->orderBy('tanggal', 'desc')->orderBy('id', 'desc')->get();
        return response()->json($riwayat);
    }

    public function storeUserVisit(Request $request)
    {
        $user = $request->user();
        $noTelepon = $request->no_telepon ?: ($user ? $user->no_telepon : null);

        if (!$noTelepon) {
            return response()->json([
                'success' => false,
                'message' => 'Nomor WhatsApp / telepon wajib diisi untuk pendaftaran antrean kunjungan.'
            ], 400);
        }

        if ($user && empty($user->no_telepon)) {
            $user->no_telepon = $noTelepon;
            $user->save();
        }

        $validated = $request->validate([
            'tanggal'     => 'required|date',
            'nama_pasien' => 'required|string|max:255',
            'dokter'      => 'required|string|max:255',
            'poli'        => 'required|string|max:255',
            'keluhan'     => 'nullable|string',
            'no_telepon'  => 'nullable|string|max:30',
        ]);

        $validated['no_telepon'] = $noTelepon;
        $validated['catatan'] = 'Menunggu Konfirmasi Antrean';

        $riwayat = RiwayatKunjungan::create($validated);
        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran antrean berhasil!',
            'data'    => $riwayat
        ], 201);
    }

    // 🟢 Ambil riwayat kunjungan berdasarkan nomor telepon (untuk detail admin)
    public function showByPhone($no_telepon)
    {
        $riwayat = RiwayatKunjungan::where('no_telepon', $no_telepon)
            ->orderBy('tanggal', 'desc')
            ->get();
        return response()->json($riwayat);
    }
}
