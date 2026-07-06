import AppLayout from '@/Layouts/AppLayout';
import { rupiah, datetimeIndo } from '@/lib/utils';
import { Link, useForm, usePage } from '@inertiajs/react';
import { PrinterIcon, ArrowLeftIcon, DocumentTextIcon, TruckIcon, UserIcon, BanknotesIcon, TrashIcon, ExclamationTriangleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function PembelianShow({ pembelian }) {
    const { errors } = usePage().props;
    const [showConfirm, setShowConfirm] = useState(false);
    const { delete: destroy, processing } = useForm();

    const handlePrint = () => window.print();

    const handleDelete = () => {
        destroy(route('pembelian.destroy', pembelian.id), {
            onSuccess: () => setShowConfirm(false),
            onError: () => setShowConfirm(false),
        });
    };

    const statusBadge = (st) => {
        switch (st) {
            case 'lunas':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'sebagian':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default:
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        }
    };

    return (
        <AppLayout title={`Detail Pembelian #${pembelian.nomor_faktur || pembelian.id}`}>
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6 print:hidden">
                    <Link
                        href={route('pembelian.index')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4" /> Kembali ke Daftar Pembelian
                    </Link>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition-all"
                        >
                            <PrinterIcon className="w-4 h-4 text-amber-400" /> Cetak Bukti Pembelian
                        </button>
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-semibold text-xs rounded-xl border border-red-500/30 hover:border-red-500/50 transition-all"
                        >
                            <TrashIcon className="w-4 h-4" /> Hapus
                        </button>
                    </div>
                </div>

                {/* Flash Error dari proteksi FIFO */}
                {errors?.message && (
                    <div className="mb-4 flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm print:hidden">
                        <XCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{errors.message}</span>
                    </div>
                )}

                <div className="bg-slate-900/80 rounded-2xl border border-slate-700/60 p-6 sm:p-8 shadow-2xl print:shadow-none print:border-0 print:bg-white print:text-slate-900">
                    {/* Header Faktur */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 print:border-slate-300 pb-6 mb-6">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <DocumentTextIcon className="w-6 h-6 text-amber-400 print:text-slate-900" />
                                <h1 className="text-2xl font-black text-white print:text-slate-900">
                                    {pembelian.nomor_faktur || `Faktur PB-${pembelian.id}`}
                                </h1>
                            </div>
                            <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
                                Dicatat pada {datetimeIndo(pembelian.created_at)}
                            </p>
                        </div>
                        <div className="flex flex-col sm:items-end">
                            <span className={`inline-block text-xs px-3 py-1 rounded-full border font-bold capitalize ${statusBadge(pembelian.status_pembayaran)} print:border-slate-400 print:text-slate-900`}>
                                Status: {pembelian.status_pembayaran?.replace('_', ' ')}
                            </span>
                            <p className="text-xs text-slate-400 print:text-slate-600 mt-1.5">
                                Tanggal Beli: <span className="font-semibold text-white print:text-slate-900">{pembelian.tanggal_pembelian}</span>
                            </p>
                        </div>
                    </div>

                    {/* Info Pihak */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 bg-slate-800/40 print:bg-slate-100 p-4 rounded-xl border border-slate-700/40 print:border-slate-300">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <TruckIcon className="w-3.5 h-3.5" /> Supplier Pemasok
                            </p>
                            <p className="font-bold text-white print:text-slate-900 text-sm">
                                {pembelian.supplier?.nama || 'Tanpa Supplier (Umum)'}
                            </p>
                            {pembelian.supplier?.telepon && (
                                <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">{pembelian.supplier.telepon}</p>
                            )}
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <UserIcon className="w-3.5 h-3.5" /> Dicatat Oleh
                            </p>
                            <p className="font-bold text-white print:text-slate-900 text-sm">
                                {pembelian.user?.name || 'Sistem / Admin'}
                            </p>
                            <p className="text-xs text-slate-400 print:text-slate-600 mt-0.5">Staf Operasional</p>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <BanknotesIcon className="w-3.5 h-3.5" /> Pembayaran
                            </p>
                            <p className="font-bold text-emerald-400 print:text-slate-900 text-sm">
                                Dibayar: {rupiah(pembelian.jumlah_bayar)}
                            </p>
                            {pembelian.hutangSupplier && pembelian.hutangSupplier.sisa_hutang > 0 && (
                                <p className="text-xs text-red-400 print:text-red-600 font-semibold mt-0.5">
                                    Sisa Hutang: {rupiah(pembelian.hutangSupplier.sisa_hutang)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Tabel Item Pembelian */}
                    <div className="mb-6 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700 print:border-slate-400 text-xs text-slate-400 print:text-slate-600 uppercase tracking-wider">
                                    <th className="text-left py-3 px-2">No</th>
                                    <th className="text-left py-3 px-2">Nama Bahan Baku</th>
                                    <th className="text-right py-3 px-2">Qty Restok</th>
                                    <th className="text-right py-3 px-2">Harga Satuan</th>
                                    <th className="text-right py-3 px-2">Subtotal Tagihan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 print:divide-slate-200">
                                {pembelian.detail_pembelian?.map((detail, idx) => (
                                    <tr key={detail.id} className="text-slate-200 print:text-slate-900">
                                        <td className="py-3 px-2 text-xs text-slate-400">{idx + 1}</td>
                                        <td className="py-3 px-2 font-medium">
                                            {detail.bahan_baku?.nama || 'Bahan Baku Terhapus'}
                                        </td>
                                        <td className="py-3 px-2 text-right font-semibold">
                                            {detail.jumlah} <span className="text-xs text-slate-400 print:text-slate-600">{detail.bahan_baku?.satuan}</span>
                                        </td>
                                        <td className="py-3 px-2 text-right">
                                            {rupiah(detail.harga_satuan)}
                                        </td>
                                        <td className="py-3 px-2 text-right font-bold text-amber-400 print:text-slate-900">
                                            {rupiah(detail.subtotal_tagihan)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Ringkasan & Catatan */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-800 print:border-slate-300 pt-6">
                        <div>
                            {pembelian.catatan && (
                                <div className="bg-slate-800/60 print:bg-slate-100 p-3.5 rounded-xl border border-slate-700/40 print:border-slate-300">
                                    <p className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider mb-1">Catatan Tambahan:</p>
                                    <p className="text-xs text-slate-300 print:text-slate-900 italic">"{pembelian.catatan}"</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-slate-400 print:text-slate-600">
                                <span>Total Tagihan:</span>
                                <span className="font-bold text-white print:text-slate-900 text-base">{rupiah(pembelian.total_tagihan)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400 print:text-slate-600">
                                <span>Total Dibayar:</span>
                                <span className="font-bold text-emerald-400 print:text-slate-900">{rupiah(pembelian.jumlah_bayar)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400 print:text-slate-600 border-t border-slate-800 print:border-slate-300 pt-2">
                                <span>Sisa / Status:</span>
                                <span className="font-black text-amber-400 print:text-slate-900 capitalize">
                                    {pembelian.status_pembayaran?.replace('_', ' ')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Konfirmasi Hapus */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={() => !processing && setShowConfirm(false)}
                    />
                    {/* Dialog */}
                    <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 w-full max-w-md">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0">
                                <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <h2 className="font-bold text-white text-base">Hapus Pembelian?</h2>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {pembelian.nomor_faktur || `Faktur PB-${pembelian.id}`}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 mb-2">
                            Tindakan ini akan <span className="text-red-400 font-semibold">menghapus permanen</span> data pembelian dan mengembalikan stok bahan baku.
                        </p>
                        <p className="text-xs text-amber-400/80 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 mb-6">
                            ⚠️ Jika stok dari pembelian ini sudah digunakan untuk penjualan, penghapusan akan ditolak otomatis.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={processing}
                                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-sm rounded-xl border border-slate-700 transition-all disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={processing}
                                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                                        </svg>
                                        Menghapus...
                                    </>
                                ) : (
                                    <>
                                        <TrashIcon className="w-4 h-4" /> Ya, Hapus
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
