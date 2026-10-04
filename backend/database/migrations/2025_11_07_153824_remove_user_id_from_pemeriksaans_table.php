<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pemeriksaans', function (Blueprint $table) {
            // Pastikan foreign key dan kolom hanya dihapus jika memang ada
            if (Schema::hasColumn('pemeriksaans', 'user_id')) {
                try {
                    $table->dropForeign(['user_id']);
                } catch (\Exception $e) {
                    // Lewat aja kalau foreign key sudah gak ada
                }
                $table->dropColumn('user_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('pemeriksaans', function (Blueprint $table) {
            if (!Schema::hasColumn('pemeriksaans', 'user_id')) {
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            }
        });
    }
};
