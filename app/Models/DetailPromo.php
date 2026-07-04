<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailPromo extends Model
{
    protected $table = 'detail_promo';

    protected $fillable = [
        'promo_id', 'produk_id', 'harga_promo', 'diskon_persen', 'min_beli',
    ];

    protected $casts = [
        'harga_promo'   => 'decimal:2',
        'diskon_persen' => 'decimal:2',
    ];

    public function promo(): BelongsTo
    {
        return $this->belongsTo(Promo::class);
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class);
    }
}
