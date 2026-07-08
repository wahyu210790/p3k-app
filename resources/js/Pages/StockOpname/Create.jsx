import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';
import { ExclamationCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState, useMemo } from 'react';
import { rupiah } from '@/lib/utils';

export default function StockOpnameCreate({ bahan_baku, tanggal }) {
    const [search, setSearch] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        tanggal: tanggal || new Date().toLocaleDateString('en-CA'),
        catatan: '',
        items: bahan_baku.map((b) => ({
            bahan_baku_id: b.id,
            nama:          b.nama,
            satuan:        b.satuan,
            stok_sistem:   b.stok_sistem,
            hpp_rata_rata: b.hpp_rata_rata,
            stok_fisik:    b.stok_sistem, // default sama dengan sistem
            keterangan:    '',
        })),
    });

    const handleFisikChange = (id, val) => {
        setData('items', data.items.map((item) => {
            if (item.bahan_baku_id === id) {
                return { ...item, stok_fisik: val === '' ? '' : parseFloat(val) || 0 };
            }
            return item;
        }));
    };

    const handleKeteranganChange = (id, val) => {
        setData('items', data.items.map((item) => {
            if (item.bahan_baku_id === id) {
                return { ...item, keterangan: val };
            }
            return item;
        }));
    };

    const filteredItems = useMemo(() => {
        if (!search.trim()) return data.items;
        const q = search.toLowerCase();
        return data.items.filter((item) => item.nama.toLowerCase().includes(q));
    }, [data.items, search]);

    const stats = useMemo(() => {
        let totalSelisihQty = 0;
        let totalSelisihNilai = 0;
        let adaSelisih = 0;

        data.items.forEach((item) => {
            const fisik = parseFloat(item.stok_fisik) || 0;
            const sistem = parseFloat(item.stok_sistem) || 0;
            const selisih = fisik - sistem;
            if (selisih !== 0) {
                adaSelisih++;
                totalSelisihQty += selisih;
                totalSelisihNilai += selisih * (parseFloat(item.hpp_rata_rata) || 0);
            }
        });

        return { totalSelisihQty, totalSelisihNilai, adaSelisih };
    }, [data.items]);

    const submit = (e) => {
        e.preventDefault();
        post(route('stock-opname.store'));
    };

    const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors";

    return (
        <AppLayout title="Lakukan Stock Opname">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <Link href={route('stock-opname.index')} className="text-slate-400 hover:text-white text-sm">← Kembali</Link>
                    <h2 className="text-xl font-bold text-white">Catat Pemeriksaan Stok (Stock Opname)</h2>
                </div>

                {errors.message && (
                    <div className="bg-red-900/40 border border-red-700/50 rounded-2xl p-4 mb-6 flex items-start gap-3 text-red-200">
                        <ExclamationCircleIcon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div className="text-sm">
                            <p className="font-semibold">Gagal Menyimpan Stock Opname</p>
                            <p className="text-xs text-red-300 mt-0.5">{errors.message}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* Header Opname */}
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Tanggal Pemeriksaan *</label>
                            <input
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                                className={inputClass}
                                required
                            />
                            {errors.tanggal && <p className="text-xs text-red-400 mt-1">{errors.tanggal}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Catatan Pemeriksaan</label>
                            <input
                                type="text"
                                value={data.catatan}
                                onChange={(e) => setData('catatan', e.target.value)}
                                className={inputClass}
                                placeholder="Contoh: Opname rutin akhir bulan Juli..."
                            />
                        </div>
                    </div>

                    {/* Ringkasan Selisih */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-4">
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Bahan Baku Diperiksa</p>
                            <p className="text-xl font-bold text-white mt-1">{data.items.length} macam</p>
                        </div>
                        <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-4">
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Item Ada Selisih</p>
                            <p className={`text-xl font-bold mt-1 ${stats.adaSelisih > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                {stats.adaSelisih} bahan baku
                            </p>
                        </div>
                        <div className="bg-slate-900/60 rounded-xl border border-slate-700/50 p-4">
                            <p className="text-xs text-slate-400 uppercase tracking-wider">Total Nilai Selisih (HPP)</p>
                            <p className={`text-xl font-bold mt-1 ${stats.totalSelisihNilai < 0 ? 'text-red-400' : stats.totalSelisihNilai > 0 ? 'text-emerald-400' : 'text-white'}`}>
                                {stats.totalSelisihNilai > 0 ? '+' : ''}{rupiah(stats.totalSelisihNilai)}
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama bahan baku..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    {/* Table Input */}
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-700/50 text-xs text-slate-400 uppercase tracking-wider">
                                        <th className="text-left px-4 py-3">Nama Bahan Baku</th>
                                        <th className="text-right px-4 py-3">Stok Sistem</th>
                                        <th className="text-right px-4 py-3 w-36">Stok Fisik (Gudang)</th>
                                        <th className="text-right px-4 py-3">Selisih Qty</th>
                                        <th className="text-right px-4 py-3">Nilai Selisih</th>
                                        <th className="text-left px-4 py-3 w-56">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/30">
                                    {filteredItems.map((item) => {
                                        const fisik = parseFloat(item.stok_fisik) || 0;
                                        const sistem = parseFloat(item.stok_sistem) || 0;
                                        const selisih = fisik - sistem;
                                        const nilaiSelisih = selisih * (parseFloat(item.hpp_rata_rata) || 0);

                                        return (
                                            <tr key={item.bahan_baku_id} className={`hover:bg-slate-800/40 transition-colors ${selisih !== 0 ? 'bg-amber-500/5' : ''}`}>
                                                <td className="px-4 py-3">
                                                    <p className="font-semibold text-white">{item.nama}</p>
                                                    <p className="text-xs text-slate-500">HPP: {rupiah(item.hpp_rata_rata)}/{item.satuan}</p>
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-300">
                                                    {item.stok_sistem} <span className="text-xs text-slate-500">{item.satuan}</span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={item.stok_fisik}
                                                            onChange={(e) => handleFisikChange(item.bahan_baku_id, e.target.value)}
                                                            className={`w-full bg-slate-800 border rounded-lg px-2.5 py-1.5 text-right font-bold text-white focus:outline-none focus:border-amber-500 ${
                                                                selisih < 0 ? 'border-red-500/50 text-red-300' : selisih > 0 ? 'border-emerald-500/50 text-emerald-300' : 'border-slate-700'
                                                            }`}
                                                            min="0"
                                                            step="0.001"
                                                            required
                                                        />
                                                    </div>
                                                </td>
                                                <td className={`px-4 py-3 text-right font-bold ${selisih < 0 ? 'text-red-400' : selisih > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                    {selisih > 0 ? '+' : ''}{selisih} <span className="text-xs font-normal">{item.satuan}</span>
                                                </td>
                                                <td className={`px-4 py-3 text-right font-semibold ${nilaiSelisih < 0 ? 'text-red-400' : nilaiSelisih > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                    {selisih !== 0 ? rupiah(nilaiSelisih) : '—'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={item.keterangan}
                                                        onChange={(e) => handleKeteranganChange(item.bahan_baku_id, e.target.value)}
                                                        placeholder={selisih !== 0 ? 'Wajib/Alasan selisih...' : 'Opsional'}
                                                        className="w-full bg-slate-800/80 border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold transition-all text-base shadow-lg shadow-amber-500/20"
                    >
                        {processing ? 'Menyimpan & Menyesuaikan Stok...' : 'Simpan Stock Opname & Sesuaikan Stok'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
