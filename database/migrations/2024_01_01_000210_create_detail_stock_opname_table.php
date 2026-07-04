<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_stock_opname', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_opname_id')->constrained('stock_opname')->onDelete('cascade');
            $table->foreignId('bahan_baku_id')->constrained('bahan_baku')->onDelete('restrict');
            $table->decimal('stok_sistem', 12, 3);  // stok menurut sistem saat opname
            $table->decimal('stok_fisik', 12, 3);   // stok aktual hasil hitung fisik
            $table->decimal('selisih', 12, 3);       // stok_fisik - stok_sistem (negatif = susut)
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_stock_opname');
    }
};
