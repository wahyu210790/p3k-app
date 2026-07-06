import AppLayout from '@/Layouts/AppLayout';
import { rupiah } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { PlusIcon, PencilSquareIcon, TagIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const kategoriBadge = {
    Makanan:  'bg-orange-900/40 text-orange-300',
    Minuman:  'bg-blue-900/40 text-blue-300',
    Rokok:    'bg-red-900/40 text-red-300',
    Lainnya:  'bg-slate-700 text-slate-400',
};

export default function ProdukIndex({ produk, filters = {} }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [activeKategori, setActiveKategori] = useState(filters?.kategori ?? '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('produk.index'), { search, kategori: activeKategori }, { preserveState: true });
    };

    const handleKategori = (kategori) => {
        setActiveKategori(kategori);
        router.get(route('produk.index'), { search, kategori }, { preserveState: true });
    };

    return (
        <AppLayout title="Produk">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Daftar Produk</h2>
                    <Link href={route('produk.create')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl transition-all">
                        <PlusIcon className="w-4 h-4" /> Tambah Produk
                    </Link>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6 items-stretch sm:items-center justify-between bg-slate-900/60 rounded-2xl border border-slate-700/50 p-4">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama produk..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs rounded-xl transition-colors"
                        >
                            Cari
                        </button>
                        {search && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch('');
                                    router.get(route('produk.index'), { kategori: activeKategori }, { preserveState: true });
                                }}
                                className="px-3 py-2 bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 text-xs rounded-xl transition-colors"
                                title="Reset Pencarian"
                            >
                                Reset
                            </button>
                        )}
                    </form>

                    <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                        {['', 'Makanan', 'Minuman', 'Rokok', 'Lainnya'].map((k) => {
                            const label = k === '' ? 'Semua' : k;
                            const isActive = activeKategori === k;
                            return (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => handleKategori(k)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
                                        isActive
                                            ? 'bg-amber-500/15 border-amber-500/50 text-amber-400'
                                            : 'border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-white bg-slate-800/40'
                                    }`}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {produk.map(p => (
                        <div key={p.id} className={`rounded-2xl border overflow-hidden transition-all
                            ${p.is_active ? 'bg-slate-800/70 border-slate-700/50' : 'bg-slate-800/30 border-slate-700/30 opacity-60'}`}>
                            {/* Foto */}
                            <div className="aspect-square bg-slate-700/50 flex items-center justify-center overflow-hidden">
                                {p.foto_url ? (
                                    <img src={p.foto_url} alt={p.nama} className="w-full h-full object-cover" />
                                ) : (
                                    <TagIcon className="w-8 h-8 text-slate-600" />
                                )}
                            </div>
                            {/* Info */}
                            <div className="p-2.5">
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${kategoriBadge[p.kategori] ?? kategoriBadge.Lainnya}`}>
                                    {p.kategori}
                                </span>
                                <p className="text-sm font-semibold text-white mt-1.5 leading-tight line-clamp-2">{p.nama}</p>
                                <p className="text-sm font-bold text-amber-400 mt-1">{rupiah(p.harga_jual)}</p>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-slate-500">
                                        {p.has_resep ? `${p.jumlah_bahan} bahan` : 'Tanpa resep'}
                                    </span>
                                    <Link href={route('produk.edit', p.id)}
                                        className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors">
                                        <PencilSquareIcon className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                    {produk.length === 0 && (
                        <div className="col-span-full py-16 text-center text-slate-500 text-sm">
                            Belum ada produk. <Link href={route('produk.create')} className="text-amber-400">Tambahkan sekarang →</Link>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
