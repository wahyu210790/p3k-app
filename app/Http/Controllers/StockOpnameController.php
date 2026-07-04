<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\StockOpname;
use App\Models\DetailStockOpname;
use App\Services\InventoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class StockOpnameController extends Controller
{
    public function __construct(
        private readonly InventoryService $inventoryService
    ) {}

    public function index(): Response
    {
        $opname = StockOpname::with('user:id,name')
            ->withCount('detailStockOpname')
            ->latest('tanggal')
            ->paginate(15);

        return Inertia::render('StockOpname/Index', [
            'opname' => $opname,
        ]);
    }

    public function create(): Response
    {
        // Tampilkan semua bahan baku aktif dengan stok sistem saat ini
        $bahanBaku = BahanBaku::where('is_active', true)
            ->get()
            ->map(fn($b) => [
                'id'            => $b->id,
                'nama'          => $b->nama,
                'satuan'        => $b->satuan,
                'stok_sistem'   => (float) $b->stok_saat_ini,
                'hpp_rata_rata' => $this->inventoryService->getHppRataRata($b->id),
                'stok_fisik'    => null, // diisi oleh user
            ]);

        return Inertia::render('StockOpname/Create', [
            'bahan_baku' => $bahanBaku,
            'tanggal'    => now()->toDateString(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tanggal'                   => 'required|date',
            'catatan'                   => 'nullable|string|max:500',
            'items'                     => 'required|array|min:1',
            'items.*.bahan_baku_id'     => 'required|exists:bahan_baku,id',
            'items.*.stok_sistem'       => 'required|numeric|min:0',
            'items.*.stok_fisik'        => 'required|numeric|min:0',
            'items.*.keterangan'        => 'nullable|string|max:255',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $opname = StockOpname::create([
                    'user_id' => auth()->id(),
                    'tanggal' => $validated['tanggal'],
                    'catatan' => $validated['catatan'] ?? null,
                ]);

                foreach ($validated['items'] as $item) {
                    $selisih = $item['stok_fisik'] - $item['stok_sistem'];

                    DetailStockOpname::create([
                        'stock_opname_id' => $opname->id,
                        'bahan_baku_id'   => $item['bahan_baku_id'],
                        'stok_sistem'     => $item['stok_sistem'],
                        'stok_fisik'      => $item['stok_fisik'],
                        'selisih'         => $selisih,
                        'keterangan'      => $item['keterangan'] ?? null,
                    ]);

                    // Adjust stok berdasarkan selisih
                    if ($selisih != 0) {
                        $this->inventoryService->adjustStokOpname($item['bahan_baku_id'], $selisih);
                    }
                }
            });

            return redirect()->route('stock-opname.index')
                ->with('success', 'Stock opname berhasil disimpan dan stok telah disesuaikan.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => $e->getMessage()])->withInput();
        }
    }

    public function show(StockOpname $stockOpname): Response
    {
        return Inertia::render('StockOpname/Show', [
            'opname' => $stockOpname->load(
                'user:id,name',
                'detailStockOpname.bahanBaku:id,nama,satuan'
            ),
        ]);
    }
}
