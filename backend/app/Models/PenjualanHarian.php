<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PenjualanHarian extends Model
{
    use HasFactory;

    protected $table = 'penjualan_harians';

    protected $fillable = [
        'nama_pasien',
        'stok_obat_id',
        'nama_obat',
        'jenis_penjualan',   // Eceran / Pack
        'jumlah',
        'metode_pembayaran',
        'total_harga',       // harga eceran * qty atau harga pack * qty
    ];

    /**
     * Relasi ke tabel stok_obats
     */
    public function stokObat()
    {
        return $this->belongsTo(\App\Models\StokObat::class, 'stok_obat_id');
    }
}
