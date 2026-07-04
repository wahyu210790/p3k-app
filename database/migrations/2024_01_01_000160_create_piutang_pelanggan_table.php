<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('piutang_pelanggan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaksi_id')->nullable()->constrained('transaksi')->onDelete('set null');
            $table->string('nama_pelanggan');
            $table->string('nomor_wa')->nullable();
            $table->decimal('jumlah_piutang', 15, 2);
            $table->decimal('jumlah_bayar', 15, 2)->default(0);
            $table->decimal('sisa_piutang', 15, 2);
            $table->enum('status', ['belum_lunas', 'lunas'])->default('belum_lunas');
            $table->date('tanggal_piutang');
            $table->date('tanggal_lunas')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('piutang_pelanggan');
    }
};
