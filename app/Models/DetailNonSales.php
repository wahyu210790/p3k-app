<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailNonSales extends Model
{
    protected $table = 'detail_non_sales';

    protected $fillable = [
        'non_sales_id', 'produk_id', 'bahan_baku_id',
        'jumlah', 'hpp_satuan', 'subtotal_hpp',
    ];

    protected $casts = [
        'jumlah'       => 'decimal:3',
        'hpp_satuan'   => 'decimal:2',
        'subtotal_hpp' => 'decimal:2',
    ];

    public function nonSales(): BelongsTo
    {
        return $this->belongsTo(NonSales::class);
    }

    public function produk(): BelongsTo
    {
        return $this->belongsTo(Produk::class);
    }

    public function bahanBaku(): BelongsTo
    {
        return $this->belongsTo(BahanBaku::class, 'bahan_baku_id');
    }
}
