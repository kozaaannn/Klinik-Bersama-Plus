<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\KarirController;
use App\Http\Controllers\Admin\RiwayatController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\PemeriksaanAdminController;
use App\Http\Controllers\Admin\StokObatController;
use App\Http\Controllers\Admin\PenjualanHarianController;
use App\Http\Controllers\Admin\RiwayatKunjunganController;
use App\Http\Controllers\PemeriksaanController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PromoController; // <-- DITAMBAHKAN

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Semua route API otomatis memiliki prefix "/api"
| Contoh: /api/login, /api/signup, /api/admin/...
*/

/* ===============================
| 🔐 AUTH ROUTES (Publik)
| =============================== */
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

// 🔑 Login via Google
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);

// 🌍 PUBLIC API ROUTES (Bisa diakses tamu tanpa login)
Route::get('/public/karir', [KarirController::class, 'publicIndex']);
Route::post('/public/karir/apply', [KarirController::class, 'apply']);
Route::get('/public/promos', [PromoController::class, 'index']);
Route::get('/public/obat', [StokObatController::class, 'index']);

/* ===============================
| 🔒 PROTECTED ROUTES (WAJIB TOKEN SANCTUM)
| =============================== */
Route::middleware('auth:sanctum')->group(function () {

    // 🚪 Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | 👤 USER ROUTES
    |--------------------------------------------------------------------------
    | Hanya bisa diakses oleh user yang telah login
    */
    Route::prefix('user')->group(function () {
        // 👤 Profil user
        Route::get('/profile', [ProfileController::class, 'getProfile']);
        Route::post('/avatar', [ProfileController::class, 'updateAvatar']);

        // 📱 Update nomor telepon
        Route::post('/update-no-telepon', [AuthController::class, 'updateNoTelepon']);

        // 🔑 Ubah Password
        Route::post('/change-password', [ProfileController::class, 'changePassword']);

        // 🩺 Riwayat pemeriksaan berdasarkan no telepon user
        Route::get('/pemeriksaan/riwayat', [PemeriksaanController::class, 'riwayatByTelepon']);

        // 🔔 Notifikasi Akun Web
        Route::get('/notifikasi', [\App\Http\Controllers\NotifikasiController::class, 'index']);
        Route::put('/notifikasi/{id}/read', [\App\Http\Controllers\NotifikasiController::class, 'markAsRead']);
        Route::put('/notifikasi/read-all', [\App\Http\Controllers\NotifikasiController::class, 'markAllAsRead']);

        // 💼 Riwayat Status Lamaran Kerja User
        Route::get('/lamaran', [\App\Http\Controllers\NotifikasiController::class, 'getLamaranSaya']);
    });

    /*
    |--------------------------------------------------------------------------
    | ⚙️ ADMIN & OWNER ROUTES
    |--------------------------------------------------------------------------
    | Hanya admin dan owner yang boleh mengakses rute-rute ini
    */
    Route::middleware('role:admin,owner')->prefix('admin')->group(function () {
        // 👥 Data Pasien
        Route::get('/pasien', [AdminController::class, 'getPatients']);
        Route::delete('/pasien/{id}', [AdminController::class, 'deletePatient']);

        // 💼 Karir (Admin)
        Route::get('/karir', [KarirController::class, 'index']);
        Route::post('/karir', [KarirController::class, 'store']);
        Route::put('/karir/{id}', [KarirController::class, 'update']);
        Route::delete('/karir/{id}', [KarirController::class, 'destroy']);

        // 📄 Pelamar Kerja (Admin)
        Route::get('/pelamar', [KarirController::class, 'getPelamars']);
        Route::put('/pelamar/{id}/status', [KarirController::class, 'updatePelamarStatus']);
        Route::delete('/pelamar/{id}', [KarirController::class, 'deletePelamar']);

        // 📋 Riwayat Pemeriksaan Lama
        Route::get('/riwayat', [RiwayatController::class, 'index']);
        Route::post('/riwayat', [RiwayatController::class, 'store']);
        Route::get('/riwayat/{id}', [RiwayatController::class, 'show']);
        Route::put('/riwayat/{id}', [RiwayatController::class, 'update']);
        Route::delete('/riwayat/{id}', [RiwayatController::class, 'destroy']);

        // ✅ Pemeriksaan (Admin)
        Route::get('/pemeriksaan', [PemeriksaanAdminController::class, 'index']);
        Route::get('/pemeriksaan/{id}', [PemeriksaanAdminController::class, 'show']);
        Route::post('/pemeriksaan', [PemeriksaanController::class, 'store']);
        Route::put('/pemeriksaan/{id}', [PemeriksaanAdminController::class, 'update']);
        Route::delete('/pemeriksaan/{id}', [PemeriksaanAdminController::class, 'destroy']);

        // 💊 Data Stok Obat
        Route::get('/stok-obat', [StokObatController::class, 'index']);
        Route::post('/stok-obat', [StokObatController::class, 'store']);
        Route::put('/stok-obat/{id}', [StokObatController::class, 'update']);
        Route::delete('/stok-obat/{id}', [StokObatController::class, 'destroy']);

        // 🔄 Update stok otomatis
        Route::put('/stok-obat/{id}/update-stok', [StokObatController::class, 'updateStok']);

        // 💰 Penjualan Harian
        Route::get('/penjualan-harian', [PenjualanHarianController::class, 'index']);
        Route::post('/penjualan-harian', [PenjualanHarianController::class, 'store']);
        Route::delete('/penjualan-harian/{id}', [PenjualanHarianController::class, 'destroy']);

        // 🩺 Riwayat Kunjungan (Admin)
        Route::prefix('riwayat-kunjungan')->group(function () {
            Route::get('/', [RiwayatKunjunganController::class, 'index']);
            Route::get('/user/{no_telepon}', [RiwayatKunjunganController::class, 'showByPhone']);
            Route::post('/', [RiwayatKunjunganController::class, 'store']);
            Route::put('/{id}', [RiwayatKunjunganController::class, 'update']);
            Route::delete('/{id}', [RiwayatKunjunganController::class, 'destroy']);
        });

        // 🎉 PROMO ROUTES
        Route::get('/promos', [PromoController::class, 'index']);
        Route::post('/promos', [PromoController::class, 'store']);
        Route::get('/promos/{id}', [PromoController::class, 'show']);
        Route::post('/promos/{id}', [PromoController::class, 'update']); // POST untuk upload gambar
        Route::delete('/promos/{id}', [PromoController::class, 'destroy']);

        // 👑 Owner Management
        Route::prefix('owner')->group(function () {
            Route::get('/', [\App\Http\Controllers\Admin\OwnerController::class, 'getAdmins']);
            Route::post('/', [\App\Http\Controllers\Admin\OwnerController::class, 'storeAdmin']);
            Route::put('/{id}/toggle', [\App\Http\Controllers\Admin\OwnerController::class, 'toggleActive']);
            Route::delete('/{id}', [\App\Http\Controllers\Admin\OwnerController::class, 'deleteAdmin']);
        });
    });

    /*
    |--------------------------------------------------------------------------
    | 🌐 ROUTE UNTUK USER: RIWAYAT KUNJUNGAN
    |--------------------------------------------------------------------------
    */
    Route::get('/riwayat-kunjungan-user', [RiwayatKunjunganController::class, 'userRiwayat']);
    Route::post('/riwayat-kunjungan-user', [RiwayatKunjunganController::class, 'storeUserVisit']);
});
