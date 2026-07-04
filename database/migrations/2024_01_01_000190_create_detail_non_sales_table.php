<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_non_sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('non_sales_id')->constrained('non_sales')->onDelete('cascade');
            // Bisa berbasis produk (menggunakan resep) atau langsung bahan baku
            $table->foreignId('produk_id')->nullable()->constrained('produk')->onDelete('restrict');
            $table->foreignId('bahan_baku_id')->nullable()->constrained('bahan_baku')->onDelete('restrict');
            $table->decimal('jumlah', 12, 3);
            $table->decimal('hpp_satuan', 15, 2);     // HPP hasil FIFO saat dicatat
            $table->decimal('subtotal_hpp', 15, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_non_sales');
    }
};
