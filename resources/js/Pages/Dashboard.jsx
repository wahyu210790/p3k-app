import AppLayout from '@/Layouts/AppLayout';
import { rupiah, formatStok } from '@/lib/utils';
import {
    BanknotesIcon, ShoppingCartIcon, ArrowTrendingUpIcon,
    ArrowTrendingDownIcon, ExclamationTriangleIcon, ClockIcon,
} from '@heroicons/react/24/outline';
import { Link } from '@inertiajs/react';

const StatCard = ({ label, value, color, icon: Icon }) => (
    <div className={`rounded-2xl p-4 border ${color} flex items-start gap-3`}>
        <div className="rounded-xl p-2 bg-white/10">
            <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
            <p className="text-xs opacity-70 font-medium">{label}</p>
            <p className="text-lg font-bold truncate">{value}</p>
        </div>
    </div>
);

const DompetCard = ({ label, saldo, color }) => (
    <div className={`rounded-xl p-4 ${color}`}>
        <p className="text-xs font-semibold opacity-70 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold mt-1">{rupiah(saldo)}</p>
    </div>
);

export default function Dashboard({ keuangan, total_nilai_stok, stok_rendah, transaksi_hari_ini, piutang_mendesak }) {
    const hari = keuangan.hari_ini;
    const dompet = keuangan.dompet;

    return (
        <AppLayout title="Dashboard">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Selamat datang 👋</h2>
                    <p className="text-slate-400 text-sm mt-0.5">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <Link href={route('laporan.penjualan')} className="text-amber-400 hover:text-amber-300 text-sm font-medium">
                    Lihat Laporan →
                </Link>
            </div>

            {/* 3 Dompet */}
            <section className="mb-6">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">💰 Saldo 3 Dompet</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <DompetCard label="Dompet Modal" saldo={dompet.modal}
                        color="bg-blue-900/50 border border-blue-700/50 text-blue-100" />
                    <DompetCard label="Dompet Operasional" saldo={dompet.operasional}
                        color="bg-violet-900/50 border border-violet-700/50 text-violet-100" />
                    <DompetCard label="Dompet Keuntungan" saldo={dompet.keuntungan}
                        color="bg-emerald-900/50 border border-emerald-700/50 text-emerald-100" />
                </div>
            </section>

            {/* Stats hari ini */}
            <section className="mb-6">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">📊 Hari Ini</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatCard label="Omset" value={rupiah(hari.omset, true)} icon={ShoppingCartIcon}
                        color="bg-amber-900/40 border-amber-700/50 text-amber-100" />
                    <StatCard label="Keuntungan" value={rupiah(hari.keuntungan, true)} icon={ArrowTrendingUpIcon}
                        color="bg-emerald-900/40 border-emerald-700/50 text-emerald-100" />
                    <StatCard label="Pengeluaran" value={rupiah(hari.pengeluaran, true)} icon={ArrowTrendingDownIcon}
                        color="bg-red-900/40 border-red-700/50 text-red-100" />
                    <StatCard label="Nilai Stok" value={rupiah(total_nilai_stok, true)} icon={BanknotesIcon}
                        color="bg-slate-700/60 border-slate-600/50 text-slate-100" />
                </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Transaksi terakhir */}
                <div className="lg:col-span-2 bg-slate-900/60 rounded-2xl border border-slate-700/50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-amber-400" />
                            Transaksi Hari Ini
                        </h3>
                        <Link href={route('pos.riwayat')} className="text-xs text-amber-400 hover:text-amber-300">
                            Lihat semua
                        </Link>
                    </div>
                    {transaksi_hari_ini.length === 0 ? (
                        <div className="py-12 text-center text-slate-500 text-sm">Belum ada transaksi hari ini</div>
                    ) : (
                        <div className="divide-y divide-slate-700/30">
                            {transaksi_hari_ini.map(t => (
                                <div key={t.id} className="flex items-center justify-between px-4 py-3">
                                    <div>
                                        <p className="text-sm font-medium text-white">{t.nomor_transaksi}</p>
                                        <p className="text-xs text-slate-500">
                                            {t.user?.name} · {t.metode_pembayaran?.toUpperCase()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-emerald-400">{rupiah(t.total_harga_jual)}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            t.status === 'selesai'
                                                ? 'bg-emerald-900/50 text-emerald-400'
                                                : 'bg-amber-900/50 text-amber-400'
                                        }`}>{t.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Alerts panel */}
                <div className="space-y-4">
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-slate-700/50 flex items-center gap-2">
                            <ExclamationTriangleIcon className="w-4 h-4 text-amber-400" />
                            <h3 className="font-semibold text-white text-sm">
                                Stok Rendah ({stok_rendah.length})
                            </h3>
                        </div>
                        {stok_rendah.length === 0 ? (
                            <div className="py-8 text-center text-slate-500 text-xs">Semua stok aman ✅</div>
                        ) : (
                            <div className="divide-y divide-slate-700/30 max-h-48 overflow-y-auto">
                                {stok_rendah.map(b => (
                                    <div key={b.id} className="px-4 py-2.5">
                                        <p className="text-sm text-white font-medium">{b.nama}</p>
                                        <p className="text-xs text-red-400">
                                            {formatStok(b.stok_saat_ini)} {b.satuan} / min {formatStok(b.stok_minimum)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {piutang_mendesak?.length > 0 && (
                        <div className="bg-slate-900/60 rounded-2xl border border-red-800/40 overflow-hidden">
                            <div className="px-4 py-3 border-b border-red-800/30 flex items-center gap-2">
                                <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
                                <h3 className="font-semibold text-red-300 text-sm">Piutang Menunggak</h3>
                            </div>
                            <div className="divide-y divide-slate-700/30">
                                {piutang_mendesak.map(p => (
                                    <div key={p.id} className="px-4 py-2.5">
                                        <p className="text-sm text-white font-medium">{p.nama_pelanggan}</p>
                                        <p className="text-xs text-red-400">{rupiah(p.sisa_piutang)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
