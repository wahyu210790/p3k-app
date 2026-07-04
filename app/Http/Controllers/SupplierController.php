<?php

namespace App\Http\Controllers;

use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupplierController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Supplier/Index', [
            'suppliers' => Supplier::withCount('pembelian')
                ->orderBy('nama')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Supplier/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama'    => 'required|string|max:100|unique:supplier,nama',
            'telepon' => 'nullable|string|max:20',
            'alamat'  => 'nullable|string|max:255',
            'catatan' => 'nullable|string|max:500',
        ]);

        Supplier::create($validated);

        return redirect()->route('supplier.index')
            ->with('success', "Supplier '{$validated['nama']}' berhasil ditambahkan.");
    }

    public function edit(Supplier $supplier): Response
    {
        return Inertia::render('Supplier/Form', [
            'supplier' => $supplier,
        ]);
    }

    public function update(Request $request, Supplier $supplier): RedirectResponse
    {
        $validated = $request->validate([
            'nama'      => 'required|string|max:100|unique:supplier,nama,' . $supplier->id,
            'telepon'   => 'nullable|string|max:20',
            'alamat'    => 'nullable|string|max:255',
            'catatan'   => 'nullable|string|max:500',
            'is_active' => 'boolean',
        ]);

        $supplier->update($validated);

        return redirect()->route('supplier.index')
            ->with('success', "Supplier '{$supplier->nama}' berhasil diperbarui.");
    }
}
