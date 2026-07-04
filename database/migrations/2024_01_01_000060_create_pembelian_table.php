<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pembelian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('supplier_id')->nullable()->constrained('supplier')->onDelete('set null');
            $table->string('nomor_faktur')->nullable();
            $table->date('tanggal_pembelian');
            $table->decimal('total_harga', 15, 2)->default(0);
            $table->decimal('jumlah_bayar', 15, 2)->default(0);
            $table->enum('status_pembayaran', ['lunas', 'sebagian', 'belum_bayar'])->default('lunas');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pembelian');
    }
};
