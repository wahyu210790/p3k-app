<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class NonSales extends Model
{
    protected $table = 'non_sales';

    protected $fillable = [
        'user_id', 'kategori', 'total_hpp', 'catatan', 'tanggal',
    ];

    protected $casts = [
        'total_hpp' => 'decimal:2',
        'tanggal'   => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function detailNonSales(): HasMany
    {
        return $this->hasMany(DetailNonSales::class);
    }

    public static function labelKategori(): array
    {
        return [
            'jatah_karyawan'  => 'Jatah Makan/Minum Karyawan',
            'konsumsi_owner'  => 'Konsumsi Owner',
            'konsumsi_tamu'   => 'Konsumsi Tamu',
            'sampling'        => 'Sampling Produk',
            'rusak'           => 'Barang Rusak',
            'kadaluarsa'      => 'Barang Kadaluarsa',
            'lainnya'         => 'Lainnya',
        ];
    }
}
