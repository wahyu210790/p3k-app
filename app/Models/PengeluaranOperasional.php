<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PengeluaranOperasional extends Model
{
    protected $table = 'pengeluaran_operasional';

    protected $fillable = [
        'user_id', 'kategori', 'jumlah', 'keterangan', 'tanggal',
    ];

    protected $casts = [
        'jumlah'  => 'decimal:2',
        'tanggal' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function labelKategori(): array
    {
        return [
            'listrik'    => 'Listrik',
            'internet'   => 'Internet',
            'gas'        => 'Gas',
            'bensin'     => 'Bensin',
            'gaji'       => 'Gaji Karyawan',
            'perawatan'  => 'Perawatan Peralatan',
            'lainnya'    => 'Lainnya',
        ];
    }
}
