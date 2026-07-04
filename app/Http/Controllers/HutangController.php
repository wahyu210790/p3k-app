<?php

namespace App\Http\Controllers;

use App\Models\HutangSupplier;
use App\Services\FinancialService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HutangController extends Controller
{
    public function __construct(
        private readonly FinancialService $financialService
    ) {}

    public function index(Request $request): Response
    {
        $hutang = HutangSupplier::with('supplier:id,nama', 'pembelian:id,nomor_faktur,tanggal_pembelian')
            ->when($request->get('status'), fn($q, $v) => $q->where('status', $v))
            ->when($request->get('supplier_id'), fn($q, $v) => $q->where('supplier_id', $v))
            ->latest('tanggal_hutang')
            ->paginate(20)
            ->withQueryString();

        $totalAktif = HutangSupplier::where('status', 'belum_lunas')->sum('sisa_hutang');

        return Inertia::render('Hutang/Index', [
            'hutang'       => $hutang,
            'total_aktif'  => (float) $totalAktif,
            'suppliers'    => \App\Models\Supplier::where('is_active', true)->get(['id', 'nama']),
            'filters'      => $request->only(['status', 'supplier_id']),
        ]);
    }

    public function bayar(Request $request, HutangSupplier $hutang): RedirectResponse
    {
        $validated = $request->validate([
            'jumlah_bayar' => "required|numeric|min:1|max:{$hutang->sisa_hutang}",
        ]);

        try {
            $this->financialService->bayarHutangSupplier($hutang, $validated['jumlah_bayar']);

            $pesan = $hutang->fresh()->status === 'lunas'
                ? "Hutang ke {$hutang->supplier?->nama} sudah LUNAS."
                : "Pembayaran Rp" . number_format($validated['jumlah_bayar'], 0, ',', '.') . " berhasil dicatat.";

            return back()->with('success', $pesan);
        } catch (\Exception $e) {
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }
}
