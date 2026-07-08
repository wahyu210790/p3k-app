<?php

namespace App\Services;

use App\Models\DompetKeuangan;
use App\Models\HutangSupplier;
use App\Models\Pembelian;
use App\Models\PengeluaranOperasional;
use App\Models\Pengaturan;
use App\Models\PiutangPelanggan;
use App\Models\Transaksi;
use Illuminate\Support\Facades\DB;

/**
 * FinancialService — Mengelola alokasi keuangan ke 3 Dompet.
 *
 * Formula alokasi per transaksi penjualan:
 *   Dompet Modal       += HPP barang terjual
 *   Dompet Operasional += HPP × (persen_operasional / 100)
 *   Dompet Keuntungan  += Harga Jual - HPP - Dana Operasional
 *
 * Contoh (persen_operasional = 20%):
 *   Harga Jual    = Rp15.000
 *   HPP           = Rp8.000
 *   Dana Operasional = Rp1.600 (20% × 8.000)
 *   Keuntungan    = Rp5.400   (15.000 - 8.000 - 1.600)
 */
class FinancialService
{
    /**
     * Hitung alokasi dana dari satu item transaksi.
     *
     * @param  float $hargaJual     Harga jual aktual (setelah promo jika ada)
     * @param  float $hpp           HPP aktual hasil FIFO
     * @param  float $persenOps     Persentase operasional (0-100), default dari pengaturan
     * @return array { dana_modal, dana_operasional, keuntungan }
     */
    public function hitungAlokasi(float $hargaJual, float $hpp, ?float $persenOps = null): array
    {
        $persenOps      = $persenOps ?? Pengaturan::getPersenOperasional();
        $danaModal      = $hpp;
        $danaOperasional = round($hpp * ($persenOps / 100), 2);
        $keuntungan     = round($hargaJual - $hpp - $danaOperasional, 2);

        return [
            'dana_modal'       => round($danaModal, 2),
            'dana_operasional' => $danaOperasional,
            'keuntungan'       => $keuntungan,
        ];
    }

    /**
     * Tambah saldo ke 3 dompet setelah transaksi penjualan berhasil.
     * Harus dipanggil di dalam DB::transaction().
     *
     * @param  float $danaModal
     * @param  float $danaOperasional
     * @param  float $keuntungan
     */
    public function alokasikanDompet(
        float $danaModal,
        float $danaOperasional,
        float $keuntungan
    ): void {
        DompetKeuangan::tambah('modal', $danaModal);
        DompetKeuangan::tambah('operasional', $danaOperasional);
        DompetKeuangan::tambah('keuntungan', $keuntungan);
    }

    /**
     * Catat pengeluaran operasional dan kurangi Dompet Operasional.
     * Harus dipanggil di dalam DB::transaction().
     *
     * @throws \Exception jika saldo dompet operasional tidak mencukupi
     */
    public function catatPengeluaran(
        int    $userId,
        string $kategori,
        float  $jumlah,
        string $tanggal,
        ?string $keterangan = null
    ): PengeluaranOperasional {
        $saldo = DompetKeuangan::getSaldo('operasional');

        if ($saldo < $jumlah) {
            throw new \Exception(
                "Saldo Dompet Operasional tidak mencukupi. " .
                "Saldo: Rp" . number_format($saldo, 0, ',', '.') . ", " .
                "Pengeluaran: Rp" . number_format($jumlah, 0, ',', '.')
            );
        }

        $pengeluaran = PengeluaranOperasional::create([
            'user_id'    => $userId,
            'kategori'   => $kategori,
            'jumlah'     => $jumlah,
            'keterangan' => $keterangan,
            'tanggal'    => $tanggal,
        ]);

        DompetKeuangan::kurangi('operasional', $jumlah);

        return $pengeluaran;
    }

    /**
     * Buat record hutang supplier secara otomatis dari pembelian yang belum lunas.
     * Dipanggil saat mencatat pembelian baru.
     */
    public function buatHutangSupplier(Pembelian $pembelian): ?HutangSupplier
    {
        $sisa = $pembelian->total_harga - $pembelian->jumlah_bayar;

        if ($sisa <= 0) return null;

        return HutangSupplier::create([
            'pembelian_id'  => $pembelian->id,
            'supplier_id'   => $pembelian->supplier_id,
            'jumlah_hutang' => $sisa,
            'jumlah_bayar'  => 0,
            'sisa_hutang'   => $sisa,
            'status'        => 'belum_lunas',
            'tanggal_hutang' => $pembelian->tanggal_pembelian,
        ]);
    }

