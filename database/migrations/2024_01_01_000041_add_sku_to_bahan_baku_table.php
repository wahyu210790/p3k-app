<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bahan_baku', function (Blueprint $table) {
            // Nullable dulu agar data lama tidak error, unique per bahan baku
            $table->string('sku', 50)->nullable()->unique()->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('bahan_baku', function (Blueprint $table) {
            $table->dropUnique(['sku']);
            $table->dropColumn('sku');
        });
    }
};
