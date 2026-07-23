<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\BahanBaku;
use App\Models\FifoBatch;
use App\Models\DetailPembelian;

// Find Nutrisari Jeruk Manis
$bahan = BahanBaku::where('nama', 'like', '%NUTRISARI JERUK MANIS%')->first();
if (!$bahan) {
    die("Bahan baku not found\n");
}

echo "Bahan Baku: {$bahan->nama} | Stok Saat Ini: {$bahan->stok_saat_ini}\n";

// Find batches with suspicious qty/harga
$batches = FifoBatch::where('bahan_baku_id', $bahan->id)
    ->where('jumlah_awal', '>', 100) // 100 is suspiciously large
    ->get();

foreach ($batches as $batch) {
    echo "\n=== BATCH ID: {$batch->id} ===\n";
    echo "Jumlah Awal: {$batch->jumlah_awal}\n";
    echo "Jumlah Sisa: {$batch->jumlah_sisa}\n";
    echo "Harga Beli: {$batch->harga_beli}\n";
    echo "Tanggal Masuk: {$batch->tanggal_masuk}\n";
    
    if ($batch->pembelian_id) {
        $detail = DetailPembelian::where('pembelian_id', $batch->pembelian_id)
            ->where('bahan_baku_id', $bahan->id)
            ->first();
        if ($detail) {
            echo "--- Detail Pembelian ---\n";
            echo "Pembelian ID: {$batch->pembelian_id}\n";
            echo "Jumlah: {$detail->jumlah}\n";
            echo "Harga Satuan: {$detail->harga_satuan}\n";
            echo "Subtotal: {$detail->subtotal}\n";
        }
    }
}
