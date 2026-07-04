<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('produk', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('kategori')->default('Makanan'); // Makanan, Minuman, Rokok, Lainnya
            $table->string('foto')->nullable(); // path ke file gambar
            $table->decimal('harga_jual', 15, 2);
            $table->boolean('has_resep')->default(true); // jika false, produk langsung dari bahan baku
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('produk');
    }
};
