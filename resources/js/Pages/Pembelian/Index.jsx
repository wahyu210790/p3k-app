import AppLayout from '@/Layouts/AppLayout';
import { rupiah, tanggalIndo } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { PlusIcon, EyeIcon, TruckIcon, DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useSortableData } from '@/lib/sort';
import SortableHeader from '@/Components/SortableHeader';

export default function PembelianIndex({ pembelian, suppliers, filters = {} }) {
    const { items: sortedPembelian, sortConfig, requestSort } = useSortableData(pembelian.data);
    const [search, setSearch] = useState(filters?.search ?? '');
    const [supplierId, setSupplierId] = useState(filters?.supplier_id ?? '');
    const [status, setStatus] = useState(filters?.status ?? '');
    const [dari, setDari] = useState(filters?.dari ?? '');
    const [sampai, setSampai] = useState(filters?.sampai ?? '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(
            route('pembelian.index'),
            { search, supplier_id: supplierId, status, dari, sampai },
            { preserveState: true }
        );
    };

    const statusBadge = (st) => {
        switch (st) {
            case 'lunas':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'sebagian':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            default:
                return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        }
    };

    return (
        <AppLayout title="Pembelian Bahan Baku">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Riwayat Pembelian</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Catat restok bahan baku dari supplier & otomatis update stok FIFO</p>
                    </div>
                    <Link
                        href={route('pembelian.create')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl transition-all"
                    >
                        <PlusIcon className="w-4 h-4" /> Catat Pembelian
                    </Link>
                </div>

                {/* Filter Bar */}
                <form onSubmit={handleFilter} className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-4 mb-6 flex flex-wrap gap-3 items-end">
                    <div className="w-full sm:w-auto sm:flex-1 min-w-[200px]">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Cari Faktur / Item</label>
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="No. Faktur / Nama bahan baku..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                            />
                        </div>
                    </div>

                    <div className="flex-1 min-w-[160px]">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Supplier</label>
                        <select
                            value={supplierId}
                            onChange={(e) => setSupplierId(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        >
                            <option value="">Semua Supplier</option>
                            {suppliers.map((s) => (
                                <option key={s.id} value={s.id}>{s.nama}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-40">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        >
                            <option value="">Semua Status</option>
                            <option value="lunas">Lunas</option>
                            <option value="sebagian">Sebagian</option>
                            <option value="belum_lunas">Belum Lunas (Hutang)</option>
                        </select>
                    </div>

                    <div className="w-36">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Dari Tanggal</label>
                        <input
                            type="date"
                            value={dari}
                            onChange={(e) => setDari(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    <div className="w-36">
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Sampai Tanggal</label>
                        <input
                            type="date"
                            value={sampai}
                            onChange={(e) => setSampai(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium text-xs rounded-xl transition-colors"
                        >
                            Filter
                        </button>
                        {(search || supplierId || status || dari || sampai) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch(''); setSupplierId(''); setStatus(''); setDari(''); setSampai('');
                                    router.get(route('pembelian.index'));
                                }}
                                className="px-3 py-2 bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-400 text-xs rounded-xl transition-colors"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </form>

                {/* Table */}
                <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700/50 text-xs text-slate-400 uppercase tracking-wider">
                                    <SortableHeader label="Faktur / Tanggal" sortKey="nomor_faktur" currentSort={sortConfig} onSort={requestSort} align="left" />
                                    <SortableHeader label="Supplier" sortKey="supplier.nama" currentSort={sortConfig} onSort={requestSort} align="left" />
                                    <th className="text-left px-5 py-3.5">Item Dibeli</th>
                                    <SortableHeader label="Total Tagihan" sortKey="total_harga" currentSort={sortConfig} onSort={requestSort} align="right" />
                                    <SortableHeader label="Dibayar" sortKey="jumlah_bayar" currentSort={sortConfig} onSort={requestSort} align="right" />
                                    <SortableHeader label="Status" sortKey="status_pembayaran" currentSort={sortConfig} onSort={requestSort} align="center" />
                                    <SortableHeader label="Dicatat Oleh" sortKey="user.name" currentSort={sortConfig} onSort={requestSort} align="left" />
                                    <th className="text-center px-5 py-3.5">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                {sortedPembelian.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-5 py-16 text-center text-slate-500">
                                            Belum ada catatan pembelian pada filter ini.
                                        </td>
                                    </tr>
                                ) : (
                                    sortedPembelian.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <DocumentTextIcon className="w-4 h-4 text-amber-400 shrink-0" />
                                                    <div>
                                                        <p className="font-semibold text-white">{p.nomor_faktur || `PB-${p.id}`}</p>
                                                        <p className="text-xs text-slate-500">{tanggalIndo(p.tanggal_pembelian)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="font-medium text-slate-300">
                                                    {p.supplier?.nama || 'Tanpa Supplier (Umum)'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 max-w-[280px]">
                                                <div
                                                    className="flex flex-wrap gap-1.5"
                                                    title={p.detail_pembelian?.map(d => `${d.bahan_baku?.nama || 'Item'} (${d.jumlah} ${d.bahan_baku?.satuan})`).join(', ')}
                                                >
                                                    {p.detail_pembelian && p.detail_pembelian.length > 0 ? (
                                                        <>
                                                            {p.detail_pembelian.slice(0, 2).map((item, idx) => (
                                                                <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/90 border border-slate-700/60 text-slate-300 text-xs font-medium">
                                                                    <span className="text-amber-400 font-semibold">{item.bahan_baku?.nama || 'Item'}</span>
                                                                    <span className="text-slate-400 text-[11px]">({item.jumlah} {item.bahan_baku?.satuan})</span>
                                                                </span>
                                                            ))}
                                                            {p.detail_pembelian.length > 2 && (
                                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                                                                    +{p.detail_pembelian.length - 2} lagi
                                                                </span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-slate-500 italic">Tidak ada item</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-bold text-white">
                                                {rupiah(p.total_tagihan || p.total_harga)}
                                            </td>
                                            <td className="px-5 py-3.5 text-right font-medium text-emerald-400">
                                                {rupiah(p.jumlah_bayar)}
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full border font-semibold capitalize ${statusBadge(p.status_pembayaran)}`}>
                                                    {p.status_pembayaran?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-xs text-slate-400">
                                                {p.user?.name || '—'}
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <Link
                                                    href={route('pembelian.show', p.id)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                                                >
                                                    <EyeIcon className="w-3.5 h-3.5" /> Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
