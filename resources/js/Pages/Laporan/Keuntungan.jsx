import AppLayout from '@/Layouts/AppLayout';
import LaporanTabs from './LaporanTabs';
import { rupiah, tanggalIndo } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { PrinterIcon, CurrencyDollarIcon, ReceiptRefundIcon, ArrowTrendingUpIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function LaporanKeuntungan({ data_harian, total_pengeluaran, total_pembelian_non_produk, laba_kotor, dari, sampai }) {
    const [tglDari, setTglDari] = useState(dari);
    const [tglSampai, setTglSampai] = useState(sampai);

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('laporan.keuntungan'), { dari: tglDari, sampai: tglSampai }, { preserveState: true });
    };

    const handlePrint = () => window.print();

    // Hitung total akumulasi dari data_harian
    const totalOmset                = data_harian.reduce((sum, d) => sum + parseFloat(d.omset || 0), 0);
    const totalHPP                  = data_harian.reduce((sum, d) => sum + parseFloat(d.hpp || 0), 0);
    const totalOperasionalMasuk     = data_harian.reduce((sum, d) => sum + parseFloat(d.operasional || 0), 0);
    const totalKeuntunganKotor      = data_harian.reduce((sum, d) => sum + parseFloat(d.keuntungan || 0), 0);
    const totalPembelianNonProduk   = data_harian.reduce((sum, d) => sum + parseFloat(d.pembelian_non_produk || 0), 0);

    return (
        <AppLayout title="Laporan Laba / Rugi">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-2 print:hidden">
                    <div>
                        <h2 className="text-xl font-bold text-white">Laporan Operasional &amp; Keuangan</h2>
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

                {/* Ringkasan Laba Rugi Cards — baris 1 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-slate-900/80 print:bg-slate-100 rounded-2xl border border-slate-700/60 print:border-slate-300 p-5 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                            <CurrencyDollarIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 print:text-slate-600 uppercase tracking-wider">Laba Jual Kotor</p>
                            <p className="text-xl font-black text-emerald-400 print:text-slate-900 mt-0.5">
                                {rupiah(totalKeuntunganKotor + totalOperasionalMasuk)}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Untung: {rupiah(totalKeuntunganKotor)} + Ops: {rupiah(totalOperasionalMasuk)}
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-900/80 print:bg-slate-100 rounded-2xl border border-slate-700/60 print:border-slate-300 p-5 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                            <ShoppingCartIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 print:text-slate-600 uppercase tracking-wider">Pembelian Non-Produk</p>
                            <p className="text-xl font-black text-orange-400 print:text-orange-600 mt-0.5">
                                {rupiah(total_pembelian_non_produk ?? totalPembelianNonProduk)}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">Gas, sabun, dll.</p>
                        </div>
                    </div>

                    <div className="bg-slate-900/80 print:bg-slate-100 rounded-2xl border border-slate-700/60 print:border-slate-300 p-5 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                            <ReceiptRefundIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 print:text-slate-600 uppercase tracking-wider">Pengeluaran Operasional</p>
                            <p className="text-xl font-black text-red-400 print:text-red-600 mt-0.5">
                                {rupiah(total_pengeluaran)}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">Listrik, gaji, dll.</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-amber-500/20 to-emerald-500/20 print:bg-slate-200 rounded-2xl border border-amber-500/30 print:border-slate-400 p-5 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                            <ArrowTrendingUpIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-amber-300 print:text-slate-800 uppercase tracking-wider">Laba Bersih</p>
                            <p className={`text-xl font-black mt-0.5 ${laba_kotor < 0 ? 'text-red-400 print:text-red-600' : 'text-amber-400 print:text-slate-900'}`}>
                                {rupiah(laba_kotor)}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">Setelah semua potongan</p>
                        </div>
                    </div>
                </div>

                {/* Keterangan formula */}
                <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-2.5 mb-6 text-xs text-slate-400 flex flex-wrap items-center gap-2">
                    <span className="text-emerald-400 font-semibold">Laba Jual Kotor</span>
                    <span>−</span>
                    <span className="text-orange-400 font-semibold">Pembelian Non-Produk</span>
                    <span>−</span>
                    <span className="text-red-400 font-semibold">Pengeluaran Operasional</span>
                    <span>=</span>
                    <span className="text-amber-400 font-semibold">Laba Bersih</span>
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
                                    <th className="text-right px-5 py-3.5">Dana Ops. Masuk</th>
                                    <th className="text-right px-5 py-3.5">Keuntungan Murni</th>
                                    <th className="text-right px-5 py-3.5 text-orange-400">Beli Non-Produk</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30 print:divide-slate-200">
                                {data_harian.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
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
                                            <td className="px-5 py-3.5 text-right font-medium text-orange-400 print:text-orange-600">
                                                {parseFloat(d.pembelian_non_produk || 0) > 0
                                                    ? rupiah(d.pembelian_non_produk)
                                                    : <span className="text-slate-600">—</span>
                                                }
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
                                        <td className="px-5 py-3.5 text-right text-orange-400 print:text-orange-600">{rupiah(totalPembelianNonProduk)}</td>
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
