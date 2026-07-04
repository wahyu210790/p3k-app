<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\NonSales;
use App\Models\DetailNonSales;
use App\Models\Produk;
use App\Services\InventoryService;
use App\Services\RecipeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class NonSalesController extends Controller
{
    public function __construct(
        private readonly InventoryService $inventoryService,
        private readonly RecipeService    $recipeService
    ) {}

    public function index(Request $request): Response
    {
        $nonSales = NonSales::with('user:id,name')
            ->when($request->get('dari'), fn($q, $v) => $q->whereDate('tanggal', '>=', $v))
            ->when($request->get('sampai'), fn($q, $v) => $q->whereDate('tanggal', '<=', $v))
            ->when($request->get('kategori'), fn($q, $v) => $q->where('kategori', $v))
            ->latest('tanggal')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('NonSales/Index', [
            'non_sales'        => $nonSales,
            'label_kategori'   => NonSales::labelKategori(),
            'filters'          => $request->only(['dari', 'sampai', 'kategori']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('NonSales/Create', [
            'label_kategori' => NonSales::labelKategori(),
            'produk'         => Produk::where('is_active', true)
                ->where('has_resep', true)
                ->get(['id', 'nama', 'kategori']),
            'bahan_baku'     => BahanBaku::where('is_active', true)
                ->get(['id', 'nama', 'satuan', 'stok_saat_ini']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kategori'                  => 'required|string',
            'tanggal'                   => 'required|date',
            'catatan'                   => 'nullable|string|max:500',
            'items'                     => 'required|array|min:1',
            'items.*.tipe'              => 'required|in:produk,bahan_baku',
            'items.*.produk_id'         => 'nullable|exists:produk,id',
            'items.*.bahan_baku_id'     => 'nullable|exists:bahan_baku,id',
            'items.*.jumlah'            => 'required|numeric|min:0.001',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                $totalHPP = 0;
                $detailItems = [];

                foreach ($validated['items'] as $item) {
                    if ($item['tipe'] === 'produk') {
                        // Kurangi stok via resep + FIFO
                        $hasil     = $this->recipeService->gunakanResep($item['produk_id'], (int) $item['jumlah']);
                        $totalHPP += $hasil['total_hpp'];

                        $detailItems[] = [
                            'produk_id'    => $item['produk_id'],
                            'bahan_baku_id' => null,
                            'jumlah'       => $item['jumlah'],
                            'hpp_satuan'   => $hasil['hpp_satuan'],
                            'subtotal_hpp' => $hasil['total_hpp'],
                        ];
                    } else {
                        // Kurangi stok bahan baku langsung via FIFO
                        $hasil     = $this->inventoryService->consumeStock($item['bahan_baku_id'], $item['jumlah']);
                        $totalHPP += $hasil['total_hpp'];

                        $detailItems[] = [
                            'produk_id'    => null,
                            'bahan_baku_id' => $item['bahan_baku_id'],
                            'jumlah'       => $item['jumlah'],
                            'hpp_satuan'   => $hasil['hpp_satuan'],
                            'subtotal_hpp' => $hasil['total_hpp'],
                        ];
                    }
                }

                $nonSales = NonSales::create([
                    'user_id'   => auth()->id(),
                    'kategori'  => $validated['kategori'],
                    'total_hpp' => round($totalHPP, 2),
                    'catatan'   => $validated['catatan'] ?? null,
                    'tanggal'   => $validated['tanggal'],
                ]);

                foreach ($detailItems as $detail) {
                    $nonSales->detailNonSales()->create($detail);
                }
            });

            return redirect()->route('non-sales.index')
                ->with('success', 'Catatan non-sales berhasil disimpan.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => $e->getMessage()])->withInput();
        }
    }

    public function show(NonSales $nonSales): Response
    {
        return Inertia::render('NonSales/Show', [
            'non_sales' => $nonSales->load(
                'user:id,name',
                'detailNonSales.produk:id,nama',
                'detailNonSales.bahanBaku:id,nama,satuan'
            ),
            'label_kategori' => NonSales::labelKategori(),
        ]);
    }
}
