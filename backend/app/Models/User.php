<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Kolom yang boleh diisi (mass assignable)
     */
    protected $fillable = [
        'name',
        'email',
        'no_telepon', // ✅ digunakan untuk relasi ke pemeriksaan
        'password',
        'role',
        'avatar'
    ];

    /**
     * Kolom yang disembunyikan dari array / JSON
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Casting kolom ke tipe data tertentu
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * ✅ Tambahkan ini supaya avatar_url ikut keluar di JSON response
     */
    protected $appends = ['avatar_url'];

    /**
     * Relasi ke tabel pemeriksaans
     * User dapat memiliki banyak pemeriksaan berdasarkan no_telepon
     */
    public function pemeriksaans()
    {
        return $this->hasMany(Pemeriksaan::class, 'no_telepon', 'no_telepon');
    }

    public function notifikasis()
    {
        return $this->hasMany(Notifikasi::class, 'user_id');
    }

    public function pelamars()
    {
        return $this->hasMany(Pelamar::class, 'user_id');
    }

    /**
     * ✅ Accessor untuk URL avatar lengkap
     */
    public function getAvatarUrlAttribute()
    {
        return $this->avatar
            ? url('storage/avatars/' . $this->avatar)
            : url('https://cdn-icons-png.flaticon.com/512/847/847969.png'); // default jika null
    }
}
