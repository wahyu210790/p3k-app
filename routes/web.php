<?php

use App\Http\Controllers\BahanBakuController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HutangController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\NonSalesController;
use App\Http\Controllers\PembelianController;
use App\Http\Controllers\PengeluaranController;
use App\Http\Controllers\PengaturanController;
use App\Http\Controllers\PiutangController;
use App\Http\Controllers\POSController;
use App\Http\Controllers\PromoController;
use App\Http\Controllers\StockOpnameController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ProdukController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;


// ============================================================================
// Route publik (sudah di-handle Breeze: login, register, dll.)
// ============================================================================
require __DIR__.'/auth.php';

// ============================================================================
// Semua route butuh autentikasi
// ============================================================================
Route::middleware('auth')->group(function () {

    // Redirect root → dashboard (owner) atau POS (kasir)
    Route::get('/', function () {
        return auth()->user()->isOwner()
            ? redirect()->route('dashboard')
            : redirect()->route('pos.index');
    })->name('home');

    // Profile (Breeze scaffold — untuk semua user yang login)
    Route::get('/profile',    [ProfileController::class, 'edit']   )->name('profile.edit');
    Route::patch('/profile',  [ProfileController::class, 'update'] )->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // ========================================================================
    // KASIR + OWNER — POS & Non-Sales
    // ========================================================================
    Route::middleware('kasir-or-owner')->group(function () {

        // POS — Kasir
        Route::get('/pos',              [POSController::class, 'index'])   ->name('pos.index');
        Route::post('/pos/checkout',    [POSController::class, 'checkout'])->name('pos.checkout');
        Route::get('/pos/struk/{transaksi}', [POSController::class, 'struk'])->name('pos.struk');
        Route::get('/pos/riwayat',      [POSController::class, 'riwayat'])->name('pos.riwayat');
        Route::post('/pos/estimasi-hpp', [POSController::class, 'estimasiHPP'])->name('pos.estimasi-hpp');
        Route::post('/pos/open-bill',                  [POSController::class, 'storeOpenBill']) ->name('pos.open-bill.store');
        Route::put('/pos/open-bill/{openBill}',        [POSController::class, 'updateOpenBill'])->name('pos.open-bill.update');
        Route::delete('/pos/open-bill/{openBill}',     [POSController::class, 'deleteOpenBill'])->name('pos.open-bill.destroy');

        // Non-Sales (jatah karyawan, rusak, dll.)
        Route::get('/non-sales',             [NonSalesController::class, 'index'] )->name('non-sales.index');
        Route::get('/non-sales/catat',       [NonSalesController::class, 'create'])->name('non-sales.create');
        Route::post('/non-sales',            [NonSalesController::class, 'store'] )->name('non-sales.store');
        Route::get('/non-sales/{nonSales}',  [NonSalesController::class, 'show']  )->name('non-sales.show');
    });

    // ========================================================================
    // OWNER ONLY — Semua fitur manajemen
    // ========================================================================
    Route::middleware('owner')->group(function () {

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // ── Master Data ─────────────────────────────────────────────────────
        Route::resource('bahan-baku', BahanBakuController::class);
        Route::resource('produk',     ProdukController::class);
        Route::resource('supplier',   SupplierController::class)->except(['destroy']);
        Route::resource('promo',      PromoController::class);

        // ── Pembelian ────────────────────────────────────────────────────────
        Route::get('/pembelian',               [PembelianController::class, 'index']  )->name('pembelian.index');
        Route::get('/pembelian/buat',          [PembelianController::class, 'create'] )->name('pembelian.create');
        Route::post('/pembelian',              [PembelianController::class, 'store']  )->name('pembelian.store');
        Route::get('/pembelian/{pembelian}',   [PembelianController::class, 'show']   )->name('pembelian.show');
        Route::delete('/pembelian/{pembelian}',[PembelianController::class, 'destroy'])->name('pembelian.destroy');
        Route::delete('/pembelian/{pembelian}/item/{detailPembelian}', [PembelianController::class, 'destroyItem'])->name('pembelian.destroy-item');

        // ── Keuangan ─────────────────────────────────────────────────────────
        Route::get('/pengeluaran',        [PengeluaranController::class, 'index'] )->name('pengeluaran.index');
        Route::get('/pengeluaran/catat',  [PengeluaranController::class, 'create'])->name('pengeluaran.create');
        Route::post('/pengeluaran',       [PengeluaranController::class, 'store'] )->name('pengeluaran.store');

        Route::get('/piutang',                         [PiutangController::class, 'index'])->name('piutang.index');
        Route::post('/piutang/{piutang}/bayar',        [PiutangController::class, 'bayar'])->name('piutang.bayar');

        Route::get('/hutang',                          [HutangController::class, 'index'])->name('hutang.index');
        Route::post('/hutang/{hutang}/bayar',          [HutangController::class, 'bayar'])->name('hutang.bayar');
        Route::post('/hutang/{hutang}/tutup-retur',    [HutangController::class, 'tutupRetur'])->name('hutang.tutup-retur');

        // ── Stock Opname ──────────────────────────────────────────────────────
        Route::get('/stock-opname',                      [StockOpnameController::class, 'index'] )->name('stock-opname.index');
        Route::get('/stock-opname/catat',                [StockOpnameController::class, 'create'])->name('stock-opname.create');
        Route::post('/stock-opname',                     [StockOpnameController::class, 'store'] )->name('stock-opname.store');
        Route::get('/stock-opname/{stockOpname}',        [StockOpnameController::class, 'show']  )->name('stock-opname.show');

        // ── Laporan ───────────────────────────────────────────────────────────
        Route::prefix('laporan')->name('laporan.')->group(function () {
            Route::get('/penjualan',       [LaporanController::class, 'penjualan']     )->name('penjualan');
            Route::get('/keuntungan',      [LaporanController::class, 'keuntungan']    )->name('keuntungan');
            Route::get('/stok',            [LaporanController::class, 'stok']          )->name('stok');
            Route::get('/operasional',     [LaporanController::class, 'operasional']   )->name('operasional');
            Route::get('/produk-terlaris', [LaporanController::class, 'produkTerlaris'])->name('produk-terlaris');
            Route::get('/piutang',         [LaporanController::class, 'piutang']       )->name('piutang');
            Route::get('/hutang',          [LaporanController::class, 'hutang']        )->name('hutang');
        });

        // ── Pengaturan ────────────────────────────────────────────────────────
        Route::get('/pengaturan',  [PengaturanController::class, 'index'] )->name('pengaturan.index');
        Route::post('/pengaturan', [PengaturanController::class, 'update'])->name('pengaturan.update');
    });
});
