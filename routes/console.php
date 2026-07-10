<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('p3k:koreksi-hpp {--dry-run : Hanya simulasi cek tanpa mengubah data di database}', function () {
    $dryRun = $this->option('dry-run');
    $this->info($dryRun ? "=== SIMULASI KOREKSI HPP LAMA (DRY RUN) ===" : "=== MEMULAI KOREKSI HPP DATA LAMA ===");

    $details = \App\Models\DetailTransaksi::with('produk.detailResep.bahanBaku', 'transaksi')
        ->where(function ($q) {
            $q->where('subtotal_hpp', '<=', 0)
              ->orWhereNull('subtotal_hpp');
        })
        ->get();

    if ($details->isEmpty()) {
        $this->info("✔ Tidak ditemukan transaksi lama dengan HPP Rp 0. Semua data historis sudah aman!");
        return;
    }

    $this->warn("Ditemukan " . $details->count() . " item transaksi historis dengan HPP Rp 0 / belum tercatat.");

    $transaksiToUpdate = [];
    $totalItemTerkoreksi = 0;
    $totalSelisihHpp = 0;

    \Illuminate\Support\Facades\DB::beginTransaction();

    try {
        $financialService = app(\App\Services\FinancialService::class);

        foreach ($details as $detail) {
            if (!$detail->produk) {
                $this->warn("[Skipped] Detail ID {$detail->id}: Produk sudah terhapus dari database.");
                continue;
            }
            if ($detail->produk->detailResep->isEmpty()) {
                $this->warn("[Skipped] Detail ID {$detail->id} ({$detail->produk->nama}): Produk ini belum memiliki Resep Bahan Baku.");
                continue;
            }

            $hppKoreksiTotal = 0.0;
            foreach ($detail->produk->detailResep as $resep) {
                $jumlahDibutuhkan = (float) $resep->jumlah * (int) $detail->jumlah;
                $bahan = $resep->bahanBaku;
                if (!$bahan) continue;

                $hargaRata = $bahan->getHppRataRata();
                if ($hargaRata <= 0) {
                    $lastBatch = \App\Models\FifoBatch::where('bahan_baku_id', $bahan->id)->latest('id')->first();
                    $hargaRata = $lastBatch ? (float) $lastBatch->harga_beli : 0;
                }

                if ($hargaRata <= 0) {
                    $lastBeli = \App\Models\DetailPembelian::where('bahan_baku_id', $bahan->id)->latest('id')->first();
                    $hargaRata = $lastBeli ? (float) $lastBeli->harga_satuan : 0;
                }

                if ($hargaRata <= 0) {
                    $this->warn(" -> [Info] Bahan baku '{$bahan->nama}' pada produk '{$detail->produk->nama}' belum pernah dibeli/dicatat harganya (Rp 0).");
                }

                $hppKoreksiTotal += $jumlahDibutuhkan * $hargaRata;
            }

            if ($hppKoreksiTotal > 0) {
                $totalItemTerkoreksi++;
                $selisihHpp = $hppKoreksiTotal - (float) $detail->subtotal_hpp;
                $totalSelisihHpp += $selisihHpp;

                $alokasi = $financialService->hitungAlokasi(
                    hargaJual: (float) $detail->subtotal_harga_jual,
                    hpp:       round($hppKoreksiTotal, 2)
                );

                $detail->update([
                    'hpp_satuan'                => round($hppKoreksiTotal / $detail->jumlah, 2),
                    'subtotal_hpp'              => round($hppKoreksiTotal, 2),
                    'subtotal_dana_modal'       => $alokasi['dana_modal'],
                    'subtotal_dana_operasional' => $alokasi['dana_operasional'],
                    'subtotal_keuntungan'       => $alokasi['keuntungan'],
                ]);

                $transaksiToUpdate[$detail->transaksi_id] = $detail->transaksi;
            }
        }

        // Update Header Transaksi & Saldo Dompet Keuangan
        foreach ($transaksiToUpdate as $transaksiId => $transaksi) {
            if (!$transaksi) continue;

            $oldModal       = (float) $transaksi->total_dana_modal;
            $oldOps         = (float) $transaksi->total_dana_operasional;
            $oldKeuntungan  = (float) $transaksi->total_keuntungan;

            $newHpp = \App\Models\DetailTransaksi::where('transaksi_id', $transaksiId)->sum('subtotal_hpp');
            $newModal = \App\Models\DetailTransaksi::where('transaksi_id', $transaksiId)->sum('subtotal_dana_modal');
            $newOps = \App\Models\DetailTransaksi::where('transaksi_id', $transaksiId)->sum('subtotal_dana_operasional');
            $newKeuntungan = \App\Models\DetailTransaksi::where('transaksi_id', $transaksiId)->sum('subtotal_keuntungan');

            $transaksi->update([
                'total_hpp'              => round($newHpp, 2),
                'total_dana_modal'       => round($newModal, 2),
                'total_dana_operasional' => round($newOps, 2),
                'total_keuntungan'       => round($newKeuntungan, 2),
            ]);

            $deltaModal       = $newModal - $oldModal;
            $deltaOps         = $newOps - $oldOps;
            $deltaKeuntungan  = $newKeuntungan - $oldKeuntungan;

            \App\Models\DompetKeuangan::tambah('modal', $deltaModal);
            \App\Models\DompetKeuangan::tambah('operasional', $deltaOps);
            \App\Models\DompetKeuangan::tambah('keuntungan', $deltaKeuntungan);
        }

        if ($dryRun) {
            \Illuminate\Support\Facades\DB::rollBack();
            $this->info("--- HASIL SIMULASI ---");
            $this->info("Item transaksi yang akan dikoreksi : {$totalItemTerkoreksi} item");
            $this->info("Total penyesuaian HPP              : +Rp " . number_format($totalSelisihHpp, 0, ',', '.'));
            $this->warn("[DRY RUN] Tidak ada perubahan yang disimpan ke database.");
        } else {
            \Illuminate\Support\Facades\DB::commit();
            $this->info("✔ Berhasil mengkoreksi {$totalItemTerkoreksi} item transaksi lama.");
            $this->info("✔ Total HPP dan Saldo Dompet Keuangan telah diperbarui (+Rp " . number_format($totalSelisihHpp, 0, ',', '.') . ").");
        }
    } catch (\Exception $e) {
        \Illuminate\Support\Facades\DB::rollBack();
        $this->error("Gagal mengkoreksi data: " . $e->getMessage());
    }
})->purpose('Koreksi HPP dan Dompet Keuangan untuk transaksi historis yang HPP-nya Rp 0');
