<?php

namespace App\Services;

use App\Models\DetailTransaksi;
use App\Models\Pengaturan;
use App\Models\Transaksi;
use Illuminate\Support\Facades\DB;

/**
 * TransactionService — Orkestrator alur transaksi POS end-to-end.
 *
 * Alur lengkap satu transaksi:
 * 1. Validasi stok semua item di keranjang
 * 2. Mulai DB Transaction
 * 3. Untuk setiap item:
 *    a. RecipeService.gunakanResep() → kurangi stok FIFO, dapat HPP aktual
 *    b. Apply harga promo jika aktif
 *    c. FinancialService.hitungAlokasi() → kalkulasi 3 dompet per item
 * 4. Buat record Transaksi header
 * 5. Buat record DetailTransaksi per item
 * 6. FinancialService.alokasikanDompet() → update 3 dompet
 * 7. Jika metode = 'piutang' → buat record PiutangPelanggan
 * 8. Commit DB Transaction
 * 9. Return hasil transaksi lengkap
 */
class TransactionService
{
    public function __construct(
        private readonly RecipeService   $recipeService,
        private readonly FinancialService $financialService
    ) {}

    /**
     * Proses transaksi POS.
     *
     * @param  int    $userId     ID kasir yang melakukan transaksi
     * @param  array  $items      Keranjang belanja:
     *                            [
     *                              ['produk_id' => 1, 'qty' => 2, 'promo_id' => null],
     *                              ['produk_id' => 3, 'qty' => 1, 'promo_id' => 5],
     *                            ]
     * @param  string $metodePembayaran  'cash' | 'qris' | 'transfer' | 'piutang'
     * @param  array  $piutangData       Wajib jika metodePembayaran = 'piutang':
     *                                   ['nama_pelanggan' => '...', 'nomor_wa' => '...']
     * @param  string|null $catatan
     * @return array  Hasil transaksi lengkap
     * @throws \Exception
     */
    public function prosesPenjualan(
        int    $userId,
        array  $items,
        string $metodePembayaran,
        array  $piutangData = [],
        ?string $catatan = null,
        ?string $tanggalTransaksi = null
    ): array {
        if (empty($items)) {
            throw new \Exception('Keranjang belanja kosong.');
        }

        if ($metodePembayaran === 'piutang' && empty($piutangData['nama_pelanggan'])) {
            throw new \Exception('Nama pelanggan wajib diisi untuk transaksi piutang.');
        }

        // Validasi stok semua item sebelum memulai transaksi
        $this->validasiSemuaItem($items);

        $persenOps = Pengaturan::getPersenOperasional();

        return DB::transaction(function () use (
            $userId, $items, $metodePembayaran, $piutangData, $catatan, $persenOps
        ) {
            $totalHargaJual       = 0;
            $totalHPP             = 0;
            $totalDanaModal       = 0;
            $totalDanaOperasional = 0;
            $totalKeuntungan      = 0;
            $detailItems          = [];

            // === Proses setiap item ===
            foreach ($items as $item) {
                $produkId = $item['produk_id'];
                $qty      = (int) $item['qty'];
                $promoId  = $item['promo_id'] ?? null;

                // Ambil produk dengan info harga promo
                $produk    = \App\Models\Produk::findOrFail($produkId);
                $hargaNormal = (float) $produk->harga_jual;

                // Tentukan harga jual aktual (normal atau promo)
                $hargaJualSatuan = $hargaNormal;
                if ($promoId) {
                    $promoDetail = \App\Models\DetailPromo::with('promo')
                        ->where('promo_id', $promoId)
                        ->where('produk_id', $produkId)
                        ->first();

                    if ($promoDetail && $promoDetail->promo->isAktifHariIni()) {
                        $hargaJualSatuan = match ($promoDetail->promo->tipe) {
                            'harga_khusus'  => (float) $promoDetail->harga_promo,
                            'diskon_persen' => round($hargaNormal * (1 - $promoDetail->diskon_persen / 100), 2),
                            default         => $hargaNormal,
                        };
                    }
                }

                // Kurangi stok bahan baku via FIFO + hitung HPP aktual
                $hasilResep = $this->recipeService->gunakanResep($produkId, $qty);
                $hppSatuan  = $hasilResep['hpp_satuan'];
                $hppTotal   = $hasilResep['total_hpp'];

                // Hitung alokasi 3 dompet per item
                $alokasi = $this->financialService->hitungAlokasi(
                    hargaJual: $hargaJualSatuan * $qty,
                    hpp:       $hppTotal,
                    persenOps: $persenOps
                );

                $subtotalHargaJual = $hargaJualSatuan * $qty;

                $detailItems[] = [
                    'produk_id'                 => $produkId,
                    'promo_id'                  => $promoId,
                    'jumlah'                    => $qty,
                    'harga_normal_satuan'        => $hargaNormal,
                    'harga_jual_satuan'          => $hargaJualSatuan,
                    'hpp_satuan'                 => $hppSatuan,
                    'subtotal_harga_jual'        => $subtotalHargaJual,
                    'subtotal_hpp'               => $hppTotal,
                    'subtotal_dana_modal'        => $alokasi['dana_modal'],
                    'subtotal_dana_operasional'  => $alokasi['dana_operasional'],
                    'subtotal_keuntungan'        => $alokasi['keuntungan'],
                ];

                $totalHargaJual       += $subtotalHargaJual;
                $totalHPP             += $hppTotal;
                $totalDanaModal       += $alokasi['dana_modal'];
                $totalDanaOperasional += $alokasi['dana_operasional'];
                $totalKeuntungan      += $alokasi['keuntungan'];
            }

            // === Buat record Transaksi ===
            $tglObj = $tanggalTransaksi ? \Carbon\Carbon::parse($tanggalTransaksi) : now();

            $transaksi = Transaksi::create([
                'user_id'                => $userId,
                'nomor_transaksi'        => Transaksi::generateNomor($tglObj->toDateString()),
                'tanggal_transaksi'      => $tglObj,
                'total_harga_jual'       => round($totalHargaJual, 2),
                'total_hpp'              => round($totalHPP, 2),
                'total_dana_modal'       => round($totalDanaModal, 2),
                'total_dana_operasional' => round($totalDanaOperasional, 2),
                'total_keuntungan'       => round($totalKeuntungan, 2),
                'metode_pembayaran'      => $metodePembayaran,
                'status'                 => $metodePembayaran === 'piutang' ? 'piutang' : 'selesai',
                'catatan'                => $catatan,
            ]);

            if ($tanggalTransaksi) {
                $transaksi->created_at = $tglObj;
                $transaksi->saveQuietly();
            }

            // === Buat DetailTransaksi untuk setiap item ===
            foreach ($detailItems as $detail) {
                DetailTransaksi::create(array_merge(
                    ['transaksi_id' => $transaksi->id],
                    $detail
                ));
            }

            // === Update 3 Dompet Keuangan ===
            $this->financialService->alokasikanDompet(
                danaModal:       round($totalDanaModal, 2),
                danaOperasional: round($totalDanaOperasional, 2),
                keuntungan:      round($totalKeuntungan, 2)
            );

            // === Buat Piutang Pelanggan jika metode = piutang ===
            $piutang = null;
            if ($metodePembayaran === 'piutang') {
                $piutang = $this->financialService->buatPiutangPelanggan(
                    transaksi:      $transaksi,
                    namaPelanggan:  $piutangData['nama_pelanggan'],
                    nomorWa:        $piutangData['nomor_wa'] ?? null,
                    catatan:        $piutangData['catatan']  ?? null,
                    tanggalTransaksi: $tanggalTransaksi
                );
            }

            return [
                'transaksi'     => $transaksi->load('detailTransaksi.produk'),
                'piutang'       => $piutang,
                'ringkasan' => [
                    'total_harga_jual'       => round($totalHargaJual, 2),
                    'total_hpp'              => round($totalHPP, 2),
                    'total_dana_modal'       => round($totalDanaModal, 2),
                    'total_dana_operasional' => round($totalDanaOperasional, 2),
                    'total_keuntungan'       => round($totalKeuntungan, 2),
                ],
            ];
        });
    }

