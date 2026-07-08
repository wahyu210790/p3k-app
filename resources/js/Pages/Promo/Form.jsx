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

export default function PromoForm({ promo, produk }) {
    const isEdit = !!promo;
    const { data, setData, post, put, processing, errors } = useForm({
        nama:            promo?.nama ?? '',
        tipe:            promo?.tipe ?? 'harga_khusus',
        tanggal_mulai:   promo?.tanggal_mulai ?? new Date().toLocaleDateString('en-CA'),
        tanggal_selesai: promo?.tanggal_selesai ?? new Date(Date.now() + 7*86400000).toLocaleDateString('en-CA'),
        keterangan:      promo?.keterangan ?? '',
        is_active:       promo?.is_active ?? true,
        produk: promo?.detail_promo?.map(dp => ({
            produk_id:     dp.produk_id,
            harga_promo:   dp.harga_promo ?? '',
            diskon_persen: dp.diskon_persen ?? '',
            min_beli:      dp.min_beli ?? 1,
        })) ?? [{ produk_id: '', harga_promo: '', diskon_persen: '', min_beli: 1 }],
    });

    const addProduk = () => {
        setData('produk', [...data.produk, { produk_id: '', harga_promo: '', diskon_persen: '', min_beli: 1 }]);
    };

    const removeProduk = (idx) => {
        if (data.produk.length > 1) {
            setData('produk', data.produk.filter((_, i) => i !== idx));
        }
    };

    const updateProduk = (idx, field, val) => {
        setData('produk', data.produk.map((p, i) => i === idx ? { ...p, [field]: val } : p));
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('promo.update', promo.id));
        } else {
            post(route('promo.store'));
        }
    };

    const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors";

    return (
        <AppLayout title={isEdit ? 'Edit Promo' : 'Buat Promo Baru'}>
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Link href={route('promo.index')} className="text-slate-400 hover:text-white text-sm">← Kembali</Link>
                    <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit' : 'Buat'} Promo</h2>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 space-y-5">
                        <h3 className="font-semibold text-white text-base border-b border-slate-800 pb-3">Informasi Promo</h3>
                        
                        <Field label="Nama Promo *" error={errors.nama}>
                            <input
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                className={inputClass}
                                placeholder="Contoh: Promo Akhir Pekan Indomie / Diskon Minuman Dingin"
                                required
                            />
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Field label="Tipe Promo *" error={errors.tipe}>
                                <select
                                    value={data.tipe}
                                    onChange={(e) => setData('tipe', e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="harga_khusus">Harga Khusus</option>
                                    <option value="diskon_persen">Diskon Persen (%)</option>
                                    <option value="paket_bundling">Paket Bundling</option>
                                </select>
                            </Field>

                            <Field label="Tanggal Mulai *" error={errors.tanggal_mulai}>
                                <input
                                    type="date"
                                    value={data.tanggal_mulai}
                                    onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                    className={inputClass}
                                    required
                                />
                            </Field>

                            <Field label="Tanggal Selesai *" error={errors.tanggal_selesai}>
                                <input
                                    type="date"
                                    value={data.tanggal_selesai}
                                    onChange={(e) => setData('tanggal_selesai', e.target.value)}
                                    className={inputClass}
                                    required
                                />
                            </Field>
                        </div>

                        <Field label="Keterangan (Opsional)" error={errors.keterangan}>
                            <textarea
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                rows={2}
                                className={inputClass + " resize-none"}
                                placeholder="Syarat & ketentuan promo..."
                            />
                        </Field>

                        {isEdit && (
                            <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl">
                                <div>
                                    <p className="text-sm font-medium text-white">Status Promo</p>
                                    <p className="text-xs text-slate-500">Nonaktifkan jika promo sudah selesai / batal</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setData('is_active', !data.is_active)}
                                    className={`w-11 h-6 rounded-full transition-colors ${data.is_active ? 'bg-emerald-500' : 'bg-slate-600'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${data.is_active ? 'translate-x-5' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Products in Promo */}
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div>
                                <h3 className="font-semibold text-white text-base">Produk yang Dipromosikan</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Pilih produk dan tentukan potongan harganya</p>
                            </div>
                            <button
                                type="button"
                                onClick={addProduk}
                                className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 transition-colors"
                            >
                                <PlusIcon className="w-3.5 h-3.5" /> Tambah Produk
                            </button>
                        </div>

                        {errors.produk && <p className="text-xs text-red-400">{errors.produk}</p>}

                        <div className="space-y-3">
                            {data.produk.map((pItem, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/40">
                                    <div className="flex-1 w-full sm:w-auto">
                                        <select
                                            value={pItem.produk_id}
                                            onChange={(e) => updateProduk(idx, 'produk_id', e.target.value)}
                                            className={inputClass}
                                            required
                                        >
                                            <option value="">Pilih Produk...</option>
                                            {produk.map((prod) => (
                                                <option key={prod.id} value={prod.id}>
                                                    {prod.nama} (Normal: Rp {prod.harga_jual?.toLocaleString('id-ID')})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {data.tipe === 'harga_khusus' && (
                                        <div className="w-full sm:w-44">
                                            <input
                                                type="number"
                                                value={pItem.harga_promo}
                                                onChange={(e) => updateProduk(idx, 'harga_promo', e.target.value)}
                                                className={inputClass}
                                                placeholder="Harga Promo (Rp)"
                                                min="0"
                                                required
                                            />
                                        </div>
                                    )}

                                    {data.tipe === 'diskon_persen' && (
                                        <div className="w-full sm:w-36">
                                            <input
                                                type="number"
                                                value={pItem.diskon_persen}
                                                onChange={(e) => updateProduk(idx, 'diskon_persen', e.target.value)}
                                                className={inputClass}
                                                placeholder="Diskon (%)"
                                                min="0"
                                                max="100"
                                                required
                                            />
                                        </div>
                                    )}

                                    {data.tipe === 'paket_bundling' && (
                                        <>
                                            <div className="w-full sm:w-36">
                                                <input
                                                    type="number"
                                                    value={pItem.min_beli}
                                                    onChange={(e) => updateProduk(idx, 'min_beli', e.target.value)}
                                                    className={inputClass}
                                                    placeholder="Min. Beli (Qty)"
                                                    min="2"
                                                    required
                                                />
                                            </div>
                                            <div className="w-full sm:w-44">
                                                <input
                                                    type="number"
                                                    value={pItem.harga_promo}
                                                    onChange={(e) => updateProduk(idx, 'harga_promo', e.target.value)}
                                                    className={inputClass}
                                                    placeholder="Harga Bundling (Rp)"
                                                    min="0"
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => removeProduk(idx)}
                                        disabled={data.produk.length <= 1}
                                        className="p-2.5 text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors self-end sm:self-center"
                                        title="Hapus baris ini"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold transition-all"
                    >
                        {processing ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Buat Promo')}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
