import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const Field = ({ label, error, children }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
        {children}
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
);

export default function ProdukForm({ produk, bahan_baku, kategori_options }) {
    const isEdit = !!produk;

    const { data, setData, post, put, processing, errors } = useForm({
        _method:    isEdit ? 'PUT' : undefined,
        nama:       produk?.nama ?? '',
        kategori:   produk?.kategori ?? 'Makanan',
        harga_jual: produk?.harga_jual ?? '',
        has_resep:  produk?.has_resep ?? true,
        is_active:  produk?.is_active ?? true,
        foto:       null,
        resep: produk?.detail_resep?.map(r => ({
            bahan_baku_id: r.bahan_baku_id,
            jumlah:        r.jumlah,
        })) ?? [],
    });

    const tambahIngredient = () => {
        setData('resep', [...data.resep, { bahan_baku_id: '', jumlah: '' }]);
    };

    const hapusIngredient = (idx) => {
        setData('resep', data.resep.filter((_, i) => i !== idx));
    };

    const updateIngredient = (idx, field, val) => {
        setData('resep', data.resep.map((r, i) => i === idx ? { ...r, [field]: val } : r));
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route('produk.update', produk.id), { forceFormData: true });
        } else {
            post(route('produk.store'), { forceFormData: true });
        }
    };

    const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500";

    return (
        <AppLayout title={isEdit ? 'Edit Produk' : 'Tambah Produk'}>
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Link href={route('produk.index')} className="text-slate-400 hover:text-white text-sm">← Kembali</Link>
                    <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit' : 'Tambah'} Produk</h2>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    {/* Info Dasar */}
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-5 space-y-4">
                        <h3 className="font-semibold text-white text-sm">Informasi Produk</h3>
                        <Field label="Foto Produk (Opsional)" error={errors.foto}>
                            <div className="flex items-center gap-4 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                                {produk?.foto_url && !data.foto && (
                                    <img src={produk.foto_url} alt="Foto saat ini" className="w-14 h-14 rounded-xl object-cover border border-slate-600 shrink-0 shadow" />
                                )}
                                {data.foto && (
                                    <img src={URL.createObjectURL(data.foto)} alt="Preview baru" className="w-14 h-14 rounded-xl object-cover border-2 border-amber-500 shrink-0 shadow" />
                                )}
                                <div className="flex-1 min-w-0">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={e => setData('foto', e.target.files[0])}
                                        className="w-full text-xs text-slate-300 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20 transition-all cursor-pointer" 
                                    />
                                    <p className="text-[11px] text-slate-500 mt-1">Format: JPG, PNG, WEBP (Maks. 2MB).</p>
                                </div>
                            </div>
                        </Field>
                        <Field label="Nama Produk" error={errors.nama}>
                            <input type="text" value={data.nama} onChange={e => setData('nama', e.target.value)}
                                className={inputClass} placeholder="Contoh: Indomie Goreng Telur" />
                        </Field>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Kategori" error={errors.kategori}>
                                <select value={data.kategori} onChange={e => setData('kategori', e.target.value)} className={inputClass}>
                                    {kategori_options.map(k => <option key={k} value={k}>{k}</option>)}
                                </select>
                            </Field>
                            <Field label="Harga Jual (Rp)" error={errors.harga_jual}>
                                <input type="number" value={data.harga_jual} onChange={e => setData('harga_jual', e.target.value)}
                                    className={inputClass} min="1" placeholder="5000" />
                            </Field>
                        </div>
                    </div>

                    {/* Resep */}
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-white text-sm">Resep / Bahan Baku</h3>
                            <div className="flex items-center gap-3">
                                <label className="flex items-center gap-2 text-xs text-slate-400">
                                    <input type="checkbox" checked={data.has_resep}
                                        onChange={e => setData('has_resep', e.target.checked)}
                                        className="rounded" />
                                    Pakai Resep
                                </label>
                            </div>
                        </div>

                        {data.has_resep && (
                            <>
                                <div className="space-y-2 mb-3">
                                    {data.resep.map((r, idx) => (
                                        <div key={idx} className="flex gap-2 items-center">
                                            <select value={r.bahan_baku_id}
                                                onChange={e => updateIngredient(idx, 'bahan_baku_id', e.target.value)}
                                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500">
                                                <option value="">Pilih bahan baku...</option>
                                                {bahan_baku.map(b => (
                                                    <option key={b.id} value={b.id}>{b.nama} ({b.satuan})</option>
                                                ))}
                                            </select>
                                            <input type="number" value={r.jumlah}
                                                onChange={e => updateIngredient(idx, 'jumlah', e.target.value)}
                                                placeholder="Jml" min="0.001" step="0.001"
                                                className="w-24 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                                            />
                                            <button type="button" onClick={() => hapusIngredient(idx)}
                                                className="p-2 text-red-400 hover:text-red-300 shrink-0">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" onClick={tambahIngredient}
                                    className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors">
                                    <PlusIcon className="w-4 h-4" />
                                    Tambah Bahan
                                </button>
                                {errors.resep && <p className="text-xs text-red-400 mt-2">{errors.resep}</p>}
                            </>
                        )}
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold transition-all text-sm">
                        {processing ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Produk')}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
