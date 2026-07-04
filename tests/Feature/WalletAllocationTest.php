<?php

namespace Tests\Feature;

use App\Models\BahanBaku;
use App\Models\DetailResep;
use App\Models\DompetKeuangan;
use App\Models\HutangSupplier;
use App\Models\PengeluaranOperasional;
use App\Models\Pengaturan;
use App\Models\PiutangPelanggan;
use App\Models\Produk;
use App\Models\Supplier;
use App\Models\User;
use App\Services\FinancialService;
use App\Services\InventoryService;
use App\Services\TransactionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * WalletAllocationTest — Memastikan sistem 3 Dompet Keuangan bekerja dengan benar.
 *
 * Skenario yang diuji:
 * 1.  Alokasi 3 dompet sesuai formula (Modal, Operasional, Keuntungan)
 * 2.  Dompet bertambah setelah transaksi penjualan
 * 3.  Persentase operasional dinamis dari tabel pengaturan
 * 4.  Proses penjualan end-to-end via TransactionService (Cash)
 * 5.  Proses penjualan dengan metode Piutang → PiutangPelanggan terbuat
 * 6.  Bayar piutang → status berubah ke 'lunas'
 * 7.  Pengeluaran operasional mengurangi Dompet Operasional
 * 8.  Pengeluaran melebihi saldo → Exception
 * 9.  Proses pembelian → stok bertambah + hutang supplier terbuat
 * 10. Bayar hutang supplier → status berubah ke 'lunas'
 * 11. Validasi stok kurang saat POS checkout → Exception
 */
class WalletAllocationTest extends TestCase
{
    use RefreshDatabase;

    private FinancialService  $financialService;
    private InventoryService  $inventoryService;
    private TransactionService $transactionService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->financialService   = app(FinancialService::class);
        $this->inventoryService   = app(InventoryService::class);
        $this->transactionService = app(TransactionService::class);

        // Inisialisasi 3 dompet (saldo awal 0)
        foreach (['modal', 'operasional', 'keuntungan'] as $tipe) {
            DompetKeuangan::create(['tipe' => $tipe, 'saldo' => 0]);
        }

