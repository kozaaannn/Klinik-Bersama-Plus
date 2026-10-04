<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StokObat extends Model
{
    use HasFactory;

    protected $table = 'stok_obats';

    protected $fillable = [
        'nama_obat',
        'qty_pack',
        'stok_pack',
        'qty_total',
        'harga_modal',
        'ppn',
        'margin',
        'harga_pack',
        'harga_ecer',
        'total_harga',
        'tanggal_input',
    ];

    /**
     * 🚀 Otomatis hitung semua nilai saat create & update
     */
    protected static function booted()
    {
        static::creating(function ($obat) {
            self::hitungSemua($obat);
        });

        static::updating(function ($obat) {
            self::hitungSemua($obat);
        });
    }

    /**
     * 🔥 Fungsi untuk menghitung seluruh data otomatis
     */
    private static function hitungSemua($obat)
    {
        $harga_modal = $obat->harga_modal ?? 0;
        $ppn         = $obat->ppn ?? 0;
        $margin      = $obat->margin ?? 0;
        $qty_pack    = $obat->qty_pack ?? 0;
        $stok_pack   = $obat->stok_pack ?? 0;

        // 🟢 1. Hitung harga pack (modal + ppn + margin)
        $obat->harga_pack = 
            $harga_modal + 
            ($harga_modal * $ppn / 100) + 
            ($harga_modal * $margin / 100);

        // 🟢 2. Hitung harga ecer = harga_pack / qty_pack
        $obat->harga_ecer = ($qty_pack > 0)
            ? $obat->harga_pack / $qty_pack
            : $obat->harga_pack;

        // 🟢 3. Hitung qty_total (OTOMATIS)
        $obat->qty_total = $qty_pack * $stok_pack;

        // 🟢 4. Total harga penjualan semua stok
        $obat->total_harga = $obat->harga_pack * $obat->stok_pack;
    }
}
