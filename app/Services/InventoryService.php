<?php

namespace App\Services;

use App\Models\BahanBaku;
use App\Models\FifoBatch;
use Illuminate\Support\Facades\DB;

/**
 * InventoryService — Mengelola semua operasi stok bahan baku.
 *
 * Menggunakan metode FIFO (First In First Out):
 * - Stok yang paling lama masuk akan dikeluarkan terlebih dahulu.
 * - Setiap pembelian membentuk satu "batch" dengan harga beli masing-masing.
 * - HPP dihitung berdasarkan batch yang benar-benar dikonsumsi.
 */
class InventoryService
{
    /**
     * Tambah stok bahan baku dan buat batch FIFO baru.
     * Dipanggil otomatis saat mencatat pembelian baru.
     *
     * @param  int         $bahanBakuId
     * @param  float       $jumlah       Jumlah yang dibeli
     * @param  float       $hargaBeli    Harga beli per satuan
     * @param  string      $tanggalMasuk Format: 'YYYY-MM-DD'
     * @param  int|null    $pembelianId  FK ke tabel pembelian (nullable)
     * @return FifoBatch
     */
    public function tambahStok(
        int $bahanBakuId,
        float $jumlah,
        float $hargaBeli,
        string $tanggalMasuk,
        ?int $pembelianId = null
    ): FifoBatch {
        $bahanBaku = BahanBaku::findOrFail($bahanBakuId);

        $batch = FifoBatch::create([
            'bahan_baku_id' => $bahanBakuId,
            'pembelian_id'  => $pembelianId,
            'harga_beli'    => $hargaBeli,
            'jumlah_awal'   => $jumlah,
            'jumlah_sisa'   => $jumlah,
            'tanggal_masuk' => $tanggalMasuk,
        ]);

        // Tambah stok saat ini
        $bahanBaku->increment('stok_saat_ini', $jumlah);

        return $batch;
    }

    /**
     * Kurangi stok bahan baku menggunakan metode FIFO.
     *
     * Contoh:
     *   Batch A: 10 Indomie @ Rp1.500 (masuk lebih awal)
     *   Batch B: 10 Indomie @ Rp2.000 (masuk belakangan)
     *   Dikonsumsi: 12 Indomie
     *   → Ambil 10 dari Batch A (HPP: 15.000) + 2 dari Batch B (HPP: 4.000)
     *   → Total HPP: Rp19.000, HPP/satuan: Rp1.583,33
     *
     * @param  int   $bahanBakuId
     * @param  float $jumlahDibutuhkan
     * @return array { total_hpp, hpp_satuan, rincian_batch, jumlah_dikonsumsi }
     * @throws \Exception jika stok tidak mencukupi
     */
    public function consumeStock(int $bahanBakuId, float $jumlahDibutuhkan): array
    {
        $bahanBaku = BahanBaku::lockForUpdate()->findOrFail($bahanBakuId);

        // Validasi kecukupan stok
        if ($bahanBaku->stok_saat_ini < $jumlahDibutuhkan) {
            throw new \Exception(
                "Stok '{$bahanBaku->nama}' tidak mencukupi. " .
                "Tersedia: {$bahanBaku->stok_saat_ini} {$bahanBaku->satuan}, " .
                "Dibutuhkan: {$jumlahDibutuhkan} {$bahanBaku->satuan}."
            );
        }

        $sisaHarusDikurangi = (float) $jumlahDibutuhkan;
        $totalHPP           = 0.0;
        $rincianBatch       = [];

        // Ambil batch dari yang paling lama (FIFO: oldest first)
        $batches = FifoBatch::where('bahan_baku_id', $bahanBakuId)
            ->where('jumlah_sisa', '>', 0)
            ->orderBy('tanggal_masuk')
            ->orderBy('id')
            ->lockForUpdate()
            ->get();

        foreach ($batches as $batch) {
            if ($sisaHarusDikurangi <= 0) break;

            // Ambil sebanyak mungkin dari batch ini
            $diambilDariBatch = min((float) $batch->jumlah_sisa, $sisaHarusDikurangi);
            $hppDariBatch     = $diambilDariBatch * (float) $batch->harga_beli;

            // Update sisa batch
            $batch->decrement('jumlah_sisa', $diambilDariBatch);

            $rincianBatch[] = [
                'batch_id'       => $batch->id,
                'jumlah_diambil' => $diambilDariBatch,
                'harga_beli'     => (float) $batch->harga_beli,
                'hpp'            => round($hppDariBatch, 2),
            ];

            $totalHPP           += $hppDariBatch;
            $sisaHarusDikurangi -= $diambilDariBatch;
        }

        // Safety fallback: jika masih ada sisa stok yang harus dikurangi namun batch FIFO sudah habis
        // (misal karena selisih riwayat stok), gunakan HPP rata-rata atau harga beli terakhir agar HPP tidak Rp 0.
        if ($sisaHarusDikurangi > 0) {
            $hargaFallback = $bahanBaku->getHppRataRata();
            if ($hargaFallback <= 0) {
                $lastBatch = FifoBatch::where('bahan_baku_id', $bahanBakuId)->latest('id')->first();
                $hargaFallback = $lastBatch ? (float) $lastBatch->harga_beli : 0;
            }

            $hppFallback = $sisaHarusDikurangi * $hargaFallback;
            $totalHPP   += $hppFallback;

            $rincianBatch[] = [
                'batch_id'       => null,
                'jumlah_diambil' => $sisaHarusDikurangi,
                'harga_beli'     => round($hargaFallback, 2),
                'hpp'            => round($hppFallback, 2),
            ];
        }

        // Update stok saat ini
        $bahanBaku->decrement('stok_saat_ini', $jumlahDibutuhkan);

        return [
            'total_hpp'          => round($totalHPP, 2),
            'hpp_satuan'         => $jumlahDibutuhkan > 0
                                        ? round($totalHPP / $jumlahDibutuhkan, 2)
                                        : 0,
            'rincian_batch'      => $rincianBatch,
            'jumlah_dikonsumsi'  => $jumlahDibutuhkan,
        ];
    }