        // Pengaturan default
        Pengaturan::create(['kunci' => 'persen_operasional', 'nilai' => '20']);
    }

    // =========================================================================
    // FINANCIAL SERVICE — ALOKASI FORMULA
    // =========================================================================

    #[Test]
    public function hitung_alokasi_menggunakan_formula_3_dompet_yang_benar(): void
    {
        // Harga Jual = 15.000, HPP = 8.000, Operasional = 20% dari HPP
        $alokasi = $this->financialService->hitungAlokasi(
            hargaJual: 15000,
            hpp:       8000,
            persenOps: 20
        );

        $this->assertEquals(8000.0,  $alokasi['dana_modal']);        // = HPP
        $this->assertEquals(1600.0,  $alokasi['dana_operasional']);  // 20% × 8000
        $this->assertEquals(5400.0,  $alokasi['keuntungan']);        // 15000 - 8000 - 1600

        // Pastikan total balance
        $total = $alokasi['dana_modal'] + $alokasi['dana_operasional'] + $alokasi['keuntungan'];
        // Modal + Ops + Keuntungan = HPP + (20%×HPP) + (HargaJual - HPP - 20%×HPP) = HargaJual
        $this->assertEquals(15000.0, $total);
    }

    #[Test]
    public function persen_operasional_diambil_dari_pengaturan_secara_dinamis(): void
    {
        // Ubah persentase ke 30%
        Pengaturan::set('persen_operasional', 30);

        $alokasi = $this->financialService->hitungAlokasi(
            hargaJual: 10000,
            hpp:       6000
            // persenOps tidak diisi → ambil dari Pengaturan
        );

        $this->assertEquals(6000.0, $alokasi['dana_modal']);
        $this->assertEquals(1800.0, $alokasi['dana_operasional']); // 30% × 6000
        $this->assertEquals(2200.0, $alokasi['keuntungan']);       // 10000 - 6000 - 1800
    }

    #[Test]
    public function alokasikan_dompet_menambah_saldo_ketiga_dompet(): void
    {
        $this->financialService->alokasikanDompet(8000, 1600, 5400);

        $this->assertEquals(8000.0, DompetKeuangan::getSaldo('modal'));
        $this->assertEquals(1600.0, DompetKeuangan::getSaldo('operasional'));
        $this->assertEquals(5400.0, DompetKeuangan::getSaldo('keuntungan'));
    }

    // =========================================================================
    // TRANSACTION SERVICE — PENJUALAN END-TO-END
    // =========================================================================

    #[Test]
    public function proses_penjualan_cash_memperbarui_stok_dan_dompet(): void
    {
        // Setup
        $kasir   = User::factory()->create(['role' => 'kasir']);
        $indomie = BahanBaku::create(['nama' => 'Indomie', 'satuan' => 'pcs', 'stok_saat_ini' => 0, 'stok_minimum' => 0]);
        $this->inventoryService->tambahStok($indomie->id, 10, 1500, '2024-01-01');

        $produk = Produk::create([
            'nama' => 'Indomie Goreng', 'kategori' => 'Makanan', 'harga_jual' => 5000, 'has_resep' => true,
        ]);
        DetailResep::create(['produk_id' => $produk->id, 'bahan_baku_id' => $indomie->id, 'jumlah' => 1]);

        // Proses penjualan 2 Indomie Goreng via Cash
        $hasil = $this->transactionService->prosesPenjualan(
            userId:            $kasir->id,
            items:             [['produk_id' => $produk->id, 'qty' => 2, 'promo_id' => null]],
            metodePembayaran:  'cash'
        );

        // Stok berkurang: 10 - 2 = 8
        $this->assertEquals(8, $indomie->fresh()->stok_saat_ini);

        // Total Harga Jual: 2 × 5.000 = 10.000
        $this->assertEquals(10000.0, $hasil['ringkasan']['total_harga_jual']);

        // HPP: 2 × 1.500 = 3.000
        $this->assertEquals(3000.0, $hasil['ringkasan']['total_hpp']);

        // Dana Modal: 3.000, Operasional: 600 (20%×3000), Keuntungan: 6.400
        $this->assertEquals(3000.0, $hasil['ringkasan']['total_dana_modal']);
        $this->assertEquals(600.0,  $hasil['ringkasan']['total_dana_operasional']);
        $this->assertEquals(6400.0, $hasil['ringkasan']['total_keuntungan']);

        // Dompet saldo bertambah
        $this->assertEquals(3000.0, DompetKeuangan::getSaldo('modal'));
        $this->assertEquals(600.0,  DompetKeuangan::getSaldo('operasional'));
        $this->assertEquals(6400.0, DompetKeuangan::getSaldo('keuntungan'));

        // Transaksi tersimpan di database
        $this->assertDatabaseHas('transaksi', [
            'user_id'           => $kasir->id,
            'metode_pembayaran' => 'cash',
            'status'            => 'selesai',
        ]);
    }

    #[Test]
    public function proses_penjualan_piutang_membuat_record_piutang_pelanggan(): void
    {
        $kasir   = User::factory()->create(['role' => 'kasir']);
        $indomie = BahanBaku::create(['nama' => 'Indomie', 'satuan' => 'pcs', 'stok_saat_ini' => 0, 'stok_minimum' => 0]);
        $this->inventoryService->tambahStok($indomie->id, 10, 1500, '2024-01-01');

        $produk = Produk::create([
            'nama' => 'Indomie Goreng', 'kategori' => 'Makanan', 'harga_jual' => 5000, 'has_resep' => true,
        ]);
        DetailResep::create(['produk_id' => $produk->id, 'bahan_baku_id' => $indomie->id, 'jumlah' => 1]);

        $hasil = $this->transactionService->prosesPenjualan(
            userId:           $kasir->id,
            items:            [['produk_id' => $produk->id, 'qty' => 1, 'promo_id' => null]],
            metodePembayaran: 'piutang',
            piutangData:      ['nama_pelanggan' => 'Budi', 'nomor_wa' => '081234567890']
        );

        // Transaksi berstatus piutang
        $this->assertDatabaseHas('transaksi', ['metode_pembayaran' => 'piutang', 'status' => 'piutang']);

        // Piutang pelanggan terbuat
        $this->assertNotNull($hasil['piutang']);
        $this->assertDatabaseHas('piutang_pelanggan', [
            'nama_pelanggan' => 'Budi',
            'nomor_wa'       => '081234567890',
            'jumlah_piutang' => 5000,
            'status'         => 'belum_lunas',
        ]);
    }

    #[Test]
    public function bayar_piutang_lunas_mengubah_status_menjadi_lunas(): void
    {
        $piutang = PiutangPelanggan::create([
            'nama_pelanggan'  => 'Budi',
            'jumlah_piutang'  => 15000,
            'jumlah_bayar'    => 0,
            'sisa_piutang'    => 15000,
            'status'          => 'belum_lunas',
            'tanggal_piutang' => now()->toDateString(),
        ]);

        // Bayar sebagian
        $this->financialService->bayarPiutangPelanggan($piutang, 10000);
        $this->assertEquals(5000.0, $piutang->fresh()->sisa_piutang);
        $this->assertEquals('belum_lunas', $piutang->fresh()->status);

        // Bayar lunas
        $this->financialService->bayarPiutangPelanggan($piutang->fresh(), 5000);
        $this->assertEquals(0.0,    $piutang->fresh()->sisa_piutang);
        $this->assertEquals('lunas', $piutang->fresh()->status);
        $this->assertNotNull($piutang->fresh()->tanggal_lunas);
    }

    // =========================================================================
    // PENGELUARAN OPERASIONAL
    // =========================================================================

    #[Test]
    public function catat_pengeluaran_mengurangi_dompet_operasional(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);

        // Isi dompet operasional dulu
        DompetKeuangan::tambah('operasional', 500000);

        $this->financialService->catatPengeluaran(
            userId:     $owner->id,
            kategori:   'listrik',
            jumlah:     150000,
            tanggal:    now()->toDateString(),
            keterangan: 'Bayar tagihan PLN'
        );

        // Saldo berkurang
        $this->assertEquals(350000.0, DompetKeuangan::getSaldo('operasional'));

        // Tercatat di database
        $this->assertDatabaseHas('pengeluaran_operasional', [
            'kategori' => 'listrik',
            'jumlah'   => 150000,
        ]);
    }

    #[Test]
    public function catat_pengeluaran_melebihi_saldo_melempar_exception(): void
    {
        $owner = User::factory()->create(['role' => 'owner']);

        // Saldo hanya 50.000
        DompetKeuangan::tambah('operasional', 50000);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessageMatches('/tidak mencukupi/');

        $this->financialService->catatPengeluaran(
            userId:   $owner->id,
            kategori: 'gaji',
            jumlah:   200000, // lebih dari saldo
            tanggal:  now()->toDateString()
        );
    }

    // =========================================================================
    // PEMBELIAN + HUTANG SUPPLIER
    // =========================================================================

    #[Test]
    public function proses_pembelian_menambah_stok_dan_membuat_hutang_jika_belum_lunas(): void
    {
        $owner    = User::factory()->create(['role' => 'owner']);
        $supplier = Supplier::create(['nama' => 'Supplier ABC']);
        $indomie  = BahanBaku::create(['nama' => 'Indomie', 'satuan' => 'pcs', 'stok_saat_ini' => 0, 'stok_minimum' => 5]);

        $pembelian = $this->transactionService->prosesPembelian($owner->id, [
            'supplier_id'       => $supplier->id,
            'tanggal_pembelian' => '2024-01-10',
            'jumlah_bayar'      => 15000, // bayar sebagian dari total 30.000
            'items'             => [
                ['bahan_baku_id' => $indomie->id, 'jumlah' => 20, 'harga_satuan' => 1500],
            ],
        ]);

        // Stok bertambah
        $this->assertEquals(20, $indomie->fresh()->stok_saat_ini);

        // Batch FIFO terbuat
        $this->assertDatabaseHas('fifo_batches', [
            'bahan_baku_id' => $indomie->id,
            'harga_beli'    => 1500,
            'jumlah_awal'   => 20,
        ]);

        // Hutang supplier terbuat (sisa 15.000)
        $this->assertDatabaseHas('hutang_supplier', [
            'supplier_id'   => $supplier->id,
            'jumlah_hutang' => 15000,
            'status'        => 'belum_lunas',
        ]);
    }

    #[Test]
    public function bayar_hutang_supplier_lunas_mengubah_status_di_pembelian_dan_hutang(): void
    {
        $owner    = User::factory()->create(['role' => 'owner']);
        $supplier = Supplier::create(['nama' => 'Supplier XYZ']);
        $indomie  = BahanBaku::create(['nama' => 'Indomie', 'satuan' => 'pcs', 'stok_saat_ini' => 0, 'stok_minimum' => 0]);

        $pembelian = $this->transactionService->prosesPembelian($owner->id, [
            'supplier_id'       => $supplier->id,
            'tanggal_pembelian' => '2024-01-10',
            'jumlah_bayar'      => 0, // belum bayar sama sekali
            'items'             => [
                ['bahan_baku_id' => $indomie->id, 'jumlah' => 10, 'harga_satuan' => 2000],
            ],
        ]);

        $hutang = HutangSupplier::where('pembelian_id', $pembelian->id)->first();
        $this->assertEquals(20000.0, $hutang->jumlah_hutang);

        // Bayar lunas
        $this->financialService->bayarHutangSupplier($hutang, 20000);

        $this->assertEquals('lunas', $hutang->fresh()->status);
        $this->assertEquals(0.0,     $hutang->fresh()->sisa_hutang);
        $this->assertEquals('lunas', $pembelian->fresh()->status_pembayaran);
    }

    #[Test]
    public function penjualan_dengan_stok_kurang_melempar_exception_sebelum_transaksi(): void
    {
        $kasir   = User::factory()->create(['role' => 'kasir']);
        $indomie = BahanBaku::create(['nama' => 'Indomie', 'satuan' => 'pcs', 'stok_saat_ini' => 0, 'stok_minimum' => 0]);

        // Hanya ada 2 stok
        $this->inventoryService->tambahStok($indomie->id, 2, 1500, '2024-01-01');

        $produk = Produk::create([
            'nama' => 'Indomie Goreng', 'kategori' => 'Makanan', 'harga_jual' => 5000, 'has_resep' => true,
        ]);
        DetailResep::create(['produk_id' => $produk->id, 'bahan_baku_id' => $indomie->id, 'jumlah' => 1]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessageMatches('/tidak mencukupi/');

        // Minta 5 porsi padahal stok hanya 2
        $this->transactionService->prosesPenjualan(
            userId:           $kasir->id,
            items:            [['produk_id' => $produk->id, 'qty' => 5, 'promo_id' => null]],
            metodePembayaran: 'cash'
        );

        // Pastikan dompet TIDAK berubah (transaksi dibatalkan)
        $this->assertEquals(0.0, DompetKeuangan::getSaldo('modal'));
        $this->assertEquals(0.0, DompetKeuangan::getSaldo('operasional'));
        $this->assertEquals(0.0, DompetKeuangan::getSaldo('keuntungan'));
    }
}
