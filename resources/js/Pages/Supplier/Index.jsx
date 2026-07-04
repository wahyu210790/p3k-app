import AppLayout from '@/Layouts/AppLayout';
import { Link } from '@inertiajs/react';
import { PlusIcon, PencilSquareIcon, TruckIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function SupplierIndex({ suppliers }) {
    return (
        <AppLayout title="Supplier">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Daftar Supplier</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Kelola data pemasok bahan baku dan barang</p>
                    </div>
                    <Link
                        href={route('supplier.create')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl transition-all"
                    >
                        <PlusIcon className="w-4 h-4" /> Tambah Supplier
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suppliers.length === 0 ? (
                        <div className="col-span-full bg-slate-900/60 rounded-2xl border border-slate-700/50 p-12 text-center text-slate-500 text-sm">
                            Belum ada data supplier. <Link href={route('supplier.create')} className="text-amber-400 hover:underline">Tambahkan sekarang →</Link>
                        </div>
                    ) : (
                        suppliers.map((s) => (
                            <div
                                key={s.id}
                                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                                    s.is_active
                                        ? 'bg-slate-900/60 border-slate-700/50 hover:border-slate-600'
                                        : 'bg-slate-900/30 border-slate-800 opacity-60'
                                }`}
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
                                                <TruckIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white text-base leading-tight">{s.nama}</h3>
                                                <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold mt-1 ${
                                                    s.is_active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-400'
                                                }`}>
                                                    {s.is_active ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </div>
                                        </div>
                                        <Link
                                            href={route('supplier.edit', s.id)}
                                            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                            title="Edit Supplier"
                                        >
                                            <PencilSquareIcon className="w-4 h-4" />
                                        </Link>
                                    </div>

                                    <div className="space-y-2 text-xs text-slate-300 mt-4 border-t border-slate-800 pt-3">
                                        {s.telepon && (
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <PhoneIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                                <span>{s.telepon}</span>
                                            </div>
                                        )}
                                        {s.alamat && (
                                            <div className="flex items-start gap-2 text-slate-400">
                                                <MapPinIcon className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                                                <span className="line-clamp-2">{s.alamat}</span>
                                            </div>
                                        )}
                                        {s.catatan && (
                                            <p className="text-slate-500 italic bg-slate-800/40 p-2 rounded-lg mt-2">
                                                "{s.catatan}"
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                                    <span>Riwayat Pembelian:</span>
                                    <span className="font-semibold text-white bg-slate-800 px-2.5 py-1 rounded-lg">
                                        {s.pembelian_count || 0} kali
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
