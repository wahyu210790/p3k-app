import AppLayout from '@/Layouts/AppLayout';
import { rupiah, tanggalIndo } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { PlusIcon, PencilSquareIcon, TrashIcon, TagIcon, CalendarIcon } from '@heroicons/react/24/outline';

const tipeBadge = {
    harga_khusus:   { label: 'Harga Khusus', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    diskon_persen:  { label: 'Diskon %', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    paket_bundling: { label: 'Paket Bundling', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
};

export default function PromoIndex({ promo }) {
    const handleDelete = (id, nama) => {
        if (confirm(`Nonaktifkan promo "${nama}"?`)) {
            router.delete(route('promo.destroy', id));
        }
    };

    return (
        <AppLayout title="Promo & Diskon">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Daftar Promo</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Atur harga khusus, diskon, dan promo bundling untuk produk</p>
                    </div>
                    <Link
                        href={route('promo.create')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl transition-all"
                    >
                        <PlusIcon className="w-4 h-4" /> Buat Promo
                    </Link>
                </div>

                <div className="space-y-4">
                    {promo.data.length === 0 ? (
                        <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-12 text-center text-slate-500 text-sm">
                            Belum ada promo yang dibuat. <Link href={route('promo.create')} className="text-amber-400 hover:underline">Buat sekarang →</Link>
                        </div>
                    ) : (
                        promo.data.map((p) => {
                            const badge = tipeBadge[p.tipe] ?? tipeBadge.harga_khusus;
                            return (
                                <div
                                    key={p.id}
                                    className={`rounded-2xl border p-5 transition-all ${
                                        p.is_active
                                            ? 'bg-slate-900/60 border-slate-700/50 hover:border-slate-600'
                                            : 'bg-slate-900/30 border-slate-800 opacity-60'
                                    }`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4 mb-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
                                                <TagIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-bold text-white text-base">{p.nama}</h3>
                                                    <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold ${badge.color}`}>
                                                        {badge.label}
                                                    </span>
                                                    {!p.is_active && (
                                                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
                                                            Nonaktif
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                                                    <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                                                    <span>{tanggalIndo(p.tanggal_mulai)} s/d {tanggalIndo(p.tanggal_selesai)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            <Link
                                                href={route('promo.edit', p.id)}
                                                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                                            >
                                                <PencilSquareIcon className="w-3.5 h-3.5" /> Edit
                                            </Link>
                                            {p.is_active && (
                                                <button
                                                    onClick={() => handleDelete(p.id, p.nama)}
                                                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 transition-colors"
                                                    title="Nonaktifkan"
                                                >
                                                    <TrashIcon className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {p.keterangan && (
                                        <p className="text-xs text-slate-400 mb-3 bg-slate-800/40 px-3 py-2 rounded-xl">
                                            {p.keterangan}
                                        </p>
                                    )}

                                    <div>
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                            Produk dalam Promo ({p.detail_promo?.length || 0}):
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {p.detail_promo?.map((dp) => (
                                                <div
                                                    key={dp.id}
                                                    className="bg-slate-800 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs flex items-center gap-2"
                                                >
                                                    <span className="font-medium text-white">{dp.produk?.nama}</span>
                                                    <span className="text-amber-400 font-bold">
                                                        {p.tipe === 'harga_khusus' && rupiah(dp.harga_promo)}
                                                        {p.tipe === 'diskon_persen' && `${dp.diskon_persen}%`}
                                                        {p.tipe === 'paket_bundling' && `${rupiah(dp.harga_promo)} (Min ${dp.min_beli})`}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
