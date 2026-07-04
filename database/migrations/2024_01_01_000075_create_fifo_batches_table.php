<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fifo_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bahan_baku_id')->constrained('bahan_baku')->onDelete('cascade');
            $table->foreignId('pembelian_id')->nullable()->constrained('pembelian')->onDelete('set null');
            $table->decimal('harga_beli', 15, 2); // harga beli per satuan pada batch ini
            $table->decimal('jumlah_awal', 12, 3); // stok awal saat batch masuk
            $table->decimal('jumlah_sisa', 12, 3);  // sisa stok yang belum terpakai
            $table->date('tanggal_masuk');
            $table->timestamps();

            $table->index(['bahan_baku_id', 'tanggal_masuk']); // untuk query FIFO order
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fifo_batches');
    }
};
