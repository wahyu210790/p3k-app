<?php

namespace App\Services;

use App\Models\Produk;

/**
 * RecipeService — Mengelola penggunaan resep produk.
 *
 * Saat produk terjual, RecipeService akan:
 * 1. Membaca resep produk (bahan baku apa saja yang dibutuhkan).
 * 2. Menghitung total bahan baku yang perlu dikurangi.
 * 3. Memanggil InventoryService untuk mengurangi stok via FIFO.
 * 4. Mengembalikan total HPP aktual berdasarkan batch yang dikonsumsi.
 */
class RecipeService
{
    public function __construct(
        private readonly InventoryService $inventoryService
    ) {}

    /**
     * Hitung estimasi HPP produk tanpa mengubah stok.
     * Menggunakan HPP rata-rata tertimbang dari stok yang tersedia.
     * Digunakan untuk menampilkan estimasi HPP di POS sebelum checkout.
     *
     * @param  int $produkId
     * @param  int $qty
     * @return float Total estimasi HPP
     */
    public function hitungEstimasiHPP(int $produkId, int $qty = 1): float
    {
        $produk = Produk::with('detailResep.bahanBaku')->findOrFail($produkId);
        $totalHPP = 0.0;

        foreach ($produk->detailResep as $resep) {
            $jumlahDibutuhkan = (float) $resep->jumlah * $qty;
            $hppRataRata      = $this->inventoryService->getHppRataRata($resep->bahan_baku_id);
            $totalHPP        += $jumlahDibutuhkan * $hppRataRata;
        }

        return round($totalHPP, 2);
    }

    /**
     * Kurangi stok bahan baku sesuai resep menggunakan FIFO.
     * Mengembalikan HPP aktual berdasarkan batch yang benar-benar dikonsumsi.
     *
     * PENTING: Harus dijalankan di dalam DB::transaction() oleh caller.
     *
     * Contoh — Indomie Goreng Telur (qty: 2):
     *   Resep: Indomie = 1 pcs, Telur = 1 butir
     *   Yang dikurangi: Indomie = 2 pcs, Telur = 2 butir
     *   HPP = HPP(Indomie×2 via FIFO) + HPP(Telur×2 via FIFO)
     *
     * @param  int $produkId
     * @param  int $qty       Jumlah porsi produk yang terjual
     * @return array {
     *   produk_id, nama_produk, qty,
     *   total_hpp, hpp_satuan,
     *   detail_penggunaan[]
     * }
     */
    public function gunakanResep(int $produkId, int $qty): array
    {
        $produk   = Produk::with('detailResep.bahanBaku')->findOrFail($produkId);
        $totalHPP = 0.0;
        $detail   = [];

        foreach ($produk->detailResep as $resep) {
            $jumlahDibutuhkan = (float) $resep->jumlah * $qty;

            $hasil = $this->inventoryService->consumeStock(
                $resep->bahan_baku_id,
                $jumlahDibutuhkan
            );

            $totalHPP += $hasil['total_hpp'];

            $detail[] = [
                'bahan_baku_id'  => $resep->bahan_baku_id,
                'nama_bahan'     => $resep->bahanBaku->nama,
                'satuan'         => $resep->bahanBaku->satuan,
                'jumlah_dipakai' => $jumlahDibutuhkan,
                'hpp'            => $hasil['total_hpp'],
                'rincian_batch'  => $hasil['rincian_batch'],
            ];
        }

        return [
            'produk_id'        => $produkId,
            'nama_produk'      => $produk->nama,
            'qty'              => $qty,
            'total_hpp'        => round($totalHPP, 2),
            'hpp_satuan'       => $qty > 0 ? round($totalHPP / $qty, 2) : 0,
            'detail_penggunaan' => $detail,
        ];
    }

    /**
     * Cek apakah stok bahan baku cukup untuk membuat produk sejumlah qty.
     * Tidak mengubah stok — hanya pengecekan saja.
     *
     * @return array { cukup: bool, kekurangan: [] }
     */
    public function cekStokCukup(int $produkId, int $qty): array
    {
        $produk    = Produk::with('detailResep.bahanBaku')->findOrFail($produkId);
        $cukup     = true;
        $kekurangan = [];

        foreach ($produk->detailResep as $resep) {
            $dibutuhkan = (float) $resep->jumlah * $qty;
            $tersedia   = (float) $resep->bahanBaku->stok_saat_ini;

            if ($tersedia < $dibutuhkan) {
                $cukup = false;
                $kekurangan[] = [
                    'bahan_baku_id' => $resep->bahan_baku_id,
                    'nama'          => $resep->bahanBaku->nama,
                    'tersedia'      => $tersedia,
                    'dibutuhkan'    => $dibutuhkan,
                    'kurang'        => $dibutuhkan - $tersedia,
                    'satuan'        => $resep->bahanBaku->satuan,
                ];
            }
        }

        return [
            'cukup'      => $cukup,
            'kekurangan' => $kekurangan,
        ];
    }

    /**
     * Hitung jumlah maksimum produk yang bisa dibuat dari stok yang tersedia.
     *
     * @return int Maksimum qty yang bisa dibuat (0 jika stok tidak cukup untuk 1 porsi)
     */
    public function getMaxQty(int $produkId): int
    {
        $produk = Produk::with('detailResep.bahanBaku')->findOrFail($produkId);

        if ($produk->detailResep->isEmpty()) return 9999;

        $maxQty = PHP_INT_MAX;

        foreach ($produk->detailResep as $resep) {
            if ((float) $resep->jumlah <= 0) continue;

            $maxDariIngredient = floor(
                (float) $resep->bahanBaku->stok_saat_ini / (float) $resep->jumlah
            );
            $maxQty = min($maxQty, $maxDariIngredient);
        }

        return (int) max(0, $maxQty === PHP_INT_MAX ? 0 : $maxQty);
    }
}
