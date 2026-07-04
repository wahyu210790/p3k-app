<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Transaksi extends Model
{
    protected $table = 'transaksi';
    protected $fillable = [
        'user_id', 'nomor_transaksi', 'tanggal_transaksi',
        'total_harga_jual', 'total_hpp', 'total_dana_modal',
        'total_dana_operasional', 'total_keuntungan',
        'metode_pembayaran', 'status', 'catatan',
    ];

    protected $casts = [
        'tanggal_transaksi'      => 'datetime',
        'total_harga_jual'       => 'decimal:2',
        'total_hpp'              => 'decimal:2',
        'total_dana_modal'       => 'decimal:2',
        'total_dana_operasional' => 'decimal:2',
        'total_keuntungan'       => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function detailTransaksi(): HasMany
    {
        return $this->hasMany(DetailTransaksi::class);
    }

    public function piutangPelanggan(): HasOne
    {
        return $this->hasOne(PiutangPelanggan::class);
    }

    /** Generate nomor transaksi unik: TRX-YYYYMMDD-XXXX */
    public static function generateNomor(): string
    {
        $today  = now()->format('Ymd');
        $prefix = "TRX-{$today}-";
        $last   = static::where('nomor_transaksi', 'like', "{$prefix}%")
            ->orderByDesc('nomor_transaksi')
            ->value('nomor_transaksi');

        $seq = $last ? (int) substr($last, -4) + 1 : 1;
        return $prefix . str_pad($seq, 4, '0', STR_PAD_LEFT);
    }
}
