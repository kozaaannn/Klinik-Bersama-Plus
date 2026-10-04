<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::table('stok_obats', function (Blueprint $table) {
        $table->decimal('harga_pack', 15, 2)->nullable()->after('margin');
        $table->decimal('harga_ecer', 15, 2)->nullable()->after('harga_pack');
    });
}

public function down()
{
    Schema::table('stok_obats', function (Blueprint $table) {
        $table->dropColumn(['harga_pack', 'harga_ecer']);
    });
}

};
