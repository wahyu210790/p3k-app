<?php

namespace App\Http\Controllers;

use App\Models\BahanBaku;
use App\Models\DetailPromo;
use App\Models\Produk;
use App\Models\Promo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PromoController extends Controller
{
    public function index(): Response
    {
        $promo = Promo::with('detailPromo.produk:id,nama')
            ->orderByDesc('tanggal_mulai')
            ->paginate(15);

        return Inertia::render('Promo/Index', [
            'promo' => $promo,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Promo/Form', [
            'produk' => Produk::where('is_active', true)->get(['id', 'nama', 'kategori', 'harga_jual']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama'            => 'required|string|max:100',
            'tipe'            => 'required|in:harga_khusus,diskon_persen,paket_bundling',
            'tanggal_mulai'   => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'keterangan'      => 'nullable|string|max:500',
            'produk'          => 'required|array|min:1',
            'produk.*.produk_id'       => 'required|exists:produk,id',
            'produk.*.harga_promo'     => 'nullable|numeric|min:0',
            'produk.*.diskon_persen'   => 'nullable|numeric|min:0|max:100',
            'produk.*.min_beli'        => 'nullable|integer|min:1',
        ]);

        $promo = Promo::create([
            'nama'            => $validated['nama'],
            'tipe'            => $validated['tipe'],
            'tanggal_mulai'   => $validated['tanggal_mulai'],
            'tanggal_selesai' => $validated['tanggal_selesai'],
            'keterangan'      => $validated['keterangan'] ?? null,
            'is_active'       => true,
        ]);

        foreach ($validated['produk'] as $p) {
            DetailPromo::create([
                'promo_id'      => $promo->id,
                'produk_id'     => $p['produk_id'],
                'harga_promo'   => $p['harga_promo'] ?? null,
                'diskon_persen' => $p['diskon_persen'] ?? null,
                'min_beli'      => $p['min_beli'] ?? 1,
            ]);
        }

        return redirect()->route('promo.index')
            ->with('success', "Promo '{$promo->nama}' berhasil ditambahkan.");
    }

    public function edit(Promo $promo): Response
    {
        return Inertia::render('Promo/Form', [
            'promo'  => $promo->load('detailPromo'),
            'produk' => Produk::where('is_active', true)->get(['id', 'nama', 'kategori', 'harga_jual']),
        ]);
    }

    public function update(Request $request, Promo $promo): RedirectResponse
    {
        $validated = $request->validate([
            'nama'            => 'required|string|max:100',
            'tipe'            => 'required|in:harga_khusus,diskon_persen,paket_bundling',
            'tanggal_mulai'   => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'keterangan'      => 'nullable|string|max:500',
            'is_active'       => 'boolean',
            'produk'          => 'required|array|min:1',
            'produk.*.produk_id'     => 'required|exists:produk,id',
            'produk.*.harga_promo'   => 'nullable|numeric|min:0',
            'produk.*.diskon_persen' => 'nullable|numeric|min:0|max:100',
            'produk.*.min_beli'      => 'nullable|integer|min:1',
        ]);

        $promo->update($validated);
        $promo->detailPromo()->delete();

        foreach ($validated['produk'] as $p) {
            DetailPromo::create([
                'promo_id'      => $promo->id,
                'produk_id'     => $p['produk_id'],
                'harga_promo'   => $p['harga_promo'] ?? null,
                'diskon_persen' => $p['diskon_persen'] ?? null,
                'min_beli'      => $p['min_beli'] ?? 1,
            ]);
        }

        return redirect()->route('promo.index')
            ->with('success', "Promo '{$promo->nama}' berhasil diperbarui.");
    }

    public function destroy(Promo $promo): RedirectResponse
    {
        $promo->update(['is_active' => false]);
        return redirect()->route('promo.index')
            ->with('success', "Promo '{$promo->nama}' dinonaktifkan.");
    }
}
