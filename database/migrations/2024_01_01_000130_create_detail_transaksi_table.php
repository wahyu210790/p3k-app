<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_transaksi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaksi_id')->constrained('transaksi')->onDelete('cascade');
            $table->foreignId('produk_id')->constrained('produk')->onDelete('restrict');
            $table->foreignId('promo_id')->nullable()->constrained('promo')->onDelete('set null');
            $table->integer('jumlah');
            $table->decimal('harga_normal_satuan', 15, 2); // harga sebelum promo
            $table->decimal('harga_jual_satuan', 15, 2);   // harga aktual (bisa harga promo)
            $table->decimal('hpp_satuan', 15, 2);           // HPP hasil kalkulasi FIFO
            $table->decimal('subtotal_harga_jual', 15, 2);
            $table->decimal('subtotal_hpp', 15, 2);
            $table->decimal('subtotal_dana_modal', 15, 2);
            $table->decimal('subtotal_dana_operasional', 15, 2);
            $table->decimal('subtotal_keuntungan', 15, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_transaksi');
    }
};
