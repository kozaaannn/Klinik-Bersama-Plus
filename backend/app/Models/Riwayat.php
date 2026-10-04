<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Riwayat extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama',
        'alamat',
        'tanggal_lahir',
        'tinggi_badan',
        'berat_badan',
        'waktu_pemeriksaan',
        'tekanan_darah',
        'gula_darah',
        'kolesterol',
        'asam_urat',
        'hasil_pemeriksaan',
        'no_telepon', // ✅ dipakai untuk mencocokkan data pasien yang daftar
    ];
    public function user()
{
    return $this->belongsTo(User::class, 'no_telepon', 'no_telepon');
}

}
