<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DompetKeuangan extends Model
{
    protected $table = 'dompet_keuangan';

    protected $fillable = ['tipe', 'saldo'];

    protected $casts = [
        'saldo' => 'decimal:2',
    ];

    /** Tambah saldo ke dompet tertentu */
    public static function tambah(string $tipe, float $jumlah): void
    {
        static::where('tipe', $tipe)->increment('saldo', $jumlah);
    }

    /** Kurangi saldo dari dompet tertentu */
    public static function kurangi(string $tipe, float $jumlah): void
    {
        static::where('tipe', $tipe)->decrement('saldo', $jumlah);
    }

    /** Ambil saldo dompet tertentu */
    public static function getSaldo(string $tipe): float
    {
        return (float) static::where('tipe', $tipe)->value('saldo');
    }

    /** Ambil semua saldo sebagai array */
    public static function getAllSaldo(): array
    {
        return static::all()->pluck('saldo', 'tipe')->toArray();
    }
}
