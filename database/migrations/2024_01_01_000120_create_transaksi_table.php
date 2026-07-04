<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict'); // kasir
            $table->string('nomor_transaksi')->unique();
            $table->timestamp('tanggal_transaksi');
            $table->decimal('total_harga_jual', 15, 2)->default(0);
            $table->decimal('total_hpp', 15, 2)->default(0);           // total modal barang
            $table->decimal('total_dana_modal', 15, 2)->default(0);    // = total_hpp
            $table->decimal('total_dana_operasional', 15, 2)->default(0); // persentase dari total_hpp
            $table->decimal('total_keuntungan', 15, 2)->default(0);    // harga_jual - hpp - operasional
            $table->enum('metode_pembayaran', ['cash', 'qris', 'transfer', 'piutang']);
            $table->enum('status', ['selesai', 'piutang'])->default('selesai');
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->index('tanggal_transaksi');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};
