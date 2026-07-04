<?php

namespace App\Http\Controllers;

use App\Models\PiutangPelanggan;
use App\Services\FinancialService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PiutangController extends Controller
{
    public function __construct(
        private readonly FinancialService $financialService
    ) {}

    public function index(Request $request): Response
    {
        $piutang = PiutangPelanggan::with('transaksi:id,nomor_transaksi')
            ->when($request->get('status'), fn($q, $v) => $q->where('status', $v))
            ->when($request->get('search'), fn($q, $s) =>
                $q->where('nama_pelanggan', 'like', "%{$s}%")
                  ->orWhere('nomor_wa', 'like', "%{$s}%")
            )
            ->latest('tanggal_piutang')
            ->paginate(20)
            ->withQueryString();

        $totalAktif = PiutangPelanggan::where('status', 'belum_lunas')->sum('sisa_piutang');

        return Inertia::render('Piutang/Index', [
            'piutang'      => $piutang,
            'total_aktif'  => (float) $totalAktif,
            'filters'      => $request->only(['status', 'search']),
        ]);
    }

    public function bayar(Request $request, PiutangPelanggan $piutang): RedirectResponse
    {
        $validated = $request->validate([
            'jumlah_bayar' => "required|numeric|min:1|max:{$piutang->sisa_piutang}",
        ]);

        try {
            $this->financialService->bayarPiutangPelanggan($piutang, $validated['jumlah_bayar']);

            $pesan = $piutang->fresh()->status === 'lunas'
                ? "Piutang {$piutang->nama_pelanggan} sudah LUNAS."
                : "Pembayaran Rp" . number_format($validated['jumlah_bayar'], 0, ',', '.') . " diterima.";

            return back()->with('success', $pesan);
        } catch (\Exception $e) {
            return back()->withErrors(['message' => $e->getMessage()]);
        }
    }
}
