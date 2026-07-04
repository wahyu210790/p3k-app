import AppLayout from '@/Layouts/AppLayout';
import { rupiah, tanggalIndo } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useSortableData } from '@/lib/sort';
import SortableHeader from '@/Components/SortableHeader';

export default function PengeluaranIndex({ pengeluaran, total_periode, label_kategori, filters }) {
    const { items: sortedPengeluaran, sortConfig, requestSort } = useSortableData(pengeluaran.data);
    const handleFilter = (dari, sampai) => {
        router.get(route('pengeluaran.index'), { dari, sampai }, { preserveState: true });
    };

    return (
        <AppLayout title="Pengeluaran Operasional">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-xl font-bold text-white">Pengeluaran Operasional</h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Total periode: <span className="text-red-400 font-semibold">{rupiah(total_periode)}</span>
                        </p>
                    </div>
                    <Link href={route('pengeluaran.create')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl transition-all">
                        <PlusIcon className="w-4 h-4" /> Catat Pengeluaran
                    </Link>
                </div>

                {/* Filter Tanggal */}
                <div className="flex gap-3 mb-5">
                    <input type="date" defaultValue={filters.dari}
                        onChange={e => handleFilter(e.target.value, filters.sampai)}
                        className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                    <span className="text-slate-500 self-center">s/d</span>
                    <input type="date" defaultValue={filters.sampai}
                        onChange={e => handleFilter(filters.dari, e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500" />
                </div>

                <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700/50 text-xs text-slate-400 uppercase tracking-wider">
                                    <SortableHeader label="Tanggal" sortKey="tanggal" currentSort={sortConfig} onSort={requestSort} align="left" />
                                    <SortableHeader label="Kategori" sortKey="kategori" currentSort={sortConfig} onSort={requestSort} align="left" />
                                    <SortableHeader label="Keterangan" sortKey="keterangan" currentSort={sortConfig} onSort={requestSort} align="left" />
                                    <SortableHeader label="Jumlah" sortKey="jumlah" currentSort={sortConfig} onSort={requestSort} align="right" />
                                    <SortableHeader label="Dicatat oleh" sortKey="user.name" currentSort={sortConfig} onSort={requestSort} align="left" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                {sortedPengeluaran.length === 0 ? (
                                    <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500">Tidak ada pengeluaran pada periode ini</td></tr>
                                ) : sortedPengeluaran.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-800/40">
                                        <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{tanggalIndo(p.tanggal)}</td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 rounded-full bg-slate-700 text-slate-300 text-xs font-medium">
                                                {label_kategori[p.kategori] ?? p.kategori}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-400 text-xs">{p.keterangan ?? '—'}</td>
                                        <td className="px-4 py-3 text-right font-semibold text-red-400">{rupiah(p.jumlah)}</td>
                                        <td className="px-4 py-3 text-slate-500 text-xs">{p.user?.name}</td>
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
