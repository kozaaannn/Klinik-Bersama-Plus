<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StokObat;
use Illuminate\Support\Facades\Validator;

class StokObatController extends Controller
{
    public function index()
    {
        $stok = StokObat::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'message' => 'Daftar Stok Obat',
            'data' => $stok
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_obat'   => 'required|string|max:255',
            'qty_pack'    => 'required|integer|min:1',
            'stok_pack'   => 'required|integer|min:0',
            'harga_modal' => 'required|numeric|min:0',
            'ppn'         => 'nullable|numeric|min:0',
            'margin'      => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        $existing = StokObat::where('nama_obat', $request->nama_obat)->first();

        /** =============================================
         *  Jika obat sudah ada → hanya tambahkan stok_pack
         *  qty_pack TIDAK ditambah (tetap isi per pack)
         * =============================================*/
        if ($existing) {
            $existing->stok_pack = $existing->stok_pack + $request->stok_pack;

            // qty_pack tetap mengikuti request (isi per pack)
            $existing->qty_pack = (int) $request->qty_pack;

            // qty_total otomatis
            $existing->qty_total = $existing->qty_pack * $existing->stok_pack;

            // harga
            $existing->harga_modal = $request->harga_modal;
            $existing->ppn = $request->ppn;
            $existing->margin = $request->margin;

            $existing->total_harga = $this->hitungTotalHarga($existing->toArray());
            $existing->save();

            return response()->json([
                'success' => true,
                'message' => 'Stok obat diperbarui',
                'data'    => $existing
            ], 200);
        }

        // Data baru
        $data = $request->only([
            'nama_obat', 'qty_pack', 'stok_pack', 'harga_modal', 'ppn', 'margin'
        ]);

        $data['qty_total'] = $data['qty_pack'] * $data['stok_pack'];
        $data['total_harga'] = $this->hitungTotalHarga($data);

        $stok = StokObat::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Stok obat berhasil ditambahkan',
            'data'    => $stok
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $stok = StokObat::find($id);
        if (!$stok) {
            return response()->json([
                'success' => false,
                'message' => 'Data stok obat tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_obat'   => 'sometimes|string|max:255',
            'qty_pack'    => 'sometimes|integer|min:1',
            'stok_pack'   => 'sometimes|integer|min:0',
            'harga_modal' => 'sometimes|numeric|min:0',
            'ppn'         => 'nullable|numeric|min:0',
            'margin'      => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        $stok->fill($request->all());

        // qty_total otomatis
        $stok->qty_total = $stok->qty_pack * $stok->stok_pack;

        $stok->total_harga = $this->hitungTotalHarga($stok->toArray());
        $stok->save();

        return response()->json([
            'success' => true,
            'message' => 'Data stok obat diperbarui',
            'data'    => $stok
        ], 200);
    }

    public function destroy($id)
    {
        $stok = StokObat::find($id);
        if (!$stok) {
            return response()->json([
                'success' => false,
                'message' => 'Data stok obat tidak ditemukan'
            ], 404);
        }

        $stok->delete();

        return response()->json([
            'success' => true,
            'message' => 'Data stok dihapus'
        ], 200);
    }

    public function updateStok(Request $request, $id)
    {
        $stok = StokObat::find($id);
        if (!$stok) {
            return response()->json([
                'success' => false,
                'message' => 'Data stok obat tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'stok_pack' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        $stok->stok_pack = $request->stok_pack;

        // qty_total otomatis
        $stok->qty_total = $stok->qty_pack * $stok->stok_pack;

        $stok->total_harga = $this->hitungTotalHarga($stok->toArray());
        $stok->save();

        return response()->json([
            'success' => true,
            'message' => 'Stok berhasil diperbarui',
            'data'    => $stok
        ], 200);
    }

    private function hitungTotalHarga($data)
    {
        $harga_modal = $data['harga_modal'] ?? 0;
        $ppn         = $data['ppn'] ?? 0;
        $margin      = $data['margin'] ?? 0;
        $stok_pack   = $data['stok_pack'] ?? 0;

        $harga_per_pack =
            $harga_modal +
            ($harga_modal * $ppn / 100) +
            ($harga_modal * $margin / 100);

        return $harga_per_pack * $stok_pack;
    }
}
