<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\DetailResep;
use App\Models\OpenBill;
use App\Models\Produk;
use App\Services\InventoryService;
use App\Services\RecipeService;
use App\Services\TransactionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class POSController extends Controller
{
    public function __construct(
        private readonly TransactionService $transactionService,
        private readonly RecipeService      $recipeService
    ) {}

    /**
     * Halaman utama POS — tampilkan semua produk aktif beserta info stok.
     */
    public function index(): Response
    {
        $produk = Produk::where('is_active', true)
            ->with([
                'detailResep.bahanBaku:id,nama,satuan,stok_saat_ini',
                'detailPromo.promo',
            ])
            ->get()
            ->map(function ($p) {
                $promoAktif = $p->getHargaPromoAktif();
                $maxQty     = $p->has_resep
                    ? $this->recipeService->getMaxQty($p->id)
                    : 9999;

                return [
                    'id'          => $p->id,
                    'nama'        => $p->nama,
                    'kategori'    => $p->kategori,
                    'foto_url'    => $p->foto_url,
                    'harga_jual'  => (float) $p->harga_jual,
                    'harga_promo' => $promoAktif,
                    'max_qty'     => $maxQty,
                    'has_resep'   => $p->has_resep,
                ];
            })
            ->groupBy('kategori');

        return Inertia::render('POS/Index', [
            'produk_per_kategori' => $produk,
            'open_bills'          => OpenBill::with('user:id,name')->latest()->get(),
        ]);
    }

    /**
     * Proses checkout dari POS.
     */
    public function checkout(Request $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'items'                    => 'required|array|min:1',
            'items.*.produk_id'        => 'required|integer|exists:produk,id',
            'items.*.qty'              => 'required|integer|min:1',
            'items.*.promo_id'         => 'nullable|integer|exists:promo,id',
            'metode_pembayaran'        => 'required|in:cash,qris,transfer,piutang',
            'piutang_data.nama_pelanggan' => 'required_if:metode_pembayaran,piutang|string|max:100',
            'piutang_data.nomor_wa'    => 'nullable|string|max:20',
            'catatan'                  => 'nullable|string|max:255',
            'open_bill_id'             => 'nullable|integer|exists:open_bills,id',
        ]);

        try {
            $hasil = $this->transactionService->prosesPenjualan(
                userId:           auth()->id(),
                items:            $validated['items'],
                metodePembayaran: $validated['metode_pembayaran'],
                piutangData:      $validated['piutang_data'] ?? [],
                catatan:          $validated['catatan'] ?? null
            );

            if (!empty($validated['open_bill_id'])) {
                OpenBill::where('id', $validated['open_bill_id'])->delete();
            }

            return redirect()->route('pos.struk', $hasil['transaksi']->id)
                ->with('success', 'Transaksi berhasil! No: ' . $hasil['transaksi']->nomor_transaksi);
        } catch (\Exception $e) {
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }

    /**
     * Struk transaksi — ditampilkan setelah checkout berhasil.
     */
    public function struk(\App\Models\Transaksi $transaksi): Response
    {
        $nama_usaha  = \App\Models\Pengaturan::get('nama_usaha', 'WARMINDO P3K');
        $footer_struk = \App\Models\Pengaturan::get('footer_struk', 'Terima kasih!');

        return Inertia::render('POS/Struk', [
            'transaksi'   => $transaksi->load('detailTransaksi.produk', 'user:id,name'),
            'nama_usaha'  => $nama_usaha,
            'footer_struk' => $footer_struk,
        ]);
    }

    /**
     * Riwayat transaksi hari ini (untuk Kasir).
     */
    public function riwayat(Request $request): Response
    {
        $tanggal = $request->get('tanggal', now()->toDateString());

        $transaksi = \App\Models\Transaksi::with('user:id,name', 'detailTransaksi.produk:id,nama')
            ->whereDate('tanggal_transaksi', $tanggal)
            ->when(auth()->user()->isKasir(), fn($q) => $q->where('user_id', auth()->id()))
            ->latest()
            ->paginate(20);

        return Inertia::render('POS/Riwayat', [
            'transaksi' => $transaksi,
            'tanggal'   => $tanggal,
        ]);
    }

    /**
     * API: estimasi HPP item keranjang (digunakan POS React real-time).
     */
    public function estimasiHPP(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items'             => 'required|array',
            'items.*.produk_id' => 'required|integer|exists:produk,id',
            'items.*.qty'       => 'required|integer|min:1',
        ]);

        $hasil = [];
        foreach ($validated['items'] as $item) {
            $hpp = $this->recipeService->hitungEstimasiHPP($item['produk_id'], $item['qty']);
            $hasil[] = [
                'produk_id' => $item['produk_id'],
                'qty'       => $item['qty'],
                'hpp'       => $hpp,
            ];
        }

        return response()->json(['items' => $hasil]);
    }

    /**
     * Simpan pesanan ke meja aktif (Open Bill).
     */
    public function storeOpenBill(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_meja'      => 'required|string|max:100',
            'keranjang'      => 'required|array|min:1',
            'catatan'        => 'nullable|string|max:500',
            'total_estimasi' => 'required|numeric|min:0',
        ]);

        OpenBill::create([
            'nama_meja'      => $validated['nama_meja'],
            'keranjang'      => $validated['keranjang'],
            'catatan'        => $validated['catatan'] ?? null,
            'total_estimasi' => $validated['total_estimasi'],
            'user_id'        => auth()->id(),
        ]);

        return redirect()->route('pos.index')->with('success', "Pesanan meja '{$validated['nama_meja']}' berhasil disimpan!");
    }

    /**
     * Update pesanan di meja aktif (Open Bill).
     */
    public function updateOpenBill(Request $request, OpenBill $openBill): RedirectResponse
    {
        $validated = $request->validate([
            'nama_meja'      => 'required|string|max:100',
            'keranjang'      => 'required|array|min:1',
            'catatan'        => 'nullable|string|max:500',
            'total_estimasi' => 'required|numeric|min:0',
        ]);

        $openBill->update([
            'nama_meja'      => $validated['nama_meja'],
            'keranjang'      => $validated['keranjang'],
            'catatan'        => $validated['catatan'] ?? null,
            'total_estimasi' => $validated['total_estimasi'],
            'user_id'        => auth()->id(),
        ]);

        return redirect()->route('pos.index')->with('success', "Pesanan meja '{$validated['nama_meja']}' berhasil diperbarui!");
    }

    /**
     * Hapus meja aktif (Batal pesanan).
     */
    public function deleteOpenBill(OpenBill $openBill): RedirectResponse
    {
        $nama = $openBill->nama_meja;
        $openBill->delete();

        return redirect()->route('pos.index')->with('success', "Meja '{$nama}' berhasil dihapus / dibatalkan.");
    }
}
