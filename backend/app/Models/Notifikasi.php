<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'email',
        'no_telepon',
        'judul',
        'pesan',
        'tipe',
        'status',
        'link',
        'data',
        'is_read',
    ];

    protected $casts = [
        'data'    => 'array',
        'is_read' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope untuk mengambil notifikasi milik user (berdasarkan ID, email, atau no telepon)
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
