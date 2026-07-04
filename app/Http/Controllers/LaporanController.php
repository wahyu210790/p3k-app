<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\DetailPembelian;
use App\Models\DetailTransaksi;
use App\Models\PengeluaranOperasional;
use App\Models\PiutangPelanggan;
use App\Models\HutangSupplier;
use App\Models\Transaksi;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LaporanController extends Controller
{
    public function __construct(
        private readonly InventoryService $inventoryService
    ) {}

    /** Laporan penjualan harian / periode */
    public function penjualan(Request $request): Response
    {
        $dari   = $request->get('dari', now()->startOfMonth()->toDateString());
        $sampai = $request->get('sampai', now()->toDateString());

        $transaksi = Transaksi::with('user:id,name', 'detailTransaksi.produk:id,nama')
            ->whereDate('tanggal_transaksi', '>=', $dari)
            ->whereDate('tanggal_transaksi', '<=', $sampai)
            ->latest('tanggal_transaksi')
            ->paginate(30)
            ->withQueryString();

        $ringkasan = Transaksi::whereDate('tanggal_transaksi', '>=', $dari)
            ->whereDate('tanggal_transaksi', '<=', $sampai)
            ->selectRaw('
                COUNT(*) as jumlah_transaksi,
                SUM(total_harga_jual) as total_omset,
                SUM(total_hpp) as total_hpp,
                SUM(total_dana_modal) as total_modal,
                SUM(total_dana_operasional) as total_operasional,
                SUM(total_keuntungan) as total_keuntungan
            ')
            ->first();

        return Inertia::render('Laporan/Penjualan', [
            'transaksi' => $transaksi,
            'ringkasan' => $ringkasan,
            'dari'      => $dari,
            'sampai'    => $sampai,
        ]);
    }

    /** Laporan keuntungan (laba rugi ringkas) */
    public function keuntungan(Request $request): Response
    {
        $dari   = $request->get('dari', now()->startOfMonth()->toDateString());
        $sampai = $request->get('sampai', now()->toDateString());

        // Keuntungan dari penjualan
        $penjualan = Transaksi::whereDate('tanggal_transaksi', '>=', $dari)
            ->whereDate('tanggal_transaksi', '<=', $sampai)
            ->selectRaw('
                DATE(tanggal_transaksi) as tanggal,
                SUM(total_harga_jual) as omset,
                SUM(total_hpp) as hpp,
                SUM(total_dana_operasional) as operasional,
                SUM(total_keuntungan) as keuntungan
            ')
            ->groupByRaw('DATE(tanggal_transaksi)')
            ->orderByRaw('DATE(tanggal_transaksi)')
            ->get();

        // Pengeluaran operasional pada periode yang sama
        $pengeluaran = PengeluaranOperasional::whereDate('tanggal', '>=', $dari)
            ->whereDate('tanggal', '<=', $sampai)
            ->sum('jumlah');

        // Pembelian bahan baku NON-PRODUK per hari (dianggap sebagai pengeluaran operasional)
        $pembelianNonProdukRaw = DetailPembelian::join('bahan_baku', 'detail_pembelian.bahan_baku_id', '=', 'bahan_baku.id')
            ->join('pembelian', 'detail_pembelian.pembelian_id', '=', 'pembelian.id')
            ->where('bahan_baku.jenis', 'non_produk')
            ->whereDate('pembelian.tanggal_pembelian', '>=', $dari)
            ->whereDate('pembelian.tanggal_pembelian', '<=', $sampai)
            ->selectRaw('DATE(pembelian.tanggal_pembelian) as tanggal, SUM(detail_pembelian.subtotal) as total_non_produk')
            ->groupByRaw('DATE(pembelian.tanggal_pembelian)')
            ->pluck('total_non_produk', 'tanggal');

        // Gabungkan data harian penjualan dengan pembelian non-produk
        $dataHarian = $penjualan->map(fn($d) => array_merge((array) $d, [
            'pembelian_non_produk' => (float) ($pembelianNonProdukRaw[$d->tanggal] ?? 0),
        ]));

        // Tambah hari-hari yang hanya ada pembelian non-produk (tanpa penjualan)
        foreach ($pembelianNonProdukRaw as $tanggal => $total) {
            if (!$penjualan->contains('tanggal', $tanggal)) {
                $dataHarian->push([
                    'tanggal'              => $tanggal,
                    'omset'                => 0,
                    'hpp'                  => 0,
                    'operasional'          => 0,
                    'keuntungan'           => 0,
                    'pembelian_non_produk' => (float) $total,
                ]);
            }
        }
        $dataHarian = $dataHarian->sortBy('tanggal')->values();

        $totalPembelianNonProduk = $pembelianNonProdukRaw->sum();

        // Total keuntungan bersih (setelah dikurangi pengeluaran operasional + pembelian non-produk)
        $totalKeuntunganKotor  = $penjualan->sum('keuntungan');
        $totalOperasionalMasuk = $penjualan->sum('operasional');
        $labaKotor             = $totalKeuntunganKotor + $totalOperasionalMasuk - $pengeluaran - $totalPembelianNonProduk;

        return Inertia::render('Laporan/Keuntungan', [
            'data_harian'              => $dataHarian,
            'total_pengeluaran'        => (float) $pengeluaran,
            'total_pembelian_non_produk' => (float) $totalPembelianNonProduk,
            'laba_kotor'               => $labaKotor,
            'dari'                     => $dari,
            'sampai'                   => $sampai,
        ]);
    }

    /** Laporan stok bahan baku + nilai HPP */
    public function stok(Request $request): Response
    {
        $bahanBaku = BahanBaku::where('is_active', true)
            ->get()
            ->map(fn($b) => [
                'id'            => $b->id,
                'nama'          => $b->nama,
                'satuan'        => $b->satuan,
                'stok_saat_ini' => (float) $b->stok_saat_ini,
                'stok_minimum'  => (float) $b->stok_minimum,
                'hpp_rata_rata' => $this->inventoryService->getHppRataRata($b->id),
                'nilai_stok'    => $this->inventoryService->getNilaiStok($b->id),
                'is_rendah'     => $b->isStokRendah(),
            ]);

        return Inertia::render('Laporan/Stok', [
            'bahan_baku'   => $bahanBaku,
            'total_nilai'  => $bahanBaku->sum('nilai_stok'),
            'jumlah_rendah' => $bahanBaku->where('is_rendah', true)->count(),
        ]);
    }

    /** Laporan pengeluaran operasional per kategori */
    public function operasional(Request $request): Response
    {
        $dari   = $request->get('dari', now()->startOfMonth()->toDateString());
        $sampai = $request->get('sampai', now()->toDateString());

        $perKategori = PengeluaranOperasional::whereDate('tanggal', '>=', $dari)
            ->whereDate('tanggal', '<=', $sampai)
            ->selectRaw('kategori, SUM(jumlah) as total, COUNT(*) as jumlah_transaksi')
            ->groupBy('kategori')
            ->get();

        $detail = PengeluaranOperasional::with('user:id,name')
            ->whereDate('tanggal', '>=', $dari)
            ->whereDate('tanggal', '<=', $sampai)
            ->latest('tanggal')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Laporan/Operasional', [
            'per_kategori'   => $perKategori,
            'detail'         => $detail,
            'label_kategori' => PengeluaranOperasional::labelKategori(),
            'dari'           => $dari,
            'sampai'         => $sampai,
        ]);
    }

    /** Laporan produk terlaris */
    public function produkTerlaris(Request $request): Response
    {
        $dari   = $request->get('dari', now()->startOfMonth()->toDateString());
        $sampai = $request->get('sampai', now()->toDateString());
        $limit  = (int) $request->get('limit', 10);

        $produkTerlaris = DetailTransaksi::with('produk:id,nama,kategori')
            ->whereHas('transaksi', fn($q) =>
                $q->whereDate('tanggal_transaksi', '>=', $dari)
                  ->whereDate('tanggal_transaksi', '<=', $sampai)
            )
            ->selectRaw('produk_id, SUM(jumlah) as total_terjual, SUM(subtotal_harga_jual) as total_omset, SUM(subtotal_keuntungan) as total_keuntungan')
            ->groupBy('produk_id')
            ->orderByDesc('total_terjual')
            ->limit($limit)
            ->get();

        return Inertia::render('Laporan/ProdukTerlaris', [
            'produk_terlaris' => $produkTerlaris,
            'dari'            => $dari,
            'sampai'          => $sampai,
        ]);
    }

    /** Laporan piutang pelanggan */
    public function piutang(Request $request): Response
    {
        $piutang = PiutangPelanggan::with('transaksi:id,nomor_transaksi')
            ->when($request->get('status', 'belum_lunas'), fn($q, $v) => $q->where('status', $v))
            ->latest('tanggal_piutang')
            ->paginate(20)
            ->withQueryString();

        $totalBelumLunas = PiutangPelanggan::where('status', 'belum_lunas')->sum('sisa_piutang');

        return Inertia::render('Laporan/Piutang', [
            'piutang'          => $piutang,
            'total_belum_lunas' => (float) $totalBelumLunas,
            'filters'          => $request->only(['status']),
        ]);
    }

    /** Laporan hutang supplier */
    public function hutang(Request $request): Response
    {
        $hutang = HutangSupplier::with('supplier:id,nama', 'pembelian:id,nomor_faktur')
            ->when($request->get('status', 'belum_lunas'), fn($q, $v) => $q->where('status', $v))
            ->latest('tanggal_hutang')
            ->paginate(20)
            ->withQueryString();

        $totalBelumLunas = HutangSupplier::where('status', 'belum_lunas')->sum('sisa_hutang');

        return Inertia::render('Laporan/Hutang', [
            'hutang'           => $hutang,
            'total_belum_lunas' => (float) $totalBelumLunas,
            'filters'          => $request->only(['status']),
        ]);
    }
}
