<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\FifoBatch;
use App\Models\Supplier;
use App\Services\InventoryService;
use App\Services\TransactionService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class PembelianController extends Controller
{
    public function __construct(
        private readonly TransactionService $transactionService,
        private readonly InventoryService   $inventoryService
    ) {}

    public function index(Request $request): Response
    {
        $pembelian = \App\Models\Pembelian::with('supplier:id,nama', 'user:id,name')
            ->when($request->get('supplier_id'), fn($q, $v) => $q->where('supplier_id', $v))
            ->when($request->get('status'), fn($q, $v) => $q->where('status_pembayaran', $v))
            ->when($request->get('dari'), fn($q, $v) => $q->whereDate('tanggal_pembelian', '>=', $v))
            ->when($request->get('sampai'), fn($q, $v) => $q->whereDate('tanggal_pembelian', '<=', $v))
            ->when($request->get('search'), function ($q, $s) {
                $q->where(function ($query) use ($s) {
                    $query->where('nomor_faktur', 'like', "%{$s}%")
                          ->orWhereHas('detailPembelian.bahanBaku', function ($qBahan) use ($s) {
                              $qBahan->where('nama', 'like', "%{$s}%")
                                     ->orWhere('sku', 'like', "%{$s}%");
                          });
                });
            })
            ->latest('tanggal_pembelian')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Pembelian/Index', [
            'pembelian' => $pembelian,
            'suppliers' => Supplier::where('is_active', true)->get(['id', 'nama']),
            'filters'   => $request->only(['supplier_id', 'status', 'dari', 'sampai', 'search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Pembelian/Create', [
            'suppliers'   => Supplier::where('is_active', true)->get(['id', 'nama', 'telepon']),
            'bahan_baku'  => BahanBaku::where('is_active', true)->get(['id', 'nama', 'satuan', 'stok_saat_ini']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'supplier_id'            => 'nullable|exists:supplier,id',
            'nomor_faktur'           => 'nullable|string|max:50',
            'tanggal_pembelian'      => 'required|date',
            'jumlah_bayar'           => 'required|numeric|min:0',
            'catatan'                => 'nullable|string|max:500',
            'items'                  => 'required|array|min:1',
            'items.*.bahan_baku_id'  => 'required|exists:bahan_baku,id',
            'items.*.jumlah'         => 'required|numeric|min:0.001',
            'items.*.harga_satuan'   => 'required|numeric|min:1',
        ]);

        try {
            $pembelian = $this->transactionService->prosesPembelian(auth()->id(), $validated);
            return redirect()->route('pembelian.show', $pembelian->id)
                ->with('success', 'Pembelian berhasil dicatat.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => $e->getMessage()])->withInput();
        }
    }

    public function show(\App\Models\Pembelian $pembelian): Response
    {
        return Inertia::render('Pembelian/Show', [
            'pembelian' => $pembelian->load(
                'supplier', 'user:id,name',
                'detailPembelian.bahanBaku',
                'hutangSupplier'
            ),
        ]);
    }

    public function destroy(\App\Models\Pembelian $pembelian): RedirectResponse
    {
        // Cek proteksi FIFO: pastikan tidak ada batch yang sudah dikonsumsi
        $batches = FifoBatch::where('pembelian_id', $pembelian->id)->get();

        foreach ($batches as $batch) {
            if ((float) $batch->jumlah_sisa < (float) $batch->jumlah_awal) {
                $sudahTerpakai = (float) $batch->jumlah_awal - (float) $batch->jumlah_sisa;
                $namaBahan = optional($batch->bahanBaku)->nama ?? 'bahan baku';
                return back()->withErrors([
                    'message' => "Tidak dapat menghapus. Stok dari pembelian ini sudah terpakai: "
                        . "{$namaBahan} sebanyak {$sudahTerpakai} sudah dikonsumsi untuk penjualan.",
                ]);
            }
        }

        try {
            DB::transaction(function () use ($pembelian, $batches) {
                // 1. Rollback stok bahan baku & hapus batch FIFO
                foreach ($batches as $batch) {
                    $bahanBaku = BahanBaku::find($batch->bahan_baku_id);
                    if ($bahanBaku) {
                        $bahanBaku->decrement('stok_saat_ini', (float) $batch->jumlah_awal);
                    }
                    $batch->delete();
                }

                // 2. Hapus hutang supplier terkait (jika ada)
                if ($pembelian->hutangSupplier) {
                    $pembelian->hutangSupplier->delete();
                }

                // 3. Hapus detail pembelian
                $pembelian->detailPembelian()->delete();

                // 4. Hapus header pembelian
                $pembelian->delete();
            });

            return redirect()->route('pembelian.index')
                ->with('success', 'Pembelian berhasil dihapus dan stok telah dikembalikan.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Gagal menghapus: ' . $e->getMessage()]);
        }
    }
}
