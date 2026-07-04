<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bahan_baku', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('satuan'); // pcs, butir, gram, ml, batang, botol, kg, liter, bungkus
            $table->decimal('stok_saat_ini', 12, 3)->default(0);
            $table->decimal('stok_minimum', 12, 3)->default(0);
            // Khusus rokok: stok disimpan dalam satuan batang
            $table->boolean('is_rokok')->default(false);
            $table->integer('isi_per_bungkus')->nullable(); // misal Surya 16 = 16 batang/bungkus
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bahan_baku');
    }
};
