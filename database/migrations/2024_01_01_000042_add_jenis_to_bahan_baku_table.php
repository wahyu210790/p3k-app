<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bahan_baku', function (Blueprint $table) {
            // 'produk'     = bahan baku yang dipakai dalam resep produk jual (COGS)
            // 'non_produk' = bahan baku operasional (gas, sabun, dll) → Pengeluaran Operasional
            $table->enum('jenis', ['produk', 'non_produk'])->default('produk')->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('bahan_baku', function (Blueprint $table) {
            $table->dropColumn('jenis');
        });
    }
};
