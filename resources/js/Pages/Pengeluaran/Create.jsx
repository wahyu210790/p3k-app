import AppLayout from '@/Layouts/AppLayout';
import { rupiah } from '@/lib/utils';
import { useForm, Link } from '@inertiajs/react';

export default function PengeluaranCreate({ label_kategori, saldo_operasional }) {
    const { data, setData, post, processing, errors } = useForm({
        kategori:   Object.keys(label_kategori)[0] ?? 'listrik',
        jumlah:     '',
        tanggal:    new Date().toISOString().slice(0, 10),
        keterangan: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('pengeluaran.store'));
    };

    const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500";

    return (
        <AppLayout title="Catat Pengeluaran">
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Link href={route('pengeluaran.index')} className="text-slate-400 hover:text-white text-sm">← Kembali</Link>
                    <h2 className="text-xl font-bold text-white">Catat Pengeluaran</h2>
                </div>

                {/* Saldo dompet operasional */}
                <div className="bg-violet-900/30 border border-violet-700/50 rounded-xl px-4 py-3 mb-5">
                    <p className="text-xs text-violet-400 font-medium">Saldo Dompet Operasional</p>
                    <p className="text-xl font-bold text-violet-200">{rupiah(saldo_operasional)}</p>
                </div>

                {errors.message && (
                    <div className="bg-red-900/30 border border-red-700/50 rounded-xl px-4 py-3 mb-4 text-sm text-red-300">
                        {errors.message}
                    </div>
                )}

                <form onSubmit={submit} className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Kategori</label>
                        <select value={data.kategori} onChange={e => setData('kategori', e.target.value)} className={inputClass}>
                            {Object.entries(label_kategori).map(([k, v]) => (
                                <option key={k} value={k}>{v}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Jumlah (Rp)</label>
                        <input type="number" value={data.jumlah} onChange={e => setData('jumlah', e.target.value)}
                            className={inputClass} min="1" placeholder="150000" />
                        {errors.jumlah && <p className="text-xs text-red-400 mt-1">{errors.jumlah}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal</label>
                        <input type="date" value={data.tanggal} onChange={e => setData('tanggal', e.target.value)}
                            className={inputClass} />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Keterangan (opsional)</label>
                        <textarea value={data.keterangan} onChange={e => setData('keterangan', e.target.value)}
                            rows={3} placeholder="Contoh: Bayar tagihan PLN bulan Juli..."
                            className={inputClass + ' resize-none'} />
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold transition-all">
                        {processing ? 'Menyimpan...' : 'Catat Pengeluaran'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
