import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';
import { CubeIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';

const Field = ({ label, error, children }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
        {children}
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
);

export default function BahanBakuForm({ bahan_baku, satuan_options }) {
    const isEdit = !!bahan_baku;
    const { data, setData, post, put, processing, errors } = useForm({
        sku:            bahan_baku?.sku ?? '',
        nama:           bahan_baku?.nama ?? '',
        satuan:         bahan_baku?.satuan ?? 'pcs',
        stok_minimum:   bahan_baku?.stok_minimum ?? 0,
        jenis:          bahan_baku?.jenis ?? 'produk',
        is_rokok:       bahan_baku?.is_rokok ?? false,
        isi_per_bungkus: bahan_baku?.isi_per_bungkus ?? '',
        is_active:      bahan_baku?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) put(route('bahan-baku.update', bahan_baku.id));
        else post(route('bahan-baku.store'));
    };

    const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors";

    return (
        <AppLayout title={isEdit ? 'Edit Bahan Baku' : 'Tambah Bahan Baku'}>
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Link href={route('bahan-baku.index')} className="text-slate-400 hover:text-white text-sm">← Kembali</Link>
                    <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit' : 'Tambah'} Bahan Baku</h2>
                </div>

                <form onSubmit={submit} className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 space-y-5">

                    {/* Jenis Bahan Baku */}
                    <Field label="Jenis Bahan Baku" error={errors.jenis}>
                        <div className="grid grid-cols-2 gap-3 mt-1">
                            <button
                                type="button"
                                onClick={() => setData('jenis', 'produk')}
                                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                                    data.jenis === 'produk'
                                        ? 'border-amber-500 bg-amber-500/10'
                                        : 'border-slate-700 bg-slate-800/60 hover:border-slate-600'
                                }`}
                            >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${data.jenis === 'produk' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-400'}`}>
                                    <CubeIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${data.jenis === 'produk' ? 'text-amber-400' : 'text-slate-300'}`}>Produk</p>
                                    <p className="text-xs text-slate-500 leading-tight">Masuk ke COGS</p>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setData('jenis', 'non_produk')}
                                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                                    data.jenis === 'non_produk'
                                        ? 'border-blue-500 bg-blue-500/10'
                                        : 'border-slate-700 bg-slate-800/60 hover:border-slate-600'
                                }`}
                            >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${data.jenis === 'non_produk' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'}`}>
                                    <WrenchScrewdriverIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className={`text-sm font-bold ${data.jenis === 'non_produk' ? 'text-blue-400' : 'text-slate-300'}`}>Non-Produk</p>
                                    <p className="text-xs text-slate-500 leading-tight">Ops. / pendukung</p>
                                </div>
                            </button>
                        </div>
                    </Field>

                    <Field label="SKU (Kode Bahan Baku)" error={errors.sku}>
                        <input type="text" value={data.sku} onChange={e => setData('sku', e.target.value.toUpperCase())}
                            className={inputClass} placeholder="Contoh: BB-001 atau MIE-GRG" />
                    </Field>

                    <Field label="Nama Bahan Baku" error={errors.nama}>
                        <input type="text" value={data.nama} onChange={e => setData('nama', e.target.value)}
                            className={inputClass} placeholder="Contoh: Mie Instan" />
                    </Field>

                    <Field label="Satuan" error={errors.satuan}>
                        <select value={data.satuan} onChange={e => setData('satuan', e.target.value)} className={inputClass}>
                            {satuan_options.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </Field>

                    <Field label="Stok Minimum (Alert)" error={errors.stok_minimum}>
                        <input type="number" value={data.stok_minimum} onChange={e => setData('stok_minimum', e.target.value)}
                            className={inputClass} min="0" step="0.01" />
                    </Field>

                    {/* Rokok toggle */}
                    <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl">
                        <div>
                            <p className="text-sm font-medium text-white">Produk Rokok?</p>
                            <p className="text-xs text-slate-500">Aktifkan jika ini adalah rokok (ada satuan bungkus dan batang)</p>
                        </div>
                        <button type="button" onClick={() => setData('is_rokok', !data.is_rokok)}
                            className={`w-11 h-6 rounded-full transition-colors ${data.is_rokok ? 'bg-amber-500' : 'bg-slate-600'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${data.is_rokok ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {data.is_rokok && (
                        <Field label="Isi per Bungkus (batang)" error={errors.isi_per_bungkus}>
                            <input type="number" value={data.isi_per_bungkus} onChange={e => setData('isi_per_bungkus', e.target.value)}
                                className={inputClass} min="1" placeholder="Contoh: 12" />
                        </Field>
                    )}

                    {isEdit && (
                        <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl">
                            <p className="text-sm font-medium text-white">Status Aktif</p>
                            <button type="button" onClick={() => setData('is_active', !data.is_active)}
                                className={`w-11 h-6 rounded-full transition-colors ${data.is_active ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                                <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${data.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    )}

                    <button type="submit" disabled={processing}
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold transition-all">
                        {processing ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Bahan Baku')}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
