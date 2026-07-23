<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kasbon extends Model
{
    protected $table = 'kasbon';

    protected $fillable = [
        'nama_peminjam',
        'sumber_dompet',
        'jumlah',
        'tanggal',
        'keterangan',
        'status',
    ];

    protected $casts = [
        'jumlah'  => 'decimal:2',
        'tanggal' => 'date',
    ];
}
