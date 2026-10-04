<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PenjualanHarian;
use App\Models\StokObat;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PenjualanHarianController extends Controller
{
    /**
     * 🧾 Tampilkan daftar penjualan (opsional filter tanggal)
     */
    public function index(Request $request)
    {
        $from = $request->query('from');
        $to   = $request->query('to');

        $query = PenjualanHarian::orderBy('created_at', 'desc');

        if ($from) {
            $query->whereDate('created_at', '>=', $from);
        }
        if ($to) {
            $query->whereDate('created_at', '<=', $to);
        }

        $data  = $query->get();
        $total = $data->sum('total_harga');

        return response()->json([
            'success' => true,
            'message' => 'Daftar penjualan harian',
            'data'    => $data,
            'total'   => $total
        ], 200);
    }

    /**
     * 💰 Simpan penjualan baru — kurangi stok obat otomatis
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_pasien'       => 'nullable|string|max:255',
            'stok_obat_id'      => 'required|integer|exists:stok_obats,id',
            'jenis_penjualan'   => 'nullable|string',
            'jumlah'            => 'required|integer|min:1',
            'metode_pembayaran' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors'  => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {

            $stok   = StokObat::findOrFail($request->stok_obat_id);
            $jumlah = intval($request->jumlah);

            // Tentukan jenis
            $isEceran = strtolower($request->jenis_penjualan) === 'eceran';

            // Tentukan harga akhir dari model yang sudah dihitung dengan benar
            $hargaFinal = $isEceran ? floatval($stok->harga_ecer) : floatval($stok->harga_pack);

            // Hitung total harga
            $grandTotal = $hargaFinal * $jumlah;

            /**
             * ============================
             * VALIDASI ECERAN
             * ============================
             */
            if ($isEceran) {

                // Cek cukup qty_total
                if ($stok->qty_total < $jumlah) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Stok tidak cukup (qty_total)'
                    ], 400);
                }

                // Hitung berapa pack yang harus dipotong
                $packTerpakai = ceil($jumlah / $stok->qty_pack);

                if ($stok->stok_pack < $packTerpakai) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Stok pack tidak cukup untuk konversi eceran'
                    ], 400);
                }
            } 
            else {
                // PENJUALAN PACK
                if ($stok->stok_pack < $jumlah) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Stok pack tidak cukup'
                    ], 400);
                }
            }

            // Simpan penjualan
            $penjualan = PenjualanHarian::create([
                'nama_pasien'      => $request->nama_pasien,
                'stok_obat_id'     => $stok->id,
                'nama_obat'        => $stok->nama_obat,
                'jenis_penjualan'  => $isEceran ? 'Eceran' : 'Pack',
                'jumlah'           => $jumlah,
                'metode_pembayaran'=> $request->metode_pembayaran ?? 'Tunai',
                'total_harga'      => $grandTotal,
            ]);

            /**
             * ============================
             * UPDATE STOK
             * ============================
             */
            if ($isEceran) {

                // Kurangi qty_total
                $stok->qty_total = max(0, $stok->qty_total - $jumlah);

                // Kurangi stok_pack berdasarkan konversi
                $packTerpakai = ceil($jumlah / $stok->qty_pack);
                $stok->stok_pack = max(0, $stok->stok_pack - $packTerpakai);

            } else {

                // Kurangi stok pack
                $stok->stok_pack = max(0, $stok->stok_pack - $jumlah);

                // Kurangi qty_total sesuai pack
                $stok->qty_total = max(0, $stok->qty_total - ($jumlah * $stok->qty_pack));
            }

            $stok->save();
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Penjualan berhasil disimpan',
                'data'    => $penjualan
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Penjualan store error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * ❌ Hapus penjualan — kembalikan stok
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try {

            $penjualan = PenjualanHarian::findOrFail($id);
            $stok      = StokObat::find($penjualan->stok_obat_id);

            if ($stok) {

                $isEceran = strtolower($penjualan->jenis_penjualan) === 'eceran';

                if ($isEceran) {

                    // kembalikan qty_total
                    $stok->qty_total += $penjualan->jumlah;

                    // hitung pack yang harus dikembalikan
                    $packTerpakai = ceil($penjualan->jumlah / $stok->qty_pack);
                    $stok->stok_pack += $packTerpakai;

                } else {

                    // kembalikan stok pack
                    $stok->stok_pack += $penjualan->jumlah;

                    // kembalikan qty_total sesuai pack
                    $stok->qty_total += ($penjualan->jumlah * $stok->qty_pack);
                }

                $stok->save();
            }

            $penjualan->delete();
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Penjualan dihapus dan stok dikembalikan'
            ], 200);

        } catch (\Exception $e) {

            DB::rollBack();
            Log::error('Penjualan destroy error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus penjualan',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
