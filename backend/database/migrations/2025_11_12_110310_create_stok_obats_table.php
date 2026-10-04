<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stok_obats', function (Blueprint $table) {
            $table->id();
            $table->string('nama_obat');
            $table->integer('qty_pack');
            $table->integer('stok_pack');
            $table->decimal('harga_modal', 15, 2);
            $table->decimal('ppn', 5, 2);
            $table->decimal('margin', 5, 2);
            $table->decimal('total_harga', 15, 2);
            $table->string('tanggal_input')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stok_obats');
    }
};
