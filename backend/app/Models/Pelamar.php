<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pelamar extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'karir_id',
        'posisi',
        'nama',
        'email',
        'no_telepon',
        'pesan',
        'cv_path',
        'status',
        'catatan',
    ];

    protected $appends = ['cv_url'];

    public function getCvUrlAttribute()
    {
        if (!$this->cv_path) return null;
        return url('storage/' . $this->cv_path);
    }

    public function karir()
    {
        return $this->belongsTo(Karir::class, 'karir_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope untuk mencocokkan lamaran milik user tertentu (by user_id, email, atau no_telepon)
     */
    public function scopeForUser($query, $user)
    {
        return $query->where(function ($q) use ($user) {
            $q->where('user_id', $user->id);

            if (!empty($user->email)) {
                $q->orWhere('email', $user->email);
            }

            if (!empty($user->no_telepon)) {
                $q->orWhere('no_telepon', $user->no_telepon);
            }
        });
    }
}
