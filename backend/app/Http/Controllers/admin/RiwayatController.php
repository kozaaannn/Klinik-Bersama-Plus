<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RiwayatController extends Controller
{
    private $riwayat = [
        ['id' => 1, 'pasien' => 'Andi', 'diagnosa' => 'Flu'],
        ['id' => 2, 'pasien' => 'Siti', 'diagnosa' => 'Demam Berdarah'],
    ];

    public function index()
    {
        return response()->json($this->riwayat);
    }

    public function store(Request $request)
    {
        return response()->json([
            'message' => 'Riwayat baru berhasil disimpan!',
            'data' => $request->all(),
        ], 201);
    }

    public function show($id)
    {
        return response()->json([
            'id' => $id,
            'pasien' => 'Nama Contoh',
            'diagnosa' => 'Contoh Diagnosa',
        ]);
    }

    public function update(Request $request, $id)
    {
        return response()->json([
            'message' => "Riwayat ID {$id} berhasil diperbarui.",
            'data' => $request->all(),
        ]);
    }

    public function destroy($id)
    {
        return response()->json([
            'message' => "Riwayat ID {$id} berhasil dihapus."
        ]);
    }
}
