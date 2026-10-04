<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Karir extends Model
{
    use HasFactory;

    protected $fillable = [
        'posisi',
        'lokasi',
        'tipe',
        'deskripsi',
        'kualifikasi',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function pelamars()
    {
        return $this->hasMany(Pelamar::class, 'karir_id');
    }
}
