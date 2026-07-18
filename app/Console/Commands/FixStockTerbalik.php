<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\FifoBatch;
use App\Models\DetailPembelian;
use App\Models\BahanBaku;
use Illuminate\Support\Facades\DB;

class FixStockTerbalik extends Command
{
    protected $signature = 'fix:stock-terbalik';
    protected $description = 'Memperbaiki kesalahan input pembelian Nutrisari (qty dan harga terbalik)';

    public function handle()
    {
        $this->info('Mencari data stok yang terbalik...');

        // Cari bahan baku Nutrisari Jeruk Manis
        $bahan = BahanBaku::where('nama', 'like', '%NUTRISARI JERUK MANIS%')->first();
        if (!$bahan) {
            $this->error('Bahan baku Nutrisari Jeruk Manis tidak ditemukan!');
            return;
        }

        // Cari batch yang jumlah awalnya > 1000 dan harga belinya < 100 (ciri-ciri tertukar)
        $batch = FifoBatch::where('bahan_baku_id', $bahan->id)
            ->where('jumlah_awal', '>', 1000)
            ->where('harga_beli', '<', 100)
            ->first();

        if (!$batch) {
            $this->error('Tidak ada batch yang terlihat terbalik (Qty > 1000 & Harga < 100). Mungkin sudah diperbaiki?');
            return;
        }

        $this->info("Ditemukan Batch ID: {$batch->id}");
        $this->info("Data Lama -> Qty Awal: {$batch->jumlah_awal} | Harga: Rp {$batch->harga_beli}");

        DB::transaction(function () use ($bahan, $batch) {
            $qtySalah = (float) $batch->jumlah_awal;
            $hargaSalah = (float) $batch->harga_beli;

            // Tukar!
            $qtyBenar = $hargaSalah; // 10
            $hargaBenar = $qtySalah; // 1344

            // Hitung berapa banyak yang sudah terjual dari batch ini
            $terjual = $qtySalah - (float) $batch->jumlah_sisa;

            // Update Batch
            $batch->jumlah_awal = $qtyBenar;
            $batch->jumlah_sisa = max(0, $qtyBenar - $terjual); // pastikan tidak minus
            $batch->harga_beli = $hargaBenar;
            $batch->save();

            // Update Detail Pembelian
            if ($batch->pembelian_id) {
                $detail = DetailPembelian::where('pembelian_id', $batch->pembelian_id)
                    ->where('bahan_baku_id', $bahan->id)
                    ->first();
                if ($detail) {
                    $detail->jumlah = $qtyBenar;
                    $detail->harga_satuan = $hargaBenar;
                    // Subtotal tetap sama (1344 * 10 = 10 * 1344)
                    $detail->save();
                }
            }

            // Koreksi stok fisik di bahan baku
            // Stok lama = X. Kita kurangi (qtySalah - qtyBenar)
            $koreksi = $qtySalah - $qtyBenar;
            $bahan->decrement('stok_saat_ini', $koreksi);

            $this->info("Koreksi berhasil!");
            $this->info("Data Baru -> Qty Awal: {$qtyBenar} | Harga: Rp {$hargaBenar}");
            $this->info("Stok Saat Ini (sekarang): " . $bahan->fresh()->stok_saat_ini);
        });
    }
}
