<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\FifoBatch;
use App\Services\InventoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BahanBakuController extends Controller
{
    public function __construct(
        private readonly InventoryService $inventoryService
    ) {}

    public function index(Request $request): Response
    {
        $bahanBaku = BahanBaku::when($request->get('kategori') === 'rendah', fn($q) =>
                $q->whereColumn('stok_saat_ini', '<=', 'stok_minimum')
            )
            ->when($request->get('search'), fn($q, $s) =>
                $q->where('nama', 'like', "%{$s}%")
            )
            ->when(!$request->get('semua'), fn($q) => $q->where('is_active', true))
            ->get()
            ->map(fn($b) => [
                'id'             => $b->id,
                'nama'           => $b->nama,
                'satuan'         => $b->satuan,
                'stok_saat_ini'  => (float) $b->stok_saat_ini,
                'stok_minimum'   => (float) $b->stok_minimum,
                'is_rokok'       => $b->is_rokok,
                'isi_per_bungkus' => $b->isi_per_bungkus,
                'is_active'      => $b->is_active,
                'is_stok_rendah' => $b->isStokRendah(),
                'nilai_stok'     => $this->inventoryService->getNilaiStok($b->id),
                'hpp_rata_rata'  => $this->inventoryService->getHppRataRata($b->id),
            ]);

        return Inertia::render('BahanBaku/Index', [
            'bahan_baku'    => $bahanBaku,
            'total_nilai'   => $this->inventoryService->getTotalNilaiStok(),
            'filters'       => $request->only(['kategori', 'search', 'semua']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('BahanBaku/Form', [
            'satuan_options' => ['pcs', 'butir', 'gram', 'kg', 'ml', 'liter', 'batang', 'botol', 'bungkus'],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama'           => 'required|string|max:100|unique:bahan_baku,nama',
            'satuan'         => 'required|string',
            'stok_minimum'   => 'required|numeric|min:0',
            'is_rokok'       => 'boolean',
            'isi_per_bungkus' => 'nullable|integer|min:1',
        ]);

        BahanBaku::create(array_merge($validated, ['stok_saat_ini' => 0]));

        return redirect()->route('bahan-baku.index')
            ->with('success', "Bahan baku '{$validated['nama']}' berhasil ditambahkan.");
    }

    public function edit(BahanBaku $bahanBaku): Response
    {
        return Inertia::render('BahanBaku/Form', [
            'bahan_baku'     => $bahanBaku,
            'satuan_options' => ['pcs', 'butir', 'gram', 'kg', 'ml', 'liter', 'batang', 'botol', 'bungkus'],
            'batches'        => FifoBatch::where('bahan_baku_id', $bahanBaku->id)
                ->where('jumlah_sisa', '>', 0)
                ->orderBy('tanggal_masuk')
                ->get(['id', 'harga_beli', 'jumlah_awal', 'jumlah_sisa', 'tanggal_masuk']),
        ]);
    }

    public function update(Request $request, BahanBaku $bahanBaku): RedirectResponse
    {
        $validated = $request->validate([
            'nama'           => 'required|string|max:100|unique:bahan_baku,nama,' . $bahanBaku->id,
            'satuan'         => 'required|string',
            'stok_minimum'   => 'required|numeric|min:0',
            'is_rokok'       => 'boolean',
            'isi_per_bungkus' => 'nullable|integer|min:1',
            'is_active'      => 'boolean',
        ]);

        $bahanBaku->update($validated);

        return redirect()->route('bahan-baku.index')
            ->with('success', "Bahan baku '{$bahanBaku->nama}' berhasil diperbarui.");
    }

    public function destroy(BahanBaku $bahanBaku): RedirectResponse
    {
        // Soft-disable, bukan hapus permanen (ada relasi ke FIFO batch)
        $bahanBaku->update(['is_active' => false]);

        return redirect()->route('bahan-baku.index')
            ->with('success', "Bahan baku '{$bahanBaku->nama}' dinonaktifkan.");
    }
}
