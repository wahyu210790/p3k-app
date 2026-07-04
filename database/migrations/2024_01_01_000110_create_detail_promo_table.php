<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('detail_promo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promo_id')->constrained('promo')->onDelete('cascade');
            $table->foreignId('produk_id')->constrained('produk')->onDelete('cascade');
            $table->decimal('harga_promo', 15, 2)->nullable();    // untuk tipe harga_khusus
            $table->decimal('diskon_persen', 5, 2)->nullable();   // untuk tipe diskon_persen (0-100)
            $table->integer('min_beli')->default(1);              // untuk paket_bundling
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('detail_promo');
    }
};
