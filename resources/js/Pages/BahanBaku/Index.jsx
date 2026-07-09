import AppLayout from '@/Layouts/AppLayout';
import { rupiah, formatStok } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { PlusIcon, PencilSquareIcon, ExclamationTriangleIcon, CubeIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useSortableData } from '@/lib/sort';
import SortableHeader from '@/Components/SortableHeader';

export default function BahanBakuIndex({ bahan_baku, total_nilai, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const activeJenis = filters.jenis ?? 'semua';

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('bahan-baku.index'), { search, jenis: activeJenis }, { preserveState: true });
    };

    const setJenis = (jenis) => {
        router.get(route('bahan-baku.index'), { jenis, search }, { preserveState: true });
    };

    const totalProduk    = bahan_baku.filter(b => b.jenis === 'produk').reduce((s, b) => s + b.nilai_stok, 0);
    const totalNonProduk = bahan_baku.filter(b => b.jenis === 'non_produk').reduce((s, b) => s + b.nilai_stok, 0);

    const tabs = [
        { key: 'semua',      label: 'Semua',      icon: null,                         count: bahan_baku.length },
        { key: 'produk',     label: 'Produk',      icon: CubeIcon,          color: 'amber', count: bahan_baku.filter(b => b.jenis === 'produk').length },
        { key: 'non_produk', label: 'Non-Produk',  icon: WrenchScrewdriverIcon, color: 'blue', count: bahan_baku.filter(b => b.jenis === 'non_produk').length },
    ];

    const displayedBahanBaku = activeJenis === 'semua'
        ? bahan_baku
        : bahan_baku.filter(b => b.jenis === activeJenis);

    const { items: sortedBahanBaku, sortConfig, requestSort } = useSortableData(displayedBahanBaku);

    return (
        <AppLayout title="Bahan Baku">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-xl font-bold text-white">Bahan Baku</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-xs text-slate-400">
                                Total nilai stok: <span className="text-amber-400 font-semibold">{rupiah(total_nilai)}</span>
                            </p>
                            {activeJenis === 'semua' && (
                                <>
                                    <span className="text-slate-600">·</span>
                                    <p className="text-xs text-slate-400">
                                        Produk: <span className="text-amber-400 font-semibold">{rupiah(totalProduk)}</span>
                                    </p>
                                    <span className="text-slate-600">·</span>
                                    <p className="text-xs text-slate-400">
                                        Non-Produk: <span className="text-blue-400 font-semibold">{rupiah(totalNonProduk)}</span>
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                    <Link href={route('bahan-baku.create')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl transition-all">
                        <PlusIcon className="w-4 h-4" /> Tambah
                    </Link>
                </div>

                {/* Tabs Jenis */}
                <div className="flex items-center gap-2 mb-4">
                    {tabs.map(tab => {
                        const isActive = activeJenis === tab.key;
                        const colorMap = {
                            amber: isActive ? 'bg-amber-500/15 border-amber-500/50 text-amber-400' : 'border-slate-700/50 text-slate-400 hover:border-slate-600',
                            blue:  isActive ? 'bg-blue-500/15 border-blue-500/50 text-blue-400'   : 'border-slate-700/50 text-slate-400 hover:border-slate-600',
                        };
                        const cls = tab.color
                            ? colorMap[tab.color]
                            : isActive ? 'bg-slate-700 border-slate-600 text-white' : 'border-slate-700/50 text-slate-400 hover:border-slate-600';
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setJenis(tab.key)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${cls}`}
                            >
                                {tab.icon && <tab.icon className="w-3.5 h-3.5" />}
                                {tab.label}
                                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20' : 'bg-slate-700'}`}>
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Filter */}
                <div className="flex gap-3 mb-5">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Cari bahan baku..."
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        />
                        <button type="submit" className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm">
                            Cari
                        </button>
                    </form>
                    <button
                        onClick={() => router.get(route('bahan-baku.index'), { kategori: 'rendah' })}
                        className="flex items-center gap-1.5 px-3 py-2.5 bg-red-900/40 border border-red-700/50 text-red-300 rounded-xl text-sm hover:bg-red-900/60 transition-colors">
                        <ExclamationTriangleIcon className="w-4 h-4" />
                        Stok Rendah
                    </button>
                </div>

                {/* Tabel */}
                <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700/50 text-xs text-slate-400 uppercase tracking-wider">
                                    <SortableHeader label="SKU" sortKey="sku" currentSort={sortConfig} onSort={requestSort} align="left" />
                                    <SortableHeader label="Bahan Baku" sortKey="nama" currentSort={sortConfig} onSort={requestSort} align="left" />
                                    <SortableHeader label="Jenis" sortKey="jenis" currentSort={sortConfig} onSort={requestSort} align="center" />
                                    <SortableHeader label="Stok" sortKey="stok_saat_ini" currentSort={sortConfig} onSort={requestSort} align="right" />
                                    <SortableHeader label="Min Stok" sortKey="stok_minimum" currentSort={sortConfig} onSort={requestSort} align="right" />
                                    <SortableHeader label="HPP Rata-rata" sortKey="hpp_rata_rata" currentSort={sortConfig} onSort={requestSort} align="right" />
                                    <SortableHeader label="Nilai Stok" sortKey="nilai_stok" currentSort={sortConfig} onSort={requestSort} align="right" />
                                    <th className="text-center px-4 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                {sortedBahanBaku.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                                            Tidak ada bahan baku
                                        </td>
                                    </tr>
                                ) : sortedBahanBaku.map(b => (
                                    <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="px-4 py-3">
                                            {b.sku
                                                ? <span className="font-mono text-sm font-extrabold tracking-wider text-cyan-300 bg-cyan-950/80 border border-cyan-500/50 px-2.5 py-1 rounded-lg shadow-sm select-all inline-block">{b.sku}</span>
                                                : <span className="text-xs text-slate-600 italic">—</span>
                                            }
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                {b.is_stok_rendah && (
                                                    <ExclamationTriangleIcon className="w-4 h-4 text-amber-400 shrink-0" title="Stok rendah" />
                                                )}
                                                <div>
                                                    <p className="font-medium text-white">{b.nama}</p>
                                                    {b.is_rokok && <p className="text-xs text-slate-500">{b.isi_per_bungkus} batang/bungkus</p>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {b.jenis === 'produk' ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                                    <CubeIcon className="w-3 h-3" /> Produk
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                                    <WrenchScrewdriverIcon className="w-3 h-3" /> Non-Produk
                                                </span>
                                            )}
                                        </td>
                                        <td className={`px-4 py-3 text-right font-semibold ${b.is_stok_rendah ? 'text-red-400' : 'text-white'}`}>
                                            {formatStok(b.stok_saat_ini)} {b.satuan}
                                        </td>
                                        <td className="px-4 py-3 text-right text-slate-400">
                                            {formatStok(b.stok_minimum)} {b.satuan}
                                        </td>
                                        <td className="px-4 py-3 text-right text-slate-300">
                                            {b.hpp_rata_rata > 0 ? rupiah(b.hpp_rata_rata) + '/' + b.satuan : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-right text-amber-400 font-semibold">
                                            {rupiah(b.nilai_stok)}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <Link href={route('bahan-baku.edit', b.id)}
                                                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs transition-colors">
                                                <PencilSquareIcon className="w-3.5 h-3.5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
