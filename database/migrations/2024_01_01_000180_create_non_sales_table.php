<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('non_sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('restrict');
            $table->enum('kategori', [
                'jatah_karyawan',
                'konsumsi_owner',
                'konsumsi_tamu',
                'sampling',
                'rusak',
                'kadaluarsa',
                'lainnya',
            ]);
            $table->decimal('total_hpp', 15, 2)->default(0); // total nilai HPP barang keluar
            $table->text('catatan')->nullable();
            $table->date('tanggal');
            $table->timestamps();

            $table->index('tanggal');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('non_sales');
    }
};
