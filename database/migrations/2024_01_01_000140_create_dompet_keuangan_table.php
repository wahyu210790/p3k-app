<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dompet_keuangan', function (Blueprint $table) {
            $table->id();
            $table->enum('tipe', ['modal', 'operasional', 'keuntungan'])->unique();
            $table->decimal('saldo', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dompet_keuangan');
    }
};
