<?php

namespace App\Http\Controllers;

use App\Models\Notifikasi;
use App\Models\Pelamar;
use Illuminate\Http\Request;

class NotifikasiController extends Controller
{
    /**
     * Ambil semua notifikasi milik user yang sedang login
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak terotentikasi.',
                'data'    => [],
                'unread'  => 0,
            ], 401);
        }

        $notifikasis = Notifikasi::forUser($user)
            ->orderBy('id', 'desc')
            ->limit(30)
            ->get();

        $unreadCount = Notifikasi::forUser($user)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'success'      => true,
            'data'         => $notifikasis,
            'unread_count' => $unreadCount,
        ]);
    }

    /**
     * Tandai satu notifikasi sebagai dibaca
     */
    public function markAsRead(Request $request, $id)
    {
        $user = $request->user();
        $notifikasi = Notifikasi::forUser($user)->findOrFail($id);
        $notifikasi->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Notifikasi ditandai telah dibaca.',
        ]);
    }

    /**
     * Tandai semua notifikasi milik user sebagai dibaca
     */
    public function markAllAsRead(Request $request)
    {
        $user = $request->user();
        Notifikasi::forUser($user)->where('is_read', false)->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Semua notifikasi telah ditandai dibaca.',
        ]);
    }

    /**
     * Ambil data lamaran pekerjaan milik user yang sedang login
     */
    public function getLamaranSaya(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak terotentikasi.',
                'data'    => [],
            ], 401);
        }

        $lamaran = Pelamar::with('karir')
            ->forUser($user)
            ->orderBy('id', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $lamaran,
        ]);
    }
}
