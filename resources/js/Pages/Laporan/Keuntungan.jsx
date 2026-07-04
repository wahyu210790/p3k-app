import AppLayout from '@/Layouts/AppLayout';
import LaporanTabs from './LaporanTabs';
import { rupiah, tanggalIndo } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { PrinterIcon, CurrencyDollarIcon, ReceiptRefundIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

export default function LaporanKeuntungan({ data_harian, total_pengeluaran, laba_kotor, dari, sampai }) {
    const [tglDari, setTglDari] = useState(dari);
    const [tglSampai, setTglSampai] = useState(sampai);

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('laporan.keuntungan'), { dari: tglDari, sampai: tglSampai }, { preserveState: true });
    };

    const handlePrint = () => window.print();

    // Hitung total akumulasi dari data_harian
    const totalOmset = data_harian.reduce((sum, d) => sum + parseFloat(d.omset || 0), 0);
    const totalHPP = data_harian.reduce((sum, d) => sum + parseFloat(d.hpp || 0), 0);
    const totalOperasionalMasuk = data_harian.reduce((sum, d) => sum + parseFloat(d.operasional || 0), 0);
    const totalKeuntunganKotor = data_harian.reduce((sum, d) => sum + parseFloat(d.keuntungan || 0), 0);

    return (
        <AppLayout title="Laporan Laba / Rugi">
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
                    <LaporanTabs activeTab="laporan.keuntungan" />
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
                    <h1 className="text-2xl font-bold text-slate-900">Laporan Laba Rugi Ringkas</h1>
                    <p className="text-sm text-slate-600">Periode: {tanggalIndo(dari)} s/d {tanggalIndo(sampai)}</p>
                </div>

                {/* Ringkasan Laba Rugi Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-900/80 print:bg-slate-100 rounded-2xl border border-slate-700/60 print:border-slate-300 p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 print:text-slate-900 shrink-0">
                            <CurrencyDollarIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 print:text-slate-600 uppercase tracking-wider">Total Laba Jual (Keuntungan + Operasional)</p>
                            <p className="text-2xl font-black text-emerald-400 print:text-slate-900 mt-1">
                                {rupiah(totalKeuntunganKotor + totalOperasionalMasuk)}
                            </p>
                            <p className="text-xs text-slate-500 print:text-slate-600 mt-0.5">
                                Keuntungan: {rupiah(totalKeuntunganKotor)} | Ops Masuk: {rupiah(totalOperasionalMasuk)}
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-900/80 print:bg-slate-100 rounded-2xl border border-slate-700/60 print:border-slate-300 p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 print:text-slate-900 shrink-0">
                            <ReceiptRefundIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 print:text-slate-600 uppercase tracking-wider">Total Pengeluaran Operasional</p>
                            <p className="text-2xl font-black text-red-400 print:text-red-600 mt-1">
                                {rupiah(total_pengeluaran)}
                            </p>
                            <p className="text-xs text-slate-500 print:text-slate-600 mt-0.5">
                                Beban listrik, gaji, pemeliharaan, dll.
                            </p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500/20 to-emerald-500/20 print:bg-slate-200 rounded-2xl border border-amber-500/30 print:border-slate-400 p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 print:text-slate-900 shrink-0">
                            <ArrowTrendingUpIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-amber-300 print:text-slate-800 uppercase tracking-wider">Laba Bersih (Laba Kotor)</p>
                            <p className={`text-2xl font-black mt-1 ${laba_kotor < 0 ? 'text-red-400 print:text-red-600' : 'text-amber-400 print:text-slate-900'}`}>
                                {rupiah(laba_kotor)}
                            </p>
                            <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">
                                Laba Jual dikurangi Pengeluaran Operasional
                            </p>
                        </div>
                    </div>
                </div>

                {/* Table Breakdown Harian */}
                <div className="bg-slate-900/60 print:bg-white rounded-2xl border border-slate-700/50 print:border-slate-300 overflow-hidden">
                    <div className="p-4 border-b border-slate-700/50 print:border-slate-300">
                        <h3 className="font-bold text-white print:text-slate-900">Rincian Perolehan Harian</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700/50 print:border-slate-400 text-xs text-slate-400 print:text-slate-600 uppercase tracking-wider">
                                    <th className="text-left px-5 py-3.5">Tanggal</th>
                                    <th className="text-right px-5 py-3.5">Omset Jual</th>
                                    <th className="text-right px-5 py-3.5">HPP (Modal Keluar)</th>
                                    <th className="text-right px-5 py-3.5">Dana Operasional Masuk</th>
                                    <th className="text-right px-5 py-3.5">Keuntungan Murni</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30 print:divide-slate-200">
                                {data_harian.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                                            Tidak ada data penjualan pada periode ini.
                                        </td>
                                    </tr>
                                ) : (
                                    data_harian.map((d, idx) => (
                                        <tr key={idx} className="hover:bg-slate-800/40 print:text-slate-900 transition-colors">
                                            <td className="px-5 py-3.5 font-bold text-white print:text-slate-900">
                                                {tanggalIndo(d.tanggal)}
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-medium text-slate-300 print:text-slate-800">
                                                {rupiah(d.omset)}
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-medium text-blue-400 print:text-blue-600">
                                                {rupiah(d.hpp)}
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-medium text-purple-400 print:text-purple-600">
                                                {rupiah(d.operasional)}
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-bold text-emerald-400 print:text-emerald-600">
                                                {rupiah(d.keuntungan)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            {data_harian.length > 0 && (
                                <tfoot className="bg-slate-800/60 print:bg-slate-100 border-t border-slate-700 print:border-slate-400 font-bold text-white print:text-slate-900">
                                    <tr>
                                        <td className="px-5 py-3.5">TOTAL AKUMULASI</td>
                                        <td className="px-5 py-3.5 text-right">{rupiah(totalOmset)}</td>
                                        <td className="px-5 py-3.5 text-right text-blue-400 print:text-blue-600">{rupiah(totalHPP)}</td>
                                        <td className="px-5 py-3.5 text-right text-purple-400 print:text-purple-600">{rupiah(totalOperasionalMasuk)}</td>
                                        <td className="px-5 py-3.5 text-right text-emerald-400 print:text-emerald-600">{rupiah(totalKeuntunganKotor)}</td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
