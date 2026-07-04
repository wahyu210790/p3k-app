<?php

namespace Tests\Feature;

use App\Models\BahanBaku;
use App\Models\DetailResep;
use App\Models\FifoBatch;
use App\Models\Produk;
use App\Services\InventoryService;
use App\Services\RecipeService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * FifoInventoryTest — Memastikan logika FIFO dan resep berjalan dengan benar.
 *
 * Skenario yang diuji:
 * 1. tambahStok() membuat batch FIFO baru dan menambah stok
 * 2. consumeStock() mengambil dari batch tertua (FIFO order)
 * 3. consumeStock() melintas batas batch jika 1 batch tidak cukup
 * 4. HPP dihitung akurat sesuai harga masing-masing batch
 * 5. Stok tidak mencukupi melempar Exception
 * 6. RecipeService mengurangi bahan baku sesuai resep
 * 7. RecipeService menghitung HPP dari semua ingredient
 * 8. cekStokCukup() mendeteksi kekurangan stok per ingredient
 * 9. getMaxQty() menghitung kapasitas produksi dari stok tersedia
 */
class FifoInventoryTest extends TestCase
{
    use RefreshDatabase;

    private InventoryService $inventoryService;
    private RecipeService    $recipeService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->inventoryService = app(InventoryService::class);
        $this->recipeService    = app(RecipeService::class);
    }

    // =========================================================================
    // INVENTORY SERVICE TESTS
    // =========================================================================

    #[Test]
    public function tambah_stok_membuat_batch_fifo_baru_dan_update_stok(): void
    {
        $bahanBaku = BahanBaku::create([
            'nama'          => 'Indomie',
            'satuan'        => 'pcs',
            'stok_saat_ini' => 0,
            'stok_minimum'  => 5,
        ]);

        $this->inventoryService->tambahStok(
            bahanBakuId:  $bahanBaku->id,
            jumlah:       10,
            hargaBeli:    1500,
            tanggalMasuk: '2024-01-01'
        );

        $this->assertDatabaseHas('fifo_batches', [
            'bahan_baku_id' => $bahanBaku->id,
            'harga_beli'    => 1500,
            'jumlah_awal'   => 10,
            'jumlah_sisa'   => 10,
        ]);

        // Pastikan tanggal masuk tersimpan dengan benar
        $batch = FifoBatch::where('bahan_baku_id', $bahanBaku->id)->first();
        $this->assertEquals('2024-01-01', $batch->tanggal_masuk->format('Y-m-d'));
    }

    #[Test]
    public function consume_stock_mengambil_dari_batch_tertua_lebih_dahulu(): void
    {
        $bahanBaku = BahanBaku::create([
            'nama' => 'Indomie', 'satuan' => 'pcs', 'stok_saat_ini' => 0, 'stok_minimum' => 0,
        ]);

        // Batch A — masuk lebih awal dengan harga lama
        $this->inventoryService->tambahStok($bahanBaku->id, 10, 1500, '2024-01-01');
        // Batch B — masuk belakangan dengan harga baru
        $this->inventoryService->tambahStok($bahanBaku->id, 10, 2000, '2024-01-15');

        // Konsumsi 5 — harus dari Batch A (yang lebih lama)
        $hasil = $this->inventoryService->consumeStock($bahanBaku->id, 5);

        // HPP harus dari harga Batch A (Rp1.500)
        $this->assertEquals(7500.0, $hasil['total_hpp']); // 5 × 1500
        $this->assertEquals(1500.0, $hasil['hpp_satuan']);
        $this->assertEquals(1, count($hasil['rincian_batch']));
        $this->assertEquals(1500.0, $hasil['rincian_batch'][0]['harga_beli']);

        // Stok total: 20 - 5 = 15
        $this->assertEquals(15, $bahanBaku->fresh()->stok_saat_ini);
    }

    #[Test]
    public function consume_stock_melintas_batas_batch_multi_batch(): void
    {
        $bahanBaku = BahanBaku::create([
            'nama' => 'Indomie', 'satuan' => 'pcs', 'stok_saat_ini' => 0, 'stok_minimum' => 0,
        ]);

        // Batch A: 10 pcs @ Rp1.500
        $this->inventoryService->tambahStok($bahanBaku->id, 10, 1500, '2024-01-01');
        // Batch B: 10 pcs @ Rp2.000
        $this->inventoryService->tambahStok($bahanBaku->id, 10, 2000, '2024-01-15');

        // Konsumsi 12 → ambil 10 dari Batch A + 2 dari Batch B
        $hasil = $this->inventoryService->consumeStock($bahanBaku->id, 12);

        // HPP: (10 × 1500) + (2 × 2000) = 15.000 + 4.000 = 19.000
        $this->assertEquals(19000.0, $hasil['total_hpp']);
        $this->assertEquals(2, count($hasil['rincian_batch']));

        // Batch A harus habis (sisa = 0)
        $batchA = FifoBatch::where('bahan_baku_id', $bahanBaku->id)
            ->orderBy('id')->first();
        $this->assertEquals(0.0, (float) $batchA->fresh()->jumlah_sisa);

        // Batch B sisa 8
        $batchB = FifoBatch::where('bahan_baku_id', $bahanBaku->id)
            ->orderBy('id', 'desc')->first();
        $this->assertEquals(8.0, (float) $batchB->fresh()->jumlah_sisa);

        // Stok total: 20 - 12 = 8
        $this->assertEquals(8, $bahanBaku->fresh()->stok_saat_ini);
    }

    #[Test]
    public function consume_stock_melempar_exception_jika_stok_tidak_cukup(): void
    {
        $bahanBaku = BahanBaku::create([
            'nama' => 'Telur', 'satuan' => 'butir', 'stok_saat_ini' => 0, 'stok_minimum' => 0,
        ]);

        $this->inventoryService->tambahStok($bahanBaku->id, 5, 2000, '2024-01-01');

        $this->expectException(\Exception::class);
        $this->expectExceptionMessageMatches('/tidak mencukupi/');

        // Konsumsi 10, tapi stok hanya 5
        $this->inventoryService->consumeStock($bahanBaku->id, 10);
    }

    #[Test]
    public function hpp_satuan_dihitung_berdasarkan_harga_batch_yang_dikonsumsi(): void
    {
        $bahanBaku = BahanBaku::create([
            'nama' => 'Beras', 'satuan' => 'gram', 'stok_saat_ini' => 0, 'stok_minimum' => 0,
        ]);

        // 1000 gram @ Rp12 per gram
        $this->inventoryService->tambahStok($bahanBaku->id, 1000, 12, '2024-01-01');

        $hasil = $this->inventoryService->consumeStock($bahanBaku->id, 100);

        $this->assertEquals(1200.0, $hasil['total_hpp']);  // 100 × 12
        $this->assertEquals(12.0,   $hasil['hpp_satuan']); // Rp12/gram
    }

    #[Test]
    public function rollback_stock_mengembalikan_stok_ke_batch_terakhir(): void
    {
        $bahanBaku = BahanBaku::create([
            'nama' => 'Minyak', 'satuan' => 'ml', 'stok_saat_ini' => 0, 'stok_minimum' => 0,
        ]);

        $this->inventoryService->tambahStok($bahanBaku->id, 500, 20, '2024-01-01');
        $this->inventoryService->consumeStock($bahanBaku->id, 100);

        $this->assertEquals(400, $bahanBaku->fresh()->stok_saat_ini);

        $this->inventoryService->rollbackStock($bahanBaku->id, 100);

        $this->assertEquals(500, $bahanBaku->fresh()->stok_saat_ini);
    }

    // =========================================================================
    // RECIPE SERVICE TESTS
    // =========================================================================

    #[Test]
    public function recipe_service_mengurangi_semua_bahan_baku_sesuai_resep(): void
    {
        $indomie = BahanBaku::create(['nama' => 'Indomie', 'satuan' => 'pcs',   'stok_saat_ini' => 0, 'stok_minimum' => 0]);
        $telur   = BahanBaku::create(['nama' => 'Telur',   'satuan' => 'butir', 'stok_saat_ini' => 0, 'stok_minimum' => 0]);

        $this->inventoryService->tambahStok($indomie->id, 10, 1500, '2024-01-01');
        $this->inventoryService->tambahStok($telur->id,   20, 2000, '2024-01-01');

        $produk = Produk::create([
            'nama'       => 'Indomie Goreng Telur',
            'kategori'   => 'Makanan',
            'harga_jual' => 15000,
            'has_resep'  => true,
        ]);

        DetailResep::create(['produk_id' => $produk->id, 'bahan_baku_id' => $indomie->id, 'jumlah' => 1]);
        DetailResep::create(['produk_id' => $produk->id, 'bahan_baku_id' => $telur->id,   'jumlah' => 1]);

        // Jual 2 porsi
        $hasil = $this->recipeService->gunakanResep($produk->id, qty: 2);

        // Stok berkurang sesuai resep × qty
        $this->assertEquals(8,  $indomie->fresh()->stok_saat_ini); // 10 - 2
        $this->assertEquals(18, $telur->fresh()->stok_saat_ini);   // 20 - 2

        // HPP: (2 × 1500) + (2 × 2000) = 3000 + 4000 = 7000
        $this->assertEquals(7000.0, $hasil['total_hpp']);
        $this->assertEquals(3500.0, $hasil['hpp_satuan']); // per porsi
        $this->assertEquals(2,      $hasil['qty']);
    }

    #[Test]
    public function recipe_service_menghitung_hpp_multi_ingredient_dengan_fifo(): void
    {
        $beras = BahanBaku::create(['nama' => 'Beras', 'satuan' => 'gram', 'stok_saat_ini' => 0, 'stok_minimum' => 0]);

        // Batch A: 500 gram @ Rp10/gram, Batch B: 500 gram @ Rp12/gram
        $this->inventoryService->tambahStok($beras->id, 500, 10, '2024-01-01');
        $this->inventoryService->tambahStok($beras->id, 500, 12, '2024-01-15');

        $produk = Produk::create([
            'nama' => 'Nasi', 'kategori' => 'Makanan', 'harga_jual' => 5000, 'has_resep' => true,
        ]);
        DetailResep::create(['produk_id' => $produk->id, 'bahan_baku_id' => $beras->id, 'jumlah' => 200]);

        // Jual 4 porsi → 4 × 200gr = 800gr
        // Ambil 500gr dari Batch A (HPP: 5000) + 300gr dari Batch B (HPP: 3600)
        $hasil = $this->recipeService->gunakanResep($produk->id, qty: 4);

        $this->assertEquals(8600.0, $hasil['total_hpp']);  // 5000 + 3600
        $this->assertEquals(2150.0, $hasil['hpp_satuan']); // 8600 / 4
    }

    #[Test]
    public function cek_stok_cukup_mendeteksi_kekurangan_ingredient(): void
    {
        $indomie = BahanBaku::create(['nama' => 'Indomie', 'satuan' => 'pcs',   'stok_saat_ini' => 0, 'stok_minimum' => 0]);
        $telur   = BahanBaku::create(['nama' => 'Telur',   'satuan' => 'butir', 'stok_saat_ini' => 0, 'stok_minimum' => 0]);

        $this->inventoryService->tambahStok($indomie->id, 10, 1500, '2024-01-01');
        $this->inventoryService->tambahStok($telur->id,    2, 2000, '2024-01-01'); // sedikit!

        $produk = Produk::create([
            'nama' => 'Indomie Goreng Telur', 'kategori' => 'Makanan', 'harga_jual' => 15000, 'has_resep' => true,
        ]);
        DetailResep::create(['produk_id' => $produk->id, 'bahan_baku_id' => $indomie->id, 'jumlah' => 1]);
        DetailResep::create(['produk_id' => $produk->id, 'bahan_baku_id' => $telur->id,   'jumlah' => 1]);

        // Pesan 5 porsi, telur hanya ada 2
        $cek = $this->recipeService->cekStokCukup($produk->id, qty: 5);

        $this->assertFalse($cek['cukup']);
        $this->assertCount(1, $cek['kekurangan']); // hanya Telur yang kurang
        $this->assertEquals('Telur', $cek['kekurangan'][0]['nama']);
        $this->assertEquals(3.0,     $cek['kekurangan'][0]['kurang']); // butuh 5, ada 2
    }

    #[Test]
    public function get_max_qty_menghitung_kapasitas_dari_stok_tersedia(): void
    {
        $indomie = BahanBaku::create(['nama' => 'Indomie', 'satuan' => 'pcs',   'stok_saat_ini' => 0, 'stok_minimum' => 0]);
        $telur   = BahanBaku::create(['nama' => 'Telur',   'satuan' => 'butir', 'stok_saat_ini' => 0, 'stok_minimum' => 0]);

        $this->inventoryService->tambahStok($indomie->id, 10, 1500, '2024-01-01');
        $this->inventoryService->tambahStok($telur->id,    7, 2000, '2024-01-01'); // bottleneck

        $produk = Produk::create([
            'nama' => 'Indomie Goreng Telur', 'kategori' => 'Makanan', 'harga_jual' => 15000, 'has_resep' => true,
        ]);
        DetailResep::create(['produk_id' => $produk->id, 'bahan_baku_id' => $indomie->id, 'jumlah' => 1]);
        DetailResep::create(['produk_id' => $produk->id, 'bahan_baku_id' => $telur->id,   'jumlah' => 1]);

        // max = min(10/1, 7/1) = 7 (dibatasi Telur)
        $maxQty = $this->recipeService->getMaxQty($produk->id);
        $this->assertEquals(7, $maxQty);
    }
}
