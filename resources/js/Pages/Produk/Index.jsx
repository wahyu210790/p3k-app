import AppLayout from '@/Layouts/AppLayout';
import { rupiah } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { PlusIcon, PencilSquareIcon, TagIcon, MagnifyingGlassIcon, Squares2X2Icon, TableCellsIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useSortableData } from '@/lib/sort';
import SortableHeader from '@/Components/SortableHeader';

const kategoriBadge = {
    Makanan:  'bg-orange-900/40 text-orange-300 border border-orange-700/40',
    Minuman:  'bg-blue-900/40 text-blue-300 border border-blue-700/40',
    Rokok:    'bg-red-900/40 text-red-300 border border-red-700/40',
    Mentah:   'bg-emerald-900/40 text-emerald-300 border border-emerald-700/40',
    'Add-On / Topping': 'bg-purple-900/40 text-purple-300 border border-purple-700/40',
    Lainnya:  'bg-slate-700 text-slate-300 border border-slate-600',
};

export default function ProdukIndex({ produk, filters = {} }) {
    const [search, setSearch] = useState(filters?.search ?? '');
    const [activeKategori, setActiveKategori] = useState(filters?.kategori ?? '');

    // View Switcher state: simpan pilihan tampilan di localStorage (default: 'list')
    const [viewMode, setViewMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('produk_view_mode') || 'list';
        }
        return 'list';
    });

    const handleViewModeChange = (mode) => {
        setViewMode(mode);
        if (typeof window !== 'undefined') {
            localStorage.setItem('produk_view_mode', mode);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('produk.index'), { search, kategori: activeKategori }, { preserveState: true });
    };

    const handleKategori = (kategori) => {
        setActiveKategori(kategori);
        router.get(route('produk.index'), { search, kategori }, { preserveState: true });
    };

    // Integrasi fitur sorting client-side
    const { items: sortedProduk, sortConfig, requestSort } = useSortableData(produk);

    return (
        <AppLayout title="Produk">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Daftar Produk</h2>
                    <Link href={route('produk.create')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl transition-all shadow-md">
                        <PlusIcon className="w-4 h-4" /> Tambah Produk
                    </Link>
                </div>

                {/* Filter, Tabs, & View Switcher */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6 items-stretch lg:items-center justify-between bg-slate-900/60 rounded-2xl border border-slate-700/50 p-4 shadow-sm">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama produk..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs rounded-xl transition-colors shrink-0"
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
                                className="px-3 py-2 bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 text-xs rounded-xl transition-colors shrink-0"
                                title="Reset Pencarian"
                            >
                                Reset
                            </button>
                        )}
                    </form>

                    <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3">
                        {/* Kategori Tabs */}
                        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                            {['', 'Makanan', 'Minuman', 'Rokok', 'Mentah', 'Add-On / Topping', 'Lainnya'].map((k) => {
                                const label = k === '' ? 'Semua' : k;
                                const isActive = activeKategori === k;
                                return (
                                    <button
                                        key={label}
                                        type="button"
                                        onClick={() => handleKategori(k)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
                                            isActive
                                                ? 'bg-amber-500/15 border-amber-500/50 text-amber-400 shadow-sm'
                                                : 'border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-white bg-slate-800/40'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* View Switcher Toggle */}
                        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/80 shrink-0 shadow-inner">
                            <button
                                type="button"
                                onClick={() => handleViewModeChange('list')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    viewMode === 'list'
                                        ? 'bg-amber-500 text-slate-900 shadow-sm'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
                                }`}
                                title="Tampilan Tabel (List View)"
                            >
                                <TableCellsIcon className="w-4 h-4" />
                                <span>Tabel</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleViewModeChange('grid')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                    viewMode === 'grid'
                                        ? 'bg-amber-500 text-slate-900 shadow-sm'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
                                }`}
                                title="Tampilan Kartu (Grid View)"
                            >
                                <Squares2X2Icon className="w-4 h-4" />
                                <span>Kartu</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content: Mode List vs Mode Grid */}
                {viewMode === 'list' ? (
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 overflow-hidden shadow-lg transition-all">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-700/50 text-xs text-slate-400 uppercase tracking-wider bg-slate-800/50">
                                        <th className="px-4 py-3.5 text-center w-14">Foto</th>
                                        <SortableHeader label="Nama Produk" sortKey="nama" currentSort={sortConfig} onSort={requestSort} align="left" />
                                        <SortableHeader label="Kategori" sortKey="kategori" currentSort={sortConfig} onSort={requestSort} align="center" />
                                        <SortableHeader label="Harga Jual" sortKey="harga_jual" currentSort={sortConfig} onSort={requestSort} align="right" />
                                        <SortableHeader label="Bahan Baku" sortKey="jumlah_bahan" currentSort={sortConfig} onSort={requestSort} align="center" />
                                        <th className="text-center px-4 py-3.5">Status</th>
                                        <th className="text-center px-4 py-3.5">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/30">
                                    {sortedProduk.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-16 text-center text-slate-500 text-sm">
                                                Belum ada produk. <Link href={route('produk.create')} className="text-amber-400 font-semibold hover:underline">Tambahkan sekarang →</Link>
                                            </td>
                                        </tr>
                                    ) : (
                                        sortedProduk.map((p) => (
                                            <tr key={p.id} className={`hover:bg-slate-800/50 transition-colors ${!p.is_active ? 'opacity-60 bg-slate-800/20' : ''}`}>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 overflow-hidden flex items-center justify-center mx-auto shrink-0 shadow">
                                                        {p.foto_url ? (
                                                            <img src={p.foto_url} alt={p.nama} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <TagIcon className="w-5 h-5 text-slate-500" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="font-semibold text-white text-sm">{p.nama}</p>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold inline-block ${kategoriBadge[p.kategori] ?? kategoriBadge.Lainnya}`}>
                                                        {p.kategori}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold text-amber-400 text-sm">
                                                    {rupiah(p.harga_jual)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {p.has_resep ? (
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                                            {p.jumlah_bahan} bahan
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-slate-500 italic">Tanpa resep</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {p.is_active ? (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-700 text-slate-400 border border-slate-600">
                                                            Nonaktif
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <Link
                                                        href={route('produk.edit', p.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-900 border border-slate-700 hover:border-amber-500 text-slate-300 text-xs font-bold transition-all shadow-sm group"
                                                        title="Edit Produk"
                                                    >
                                                        <PencilSquareIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                                                        <span>Edit</span>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 transition-all">
                        {sortedProduk.map(p => (
                            <div key={p.id} className={`rounded-2xl border overflow-hidden transition-all
                                ${p.is_active ? 'bg-slate-800/70 border-slate-700/50 hover:border-slate-600' : 'bg-slate-800/30 border-slate-700/30 opacity-60'}`}>
                                {/* Foto */}
                                <div className="aspect-square bg-slate-700/50 flex items-center justify-center overflow-hidden relative">
                                    {p.foto_url ? (
                                        <img src={p.foto_url} alt={p.nama} className="w-full h-full object-cover" />
                                    ) : (
                                        <TagIcon className="w-8 h-8 text-slate-600" />
                                    )}
                                    {!p.is_active && (
                                        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px] flex items-center justify-center">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/80 text-white uppercase tracking-wider">Nonaktif</span>
                                        </div>
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
                                            className="p-1.5 rounded-lg bg-slate-700 hover:bg-amber-500 hover:text-slate-900 text-white transition-all shadow-sm"
                                            title="Edit Produk">
                                            <PencilSquareIcon className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {sortedProduk.length === 0 && (
                            <div className="col-span-full py-16 text-center text-slate-500 text-sm">
                                Belum ada produk. <Link href={route('produk.create')} className="text-amber-400 hover:underline font-semibold">Tambahkan sekarang →</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
