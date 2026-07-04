import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';

const Field = ({ label, error, children }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{label}</label>
        {children}
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
);

export default function SupplierForm({ supplier }) {
    const isEdit = !!supplier;
    const { data, setData, post, put, processing, errors } = useForm({
        nama:      supplier?.nama ?? '',
        telepon:   supplier?.telepon ?? '',
        alamat:    supplier?.alamat ?? '',
        catatan:   supplier?.catatan ?? '',
        is_active: supplier?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('supplier.update', supplier.id));
        } else {
            post(route('supplier.store'));
        }
    };

    const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors";

    return (
        <AppLayout title={isEdit ? 'Edit Supplier' : 'Tambah Supplier'}>
            <div className="max-w-lg mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Link href={route('supplier.index')} className="text-slate-400 hover:text-white text-sm">← Kembali</Link>
                    <h2 className="text-xl font-bold text-white">{isEdit ? 'Edit' : 'Tambah'} Supplier</h2>
                </div>

                <form onSubmit={submit} className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 space-y-5">
                    <Field label="Nama Supplier *" error={errors.nama}>
                        <input
                            type="text"
                            value={data.nama}
                            onChange={(e) => setData('nama', e.target.value)}
                            className={inputClass}
                            placeholder="Contoh: PT Wings Food / Toko Makmur"
                            required
                        />
                    </Field>

                    <Field label="Nomor Telepon / WA" error={errors.telepon}>
                        <input
                            type="text"
                            value={data.telepon}
                            onChange={(e) => setData('telepon', e.target.value)}
                            className={inputClass}
                            placeholder="Contoh: 081234567890"
                        />
                    </Field>

                    <Field label="Alamat" error={errors.alamat}>
                        <textarea
                            value={data.alamat}
                            onChange={(e) => setData('alamat', e.target.value)}
                            rows={3}
                            className={inputClass + " resize-none"}
                            placeholder="Alamat lengkap supplier..."
                        />
                    </Field>

                    <Field label="Catatan Tambahan" error={errors.catatan}>
                        <textarea
                            value={data.catatan}
                            onChange={(e) => setData('catatan', e.target.value)}
                            rows={2}
                            className={inputClass + " resize-none"}
                            placeholder="Contoh: Pengiriman setiap hari Senin & Kamis..."
                        />
                    </Field>

                    {isEdit && (
                        <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl">
                            <div>
                                <p className="text-sm font-medium text-white">Status Supplier</p>
                                <p className="text-xs text-slate-500">Nonaktifkan jika tidak lagi bekerja sama</p>
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

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold transition-all"
                    >
                        {processing ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah Supplier')}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
