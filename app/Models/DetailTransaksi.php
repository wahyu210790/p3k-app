<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailTransaksi extends Model
{
    protected $table = 'detail_transaksi';

    protected $fillable = [
        'transaksi_id', 'produk_id', 'promo_id', 'jumlah',
        'harga_normal_satuan', 'harga_jual_satuan', 'hpp_satuan',
        'subtotal_harga_jual', 'subtotal_hpp',
        'subtotal_dana_modal', 'subtotal_dana_operasional', 'subtotal_keuntungan',
    ];

    protected $casts = [
        'harga_normal_satuan'       => 'decimal:2',
        'harga_jual_satuan'         => 'decimal:2',
        'hpp_satuan'                => 'decimal:2',
        'subtotal_harga_jual'       => 'decimal:2',
        'subtotal_hpp'              => 'decimal:2',
        'subtotal_dana_modal'       => 'decimal:2',
        'subtotal_dana_operasional' => 'decimal:2',
        'subtotal_keuntungan'       => 'decimal:2',
    ];

    public function transaksi(): BelongsTo
    {
        return $this->belongsTo(Transaksi::class);
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class);
    }

    public function promo(): BelongsTo
    {
        return $this->belongsTo(Promo::class);
    }
}
