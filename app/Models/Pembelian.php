<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Pembelian extends Model
{
    protected $table = 'pembelian';

    protected $fillable = [
        'user_id', 'supplier_id', 'nomor_faktur', 'tanggal_pembelian',
        'total_harga', 'jumlah_bayar', 'status_pembayaran', 'catatan',
    ];

    protected $casts = [
        'tanggal_pembelian' => 'date',
        'total_harga'       => 'decimal:2',
        'jumlah_bayar'      => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function detailPembelian(): HasMany
    {
        return $this->hasMany(DetailPembelian::class);
    }

    public function fifoBatches(): HasMany
    {
        return $this->hasMany(FifoBatch::class);
    }

    public function hutangSupplier(): HasOne
    {
        return $this->hasOne(HutangSupplier::class);
    }

    public function getSisaBayarAttribute(): float
    {
        return $this->total_harga - $this->jumlah_bayar;
    }
}
