<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pemeriksaans', function (Blueprint $table) {
            $table->id();

            // 🔑 Foreign key ke tabel users
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->string('nama');
            $table->string('alamat');
            $table->date('tanggal_lahir');
            $table->integer('tinggi_badan');
            $table->integer('berat_badan');
            $table->time('waktu_pemeriksaan');
            $table->string('tekanan_darah');
            $table->integer('gula_darah');
            $table->integer('kolesterol');
            $table->decimal('asam_urat', 4, 1);
            $table->text('hasil_pemeriksaan');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pemeriksaans');
    }
};
