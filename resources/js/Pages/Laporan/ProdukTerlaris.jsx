import AppLayout from '@/Layouts/AppLayout';
import LaporanTabs from './LaporanTabs';
import { rupiah, tanggalIndo } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { PrinterIcon, FireIcon } from '@heroicons/react/24/outline';

export default function LaporanProdukTerlaris({ produk_terlaris, dari, sampai }) {
    const [tglDari, setTglDari] = useState(dari);
    const [tglSampai, setTglSampai] = useState(sampai);

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('laporan.produk-terlaris'), { dari: tglDari, sampai: tglSampai }, { preserveState: true });
    };

    const handlePrint = () => window.print();

    return (
        <AppLayout title="Produk Terlaris">
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
                    <LaporanTabs activeTab="laporan.produk-terlaris" />
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
                    <h1 className="text-2xl font-bold text-slate-900">Laporan Produk Terlaris & Paling Menguntungkan</h1>
                    <p className="text-sm text-slate-600">Periode: {tanggalIndo(dari)} s/d {tanggalIndo(sampai)}</p>
                </div>

                {/* Table */}
                <div className="bg-slate-900/60 print:bg-white rounded-2xl border border-slate-700/50 print:border-slate-300 overflow-hidden">
                    <div className="p-4 border-b border-slate-700/50 print:border-slate-300 flex items-center gap-2">
                        <FireIcon className="w-5 h-5 text-amber-400 print:text-slate-900" />
                        <h3 className="font-bold text-white print:text-slate-900">Peringkat Penjualan Produk</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700/50 print:border-slate-400 text-xs text-slate-400 print:text-slate-600 uppercase tracking-wider">
                                    <th className="text-left px-5 py-3.5 w-16">Rank</th>
                                    <th className="text-left px-5 py-3.5">Nama Produk</th>
                                    <th className="text-left px-5 py-3.5">Kategori</th>
                                    <th className="text-right px-5 py-3.5">Total Terjual (Qty)</th>
                                    <th className="text-right px-5 py-3.5">Total Omset</th>
                                    <th className="text-right px-5 py-3.5">Total Keuntungan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30 print:divide-slate-200">
                                {produk_terlaris.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                                            Belum ada penjualan produk pada periode ini.
                                        </td>
                                    </tr>
                                ) : (
                                    produk_terlaris.map((p, idx) => (
                                        <tr key={idx} className="hover:bg-slate-800/40 print:text-slate-900 transition-colors">
                                            <td className="px-5 py-3.5 font-black text-amber-400 print:text-slate-900">
                                                #{idx + 1}
                                            </td>
                                            <td className="px-5 py-3.5 font-bold text-white print:text-slate-900">
                                                {p.produk?.nama || 'Produk Terhapus'}
                                            </td>
                                            <td className="px-5 py-3.5 text-xs text-slate-400 print:text-slate-600 capitalize">
                                                {p.produk?.kategori || '—'}
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-bold text-slate-200 print:text-slate-800">
                                                {p.total_terjual} <span className="text-xs text-slate-500">porsi/pcs</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-bold text-white print:text-slate-900">
                                                {rupiah(p.total_omset)}
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-black text-emerald-400 print:text-emerald-600">
                                                {rupiah(p.total_keuntungan)}
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