    /**
     * Rollback stok — kembalikan stok ke batch terakhir.
     * Digunakan jika transaksi gagal/dibatalkan.
     */
    public function rollbackStock(int $bahanBakuId, float $jumlah): void
    {
        $bahanBaku = BahanBaku::findOrFail($bahanBakuId);

        // Kembalikan ke batch terakhir yang ada
        $lastBatch = FifoBatch::where('bahan_baku_id', $bahanBakuId)
            ->latest('id')
            ->first();

        if ($lastBatch) {
            $lastBatch->increment('jumlah_sisa', $jumlah);
        } else {
            // Tidak ada batch — buat batch koreksi dengan harga rata-rata 0
            FifoBatch::create([
                'bahan_baku_id' => $bahanBakuId,
                'harga_beli'    => 0,
                'jumlah_awal'   => $jumlah,
                'jumlah_sisa'   => $jumlah,
                'tanggal_masuk' => now()->toDateString(),
            ]);
        }

        $bahanBaku->increment('stok_saat_ini', $jumlah);
    }

    /**
     * Koreksi stok berdasarkan hasil Stock Opname.
     * Selisih positif = stok fisik lebih banyak (tambah stok dengan HPP rata-rata).
     * Selisih negatif = stok fisik kurang (kurangi stok via FIFO).
     */
    public function adjustStokOpname(int $bahanBakuId, float $selisih): void
    {
        if ($selisih == 0) return;

        $bahanBaku = BahanBaku::findOrFail($bahanBakuId);

        if ($selisih > 0) {
            // Stok fisik lebih banyak → tambah stok dengan harga rata-rata
            $hargaRataRata = $bahanBaku->getHppRataRata();

            FifoBatch::create([
                'bahan_baku_id' => $bahanBakuId,
                'pembelian_id'  => null,
                'harga_beli'    => $hargaRataRata ?: 0,
                'jumlah_awal'   => $selisih,
                'jumlah_sisa'   => $selisih,
                'tanggal_masuk' => now()->toDateString(),
            ]);

            $bahanBaku->increment('stok_saat_ini', $selisih);
        } else {
            // Stok fisik kurang → kurangi via FIFO
            $this->consumeStock($bahanBakuId, abs($selisih));
        }
    }

    /**
     * Hitung nilai stok bahan baku berdasarkan sisa batch FIFO.
     * (Jumlah sisa × harga beli per batch)
     */
    public function getNilaiStok(int $bahanBakuId): float
    {
        return (float) FifoBatch::where('bahan_baku_id', $bahanBakuId)
            ->where('jumlah_sisa', '>', 0)
            ->selectRaw('SUM(jumlah_sisa * harga_beli) as nilai_total')
            ->value('nilai_total') ?? 0;
    }

    /**
     * Hitung total nilai semua stok bahan baku di gudang.
     */
    public function getTotalNilaiStok(): float
    {
        return (float) FifoBatch::where('jumlah_sisa', '>', 0)
            ->selectRaw('SUM(jumlah_sisa * harga_beli) as nilai_total')
            ->value('nilai_total') ?? 0;
    }

    /**
     * Hitung HPP rata-rata tertimbang dari stok yang tersedia (tanpa mengubah stok).
     */
    public function getHppRataRata(int $bahanBakuId): float
    {
        $result = FifoBatch::where('bahan_baku_id', $bahanBakuId)
            ->where('jumlah_sisa', '>', 0)
            ->selectRaw('SUM(jumlah_sisa * harga_beli) as nilai_total, SUM(jumlah_sisa) as total_qty')
            ->first();

        if (!$result || $result->total_qty <= 0) return 0;

        return round($result->nilai_total / $result->total_qty, 2);
    }
}
