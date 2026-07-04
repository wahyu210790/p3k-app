<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PiutangPelanggan extends Model
{
    protected $table = 'piutang_pelanggan';

    protected $fillable = [
        'transaksi_id', 'nama_pelanggan', 'nomor_wa',
        'jumlah_piutang', 'jumlah_bayar', 'sisa_piutang',
        'status', 'tanggal_piutang', 'tanggal_lunas', 'catatan',
    ];

    protected $casts = [
        'jumlah_piutang'  => 'decimal:2',
        'jumlah_bayar'    => 'decimal:2',
        'sisa_piutang'    => 'decimal:2',
        'tanggal_piutang' => 'date',
        'tanggal_lunas'   => 'date',
    ];

    public function transaksi(): BelongsTo
    {
        return $this->belongsTo(Transaksi::class);
    }

    /** Proses pembayaran piutang */
    public function bayar(float $jumlah): void
    {
        $this->jumlah_bayar += $jumlah;
        $this->sisa_piutang  = $this->jumlah_piutang - $this->jumlah_bayar;

        if ($this->sisa_piutang <= 0) {
            $this->sisa_piutang  = 0;
            $this->status        = 'lunas';
            $this->tanggal_lunas = now()->toDateString();
        }

        $this->save();
    }
}
