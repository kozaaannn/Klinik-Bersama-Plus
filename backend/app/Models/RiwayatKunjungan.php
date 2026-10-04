<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RiwayatKunjungan extends Model
{
    use HasFactory;

    protected $table = 'riwayat_kunjungan';

    protected $fillable = [
        'tanggal',
        'nama_pasien',
        'no_telepon',
        'dokter',
        'poli',
        'keluhan',
        'catatan',
    ];
}
