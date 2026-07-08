import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';
import { PlusIcon, TrashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const Field = ({ label, error, children }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
        {children}
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
);

export default function NonSalesCreate({ label_kategori, produk, bahan_baku }) {
    const { data, setData, post, processing, errors } = useForm({
        kategori: Object.keys(label_kategori)[0] ?? 'jatah_karyawan',
        tanggal:  new Date().toLocaleDateString('en-CA'),
        catatan:  '',
        items:    [{ tipe: 'produk', produk_id: '', bahan_baku_id: '', jumlah: '' }],
    });

    const addItem = (tipe) => {
        setData('items', [...data.items, { tipe, produk_id: '', bahan_baku_id: '', jumlah: '' }]);
    };

    const removeItem = (idx) => {
        if (data.items.length > 1) {
            setData('items', data.items.filter((_, i) => i !== idx));
        }
    };

    const updateItem = (idx, field, val) => {
        setData('items', data.items.map((item, i) => {
            if (i !== idx) return item;
            const updated = { ...item, [field]: val };
            if (field === 'tipe') {
                updated.produk_id = '';
                updated.bahan_baku_id = '';
            }
            return updated;
        }));
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('non-sales.store'));
    };

    const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors";

    return (
        <AppLayout title="Catat Non-Sales">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Link href={route('non-sales.index')} className="text-slate-400 hover:text-white text-sm">← Kembali</Link>
                    <h2 className="text-xl font-bold text-white">Catat Barang Keluar (Non-Sales)</h2>
                </div>

                {errors.message && (
                    <div className="bg-red-900/40 border border-red-700/50 rounded-2xl p-4 mb-6 flex items-start gap-3 text-red-200">
                        <ExclamationCircleIcon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-semibold">Gagal Menyimpan Catatan Non-Sales</p>
                            <p className="text-xs text-red-300 mt-0.5">{errors.message}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* Header Info */}
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Kategori Non-Sales *" error={errors.kategori}>
                            <select
                                value={data.kategori}
                                onChange={(e) => setData('kategori', e.target.value)}
                                className={inputClass}
                            >
                                {Object.entries(label_kategori).map(([k, label]) => (
                                    <option key={k} value={k}>{label}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Tanggal *" error={errors.tanggal}>
                            <input
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                                className={inputClass}
                                required
                            />
                        </Field>
                    </div>

                    {/* Items List */}
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div>
                                <h3 className="font-semibold text-white text-base">Daftar Barang Keluar</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Stok akan dikurangi otomatis menggunakan FIFO & nilai HPP dicatat sebagai beban operasional
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => addItem('produk')}
                                    className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 transition-colors"
                                >
                                    <PlusIcon className="w-3.5 h-3.5" /> + Produk Jadi
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addItem('bahan_baku')}
                                    className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-500/20 transition-colors"
                                >
                                    <PlusIcon className="w-3.5 h-3.5" /> + Bahan Baku
                                </button>
                            </div>
                        </div>

                        {errors.items && <p className="text-xs text-red-400">{errors.items}</p>}

                        <div className="space-y-3">
                            {data.items.map((item, idx) => {
                                return (
                                    <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/40">
                                        <div className="w-full sm:w-36">
                                            <select
                                                value={item.tipe}
                                                onChange={(e) => updateItem(idx, 'tipe', e.target.value)}
                                                className={inputClass}
                                            >
                                                <option value="produk">📦 Produk Jadi</option>
                                                <option value="bahan_baku">🧪 Bahan Baku</option>
                                            </select>
                                        </div>

                                        <div className="flex-1 w-full sm:w-auto">
                                            {item.tipe === 'produk' ? (
                                                <select
                                                    value={item.produk_id}
                                                    onChange={(e) => updateItem(idx, 'produk_id', e.target.value)}
                                                    className={inputClass}
                                                    required
                                                >
                                                    <option value="">Pilih Produk (dengan resep)...</option>
                                                    {produk.map((prod) => (
                                                        <option key={prod.id} value={prod.id}>
                                                            {prod.nama} ({prod.kategori})
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <select
                                                    value={item.bahan_baku_id}
                                                    onChange={(e) => updateItem(idx, 'bahan_baku_id', e.target.value)}
                                                    className={inputClass}
                                                    required
                                                >
                                                    <option value="">Pilih Bahan Baku...</option>
                                                    {bahan_baku.map((b) => (
                                                        <option key={b.id} value={b.id}>
                                                            {b.nama} (Stok: {b.stok_saat_ini} {b.satuan})
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>

                                        <div className="w-full sm:w-36">
                                            <input
                                                type="number"
                                                value={item.jumlah}
                                                onChange={(e) => updateItem(idx, 'jumlah', e.target.value)}
                                                className={inputClass}
                                                placeholder="Jumlah / Qty"
                                                min="0.001"
                                                step="0.001"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeItem(idx)}
                                            disabled={data.items.length <= 1}
                                            className="p-2.5 text-slate-500 hover:text-red-400 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors self-end sm:self-center"
                                            title="Hapus baris ini"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Catatan */}
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6">
                        <Field label="Catatan / Keterangan Tambahan" error={errors.catatan}>
                            <textarea
                                value={data.catatan}
                                onChange={(e) => setData('catatan', e.target.value)}
                                rows={3}
                                className={inputClass + " resize-none"}
                                placeholder="Contoh: Makan siang shift kasir pagi / Bahan tumpah di dapur..."
                            />
                        </Field>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold transition-all text-base shadow-lg shadow-amber-500/20"
                    >
                        {processing ? 'Memproses FIFO & HPP...' : 'Simpan Catatan Non-Sales'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
