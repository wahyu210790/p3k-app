<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OpenBill extends Model
{
    protected $table = 'open_bills';

    protected $fillable = [
        'nama_meja',
        'keranjang',
        'catatan',
        'total_estimasi',
        'user_id',
    ];

    protected $casts = [
        'keranjang'      => 'array',
        'total_estimasi' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
