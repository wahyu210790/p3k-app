import AppLayout from '@/Layouts/AppLayout';
import LaporanTabs from './LaporanTabs';
import { rupiah, tanggalIndo } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { PrinterIcon, ReceiptRefundIcon } from '@heroicons/react/24/outline';
import { useSortableData } from '@/lib/sort';
import SortableHeader from '@/Components/SortableHeader';

export default function LaporanOperasional({ per_kategori, detail, label_kategori, dari, sampai }) {
    const { items: sortedDetail, sortConfig, requestSort } = useSortableData(detail.data);
    const [tglDari, setTglDari] = useState(dari);
    const [tglSampai, setTglSampai] = useState(sampai);

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('laporan.operasional'), { dari: tglDari, sampai: tglSampai }, { preserveState: true });
    };

    const handlePrint = () => window.print();

    const totalAll = per_kategori.reduce((sum, k) => sum + parseFloat(k.total || 0), 0);

    return (
        <AppLayout title="Laporan Pengeluaran">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-2 print:hidden">
                    <div>
                        <h2 className="text-xl font-bold text-white">Laporan Operasional & Keuangan</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Analisis performa bisnis berdasarkan alur keuangan 3 dompet</p>
                    </div>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all"
                    >
                        <PrinterIcon className="w-4 h-4 text-amber-400" /> Cetak Laporan
                    </button>
                </div>

                <div className="print:hidden">
                    <LaporanTabs activeTab="laporan.operasional" />
                </div>

                {/* Filter Tanggal */}
                <form onSubmit={handleFilter} className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-4 mb-6 flex flex-wrap items-end gap-3 print:hidden">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Dari Tanggal</label>
                        <input
                            type="date"
                            value={tglDari}
                            onChange={(e) => setTglDari(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Sampai Tanggal</label>
                        <input
                            type="date"
                            value={tglSampai}
                            onChange={(e) => setTglSampai(e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs rounded-xl transition-colors"
                    >
                        Tampilkan
                    </button>
                </form>

                {/* Print Header */}
                <div className="hidden print:block mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-slate-900">Laporan Pengeluaran Operasional</h1>
                    <p className="text-sm text-slate-600">Periode: {tanggalIndo(dari)} s/d {tanggalIndo(sampai)}</p>
                </div>

                {/* Grid Kategori */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="md:col-span-1 bg-gradient-to-br from-red-500/20 to-purple-500/20 print:bg-slate-100 rounded-2xl border border-red-500/30 print:border-slate-300 p-6 flex flex-col justify-center">
                        <p className="text-xs font-bold text-red-300 print:text-slate-600 uppercase tracking-wider">Total Pengeluaran Operasional</p>
                        <p className="text-3xl font-black text-red-400 print:text-slate-900 mt-2">{rupiah(totalAll)}</p>
                        <p className="text-xs text-slate-400 print:text-slate-600 mt-1">Pada periode terpilih</p>
                    </div>

                    <div className="md:col-span-2 bg-slate-900/60 print:bg-white rounded-2xl border border-slate-700/50 print:border-slate-300 p-5">
                        <p className="text-xs font-bold text-slate-400 print:text-slate-600 uppercase tracking-wider mb-3">Rincian Per Kategori:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {per_kategori.map((k) => (
                                <div key={k.kategori} className="bg-slate-800/60 print:bg-slate-100 p-3 rounded-xl border border-slate-700/40 print:border-slate-200">
                                    <p className="text-xs text-slate-400 print:text-slate-600 font-medium">
                                        {label_kategori[k.kategori] ?? k.kategori}
                                    </p>
                                    <p className="text-base font-bold text-white print:text-slate-900 mt-0.5">{rupiah(k.total)}</p>
                                    <p className="text-[10px] text-slate-500 print:text-slate-600 mt-0.5">{k.jumlah_transaksi} kali catatan</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Table Detail */}
                <div className="bg-slate-900/60 print:bg-white rounded-2xl border border-slate-700/50 print:border-slate-300 overflow-hidden">
                    <div className="p-4 border-b border-slate-700/50 print:border-slate-300">
                        <h3 className="font-bold text-white print:text-slate-900">Daftar Pengeluaran</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700/50 print:border-slate-400 text-xs text-slate-400 print:text-slate-600 uppercase tracking-wider">
                                    <SortableHeader label="Tanggal" sortKey="tanggal" currentSort={sortConfig} onSort={requestSort} align="left" />
                                    <SortableHeader label="Kategori" sortKey="kategori" currentSort={sortConfig} onSort={requestSort} align="left" />
                                    <SortableHeader label="Keterangan" sortKey="keterangan" currentSort={sortConfig} onSort={requestSort} align="left" />
                                    <SortableHeader label="Jumlah" sortKey="jumlah" currentSort={sortConfig} onSort={requestSort} align="right" />
                                    <SortableHeader label="Dicatat Oleh" sortKey="user.name" currentSort={sortConfig} onSort={requestSort} align="left" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30 print:divide-slate-200">
                                {sortedDetail.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                                            Belum ada catatan pengeluaran pada periode ini.
                                        </td>
                                    </tr>
                                ) : (
                                    sortedDetail.map((d) => (
                                        <tr key={d.id} className="hover:bg-slate-800/40 print:text-slate-900 transition-colors">
                                            <td className="px-5 py-3.5 whitespace-nowrap text-slate-300 print:text-slate-800">
                                                {tanggalIndo(d.tanggal)}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="px-2.5 py-1 rounded-full bg-slate-800 print:bg-slate-200 text-slate-300 print:text-slate-800 text-xs font-semibold">
                                                    {label_kategori[d.kategori] ?? d.kategori}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-xs text-slate-400 print:text-slate-600">
                                                {d.keterangan || '—'}
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-bold text-red-400 print:text-red-600">
                                                {rupiah(d.jumlah)}
                                            </td>
                                            <td className="px-5 py-3.5 text-xs text-slate-400 print:text-slate-600">
                                                {d.user?.name}
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
