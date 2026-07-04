import AppLayout from '@/Layouts/AppLayout';
import LaporanTabs from './LaporanTabs';
import { rupiah, tanggalIndo } from '@/lib/utils';
import { router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { PrinterIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useSortableData } from '@/lib/sort';
import SortableHeader from '@/Components/SortableHeader';

export default function LaporanPenjualan({ transaksi, ringkasan, dari, sampai }) {
    const { items: sortedTransaksi, sortConfig, requestSort } = useSortableData(transaksi.data);
    const [tglDari, setTglDari] = useState(dari);
    const [tglSampai, setTglSampai] = useState(sampai);

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('laporan.penjualan'), { dari: tglDari, sampai: tglSampai }, { preserveState: true });
    };

    const handlePrint = () => window.print();

    return (
        <AppLayout title="Laporan Penjualan">
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
                    <LaporanTabs activeTab="laporan.penjualan" />
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
                    <h1 className="text-2xl font-bold text-slate-900">Laporan Penjualan & Alokasi 3 Dompet</h1>
                    <p className="text-sm text-slate-600">Periode: {tanggalIndo(dari)} s/d {tanggalIndo(sampai)}</p>
                </div>

                {/* Cards Ringkasan 3 Dompet */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
                    <div className="bg-slate-900/60 print:bg-slate-100 rounded-2xl border border-slate-700/50 print:border-slate-300 p-4">
                        <p className="text-[11px] font-bold text-slate-400 print:text-slate-600 uppercase">Total Transaksi</p>
                        <p className="text-lg font-black text-white print:text-slate-900 mt-1">{ringkasan?.jumlah_transaksi || 0} nota</p>
                    </div>

                    <div className="bg-slate-900/60 print:bg-slate-100 rounded-2xl border border-slate-700/50 print:border-slate-300 p-4">
                        <p className="text-[11px] font-bold text-slate-400 print:text-slate-600 uppercase">Total Omset</p>
                        <p className="text-lg font-black text-amber-400 print:text-slate-900 mt-1">{rupiah(ringkasan?.total_omset || 0)}</p>
                    </div>

                    <div className="bg-slate-900/60 print:bg-slate-100 rounded-2xl border border-slate-700/50 print:border-slate-300 p-4">
                        <p className="text-[11px] font-bold text-slate-400 print:text-slate-600 uppercase">Total HPP (Modal)</p>
                        <p className="text-lg font-black text-blue-400 print:text-blue-600 mt-1">{rupiah(ringkasan?.total_hpp || 0)}</p>
                    </div>

                    <div className="bg-slate-900/60 print:bg-slate-100 rounded-2xl border border-slate-700/50 print:border-slate-300 p-4">
                        <p className="text-[11px] font-bold text-slate-400 print:text-slate-600 uppercase">Dompet Modal</p>
                        <p className="text-lg font-black text-blue-400 print:text-blue-600 mt-1">{rupiah(ringkasan?.total_modal || 0)}</p>
                    </div>

                    <div className="bg-slate-900/60 print:bg-slate-100 rounded-2xl border border-slate-700/50 print:border-slate-300 p-4">
                        <p className="text-[11px] font-bold text-slate-400 print:text-slate-600 uppercase">Dompet Operasional</p>
                        <p className="text-lg font-black text-purple-400 print:text-purple-600 mt-1">{rupiah(ringkasan?.total_operasional || 0)}</p>
                    </div>

                    <div className="bg-slate-900/60 print:bg-slate-100 rounded-2xl border border-slate-700/50 print:border-slate-300 p-4">
                        <p className="text-[11px] font-bold text-slate-400 print:text-slate-600 uppercase">Dompet Keuntungan</p>
                        <p className="text-lg font-black text-emerald-400 print:text-emerald-600 mt-1">{rupiah(ringkasan?.total_keuntungan || 0)}</p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-slate-900/60 print:bg-white rounded-2xl border border-slate-700/50 print:border-slate-300 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700/50 print:border-slate-400 text-xs text-slate-400 print:text-slate-600 uppercase tracking-wider">
                                    <SortableHeader label="No Nota / Tanggal" sortKey="nomor_transaksi" currentSort={sortConfig} onSort={requestSort} align="left" />
                                    <SortableHeader label="Metode / Kasir" sortKey="metode_pembayaran" currentSort={sortConfig} onSort={requestSort} align="left" />
                                    <SortableHeader label="Omset Jual" sortKey="total_harga_jual" currentSort={sortConfig} onSort={requestSort} align="right" />
                                    <SortableHeader label="Dompet Modal" sortKey="total_dana_modal" currentSort={sortConfig} onSort={requestSort} align="right" />
                                    <SortableHeader label="Operasional" sortKey="total_dana_operasional" currentSort={sortConfig} onSort={requestSort} align="right" />
                                    <SortableHeader label="Keuntungan" sortKey="total_keuntungan" currentSort={sortConfig} onSort={requestSort} align="right" />
                                    <th className="text-center px-4 py-3 print:hidden">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30 print:divide-slate-200">
                                {sortedTransaksi.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                                            Tidak ada transaksi pada periode ini.
                                        </td>
                                    </tr>
                                ) : (
                                    sortedTransaksi.map((t) => (
                                        <tr key={t.id} className="hover:bg-slate-800/40 print:text-slate-900 transition-colors">
                                            <td className="px-4 py-3">
                                                <p className="font-bold text-white print:text-slate-900">{t.nomor_transaksi || `TRX-${t.id}`}</p>
                                                <p className="text-xs text-slate-500 print:text-slate-600">{t.tanggal_transaksi}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="uppercase text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 print:bg-slate-200 text-slate-300 print:text-slate-800">
                                                    {t.metode_pembayaran}
                                                </span>
                                                <p className="text-xs text-slate-400 print:text-slate-600 mt-1">{t.user?.name}</p>
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-white print:text-slate-900">
                                                {rupiah(t.total_harga_jual)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-blue-400 print:text-blue-600">
                                                {rupiah(t.total_dana_modal)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-purple-400 print:text-purple-600">
                                                {rupiah(t.total_dana_operasional)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-bold text-emerald-400 print:text-emerald-600">
                                                {rupiah(t.total_keuntungan)}
                                            </td>
                                            <td className="px-4 py-3 text-center print:hidden">
                                                <Link
                                                    href={route('pos.struk', t.id)}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                                                >
                                                    <EyeIcon className="w-3.5 h-3.5" /> Struk
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
