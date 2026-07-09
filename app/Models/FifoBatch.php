<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FifoBatch extends Model
{
    protected $table = 'fifo_batches';

    protected $fillable = [
        'bahan_baku_id', 'pembelian_id', 'harga_beli',
        'jumlah_awal', 'jumlah_sisa', 'tanggal_masuk',
    ];

    protected $casts = [
        'harga_beli'    => 'decimal:2',
        'jumlah_awal'   => 'float',
        'jumlah_sisa'   => 'float',
        'tanggal_masuk' => 'date',
    ];

    public function bahanBaku(): BelongsTo
    {
        return $this->belongsTo(BahanBaku::class, 'bahan_baku_id');
    }

    public function pembelian(): BelongsTo
    {
        return $this->belongsTo(Pembelian::class);
    }

    public function isTerpakai(): bool
    {
        return $this->jumlah_sisa <= 0;
    }
}
