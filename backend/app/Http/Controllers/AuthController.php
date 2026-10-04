<?php
//UPDATE users
//SET role = 'admin'
//WHERE email = 'admin@gmail.com' OR LOWER(name) = 'admin';

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    /* ======================================================
     | 🟢 REGISTER USER BARU (hanya Gmail)
     ====================================================== */
    public function signup(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email',
                'regex:/^[a-zA-Z0-9._%+-]+@gmail\.com$/'
            ],
            'no_telepon' => [
                'required',
                'string',
                'unique:users,no_telepon',
            ],
            'password' => 'required|string|min:6|confirmed',
        ], [
            'email.regex' => 'Email harus menggunakan domain @gmail.com',
            'email.unique' => 'Email sudah terdaftar.',
            'no_telepon.unique' => 'Nomor telepon sudah terdaftar.',
        ]);

        $user = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'no_telepon' => $request->no_telepon,
            'password'   => Hash::make($request->password),
            'provider'   => 'manual', // ✅ tambahkan provider manual
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Pendaftaran berhasil ✅',
            'token'   => $token,
            'user'    => $user,
        ], 201);
    }

    /* ======================================================
     | 🟢 LOGIN BIASA
     ====================================================== */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah.'],
            ]);
        }

        // Pastikan provider tetap manual
        if (empty($user->provider)) {
            $user->provider = 'manual';
            $user->save();
        }

        // Hapus token lama agar tidak menumpuk
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

       return response()->json([
    'success' => true,
    'message' => '✅ Login berhasil.',
    'token' => $token,
    'user' => [
        'id' => $user->id,
        'name' => $user->name,
        'email' => $user->email,
        'role' => $user->role, // ← TAMBAHKAN INI
        'provider' => $user->provider,
        'avatar' => $user->avatar,
    ]
]);

    }

    /* ======================================================
     | 🟢 LOGOUT
     ====================================================== */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => '🚪 Logout berhasil.'
        ]);
    }

    /* ======================================================
     | 🟢 LOGIN VIA GOOGLE
     ====================================================== */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Cek apakah user sudah ada berdasarkan email
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                $user = User::create([
                    'name'       => $googleUser->getName(),
                    'email'      => $googleUser->getEmail(),
                    'password'   => Hash::make(Str::random(16)),
                    'no_telepon' => null,
                    'role'       => 'user',
                    'provider'   => 'google', // ✅ simpan provider google
                ]);
            } else {
                // Pastikan provider diupdate ke google
                if ($user->provider !== 'google') {
                    $user->provider = 'google';
                    $user->save();
                }

                if (empty($user->role)) {
                    $user->role = 'user';
                    $user->save();
                }
            }

            // Hapus token lama agar tidak menumpuk
            $user->tokens()->delete();

            $token = $user->createToken('google_token')->plainTextToken;

            // 🟢 Redirect sesuai kebutuhan frontend
            $role = $user->role ?? 'user';
            if (empty($user->no_telepon)) {
                return redirect("http://localhost:5173/isi-no-telepon?token=$token&google=true&role=" . urlencode($role));
            }

            return redirect("http://localhost:5173/login-success?token=$token&google=true&role=" . urlencode($role));
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error'   => 'Login Google gagal ❌',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /* ======================================================
     | 🟢 UPDATE NOMOR TELEPON SETELAH LOGIN GOOGLE
     ====================================================== */
    public function updateNoTelepon(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'no_telepon' => [
                'required',
                'string',
                'max:20',
                Rule::unique('users', 'no_telepon')->ignore($user->id),
            ],
        ], [
            'no_telepon.required' => 'Nomor telepon wajib diisi.',
            'no_telepon.unique'   => 'Nomor telepon sudah digunakan oleh akun lain.',
            'no_telepon.max'      => 'Nomor telepon tidak boleh lebih dari 20 karakter.',
        ]);

        $existing = User::where('no_telepon', $request->no_telepon)
            ->where('id', '!=', $user->id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => '❌ Nomor telepon sudah digunakan oleh akun lain.',
            ], 422);
        }

        if ($user->no_telepon !== $request->no_telepon) {
            $user->no_telepon = $request->no_telepon;
            $user->save();
        }

        return response()->json([
            'success' => true,
            'message' => '✅ Nomor telepon berhasil diperbarui.',
            'user'    => $user,
        ]);
    }

    /* ======================================================
     | 🟢 PROFIL USER (untuk navbar)
     ====================================================== */
    public function profile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id'        => $user->id,
                'name'      => $user->name,
                'email'     => $user->email,
                'avatar'    => $user->avatar,
                'no_telepon'=> $user->no_telepon,
                'role'      => $user->role,
                'provider'  => $user->provider ?? 'manual', // ✅ penting biar frontend tahu login_method
            ],
        ]);
    }
}
