<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\DetailResep;
use App\Models\Produk;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProdukController extends Controller
{
    public function index(Request $request): Response
    {
        $produk = Produk::with('detailResep')
            ->when($request->get('kategori'), fn($q, $v) => $q->where('kategori', $v))
            ->when($request->get('search'), fn($q, $s) => $q->where('nama', 'like', "%{$s}%"))
            ->when(!$request->get('semua'), fn($q) => $q->where('is_active', true))
            ->get()
            ->map(fn($p) => [
                'id'          => $p->id,
                'nama'        => $p->nama,
                'kategori'    => $p->kategori,
                'foto_url'    => $p->foto_url,
                'harga_jual'  => (float) $p->harga_jual,
                'has_resep'   => $p->has_resep,
                'is_active'   => $p->is_active,
                'jumlah_bahan' => $p->detailResep->count(),
            ]);

        return Inertia::render('Produk/Index', [
            'produk'  => $produk,
            'filters' => $request->only(['kategori', 'search', 'semua']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Produk/Form', [
            'bahan_baku'      => BahanBaku::where('is_active', true)->get(['id', 'nama', 'satuan']),
            'kategori_options' => ['Makanan', 'Minuman', 'Rokok', 'Lainnya'],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama'         => 'required|string|max:100',
            'kategori'     => 'required|in:Makanan,Minuman,Rokok,Lainnya',
            'harga_jual'   => 'required|numeric|min:1',
            'has_resep'    => 'boolean',
            'foto'         => 'nullable|image|max:2048',
            'resep'        => 'nullable|array',
            'resep.*.bahan_baku_id' => 'required|exists:bahan_baku,id',
            'resep.*.jumlah'        => 'required|numeric|min:0.001',
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('produk', 'public');
        }

        $produk = Produk::create([
            'nama'       => $validated['nama'],
            'kategori'   => $validated['kategori'],
            'harga_jual' => $validated['harga_jual'],
            'has_resep'  => $validated['has_resep'] ?? true,
            'foto'       => $fotoPath,
        ]);

        // Simpan resep jika ada
        if (!empty($validated['resep'])) {
            foreach ($validated['resep'] as $r) {
                DetailResep::create([
                    'produk_id'     => $produk->id,
                    'bahan_baku_id' => $r['bahan_baku_id'],
                    'jumlah'        => $r['jumlah'],
                ]);
            }
        }

        return redirect()->route('produk.index')
            ->with('success', "Produk '{$produk->nama}' berhasil ditambahkan.");
    }

    public function edit(Produk $produk): Response
    {
        return Inertia::render('Produk/Form', [
            'produk'          => $produk->load('detailResep.bahanBaku'),
            'bahan_baku'      => BahanBaku::where('is_active', true)->get(['id', 'nama', 'satuan']),
            'kategori_options' => ['Makanan', 'Minuman', 'Rokok', 'Lainnya'],
        ]);
    }

    public function update(Request $request, Produk $produk): RedirectResponse
    {
        $validated = $request->validate([
            'nama'       => 'required|string|max:100',
            'kategori'   => 'required|in:Makanan,Minuman,Rokok,Lainnya',
            'harga_jual' => 'required|numeric|min:1',
            'has_resep'  => 'boolean',
            'is_active'  => 'boolean',
            'foto'       => 'nullable|image|max:2048',
            'resep'      => 'nullable|array',
            'resep.*.bahan_baku_id' => 'required|exists:bahan_baku,id',
            'resep.*.jumlah'        => 'required|numeric|min:0.001',
        ]);

        if ($request->hasFile('foto')) {
            if ($produk->foto) Storage::disk('public')->delete($produk->foto);
            $validated['foto'] = $request->file('foto')->store('produk', 'public');
        }

        $produk->update($validated);

        // Replace resep
        if (isset($validated['resep'])) {
            $produk->detailResep()->delete();
            foreach ($validated['resep'] as $r) {
                DetailResep::create([
                    'produk_id'     => $produk->id,
                    'bahan_baku_id' => $r['bahan_baku_id'],
                    'jumlah'        => $r['jumlah'],
                ]);
            }
        }

        return redirect()->route('produk.index')
            ->with('success', "Produk '{$produk->nama}' berhasil diperbarui.");
    }

    public function destroy(Produk $produk): RedirectResponse
    {
        $produk->update(['is_active' => false]);
        return redirect()->route('produk.index')
            ->with('success', "Produk '{$produk->nama}' dinonaktifkan.");
    }
}
