<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DetailStockOpname extends Model
{
    protected $table = 'detail_stock_opname';

    protected $fillable = [
        'stock_opname_id', 'bahan_baku_id',
        'stok_sistem', 'stok_fisik', 'selisih', 'keterangan',
    ];

    protected $casts = [
        'stok_sistem' => 'float',
        'stok_fisik'  => 'float',
        'selisih'     => 'float',
    ];

    public function stockOpname(): BelongsTo
    {
        return $this->belongsTo(StockOpname::class);
    }

    public function bahanBaku(): BelongsTo
    {
        return $this->belongsTo(BahanBaku::class, 'bahan_baku_id');
    }
}
