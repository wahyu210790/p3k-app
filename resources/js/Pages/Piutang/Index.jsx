import AppLayout from '@/Layouts/AppLayout';
import { rupiah, tanggalIndo } from '@/lib/utils';
import { Link, router, useForm } from '@inertiajs/react';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function PiutangIndex({ piutang, total_aktif, filters }) {
    const handleBayar = (id, sisaPiutang) => {
        const jml = prompt(`Bayar piutang (maks Rp${sisaPiutang.toLocaleString('id-ID')}):`);
        if (!jml || isNaN(jml)) return;
        router.post(route('piutang.bayar', id), { jumlah_bayar: parseFloat(jml) });
    };

    return (
        <AppLayout title="Piutang Pelanggan">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-xl font-bold text-white">Piutang Pelanggan</h2>
                        <p className="text-xs text-amber-400 mt-0.5 font-semibold">
                            Total belum lunas: {rupiah(total_aktif)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {['belum_lunas', 'lunas', ''].map(s => (
                            <button key={s}
                                onClick={() => router.get(route('piutang.index'), { status: s }, { preserveState: true })}
                                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
                                    ${(filters.status ?? 'belum_lunas') === s
                                        ? 'bg-amber-500 border-amber-500 text-slate-900'
                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                                    }`}>
                                {s === '' ? 'Semua' : s === 'belum_lunas' ? 'Belum Lunas' : 'Lunas'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 overflow-hidden">
                    {piutang.data.length === 0 ? (
                        <div className="py-16 text-center text-slate-500 text-sm">Tidak ada data piutang</div>
                    ) : (
                        <div className="divide-y divide-slate-700/30">
                            {piutang.data.map(p => (
                                <div key={p.id} className="flex items-center gap-4 px-4 py-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-white">{p.nama_pelanggan}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            {p.nomor_wa && <>{p.nomor_wa} · </>}
                                            {tanggalIndo(p.tanggal_piutang)}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-bold text-red-400">{rupiah(p.sisa_piutang)}</p>
                                        <p className="text-xs text-slate-500">dari {rupiah(p.jumlah_piutang)}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0
                                        ${p.status === 'lunas'
                                            ? 'bg-emerald-900/50 text-emerald-400'
                                            : 'bg-red-900/50 text-red-400'
                                        }`}>
                                        {p.status === 'lunas' ? 'Lunas' : 'Belum Lunas'}
                                    </span>
                                    {p.status === 'belum_lunas' && (
                                        <button onClick={() => handleBayar(p.id, p.sisa_piutang)}
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
