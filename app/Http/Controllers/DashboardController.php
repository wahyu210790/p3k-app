<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\DompetKeuangan;
use App\Models\PiutangPelanggan;
use App\Models\HutangSupplier;
use App\Models\Pengaturan;
use App\Models\Transaksi;
use App\Services\FinancialService;
use App\Services\InventoryService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly FinancialService $financialService,
        private readonly InventoryService $inventoryService
    ) {}

    public function index(): Response
    {
        $today      = now()->toDateString();
        $keuangan   = $this->financialService->getRingkasanKeuangan($today);
        $totalStok  = $this->inventoryService->getTotalNilaiStok();

        // Stok di bawah minimum (alert)
        $stokRendah = BahanBaku::where('is_active', true)
            ->whereColumn('stok_saat_ini', '<=', 'stok_minimum')
            ->get(['id', 'nama', 'satuan', 'stok_saat_ini', 'stok_minimum']);

        // 10 transaksi terakhir hari ini
        $transaksiTerakhir = Transaksi::with('user:id,name')
            ->whereDate('tanggal_transaksi', $today)
            ->latest()
            ->limit(10)
            ->get(['id', 'nomor_transaksi', 'tanggal_transaksi', 'total_harga_jual', 'metode_pembayaran', 'status', 'user_id']);

        // Piutang jatuh tempo (belum lunas > 7 hari)
        $piutangMendesak = PiutangPelanggan::where('status', 'belum_lunas')
            ->where('tanggal_piutang', '<=', now()->subDays(7)->toDateString())
            ->orderBy('tanggal_piutang')
            ->get(['id', 'nama_pelanggan', 'nomor_wa', 'sisa_piutang', 'tanggal_piutang'])
            ->take(5);

        return Inertia::render('Dashboard', [
            'keuangan'         => $keuangan,
            'total_nilai_stok' => $totalStok,
            'stok_rendah'      => $stokRendah,
            'transaksi_hari_ini' => $transaksiTerakhir,
            'piutang_mendesak' => $piutangMendesak,
        ]);
    }
}
