import AppLayout from '@/Layouts/AppLayout';
import { rupiah, datetimeIndo } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { PrinterIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function Struk({ transaksi, nama_usaha, footer_struk }) {
    const { errors } = usePage().props;
    const detail = transaksi.detail_transaksi ?? [];

    const handlePrint = () => window.print();

    return (
        <AppLayout title="Struk Transaksi">
            <div className="max-w-sm mx-auto">
                {/* Struk */}
                <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl print:shadow-none print:rounded-none font-mono text-sm">
                    {/* Header */}
                    <div className="text-center mb-4 pb-4 border-b border-dashed border-slate-300">
                        <img src="/images/logo.png" alt="WARMINDO P3K Logo" className="w-14 h-14 mx-auto mb-2 object-contain" />
                        <h1 className="font-black text-xl">{nama_usaha}</h1>
                        <p className="text-xs text-slate-500 mt-1">Struk Pembelian</p>
                    </div>

                    {/* Info Transaksi */}
                    <div className="mb-4 space-y-1 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-500">No. Struk</span>
                            <span className="font-semibold">{transaksi.nomor_transaksi}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Tanggal</span>
                            <span>{datetimeIndo(transaksi.tanggal_transaksi)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Kasir</span>
                            <span>{transaksi.user?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Metode</span>
                            <span className="uppercase font-semibold">{transaksi.metode_pembayaran}</span>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="mb-4 pb-4 border-b border-dashed border-slate-300 space-y-2">
                        {detail.map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between">
                                    <span className="font-medium">{item.produk?.nama}</span>
                                    <span>{rupiah(item.subtotal_harga_jual)}</span>
                                </div>
                                <p className="text-xs text-slate-500">
                                    {item.jumlah} × {rupiah(item.harga_jual_satuan)}
                                    {item.promo_id && (
                                        <span className="ml-1 text-red-500">(PROMO)</span>
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="mb-4 space-y-1">
                        <div className="flex justify-between text-lg font-black">
                            <span>TOTAL</span>
                            <span>{rupiah(transaksi.total_harga_jual)}</span>
                        </div>
                        {transaksi.status === 'piutang' && (
                            <p className="text-xs text-red-600 font-semibold text-center mt-2">
                                ⚠️ PEMBAYARAN BELUM LUNAS (PIUTANG)
                            </p>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-4 border-t border-dashed border-slate-300">
                        <p className="text-xs text-slate-500">{footer_struk || 'Terima kasih!'}</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                    <Link href={route('pos.index')}
                        className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm text-center transition-colors">
                        ← Kembali ke POS
                    </Link>
                    <button onClick={handlePrint}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm transition-all">
                        <PrinterIcon className="w-4 h-4" />
                        Print
                    </button>
                </div>
            </div>
        </AppLayout>
    );
}
