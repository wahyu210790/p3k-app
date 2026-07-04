<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengaturan extends Model
{
    protected $table = 'pengaturan';

    protected $fillable = ['kunci', 'nilai', 'keterangan'];

    /** Ambil nilai pengaturan berdasarkan kunci */
    public static function get(string $kunci, mixed $default = null): mixed
    {
        return static::where('kunci', $kunci)->value('nilai') ?? $default;
    }

    /** Set nilai pengaturan */
    public static function set(string $kunci, mixed $nilai): void
    {
        static::updateOrCreate(
            ['kunci' => $kunci],
            ['nilai' => $nilai]
        );
    }

    /** Ambil persentase dana operasional (default 20%) */
    public static function getPersenOperasional(): float
    {
        return (float) static::get('persen_operasional', 20);
    }
}
