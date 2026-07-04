import AppLayout from '@/Layouts/AppLayout';
import { rupiah, tanggalIndo } from '@/lib/utils';
import { router } from '@inertiajs/react';

export default function HutangIndex({ hutang, total_aktif, suppliers, filters }) {
    const handleBayar = (id, sisaHutang) => {
        const jml = prompt(`Bayar hutang (maks Rp${sisaHutang.toLocaleString('id-ID')}):`);
        if (!jml || isNaN(jml)) return;
        router.post(route('hutang.bayar', id), { jumlah_bayar: parseFloat(jml) });
    };

    return (
        <AppLayout title="Hutang Supplier">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-xl font-bold text-white">Hutang Supplier</h2>
                        <p className="text-xs text-amber-400 mt-0.5 font-semibold">
                            Total belum lunas: {rupiah(total_aktif)}
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 overflow-hidden">
                    {hutang.data.length === 0 ? (
                        <div className="py-16 text-center text-slate-500 text-sm">Tidak ada hutang aktif</div>
                    ) : (
                        <div className="divide-y divide-slate-700/30">
                            {hutang.data.map(h => (
                                <div key={h.id} className="flex items-center gap-4 px-4 py-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-white">{h.supplier?.nama ?? 'Tanpa Supplier'}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {h.pembelian?.nomor_faktur && <>{h.pembelian.nomor_faktur} · </>}
                                            {tanggalIndo(h.tanggal_hutang)}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-bold text-red-400">{rupiah(h.sisa_hutang)}</p>
                                        <p className="text-xs text-slate-500">dari {rupiah(h.jumlah_hutang)}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0
                                        ${h.status === 'lunas'
                                            ? 'bg-emerald-900/50 text-emerald-400'
                                            : 'bg-red-900/50 text-red-400'
                                        }`}>
                                        {h.status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                                    </span>
                                    {h.status !== 'lunas' && (
                                        <button onClick={() => handleBayar(h.id, h.sisa_hutang)}
                                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold rounded-xl transition-all shrink-0">
                                            Bayar
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
