<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StockOpname extends Model
{
    protected $table = 'stock_opname';

    protected $fillable = ['user_id', 'tanggal', 'catatan'];

    protected $casts = [
        'tanggal' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function detailStockOpname(): HasMany
    {
        return $this->hasMany(DetailStockOpname::class);
    }

    /** Total selisih nilai HPP dari opname ini */
    public function getTotalSelisihNilaiAttribute(): float
    {
        return $this->detailStockOpname->sum(fn($d) => $d->selisih * $d->bahanBaku->getHppRataRata());
    }
}