    /**
     * Proses pembelian bahan baku dari supplier.
     * Otomatis: tambah stok via FIFO + buat hutang supplier jika belum lunas.
     *
     * @param  int    $userId
     * @param  array  $data    Data pembelian (supplier, tanggal, items[], bayar)
     * @return \App\Models\Pembelian
     */
    public function prosesPembelian(int $userId, array $data): \App\Models\Pembelian
    {
        return DB::transaction(function () use ($userId, $data) {
            $inventoryService = app(InventoryService::class);

            $totalHarga = collect($data['items'])
                ->sum(fn($i) => $i['jumlah'] * $i['harga_satuan']);

            $jumlahBayar = (float) ($data['jumlah_bayar'] ?? $totalHarga);
            $statusPembayaran = match (true) {
                $jumlahBayar >= $totalHarga => 'lunas',
                $jumlahBayar > 0           => 'sebagian',
                default                    => 'belum_bayar',
            };

            // Buat header pembelian
            $pembelian = \App\Models\Pembelian::create([
                'user_id'           => $userId,
                'supplier_id'       => $data['supplier_id'] ?? null,
                'nomor_faktur'      => $data['nomor_faktur'] ?? null,
                'tanggal_pembelian' => $data['tanggal_pembelian'],
                'total_harga'       => $totalHarga,
                'jumlah_bayar'      => $jumlahBayar,
                'status_pembayaran' => $statusPembayaran,
                'catatan'           => $data['catatan'] ?? null,
            ]);

            // Buat detail + tambah stok FIFO per bahan baku
            foreach ($data['items'] as $item) {
                $subtotal = $item['jumlah'] * $item['harga_satuan'];

                \App\Models\DetailPembelian::create([
                    'pembelian_id'  => $pembelian->id,
                    'bahan_baku_id' => $item['bahan_baku_id'],
                    'jumlah'        => $item['jumlah'],
                    'harga_satuan'  => $item['harga_satuan'],
                    'subtotal'      => $subtotal,
                ]);

                // Tambah stok dan buat batch FIFO
                $inventoryService->tambahStok(
                    bahanBakuId:  $item['bahan_baku_id'],
                    jumlah:       $item['jumlah'],
                    hargaBeli:    $item['harga_satuan'],
                    tanggalMasuk: $data['tanggal_pembelian'],
                    pembelianId:  $pembelian->id
                );
            }

            // Buat hutang supplier otomatis jika belum lunas
            if ($statusPembayaran !== 'lunas') {
                $this->financialService->buatHutangSupplier($pembelian);
            }

            return $pembelian->load('detailPembelian.bahanBaku', 'hutangSupplier');
        });
    }

    /**
     * Validasi stok semua item sebelum transaksi diproses.
     * Memastikan tidak ada item yang stoknya kurang.
     */
    private function validasiSemuaItem(array $items): void
    {
        $kekuranganGlobal = [];

        foreach ($items as $item) {
            $cek = $this->recipeService->cekStokCukup(
                $item['produk_id'],
                (int) $item['qty']
            );

            if (!$cek['cukup']) {
                foreach ($cek['kekurangan'] as $k) {
                    $kekuranganGlobal[] = $k;
                }
            }
        }

        if (!empty($kekuranganGlobal)) {
            $pesan = "Stok tidak mencukupi untuk:\n";
            foreach ($kekuranganGlobal as $k) {
                $pesan .= "  • {$k['nama']}: tersedia {$k['tersedia']} {$k['satuan']}, " .
                          "dibutuhkan {$k['dibutuhkan']} {$k['satuan']}\n";
            }
            throw new \Exception($pesan);
        }
    }
}
