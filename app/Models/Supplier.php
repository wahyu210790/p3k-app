<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    protected $table = 'supplier';

    protected $fillable = [
        'nama', 'telepon', 'alamat', 'catatan', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function pembelian(): HasMany
    {
        return $this->hasMany(Pembelian::class);
    }

    public function hutangSupplier(): HasMany
    {
        return $this->hasMany(HutangSupplier::class);
    }
}
