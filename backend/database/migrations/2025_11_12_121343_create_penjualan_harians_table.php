<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePenjualanHariansTable extends Migration
{
    public function up()
    {
        Schema::create('penjualan_harians', function (Blueprint $table) {
            $table->id();
            $table->string('nama_pasien')->nullable();
            $table->unsignedBigInteger('stok_obat_id'); // FK ke stok_obats
            $table->string('nama_obat');
            $table->string('jenis_penjualan')->default('Eceran'); // Eceran / Pack
            $table->integer('jumlah')->default(1);
            $table->string('metode_pembayaran')->default('Tunai'); // Tunai / Transfer etc
            $table->decimal('total_harga', 15, 2)->default(0);
            $table->timestamps();

            $table->foreign('stok_obat_id')->references('id')->on('stok_obats')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('penjualan_harians');
    }
}
