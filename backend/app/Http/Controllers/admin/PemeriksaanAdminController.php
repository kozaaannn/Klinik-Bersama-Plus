<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pemeriksaan;

class PemeriksaanAdminController extends Controller
{
    // 🔹 Ambil semua data pemeriksaan
    public function index()
    {
        $data = Pemeriksaan::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Data pemeriksaan berhasil diambil',
            'data' => $data
        ]);
    }

    // 🔹 Update data pemeriksaan
    public function update(Request $request, $id)
    {
        $pemeriksaan = Pemeriksaan::find($id);

        if (!$pemeriksaan) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $pemeriksaan->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Data pemeriksaan berhasil diperbarui',
            'data' => $pemeriksaan
        ]);
    }

    // 🔹 Hapus data pemeriksaan
    public function destroy($id)
    {
        $pemeriksaan = Pemeriksaan::find($id);

        if (!$pemeriksaan) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        $pemeriksaan->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data pemeriksaan berhasil dihapus'
        ]);
    }
    public function show($id)
{
    $pemeriksaan = \App\Models\Pemeriksaan::find($id);

    if (!$pemeriksaan) {
        return response()->json(['message' => 'Data tidak ditemukan'], 404);
    }

    return response()->json(['data' => $pemeriksaan]);
}

}
