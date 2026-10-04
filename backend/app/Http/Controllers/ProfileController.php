<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    // ✅ Ambil data profil user
    public function getProfile(Request $request)
    {
        $user = $request->user();

        // Ambil pemeriksaan terbaru berdasar no telepon
        $latestPemeriksaan = \App\Models\Pemeriksaan::where('no_telepon', $user->no_telepon)
            ->latest()
            ->first();

        // Tambahkan properti alamat tanpa mengubah struktur data asli
        $user->alamat = $latestPemeriksaan->alamat ?? "Belum ada data pemeriksaan";

        // Tambahkan URL avatar
        $user->avatar_url = $user->avatar
            ? url('storage/avatars/' . $user->avatar)
            : null;

        // ✅ Tambahkan indikator apakah user punya password
        $user->has_password = !is_null($user->password);

        return response()->json([
            'user' => $user
        ]);
    }

    // ✅ Update Foto Profil
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:2048',
        ]);

        $user = $request->user();

        // Hapus foto lama jika ada
        if ($user->avatar && Storage::disk('public')->exists('avatars/' . $user->avatar)) {
            Storage::disk('public')->delete('avatars/' . $user->avatar);
        }

        // Simpan foto baru
        $file = $request->file('avatar');
        $fileName = time() . '_' . $file->getClientOriginalName();
        $file->storeAs('avatars', $fileName, 'public');

        // Simpan nama file
        $user->avatar = $fileName;
        $user->save();

        return response()->json([
            'message' => 'Avatar berhasil diperbarui',
            'avatar_url' => url('storage/avatars/' . $fileName)
        ]);
    }

    // ✅ Ubah Password
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:6|confirmed', // harus ada new_password_confirmation
        ], [
            'new_password.confirmed' => 'Konfirmasi password tidak cocok.',
            'new_password.min' => 'Password baru minimal 6 karakter.',
        ]);

        $user = $request->user();

        // Cegah user Google (tanpa password)
        if (is_null($user->password)) {
            return response()->json([
                'message' => 'Akun ini login menggunakan Google dan tidak memiliki password.'
            ], 400);
        }

        // Cek password lama
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Password lama salah.'
            ], 400);
        }

        // Update password
        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json([
            'message' => 'Password berhasil diperbarui.'
        ]);
    }
}
