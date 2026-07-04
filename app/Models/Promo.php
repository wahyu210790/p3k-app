<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Promo extends Model
{
    protected $fillable = [
        'nama', 'tipe', 'tanggal_mulai', 'tanggal_selesai', 'is_active', 'keterangan',
    ];

    protected $casts = [
        'tanggal_mulai'   => 'date',
        'tanggal_selesai' => 'date',
        'is_active'       => 'boolean',
    ];

    public function detailPromo(): HasMany
    {
        return $this->hasMany(DetailPromo::class);
    }

    public function isAktifHariIni(): bool
    {
        $today = now()->toDateString();
        return $this->is_active
            && $this->tanggal_mulai->toDateString() <= $today
            && $this->tanggal_selesai->toDateString() >= $today;
    }

    /** Scope: promo yang aktif hari ini */
    public function scopeAktif($query)
    {
        $today = now()->toDateString();
        return $query->where('is_active', true)
            ->where('tanggal_mulai', '<=', $today)
            ->where('tanggal_selesai', '>=', $today);
    }
}
