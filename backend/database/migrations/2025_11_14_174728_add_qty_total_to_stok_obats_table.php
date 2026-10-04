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
        $table->integer('qty_total')->default(0)->after('qty_pack');
    });
}

public function down()
{
    Schema::table('stok_obats', function (Blueprint $table) {
        $table->dropColumn('qty_total');
    });
}

};
