<?php

namespace App\Http\Controllers;

use App\Models\Kasbon;
use App\Models\DompetKeuangan;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class KasbonController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Kasbon::query()->orderBy('tanggal', 'desc')->orderBy('id', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->filled('nama_peminjam')) {
            $query->where('nama_peminjam', $request->nama_peminjam);
        }

        $kasbon = $query->paginate(20)->withQueryString();

        $dompet = DompetKeuangan::all();

        return Inertia::render('Kasbon/Index', [
            'kasbon' => $kasbon,
            'dompet' => $dompet,
            'filters' => $request->only(['status', 'nama_peminjam']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nama_peminjam' => 'required|in:Wahyu,Adit',
            'sumber_dompet' => 'required|exists:dompet_keuangan,tipe',
            'jumlah'        => 'required|numeric|min:1',
            'tanggal'       => 'required|date',
            'keterangan'    => 'nullable|string|max:255',
        ]);

        try {
            DB::transaction(function () use ($validated) {
                // Catat kasbon
                Kasbon::create([
                    'nama_peminjam' => $validated['nama_peminjam'],
                    'sumber_dompet' => $validated['sumber_dompet'],
                    'jumlah'        => $validated['jumlah'],
                    'tanggal'       => $validated['tanggal'],
                    'keterangan'    => $validated['keterangan'],
                    'status'        => 'belum_lunas',
                ]);

                // Potong saldo dompet
                DompetKeuangan::kurangi($validated['sumber_dompet'], $validated['jumlah']);
            });

            return redirect()->route('kasbon.index')
                ->with('success', 'Kasbon berhasil dicatat dan saldo dompet telah dipotong.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Gagal mencatat kasbon: ' . $e->getMessage()]);
        }
    }

    public function pelunasan(Request $request, Kasbon $kasbon): RedirectResponse
    {
        if ($kasbon->status !== 'belum_lunas') {
            return back()->withErrors(['message' => 'Kasbon ini sudah dilunasi sebelumnya.']);
        }

        $validated = $request->validate([
            'metode_lunas' => 'required|in:tunai,potong_laba',
        ]);

        try {
            DB::transaction(function () use ($kasbon, $validated) {
                if ($validated['metode_lunas'] === 'tunai') {
                    $kasbon->update(['status' => 'lunas_tunai']);
                    // Kembalikan saldo dompet
                    DompetKeuangan::tambah($kasbon->sumber_dompet, $kasbon->jumlah);
                } else {
                    // Potong laba -> uang tidak kembali ke dompet
                    $kasbon->update(['status' => 'lunas_potong_laba']);
                }
            });

            return redirect()->route('kasbon.index')
                ->with('success', 'Kasbon berhasil dilunasi.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Gagal melunasi kasbon: ' . $e->getMessage()]);
        }
    }

    public function destroy(Kasbon $kasbon): RedirectResponse
    {
        try {
            DB::transaction(function () use ($kasbon) {
                // Jika belum lunas, berarti uang dompet terpotong secara keliru (karena mau dihapus/batal)
                // Jadi kita kembalikan saldo dompetnya.
                // Jika lunas_potong_laba, uang tidak kembali saat pelunasan, tapi saat dibuat uangnya keluar. Jadi batalkan = uang kembali.
                // Jika lunas_tunai, saat buat uang keluar, saat lunas uang masuk. Jadi net = 0. Tidak perlu kembalikan dompet.
                
                if ($kasbon->status === 'belum_lunas' || $kasbon->status === 'lunas_potong_laba') {
                    DompetKeuangan::tambah($kasbon->sumber_dompet, $kasbon->jumlah);
                }
                
                $kasbon->delete();
            });

            return redirect()->route('kasbon.index')
                ->with('success', 'Catatan kasbon berhasil dihapus dan saldo telah disesuaikan.');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Gagal menghapus kasbon: ' . $e->getMessage()]);
        }
    }
}
