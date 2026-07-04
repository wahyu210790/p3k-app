import AppLayout from '@/Layouts/AppLayout';
import { rupiah, tanggalIndo } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { PlusIcon, EyeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function NonSalesIndex({ non_sales, label_kategori, filters }) {
    const [kategori, setKategori] = useState(filters.kategori ?? '');
    const [dari, setDari] = useState(filters.dari ?? '');
    const [sampai, setSampai] = useState(filters.sampai ?? '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            route('non-sales.index'),
            { kategori, dari, sampai },
            { preserveState: true }
        );
    };

    const badgeColor = (kat) => {
        switch (kat) {
            case 'jatah_karyawan':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'promosi':
                return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'rusak':
                return 'bg-red-500/10 text-red-400 border-red-500/20';
            case 'kedaluwarsa':
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            default:
                return 'bg-slate-700 text-slate-300 border-slate-600';
        }
    };

    return (
        <AppLayout title="Catatan Non-Sales">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Catatan Non-Sales</h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Catat barang keluar tanpa penjualan (jatah karyawan, rusak, promosi) yang mengurangi stok FIFO
                        </p>
                    </div>
                    <Link
                        href={route('non-sales.create')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl transition-all"
                    >
                        <PlusIcon className="w-4 h-4" /> Catat Non-Sales
                    </Link>
                </div>

                {/* Filter Bar */}
                <form onSubmit={handleFilter} className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-4 mb-6 flex flex-wrap gap-3 items-end">
                    <div className="flex-1 min-w-[160px]">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Kategori</label>
                        <select
                            value={kategori}
                            onChange={(e) => setKategori(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        >
                            <option value="">Semua Kategori</option>
                            {Object.entries(label_kategori).map(([k, label]) => (
                                <option key={k} value={k}>{label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-36">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Dari Tanggal</label>
                        <input
                            type="date"
                            value={dari}
                            onChange={(e) => setDari(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    <div className="w-36">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Sampai Tanggal</label>
                        <input
                            type="date"
                            value={sampai}
                            onChange={(e) => setSampai(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs rounded-xl transition-colors"
                        >
                            Filter
                        </button>
                        {(kategori || dari || sampai) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setKategori(''); setDari(''); setSampai('');
                                    router.get(route('non-sales.index'));
                                }}
                                className="px-3 py-2 bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 text-xs rounded-xl transition-colors"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </form>

                {/* Table */}
                <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700/50 text-xs text-slate-400 uppercase tracking-wider">
                                    <th className="text-left px-5 py-3.5">Tanggal</th>
                                    <th className="text-left px-5 py-3.5">Kategori</th>
                                    <th className="text-left px-5 py-3.5">Catatan</th>
                                    <th className="text-right px-5 py-3.5">Total HPP</th>
                                    <th className="text-left px-5 py-3.5">Dicatat Oleh</th>
                                    <th className="text-center px-5 py-3.5">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                {non_sales.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-16 text-center text-slate-500">
                                            Belum ada catatan non-sales pada filter ini.
                                        </td>
                                    </tr>
                                ) : (
                                    non_sales.data.map((ns) => (
                                        <tr key={ns.id} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="px-5 py-3.5 text-slate-300 font-medium whitespace-nowrap">
                                                {tanggalIndo(ns.tanggal)}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-block text-xs px-2.5 py-1 rounded-full border font-semibold ${badgeColor(ns.kategori)}`}>
                                                    {label_kategori[ns.kategori] ?? ns.kategori}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-xs text-slate-400 max-w-xs truncate">
                                                {ns.catatan || '—'}
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-bold text-amber-400">
                                                {rupiah(ns.total_hpp)}
                                            </td>
                                            <td className="px-5 py-3.5 text-xs text-slate-400">
                                                {ns.user?.name || '—'}
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <Link
                                                    href={route('non-sales.show', ns.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                                                >
                                                    <EyeIcon className="w-3.5 h-3.5" /> Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
