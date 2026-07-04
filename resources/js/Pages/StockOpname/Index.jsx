import AppLayout from '@/Layouts/AppLayout';
import { tanggalIndo } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { PlusIcon, EyeIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { useSortableData } from '@/lib/sort';
import SortableHeader from '@/Components/SortableHeader';

export default function StockOpnameIndex({ opname }) {
    const { items: sortedOpname, sortConfig, requestSort } = useSortableData(opname.data);
    return (
        <AppLayout title="Stock Opname">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Riwayat Stock Opname</h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            Pemeriksaan dan penyesuaian stok fisik gudang terhadap stok sistem (FIFO)
                        </p>
                    </div>
                    <Link
                        href={route('stock-opname.create')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl transition-all"
                    >
                        <PlusIcon className="w-4 h-4" /> Catat Stock Opname
                    </Link>
                </div>

                <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700/50 text-xs text-slate-400 uppercase tracking-wider">
                                    <SortableHeader label="Tanggal Opname" sortKey="tanggal" currentSort={sortConfig} onSort={requestSort} align="left" />
                                    <SortableHeader label="Jumlah Bahan Diperiksa" sortKey="detail_stock_opname_count" currentSort={sortConfig} onSort={requestSort} align="center" />
                                    <SortableHeader label="Catatan" sortKey="catatan" currentSort={sortConfig} onSort={requestSort} align="left" />
                                    <SortableHeader label="Diperiksa Oleh" sortKey="user.name" currentSort={sortConfig} onSort={requestSort} align="left" />
                                    <th className="text-center px-5 py-3.5">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                {sortedOpname.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-16 text-center text-slate-500">
                                            Belum ada catatan stock opname. <Link href={route('stock-opname.create')} className="text-amber-400 hover:underline">Lakukan pemeriksaan sekarang →</Link>
                                        </td>
                                    </tr>
                                ) : (
                                    sortedOpname.map((o) => (
                                        <tr key={o.id} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <ClipboardDocumentCheckIcon className="w-5 h-5 text-amber-400 shrink-0" />
                                                    <span className="font-semibold text-white">{tanggalIndo(o.tanggal)}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <span className="bg-slate-800 border border-slate-700 px-3 py-1 rounded-full text-xs font-bold text-amber-400">
                                                    {o.detail_stock_opname_count || 0} bahan baku
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-xs text-slate-400 max-w-xs truncate">
                                                {o.catatan || '—'}
                                            </td>
                                            <td className="px-5 py-3.5 text-xs text-slate-300">
                                                {o.user?.name || '—'}
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <Link
                                                    href={route('stock-opname.show', o.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                                                >
                                                    <EyeIcon className="w-3.5 h-3.5" /> Lihat Hasil
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
