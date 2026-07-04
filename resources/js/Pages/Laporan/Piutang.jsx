import AppLayout from '@/Layouts/AppLayout';
import LaporanTabs from './LaporanTabs';
import { rupiah, tanggalIndo } from '@/lib/utils';
import { router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { PrinterIcon, ClockIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export default function LaporanPiutang({ piutang, total_belum_lunas, filters }) {
    const [status, setStatus] = useState(filters.status ?? 'belum_lunas');

    const handleFilter = (st) => {
        setStatus(st);
        router.get(route('laporan.piutang'), { status: st }, { preserveState: true });
    };

    const handlePrint = () => window.print();

    return (
        <AppLayout title="Laporan Piutang">
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
                    <LaporanTabs activeTab="laporan.piutang" />
                </div>

                {/* Print Header */}
                <div className="hidden print:block mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-slate-900">Laporan Piutang Pelanggan</h1>
                    <p className="text-sm text-slate-600">Dicetak pada {new Date().toLocaleDateString('id-ID')}</p>
                </div>

                {/* Card Summary */}
                <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent print:bg-slate-100 border border-amber-500/30 print:border-slate-300 rounded-2xl p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 print:text-slate-900 shrink-0">
                            <ClockIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-amber-300 print:text-slate-600 uppercase tracking-wider">Total Piutang Belum Lunas (Dana Mengendap)</p>
                            <p className="text-3xl font-black text-white print:text-slate-900 mt-1">{rupiah(total_belum_lunas)}</p>
                        </div>
                    </div>
                    <div className="flex gap-2 print:hidden">
                        <button
                            onClick={() => handleFilter('belum_lunas')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                status === 'belum_lunas' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                        >
                            Belum Lunas
                        </button>
                        <button
                            onClick={() => handleFilter('lunas')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                status === 'lunas' ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                        >
                            Sudah Lunas
                        </button>
                        <button
                            onClick={() => handleFilter('')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                status === '' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                        >
                            Semua Data
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-slate-900/60 print:bg-white rounded-2xl border border-slate-700/50 print:border-slate-300 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700/50 print:border-slate-400 text-xs text-slate-400 print:text-slate-600 uppercase tracking-wider">
                                    <th className="text-left px-5 py-3.5">Tanggal / Transaksi</th>
                                    <th className="text-left px-5 py-3.5">Nama & WA Pelanggan</th>
                                    <th className="text-right px-5 py-3.5">Total Piutang</th>
                                    <th className="text-right px-5 py-3.5">Sudah Dibayar</th>
                                    <th className="text-right px-5 py-3.5">Sisa Tagihan</th>
                                    <th className="text-center px-5 py-3.5">Status</th>
                                    <th className="text-center px-5 py-3.5 print:hidden">Kelola</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30 print:divide-slate-200">
                                {piutang.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                                            Tidak ada data piutang pada filter ini.
                                        </td>
                                    </tr>
                                ) : (
                                    piutang.data.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-800/40 print:text-slate-900 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <p className="font-semibold text-white print:text-slate-900">{tanggalIndo(p.tanggal_piutang)}</p>
                                                <p className="text-xs text-slate-500">{p.transaksi?.nomor_transaksi || `TRX-${p.transaksi_id}`}</p>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <p className="font-bold text-slate-200 print:text-slate-900">{p.nama_pelanggan || 'Tanpa Nama'}</p>
                                                {p.nomor_wa && <p className="text-xs text-slate-400 print:text-slate-600">WA: {p.nomor_wa}</p>}
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-medium text-slate-300 print:text-slate-800">
                                                {rupiah(p.jumlah_piutang)}
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-medium text-emerald-400 print:text-emerald-600">
                                                {rupiah(p.jumlah_terbayar)}
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-bold text-amber-400 print:text-slate-900">
                                                {rupiah(p.sisa_piutang)}
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                                                    p.status === 'lunas' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                }`}>
                                                    {p.status?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-center print:hidden">
                                                <Link
                                                    href={route('piutang.index')}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                                                >
                                                    <span>Bayar</span>
                                                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
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
