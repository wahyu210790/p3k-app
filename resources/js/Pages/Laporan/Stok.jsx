import AppLayout from '@/Layouts/AppLayout';
import LaporanTabs from './LaporanTabs';
import { rupiah } from '@/lib/utils';
import { PrinterIcon, CubeIcon, ExclamationTriangleIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { useSortableData } from '@/lib/sort';
import SortableHeader from '@/Components/SortableHeader';

export default function LaporanStok({ bahan_baku, total_nilai, jumlah_rendah }) {
    const { items: sortedBahanBaku, sortConfig, requestSort } = useSortableData(bahan_baku);
    const handlePrint = () => window.print();

    return (
        <AppLayout title="Laporan Stok & HPP">
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
                    <LaporanTabs activeTab="laporan.stok" />
                </div>

                {/* Print Header */}
                <div className="hidden print:block mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-slate-900">Laporan Penilaian Stok Gudang (FIFO)</h1>
                    <p className="text-sm text-slate-600">Dicetak pada {new Date().toLocaleDateString('id-ID')}</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-900/80 print:bg-slate-100 rounded-2xl border border-slate-700/60 print:border-slate-300 p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 print:text-slate-900 shrink-0">
                            <BanknotesIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 print:text-slate-600 uppercase tracking-wider">Total Nilai Stok Gudang (Modal)</p>
                            <p className="text-2xl font-black text-amber-400 print:text-slate-900 mt-1">
                                {rupiah(total_nilai)}
                            </p>
                            <p className="text-xs text-slate-500 print:text-slate-600 mt-0.5">
                                Dihitung dari batch FIFO aktif
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-900/80 print:bg-slate-100 rounded-2xl border border-slate-700/60 print:border-slate-300 p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 print:text-slate-900 shrink-0">
                            <CubeIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 print:text-slate-600 uppercase tracking-wider">Macam Bahan Baku Aktif</p>
                            <p className="text-2xl font-black text-white print:text-slate-900 mt-1">
                                {bahan_baku.length} macam
                            </p>
                            <p className="text-xs text-slate-500 print:text-slate-600 mt-0.5">
                                Siap digunakan produksi & POS
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-900/80 print:bg-slate-100 rounded-2xl border border-slate-700/60 print:border-slate-300 p-6 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 print:text-slate-900 shrink-0">
                            <ExclamationTriangleIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 print:text-slate-600 uppercase tracking-wider">Stok Menipis / Kritis</p>
                            <p className={`text-2xl font-black mt-1 ${jumlah_rendah > 0 ? 'text-red-400 print:text-red-600' : 'text-emerald-400 print:text-slate-900'}`}>
                                {jumlah_rendah} bahan baku
                            </p>
                            <p className="text-xs text-slate-500 print:text-slate-600 mt-0.5">
                                Butuh restok segera ke supplier
                            </p>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-slate-900/60 print:bg-white rounded-2xl border border-slate-700/50 print:border-slate-300 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700/50 print:border-slate-400 text-xs text-slate-400 print:text-slate-600 uppercase tracking-wider">
                                    <th className="text-left px-5 py-3.5">No</th>
                                    <SortableHeader label="Nama Bahan Baku" sortKey="nama" currentSort={sortConfig} onSort={requestSort} align="left" />
                                    <SortableHeader label="Stok Saat Ini" sortKey="stok_saat_ini" currentSort={sortConfig} onSort={requestSort} align="right" />
                                    <SortableHeader label="Stok Minimum" sortKey="stok_minimum" currentSort={sortConfig} onSort={requestSort} align="right" />
                                    <SortableHeader label="HPP Rata-Rata / Satuan" sortKey="hpp_rata_rata" currentSort={sortConfig} onSort={requestSort} align="right" />
                                    <SortableHeader label="Nilai Akumulasi Stok" sortKey="nilai_stok" currentSort={sortConfig} onSort={requestSort} align="right" />
                                    <SortableHeader label="Status" sortKey="is_rendah" currentSort={sortConfig} onSort={requestSort} align="center" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30 print:divide-slate-200">
                                {sortedBahanBaku.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                                            Belum ada data bahan baku.
                                        </td>
                                    </tr>
                                ) : (
                                    sortedBahanBaku.map((b, idx) => (
                                        <tr key={b.id} className="hover:bg-slate-800/40 print:text-slate-900 transition-colors">
                                            <td className="px-5 py-3.5 text-xs text-slate-400">{idx + 1}</td>
                                            <td className="px-5 py-3.5 font-bold text-white print:text-slate-900">
                                                {b.nama}
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-semibold text-slate-200 print:text-slate-800">
                                                {b.stok_saat_ini} <span className="text-xs text-slate-500 print:text-slate-600">{b.satuan}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right text-slate-400">
                                                {b.stok_minimum} <span className="text-xs">{b.satuan}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right text-slate-300 print:text-slate-800">
                                                {rupiah(b.hpp_rata_rata)}
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-bold text-amber-400 print:text-slate-900">
                                                {rupiah(b.nilai_stok)}
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                {b.is_rendah ? (
                                                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/20 print:bg-red-100 print:text-red-800">
                                                        ⚠️ Menipis
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 print:bg-emerald-100 print:text-emerald-800">
                                                        Aman
                                                    </span>
                                                )}
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
