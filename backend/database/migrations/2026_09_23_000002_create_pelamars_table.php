<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pelamars', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('karir_id')->nullable();
            $table->string('posisi');
            $table->string('nama');
            $table->string('email');
            $table->string('no_telepon');
            $table->text('pesan')->nullable();
            $table->string('cv_path');
            $table->string('status')->default('menunggu'); // menunggu, review, diterima, ditolak
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pelamars');
    }
};
