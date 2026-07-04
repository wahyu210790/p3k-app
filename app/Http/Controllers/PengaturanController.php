<?php

namespace App\Http\Controllers;

use App\Models\Pengaturan;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengaturanController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Pengaturan/Index', [
            'pengaturan' => Pengaturan::all()->pluck('nilai', 'kunci'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'persen_operasional' => 'required|numeric|min:0|max:100',
            'nama_usaha'         => 'required|string|max:100',
            'alamat_usaha'       => 'nullable|string|max:255',
            'telepon_usaha'      => 'nullable|string|max:20',
            'footer_struk'       => 'nullable|string|max:255',
        ]);

        foreach ($validated as $kunci => $nilai) {
            Pengaturan::set($kunci, $nilai);
        }

        return back()->with('success', 'Pengaturan berhasil disimpan.');
    }
}
