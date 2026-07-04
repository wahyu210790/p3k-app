<?php

namespace App\Http\Controllers;

use App\Models\PengeluaranOperasional;
use App\Services\FinancialService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PengeluaranController extends Controller
{
    public function __construct(
        private readonly FinancialService $financialService
    ) {}

    public function index(Request $request): Response
    {
        $pengeluaran = PengeluaranOperasional::with('user:id,name')
            ->when($request->get('dari'), fn($q, $v) => $q->whereDate('tanggal', '>=', $v))
            ->when($request->get('sampai'), fn($q, $v) => $q->whereDate('tanggal', '<=', $v))
            ->when($request->get('kategori'), fn($q, $v) => $q->where('kategori', $v))
            ->latest('tanggal')
            ->paginate(20)
            ->withQueryString();

        $totalPeriode = PengeluaranOperasional::query()
            ->when($request->get('dari'), fn($q, $v) => $q->whereDate('tanggal', '>=', $v))
            ->when($request->get('sampai'), fn($q, $v) => $q->whereDate('tanggal', '<=', $v))
            ->sum('jumlah');

        return Inertia::render('Pengeluaran/Index', [
            'pengeluaran'    => $pengeluaran,
            'total_periode'  => (float) $totalPeriode,
            'label_kategori' => PengeluaranOperasional::labelKategori(),
            'filters'        => $request->only(['dari', 'sampai', 'kategori']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Pengeluaran/Create', [
            'label_kategori' => PengeluaranOperasional::labelKategori(),
            'saldo_operasional' => \App\Models\DompetKeuangan::getSaldo('operasional'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'kategori'   => 'required|string',
            'jumlah'     => 'required|numeric|min:1',
            'tanggal'    => 'required|date',
            'keterangan' => 'nullable|string|max:500',
        ]);

        try {
            $this->financialService->catatPengeluaran(
                userId:     auth()->id(),
                kategori:   $validated['kategori'],
                jumlah:     $validated['jumlah'],
                tanggal:    $validated['tanggal'],
                keterangan: $validated['keterangan'] ?? null
            );

            return redirect()->route('pengeluaran.index')
                ->with('success', 'Pengeluaran berhasil dicatat.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => $e->getMessage()])->withInput();
        }
    }
}
