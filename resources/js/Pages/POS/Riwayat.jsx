import AppLayout from '@/Layouts/AppLayout';
import { rupiah, datetimeIndo } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';

const statusBadge = (status) => {
    const map = {
        selesai: 'bg-emerald-900/50 text-emerald-400',
        piutang: 'bg-amber-900/50 text-amber-400',
        batal:   'bg-red-900/50 text-red-400',
    };
    return `inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? 'bg-slate-700 text-slate-400'}`;
};

export default function Riwayat({ transaksi, tanggal }) {
    const handleDateChange = (e) => {
        router.get(route('pos.riwayat'), { tanggal: e.target.value }, { preserveState: true });
    };

    return (
        <AppLayout title="Riwayat Transaksi">
            <div className="max-w-3xl mx-auto">
                {/* Filter */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-white text-lg">Riwayat Penjualan</h2>
                    <input type="date" value={tanggal} onChange={handleDateChange}
                        className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                </div>

                {/* Tabel transaksi */}
                <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 overflow-hidden">
                    {transaksi.data.length === 0 ? (
                        <div className="py-16 text-center text-slate-500 text-sm">Tidak ada transaksi pada tanggal ini</div>
                    ) : (
                        <div className="divide-y divide-slate-700/30">
                            {transaksi.data.map(t => (
                                <Link key={t.id} href={route('pos.struk', t.id)}
                                    className="flex items-center gap-4 px-4 py-4 hover:bg-slate-800/40 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white">{t.nomor_transaksi}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{datetimeIndo(t.tanggal_transaksi)}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-bold text-amber-400">{rupiah(t.total_harga_jual)}</p>
                                        <span className={statusBadge(t.status)}>{t.status}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Summary */}
                {transaksi.data.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-4 text-center">
                            <p className="text-xs text-slate-400">Total Omset</p>
                            <p className="text-lg font-bold text-amber-400">
                                {rupiah(transaksi.data.reduce((s, t) => s + parseFloat(t.total_harga_jual), 0))}
                            </p>
                        </div>
                        <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-4 text-center">
                            <p className="text-xs text-slate-400">Jumlah Transaksi</p>
                            <p className="text-lg font-bold text-white">{transaksi.data.length}</p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
