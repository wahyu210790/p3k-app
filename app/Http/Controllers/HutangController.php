<?php

namespace App\Http\Controllers;

use App\Models\HutangSupplier;
use App\Services\FinancialService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    /**
     * Tutup / Lunas hutang supplier tanpa pemotongan uang/dompet.
     * Digunakan ketika ada sisa barang titipan (konsinyasi) yang ditarik/diretur oleh pemilik barang.
     */
    public function tutupRetur(HutangSupplier $hutang): RedirectResponse
    {
        try {
            DB::transaction(function () use ($hutang) {
                $hutang->update([
                    'status'      => 'lunas',
                    'sisa_hutang' => 0,
                ]);

                if ($hutang->pembelian) {
                    $pembelian = $hutang->pembelian;
                    $pembelian->status_pembayaran = 'lunas';
                    $catatanRetur = ($pembelian->catatan ? $pembelian->catatan . ' | ' : '') . '[Retur Titipan: Ditutup Lunas]';
                    $pembelian->catatan = $catatanRetur;
                    $pembelian->save();
                }
            });

            return back()->with('success', "Hutang ke {$hutang->supplier?->nama} berhasil ditutup LUNAS (Retur Konsinyasi).");
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Gagal menutup hutang: ' . $e->getMessage()]);
        }
    }
}
