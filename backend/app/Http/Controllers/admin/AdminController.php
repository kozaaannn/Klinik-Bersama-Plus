<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'message' => 'Selamat datang di Dashboard Admin!',
            'stats' => [
                'total_users' => User::where('role', 'user')->count(),
                'total_karir' => \App\Models\Karir::count(),
                'total_riwayat' => \App\Models\Pemeriksaan::count(),
            ]
        ]);
    }

    // 👥 Ambil semua data pasien (users dengan role 'user')
    public function getPatients()
    {
        $patients = User::where('role', 'user')->orderBy('id', 'desc')->get();
        return response()->json([
            'success' => true,
            'data' => $patients
        ]);
    }

    // 🔴 Hapus data pasien
    public function deletePatient($id)
    {
        $patient = User::findOrFail($id);
        $patient->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data pasien berhasil dihapus.'
        ]);
    }
}