    /**
     * Bayar sebagian atau lunas hutang supplier.
     *
     * @throws \Exception jika pembayaran melebihi sisa hutang
     */
    public function bayarHutangSupplier(HutangSupplier $hutang, float $jumlahBayar): HutangSupplier
    {
        if ($jumlahBayar > $hutang->sisa_hutang) {
            throw new \Exception(
                "Pembayaran (Rp" . number_format($jumlahBayar, 0, ',', '.') . ") " .
                "melebihi sisa hutang (Rp" . number_format($hutang->sisa_hutang, 0, ',', '.') . ")."
            );
        }

        $hutang->bayar($jumlahBayar);
        return $hutang->fresh();
    }

    /**
     * Buat record piutang pelanggan dari transaksi dengan metode bayar "piutang".
     */
    public function buatPiutangPelanggan(
        Transaksi $transaksi,
        string    $namaPelanggan,
        ?string   $nomorWa = null,
        ?string   $catatan = null,
        ?string   $tanggalTransaksi = null
    ): PiutangPelanggan {
        $tglObj = $tanggalTransaksi ? \Carbon\Carbon::parse($tanggalTransaksi) : now();
        $piutang = PiutangPelanggan::create([
            'transaksi_id'    => $transaksi->id,
            'nama_pelanggan'  => $namaPelanggan,
            'nomor_wa'        => $nomorWa,
            'jumlah_piutang'  => $transaksi->total_harga_jual,
            'jumlah_bayar'    => 0,
            'sisa_piutang'    => $transaksi->total_harga_jual,
            'status'          => 'belum_lunas',
            'tanggal_piutang' => $tglObj->toDateString(),
            'catatan'         => $catatan,
        ]);

        if ($tanggalTransaksi) {
            $piutang->created_at = $tglObj;
            $piutang->saveQuietly();
        }

        return $piutang;
    }

    /**
     * Bayar sebagian atau lunas piutang pelanggan.
     *
     * @throws \Exception jika pembayaran melebihi sisa piutang
     */
    public function bayarPiutangPelanggan(PiutangPelanggan $piutang, float $jumlahBayar): PiutangPelanggan
    {
        if ($jumlahBayar > $piutang->sisa_piutang) {
            throw new \Exception(
                "Pembayaran (Rp" . number_format($jumlahBayar, 0, ',', '.') . ") " .
                "melebihi sisa piutang (Rp" . number_format($piutang->sisa_piutang, 0, ',', '.') . ")."
            );
        }

        $piutang->bayar($jumlahBayar);
        return $piutang->fresh();
    }

    /**
     * Ambil ringkasan saldo semua dompet dan statistik keuangan hari ini.
     */
    public function getRingkasanKeuangan(?string $tanggal = null): array
    {
        $tanggal    = $tanggal ?? now()->toDateString();
        $saldoDompet = DompetKeuangan::getAllSaldo();

        // Statistik hari ini
        $transaksiHariIni = Transaksi::whereDate('tanggal_transaksi', $tanggal);

        $omsetHariIni       = (float) $transaksiHariIni->sum('total_harga_jual');
        $modalHariIni       = (float) $transaksiHariIni->sum('total_dana_modal');
        $operasionalHariIni = (float) $transaksiHariIni->sum('total_dana_operasional');
        $keuntunganHariIni  = (float) $transaksiHariIni->sum('total_keuntungan');

        // Pengeluaran hari ini
        $pengeluaranHariIni = (float) PengeluaranOperasional::whereDate('tanggal', $tanggal)
            ->sum('jumlah');

        // Total piutang aktif
        $totalPiutang = (float) PiutangPelanggan::where('status', 'belum_lunas')
            ->sum('sisa_piutang');

        // Total hutang supplier
        $totalHutang = (float) HutangSupplier::where('status', 'belum_lunas')
            ->sum('sisa_hutang');

        return [
            'dompet'               => $saldoDompet,
            'hari_ini' => [
                'omset'        => $omsetHariIni,
                'modal'        => $modalHariIni,
                'operasional'  => $operasionalHariIni,
                'keuntungan'   => $keuntunganHariIni,
                'pengeluaran'  => $pengeluaranHariIni,
            ],
            'total_piutang_aktif'  => $totalPiutang,
            'total_hutang_supplier' => $totalHutang,
        ];
    }
}
