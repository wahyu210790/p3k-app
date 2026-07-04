<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('bahan_baku')->where('satuan', 'gram')->update(['satuan' => 'gr']);
        DB::table('bahan_baku')->where('satuan', 'bungkus')->update(['satuan' => 'pck']);
        DB::table('bahan_baku')->where('satuan', 'botol')->update(['satuan' => 'btl']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('bahan_baku')->where('satuan', 'gr')->update(['satuan' => 'gram']);
        DB::table('bahan_baku')->where('satuan', 'pck')->update(['satuan' => 'bungkus']);
        DB::table('bahan_baku')->where('satuan', 'btl')->update(['satuan' => 'botol']);
    }
};
