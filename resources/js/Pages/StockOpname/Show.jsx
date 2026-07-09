import AppLayout from '@/Layouts/AppLayout';
import { rupiah, datetimeIndo, formatStok } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { PrinterIcon, ArrowLeftIcon, ClipboardDocumentCheckIcon, UserIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function StockOpnameShow({ opname }) {
    const handlePrint = () => window.print();

    // Hitung total nilai selisih
    const totalSelisihNilai = opname.detail_stock_opname?.reduce((sum, d) => {
        // diperkiraan dari selisih qty
        return sum + (d.selisih || 0);
    }, 0) || 0;

    return (
        <AppLayout title={`Detail Stock Opname #${opname.id}`}>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6 print:hidden">
                    <Link
                        href={route('stock-opname.index')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4" /> Kembali ke Riwayat Opname
                    </Link>
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all"
                    >
                        <PrinterIcon className="w-4 h-4 text-amber-400" /> Cetak Laporan Opname
                    </button>
                </div>

                <div className="bg-slate-900/80 rounded-2xl border border-slate-700/60 p-6 sm:p-8 shadow-2xl print:shadow-none print:border-0 print:bg-white print:text-slate-900">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 print:border-slate-300 pb-6 mb-6">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <ClipboardDocumentCheckIcon className="w-6 h-6 text-amber-400 print:text-slate-900" />
                                <h1 className="text-2xl font-black text-white print:text-slate-900">
                                    Laporan Stock Opname #{opname.id}
                                </h1>
                            </div>
                            <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                                Dicatat pada {datetimeIndo(opname.created_at)}
                            </p>
                        </div>
                        <div>
                            <span className="bg-slate-800 print:bg-slate-200 border border-slate-700 print:border-slate-400 px-3 py-1 rounded-full text-xs font-bold text-amber-400 print:text-slate-900">
                                Diperiksa: {opname.detail_stock_opname?.length || 0} bahan baku
                            </span>
                        </div>
                    </div>

                    {/* Info Pihak */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 bg-slate-800/40 print:bg-slate-100 p-4 rounded-xl border border-slate-700/40 print:border-slate-300">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <CalendarIcon className="w-3.5 h-3.5" /> Tanggal Pemeriksaan
                            </p>
                            <p className="font-bold text-white print:text-slate-900 text-sm">
                                {opname.tanggal}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <UserIcon className="w-3.5 h-3.5" /> Diperiksa Oleh
                            </p>
                            <p className="font-bold text-white print:text-slate-900 text-sm">
                                {opname.user?.name || 'Sistem / Admin'}
                            </p>
                        </div>
                    </div>

                    {/* Tabel Item Opname */}
                    <div className="mb-6 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700 print:border-slate-400 text-xs text-slate-400 print:text-slate-600 uppercase tracking-wider">
                                    <th className="text-left py-3 px-2">No</th>
                                    <th className="text-left py-3 px-2">Nama Bahan Baku</th>
                                    <th className="text-right py-3 px-2">Stok Sistem</th>
                                    <th className="text-right py-3 px-2">Stok Fisik</th>
                                    <th className="text-right py-3 px-2">Selisih Qty</th>
                                    <th className="text-left py-3 px-2 pl-4">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                                {opname.detail_stock_opname?.map((detail, idx) => {
                                    const selisih = detail.selisih || 0;
                                    return (
                                        <tr key={detail.id} className="text-slate-200 print:text-slate-900">
                                            <td className="py-3 px-2 text-xs text-slate-400">{idx + 1}</td>
                                            <td className="py-3 px-2 font-medium">
                                                {detail.bahan_baku?.nama || 'Bahan Baku Terhapus'}
                                            </td>
                                            <td className="py-3 px-2 text-right text-slate-400">
                                                {formatStok(detail.stok_sistem)} <span className="text-xs">{detail.bahan_baku?.satuan}</span>
                                            </td>
                                            <td className="py-3 px-2 text-right font-semibold">
                                                {formatStok(detail.stok_fisik)} <span className="text-xs text-slate-400 print:text-slate-600">{detail.bahan_baku?.satuan}</span>
                                            </td>
                                            <td className={`py-3 px-2 text-right font-bold ${selisih < 0 ? 'text-red-400 print:text-red-600' : selisih > 0 ? 'text-emerald-400 print:text-emerald-600' : 'text-slate-500'}`}>
                                                {selisih > 0 ? '+' : ''}{formatStok(selisih)} <span className="text-xs font-normal">{detail.bahan_baku?.satuan}</span>
                                            </td>
                                            <td className="py-3 px-2 pl-4 text-xs text-slate-400 print:text-slate-700 italic">
                                                {detail.keterangan || '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Catatan */}
                    {opname.catatan && (
                        <div className="border-t border-slate-800 print:border-slate-300 pt-6">
                            <div className="bg-slate-800/60 print:bg-slate-100 p-3.5 rounded-xl border border-slate-700/40 print:border-slate-300">
                                <p className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider mb-1">Catatan Pemeriksaan:</p>
                                <p className="text-xs text-slate-300 print:text-slate-900 italic">"{opname.catatan}"</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
