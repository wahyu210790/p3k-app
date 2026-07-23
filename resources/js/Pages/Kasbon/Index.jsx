import AppLayout from '@/Layouts/AppLayout';
import { rupiah, tanggalIndo } from '@/lib/utils';
import { Link, router, useForm } from '@inertiajs/react';
import { PlusIcon, TrashIcon, CheckCircleIcon, BanknotesIcon, ChartPieIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import Modal from '@/Components/Modal';

export default function KasbonIndex({ kasbon, dompet, filters }) {
    const [showCreate, setShowCreate] = useState(false);
    const [showLunas, setShowLunas] = useState(null);

    const formCreate = useForm({
        nama_peminjam: 'Wahyu',
        sumber_dompet: 'modal',
        jumlah: '',
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: '',
    });

    const formLunas = useForm({
        metode_lunas: 'tunai',
    });

    const handleCreate = (e) => {
        e.preventDefault();
        formCreate.post(route('kasbon.store'), {
            onSuccess: () => {
                setShowCreate(false);
                formCreate.reset();
            }
        });
    };

    const handleLunas = (e) => {
        e.preventDefault();
        formLunas.post(route('kasbon.pelunasan', showLunas.id), {
            onSuccess: () => {
                setShowLunas(null);
                formLunas.reset();
            }
        });
    };

    const handleDelete = (kasbonId) => {
        if (confirm('Yakin ingin membatalkan dan menghapus catatan kasbon ini? Saldo dompet akan dikembalikan secara otomatis.')) {
            router.delete(route('kasbon.destroy', kasbonId));
        }
    };

    const handleFilter = (status) => {
        router.get(route('kasbon.index'), { status }, { preserveState: true });
    };

    return (
        <AppLayout title="Kasbon & Prive">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h2 className="text-xl font-bold text-white">Kasbon & Prive</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Catat penarikan dana oleh owner/partner</p>
                    </div>
                    <button onClick={() => setShowCreate(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl transition-all">
                        <PlusIcon className="w-4 h-4" /> Tarik Kasbon
                    </button>
                </div>

                {/* Filter Status */}
                <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
                    {['', 'belum_lunas', 'lunas_tunai', 'lunas_potong_laba'].map(status => (
                        <button key={status} onClick={() => handleFilter(status)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
                                (filters.status ?? '') === status
                                    ? 'bg-amber-500/15 border-amber-500/50 text-amber-400'
                                    : 'border-slate-700/50 text-slate-400 hover:border-slate-600 bg-slate-800/40'
                            }`}>
                            {status === '' ? 'Semua Status' : status.replace('_', ' ').toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-700/50 text-xs text-slate-400 uppercase tracking-wider text-left bg-slate-800/20">
                                    <th className="px-4 py-3">Tanggal</th>
                                    <th className="px-4 py-3">Nama Peminjam</th>
                                    <th className="px-4 py-3">Sumber Dompet</th>
                                    <th className="px-4 py-3">Jumlah</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Keterangan</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/30">
                                {kasbon.data.length === 0 ? (
                                    <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-500">Tidak ada catatan kasbon</td></tr>
                                ) : kasbon.data.map(k => (
                                    <tr key={k.id} className="hover:bg-slate-800/40">
                                        <td className="px-4 py-3 text-slate-300 whitespace-nowrap">{tanggalIndo(k.tanggal)}</td>
                                        <td className="px-4 py-3 font-medium text-amber-400">{k.nama_peminjam}</td>
                                        <td className="px-4 py-3 text-slate-400 capitalize">{k.sumber_dompet}</td>
                                        <td className="px-4 py-3 font-semibold text-white">{rupiah(k.jumlah)}</td>
                                        <td className="px-4 py-3">
                                            {k.status === 'belum_lunas' ? (
                                                <span className="px-2 py-1 bg-red-900/40 text-red-300 border border-red-700/40 rounded-full text-xs font-medium">Belum Lunas</span>
                                            ) : (
                                                <span className="px-2 py-1 bg-emerald-900/40 text-emerald-300 border border-emerald-700/40 rounded-full text-xs font-medium">Lunas ({k.status === 'lunas_tunai' ? 'Tunai' : 'Potong Laba'})</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-slate-400 text-xs truncate max-w-[150px]" title={k.keterangan}>{k.keterangan ?? '—'}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                {k.status === 'belum_lunas' && (
                                                    <button onClick={() => setShowLunas(k)} className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors" title="Lunasi">
                                                        <CheckCircleIcon className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(k.id)} className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Hapus Batal">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Tambah Kasbon */}
            <Modal show={showCreate} onClose={() => setShowCreate(false)} maxWidth="md">
                <form onSubmit={handleCreate} className="p-6 bg-slate-900 border border-slate-700">
                    <h2 className="text-lg font-bold text-white mb-5">Tarik Kasbon Baru</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Nama Peminjam</label>
                            <select value={formCreate.data.nama_peminjam} onChange={e => formCreate.setData('nama_peminjam', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:ring-0">
                                <option value="Wahyu">Wahyu</option>
                                <option value="Adit">Adit</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Sumber Dompet (Diproses)</label>
                            <select value={formCreate.data.sumber_dompet} onChange={e => formCreate.setData('sumber_dompet', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:ring-0 capitalize">
                                {dompet.map(d => (
                                    <option key={d.tipe} value={d.tipe}>{d.tipe} (Saldo: {rupiah(d.saldo)})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Jumlah Tarik (Rp)</label>
                            <input type="number" required min="1" value={formCreate.data.jumlah} onChange={e => formCreate.setData('jumlah', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:ring-0" placeholder="Contoh: 500000" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Tanggal</label>
                            <input type="date" required value={formCreate.data.tanggal} onChange={e => formCreate.setData('tanggal', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:ring-0" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Keterangan (Opsional)</label>
                            <textarea value={formCreate.data.keterangan} onChange={e => formCreate.setData('keterangan', e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:ring-0" rows="2" placeholder="Keperluan..."></textarea>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white">Batal</button>
                        <button type="submit" disabled={formCreate.processing} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm rounded-xl">Simpan & Tarik</button>
                    </div>
                </form>
            </Modal>

            {/* Modal Pelunasan */}
            <Modal show={!!showLunas} onClose={() => setShowLunas(null)} maxWidth="md">
                {showLunas && (
                    <form onSubmit={handleLunas} className="p-6 bg-slate-900 border border-slate-700">
                        <h2 className="text-lg font-bold text-white mb-2">Pelunasan Kasbon</h2>
                        <p className="text-sm text-slate-400 mb-5">Atas nama <span className="text-amber-400 font-bold">{showLunas.nama_peminjam}</span> sebesar <span className="text-white font-bold">{rupiah(showLunas.jumlah)}</span></p>
                        
                        <div className="space-y-4">
                            <label className={`block p-4 rounded-xl border cursor-pointer transition-all ${formLunas.data.metode_lunas === 'tunai' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 bg-slate-800'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="metode" value="tunai" checked={formLunas.data.metode_lunas === 'tunai'} onChange={e => formLunas.setData('metode_lunas', e.target.value)} className="text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-600" />
                                    <div>
                                        <div className="font-semibold text-white text-sm flex items-center gap-2"><BanknotesIcon className="w-4 h-4"/> Dikembalikan Tunai</div>
                                        <div className="text-xs text-slate-400 mt-1">Uang dikembalikan ke laci kasir. Saldo dompet <span className="capitalize">{showLunas.sumber_dompet}</span> akan bertambah kembali.</div>
                                    </div>
                                </div>
                            </label>

                            <label className={`block p-4 rounded-xl border cursor-pointer transition-all ${formLunas.data.metode_lunas === 'potong_laba' ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 bg-slate-800'}`}>
                                <div className="flex items-center gap-3">
                                    <input type="radio" name="metode" value="potong_laba" checked={formLunas.data.metode_lunas === 'potong_laba'} onChange={e => formLunas.setData('metode_lunas', e.target.value)} className="text-amber-500 focus:ring-amber-500 bg-slate-900 border-slate-600" />
                                    <div>
                                        <div className="font-semibold text-white text-sm flex items-center gap-2"><ChartPieIcon className="w-4 h-4"/> Potong Bagi Hasil (Pemutihan)</div>
                                        <div className="text-xs text-slate-400 mt-1">Uang tidak dikembalikan, tapi memotong hak bagi hasil akhir bulan. Saldo dompet tidak bertambah.</div>
                                    </div>
                                </div>
                            </label>
                        </div>
                        
                        <div className="mt-6 flex justify-end gap-3">
                            <button type="button" onClick={() => setShowLunas(null)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white">Batal</button>
                            <button type="submit" disabled={formLunas.processing} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl">Proses Pelunasan</button>
                        </div>
                    </form>
                )}
            </Modal>
        </AppLayout>
    );
}
