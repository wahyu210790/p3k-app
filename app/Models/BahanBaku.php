<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BahanBaku extends Model
{
    protected $table = 'bahan_baku';

    protected $fillable = [
        'sku', 'nama', 'satuan', 'stok_saat_ini', 'stok_minimum',
        'is_rokok', 'isi_per_bungkus', 'is_active',
    ];

    protected $casts = [
        'stok_saat_ini'  => 'decimal:3',
        'stok_minimum'   => 'decimal:3',
        'is_rokok'       => 'boolean',
        'is_active'      => 'boolean',
    ];

    public function fifoBatches(): HasMany
    {
        return $this->hasMany(FifoBatch::class)->orderBy('tanggal_masuk')->orderBy('id');
    }

    /** Hanya batch yang masih ada sisa stok (untuk FIFO consumption) */
    public function fifoBatchesAktif(): HasMany
    {
        return $this->hasMany(FifoBatch::class)
            ->where('jumlah_sisa', '>', 0)
            ->orderBy('tanggal_masuk')
            ->orderBy('id');
    }

    public function detailResep(): HasMany
    {
        return $this->hasMany(DetailResep::class);
    }

    public function detailPembelian(): HasMany
    {
        return $this->hasMany(DetailPembelian::class);
    }

    /** Apakah stok di bawah minimum? */
    public function isStokRendah(): bool
    {
        return $this->stok_saat_ini <= $this->stok_minimum;
    }

    /** Hitung HPP rata-rata tertimbang dari batch aktif */
    public function getHppRataRata(): float
    {
        $batches = $this->fifoBatchesAktif()->get();
        $totalNilai = $batches->sum(fn($b) => $b->jumlah_sisa * $b->harga_beli);
        $totalQty   = $batches->sum('jumlah_sisa');

        return $totalQty > 0 ? $totalNilai / $totalQty : 0;
    }
}
