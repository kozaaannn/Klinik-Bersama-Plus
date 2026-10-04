<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 🔹 Contoh: buat akun default agar bisa login
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'no_telepon' => '081234567890', // ✅ wajib diisi
            'password' => bcrypt('password'), // ✅ password default
        ]);
    }
}
