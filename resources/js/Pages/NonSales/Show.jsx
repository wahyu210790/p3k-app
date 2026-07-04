import AppLayout from '@/Layouts/AppLayout';
import { rupiah, datetimeIndo } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { PrinterIcon, ArrowLeftIcon, ExclamationTriangleIcon, UserIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function NonSalesShow({ non_sales, label_kategori }) {
    const handlePrint = () => window.print();

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
        <AppLayout title={`Detail Non-Sales #${non_sales.id}`}>
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6 print:hidden">
                    <Link
                        href={route('non-sales.index')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4" /> Kembali ke Daftar Non-Sales
                    </Link>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all"
                    >
                        <PrinterIcon className="w-4 h-4 text-amber-400" /> Cetak Laporan
                    </button>
                </div>

                <div className="bg-slate-900/80 rounded-2xl border border-slate-700/60 p-6 sm:p-8 shadow-2xl print:shadow-none print:border-0 print:bg-white print:text-slate-900">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 print:border-slate-300 pb-6 mb-6">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <ExclamationTriangleIcon className="w-6 h-6 text-amber-400 print:text-slate-900" />
                                <h1 className="text-2xl font-black text-white print:text-slate-900">
                                    Catatan Non-Sales #{non_sales.id}
                                </h1>
                            </div>
                            <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                                Dicatat pada {datetimeIndo(non_sales.created_at)}
                            </p>
                        </div>
                        <div>
                            <span className={`inline-block text-xs px-3 py-1 rounded-full border font-bold ${badgeColor(non_sales.kategori)} print:border-slate-400 print:text-slate-900`}>
                                {label_kategori[non_sales.kategori] ?? non_sales.kategori}
                            </span>
                        </div>
                    </div>

                    {/* Info Pihak */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 bg-slate-800/40 print:bg-slate-100 p-4 rounded-xl border border-slate-700/40 print:border-slate-300">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <CalendarIcon className="w-3.5 h-3.5" /> Tanggal Kejadian / Pengeluaran
                            </p>
                            <p className="font-bold text-white print:text-slate-900 text-sm">
                                {non_sales.tanggal}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <UserIcon className="w-3.5 h-3.5" /> Dicatat Oleh
                            </p>
                            <p className="font-bold text-white print:text-slate-900 text-sm">
                                {non_sales.user?.name || 'Sistem / Admin'}
                            </p>
                        </div>
                    </div>

                    {/* Tabel Item Non-Sales */}
                    <div className="mb-6 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700 print:border-slate-400 text-xs text-slate-400 print:text-slate-600 uppercase tracking-wider">
                                    <th className="text-left py-3 px-2">No</th>
                                    <th className="text-left py-3 px-2">Nama Barang / Bahan Baku</th>
                                    <th className="text-right py-3 px-2">Jumlah Keluar</th>
                                    <th className="text-right py-3 px-2">HPP Satuan</th>
                                    <th className="text-right py-3 px-2">Subtotal HPP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                                {non_sales.detail_non_sales?.map((detail, idx) => {
                                    const nama = detail.produk ? `📦 ${detail.produk.nama}` : `🧪 ${detail.bahan_baku?.nama}`;
                                    const satuan = detail.produk ? 'porsi/pcs' : detail.bahan_baku?.satuan;
                                    return (
                                        <tr key={detail.id} className="text-slate-200 print:text-slate-900">
                                            <td className="py-3 px-2 text-xs text-slate-400">{idx + 1}</td>
                                            <td className="py-3 px-2 font-medium">{nama}</td>
                                            <td className="py-3 px-2 text-right font-semibold">
                                                {detail.jumlah} <span className="text-xs text-slate-400 print:text-slate-600">{satuan}</span>
                                            </td>
                                            <td className="py-3 px-2 text-right text-slate-400">
                                                {rupiah(detail.hpp_satuan)}
                                            </td>
                                            <td className="py-3 px-2 text-right font-bold text-amber-400 print:text-slate-900">
                                                {rupiah(detail.subtotal_hpp)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Ringkasan & Catatan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-800 print:border-slate-300 pt-6">
                        <div>
                            {non_sales.catatan && (
                                <div className="bg-slate-800/60 print:bg-slate-100 p-3.5 rounded-xl border border-slate-700/40 print:border-slate-300">
                                    <p className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider mb-1">Catatan Tambahan:</p>
                                    <p className="text-xs text-slate-300 print:text-slate-900 italic">"{non_sales.catatan}"</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl print:border-slate-400 print:bg-slate-100">
                            <span className="text-xs font-semibold text-amber-400 print:text-slate-600 uppercase tracking-wider">Total Beban HPP:</span>
                            <span className="font-black text-amber-400 print:text-slate-900 text-xl">{rupiah(non_sales.total_hpp)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
