<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hutang_supplier', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pembelian_id')->constrained('pembelian')->onDelete('cascade');
            $table->foreignId('supplier_id')->nullable()->constrained('supplier')->onDelete('set null');
            $table->decimal('jumlah_hutang', 15, 2);
            $table->decimal('jumlah_bayar', 15, 2)->default(0);
            $table->decimal('sisa_hutang', 15, 2);
            $table->enum('status', ['belum_lunas', 'lunas'])->default('belum_lunas');
            $table->date('tanggal_hutang');
            $table->date('tanggal_lunas')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hutang_supplier');
    }
};
