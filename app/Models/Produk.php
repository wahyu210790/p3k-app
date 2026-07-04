<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;

class Produk extends Model
{
    protected $table = 'produk';
    protected $fillable = [
        'nama', 'kategori', 'foto', 'harga_jual', 'has_resep', 'is_active',
    ];

    protected $casts = [
        'harga_jual' => 'decimal:2',
        'has_resep'  => 'boolean',
        'is_active'  => 'boolean',
    ];

    protected $appends = ['foto_url'];

    public function detailResep(): HasMany
    {
        return $this->hasMany(DetailResep::class);
    }

    public function detailTransaksi(): HasMany
    {
        return $this->hasMany(DetailTransaksi::class);
    }

    public function detailPromo(): HasMany
    {
        return $this->hasMany(DetailPromo::class);
    }

    public function detailNonSales(): HasMany
    {
        return $this->hasMany(DetailNonSales::class);
    }

    /** Ambil harga promo aktif hari ini, atau null jika tidak ada */
    public function getHargaPromoAktif(): ?array
    {
        $today = now()->toDateString();

        $promoDetail = $this->detailPromo()
            ->whereHas('promo', fn($q) => $q
                ->where('is_active', true)
                ->where('tanggal_mulai', '<=', $today)
                ->where('tanggal_selesai', '>=', $today)
            )
            ->with('promo')
            ->first();

        if (!$promoDetail) return null;

        $hargaPromo = match ($promoDetail->promo->tipe) {
            'harga_khusus'    => $promoDetail->harga_promo,
            'diskon_persen'   => $this->harga_jual * (1 - ($promoDetail->diskon_persen / 100)),
            'paket_bundling'  => null, // ditangani khusus di POS
            default           => null,
        };

        return [
            'promo_id'    => $promoDetail->promo->id,
            'nama_promo'  => $promoDetail->promo->nama,
            'tipe'        => $promoDetail->promo->tipe,
            'harga_promo' => $hargaPromo,
            'diskon'      => $promoDetail->diskon_persen,
        ];
    }

    public function getFotoUrlAttribute(): ?string
    {
        if (!$this->foto) return null;
        return Storage::url($this->foto);
    }
}
