import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';
import { PlusIcon, TrashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useState, useMemo } from 'react';
import { rupiah } from '@/lib/utils';
import SearchableSelect from '@/Components/SearchableSelect';

const Field = ({ label, error, children }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
        {children}
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
);

export default function PembelianCreate({ suppliers, bahan_baku }) {
    const bahanBakuOptions = useMemo(() => {
        return bahan_baku.map((b) => ({
            value: b.id,
            label: b.nama,
            sublabel: `Stok: ${b.stok_saat_ini} ${b.satuan}`,
        }));
    }, [bahan_baku]);

    const { data, setData, post, processing, errors } = useForm({
        supplier_id:       '',
        nomor_faktur:      '',
        tanggal_pembelian: new Date().toISOString().slice(0, 10),
        jumlah_bayar:      '',
        catatan:           '',
        items:             [{ bahan_baku_id: '', jumlah: '', harga_satuan: '' }],
    });

    const addItem = () => {
        setData('items', [...data.items, { bahan_baku_id: '', jumlah: '', harga_satuan: '' }]);
    };

    const removeItem = (idx) => {
        if (data.items.length > 1) {
            setData('items', data.items.filter((_, i) => i !== idx));
        }
    };

    const updateItem = (idx, field, val) => {
        setData('items', data.items.map((item, i) => i === idx ? { ...item, [field]: val } : item));
    };

    const totalTagihan = useMemo(() => {
        return data.items.reduce((sum, item) => {
            const qty = parseFloat(item.jumlah) || 0;
            const harga = parseFloat(item.harga_satuan) || 0;
            return sum + (qty * harga);
        }, 0);
    }, [data.items]);

    const handleBayarLunas = () => {
        setData('jumlah_bayar', totalTagihan);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('pembelian.store'));
    };

    const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors";

    return (
        <AppLayout title="Catat Pembelian Bahan Baku">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Link href={route('pembelian.index')} className="text-slate-400 hover:text-white text-sm">← Kembali</Link>
                    <h2 className="text-xl font-bold text-white">Catat Pembelian Baru</h2>
                </div>

                {errors.message && (
                    <div className="bg-red-900/40 border border-red-700/50 rounded-2xl p-4 mb-6 flex items-start gap-3 text-red-200">
                        <ExclamationCircleIcon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-semibold">Gagal Menyimpan Pembelian</p>
                            <p className="text-xs text-red-300 mt-0.5">{errors.message}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* Header Faktur & Supplier */}
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Field label="Supplier" error={errors.supplier_id}>
                            <select
                                value={data.supplier_id}
                                onChange={(e) => setData('supplier_id', e.target.value)}
                                className={inputClass}
                            >
                                <option value="">Tanpa Supplier (Umum)</option>
                                {suppliers.map((s) => (
                                    <option key={s.id} value={s.id}>{s.nama}</option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Nomor Faktur / Nota (Opsional)" error={errors.nomor_faktur}>
                            <input
                                type="text"
                                value={data.nomor_faktur}
                                onChange={(e) => setData('nomor_faktur', e.target.value)}
                                className={inputClass}
                                placeholder="Contoh: INV-202607-001"
                            />
                        </Field>

                        <Field label="Tanggal Pembelian *" error={errors.tanggal_pembelian}>
                            <input
                                type="date"
                                value={data.tanggal_pembelian}
                                onChange={(e) => setData('tanggal_pembelian', e.target.value)}
                                className={inputClass}
                                required
                            />
                        </Field>
                    </div>

                    {/* Daftar Item Bahan Baku */}
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div>
                                <h3 className="font-semibold text-white text-base">Item Bahan Baku</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Stok dan HPP akan otomatis disesuaikan menggunakan metode FIFO</p>
                            </div>
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 transition-colors"
                            >
                                <PlusIcon className="w-3.5 h-3.5" /> Tambah Baris
                            </button>
                        </div>

                        {errors.items && <p className="text-xs text-red-400">{errors.items}</p>}

                        <div className="space-y-3">
                            {data.items.map((item, idx) => {
                                const selectedBahan = bahan_baku.find(b => b.id == item.bahan_baku_id);
                                const subtotal = (parseFloat(item.jumlah) || 0) * (parseFloat(item.harga_satuan) || 0);
                                return (
                                    <div key={idx} style={{ zIndex: data.items.length - idx }} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-800/50 p-3.5 rounded-xl border border-slate-700/40 relative">
                                        <div className="flex-1 w-full sm:w-auto min-w-0">
                                            <SearchableSelect
                                                options={bahanBakuOptions}
                                                value={item.bahan_baku_id}
                                                onChange={(val) => updateItem(idx, 'bahan_baku_id', val)}
                                                placeholder="Pilih Bahan Baku (ketik untuk mencari)..."
                                            />
                                        </div>

                                        <div className="w-full sm:w-36">
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={item.jumlah}
                                                    onChange={(e) => updateItem(idx, 'jumlah', e.target.value)}
                                                    className={inputClass}
                                                    placeholder="Jumlah"
                                                    min="0.001"
                                                    step="0.001"
                                                    required
                                                />
                                                {selectedBahan && (
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium pointer-events-none">
                                                        {selectedBahan.satuan}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="w-full sm:w-48">
                                            <input
                                                type="number"
                                                value={item.harga_satuan}
                                                onChange={(e) => updateItem(idx, 'harga_satuan', e.target.value)}
                                                className={inputClass}
                                                placeholder="Harga / Satuan (Rp)"
                                                min="1"
                                                required
                                            />
                                        </div>

                                        <div className="w-full sm:w-36 text-right sm:text-right font-bold text-amber-400 text-sm">
                                            {rupiah(subtotal)}
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

                        {/* Total Bar */}
                        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="text-xs text-slate-400">
                                Total {data.items.length} macam bahan baku
                            </div>
                            <div className="flex items-center gap-3 self-end sm:self-center">
                                <span className="text-sm text-slate-400 font-medium">Total Tagihan:</span>
                                <span className="text-2xl font-black text-amber-400">{rupiah(totalTagihan)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Pembayaran & Catatan */}
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Jumlah Dibayar (Rp) *
                                </label>
                                <button
                                    type="button"
                                    onClick={handleBayarLunas}
                                    className="text-xs font-bold text-amber-400 hover:underline"
                                >
                                    Bayar Lunas ({rupiah(totalTagihan)})
                                </button>
                            </div>
                            <input
                                type="number"
                                value={data.jumlah_bayar}
                                onChange={(e) => setData('jumlah_bayar', e.target.value)}
                                className={inputClass}
                                placeholder="0"
                                min="0"
                                required
                            />
                            {errors.jumlah_bayar && <p className="text-xs text-red-400 mt-1">{errors.jumlah_bayar}</p>}

                            {/* Status info */}
                            <div className="mt-2.5 text-xs">
                                {(parseFloat(data.jumlah_bayar) || 0) < totalTagihan ? (
                                    <span className="text-red-400 font-medium">
                                        ⚠️ Sisa Rp {(totalTagihan - (parseFloat(data.jumlah_bayar) || 0)).toLocaleString('id-ID')} akan dicatat sebagai Hutang Supplier.
                                    </span>
                                ) : (
                                    <span className="text-emerald-400 font-medium">
                                        ✅ Pembayaran Lunas (Dompet Modal & Operasional akan berkurang).
                                    </span>
                                )}
                            </div>
                        </div>

                        <Field label="Catatan Tambahan" error={errors.catatan}>
                            <textarea
                                value={data.catatan}
                                onChange={(e) => setData('catatan', e.target.value)}
                                rows={3}
                                className={inputClass + " resize-none"}
                                placeholder="Keterangan pengiriman, bukti bayar, dll..."
                            />
                        </Field>
                    </div>

                    <button
                        type="submit"
                        disabled={processing || totalTagihan <= 0}
                        className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold transition-all text-base shadow-lg shadow-amber-500/20"
                    >
                        {processing ? 'Memproses Restok & FIFO...' : 'Simpan Pembelian & Update Stok'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
