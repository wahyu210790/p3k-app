<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HutangSupplier extends Model
{
    protected $table = 'hutang_supplier';

    protected $fillable = [
        'pembelian_id', 'supplier_id',
        'jumlah_hutang', 'jumlah_bayar', 'sisa_hutang',
        'status', 'tanggal_hutang', 'tanggal_lunas', 'catatan',
    ];

    protected $casts = [
        'jumlah_hutang'  => 'decimal:2',
        'jumlah_bayar'   => 'decimal:2',
        'sisa_hutang'    => 'decimal:2',
        'tanggal_hutang' => 'date',
        'tanggal_lunas'  => 'date',
    ];

    public function pembelian(): BelongsTo
    {
        return $this->belongsTo(Pembelian::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    /** Proses pembayaran hutang */
    public function bayar(float $jumlah): void
    {
        $this->jumlah_bayar += $jumlah;
        $this->sisa_hutang   = $this->jumlah_hutang - $this->jumlah_bayar;

        if ($this->sisa_hutang <= 0) {
            $this->sisa_hutang   = 0;
            $this->status        = 'lunas';
            $this->tanggal_lunas = now()->toDateString();
        }

        $this->save();

        // Update status di tabel pembelian
        $this->pembelian->update([
            'jumlah_bayar'      => $this->jumlah_bayar,
            'status_pembayaran' => $this->status === 'lunas' ? 'lunas' : 'sebagian',
        ]);
    }
}
