import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import { Cog6ToothIcon, BuildingStorefrontIcon, WalletIcon, DocumentTextIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const Field = ({ label, error, children, desc }) => (
    <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">{label}</label>
        {children}
        {desc && <p className="text-xs text-slate-500 mt-1">{desc}</p>}
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
);

export default function PengaturanIndex({ pengaturan }) {
    const { data, setData, put, processing, errors, recentlySuccessful } = useForm({
        nama_usaha:         pengaturan?.nama_usaha ?? 'P3K POS Cafe & Resto',
        alamat_usaha:       pengaturan?.alamat_usaha ?? '',
        telepon_usaha:      pengaturan?.telepon_usaha ?? '',
        persen_operasional: pengaturan?.persen_operasional ?? '20',
        footer_struk:       pengaturan?.footer_struk ?? 'Terima kasih atas kunjungan Anda!',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('pengaturan.update'));
    };

    const inputClass = "w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors";

    return (
        <AppLayout title="Pengaturan Sistem">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Cog6ToothIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Pengaturan Usaha & Keuangan</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Konfigurasi profil toko, struk kasir, dan persentase alokasi 3 dompet</p>
                    </div>
                </div>

                {recentlySuccessful && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-6 flex items-center gap-3 text-emerald-300">
                        <CheckCircleIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span className="text-sm font-semibold">Pengaturan berhasil disimpan dan diperbarui!</span>
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    {/* Profil Usaha */}
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 space-y-5">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                            <BuildingStorefrontIcon className="w-5 h-5 text-amber-400" />
                            <h3 className="font-bold text-white text-base">Profil & Identitas Usaha</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <Field label="Nama Toko / Usaha *" error={errors.nama_usaha}>
                                <input
                                    type="text"
                                    value={data.nama_usaha}
                                    onChange={(e) => setData('nama_usaha', e.target.value)}
                                    className={inputClass}
                                    placeholder="Contoh: Kopi Senja POS"
                                    required
                                />
                            </Field>

                            <Field label="Nomor Telepon / WA Toko" error={errors.telepon_usaha}>
                                <input
                                    type="text"
                                    value={data.telepon_usaha}
                                    onChange={(e) => setData('telepon_usaha', e.target.value)}
                                    className={inputClass}
                                    placeholder="Contoh: 081234567890"
                                />
                            </Field>
                        </div>

                        <Field label="Alamat Usaha" error={errors.alamat_usaha}>
                            <textarea
                                value={data.alamat_usaha}
                                onChange={(e) => setData('alamat_usaha', e.target.value)}
                                rows={2}
                                className={inputClass + " resize-none"}
                                placeholder="Alamat lengkap yang akan dicetak di header struk kasir..."
                            />
                        </Field>
                    </div>

                    {/* Konfigurasi Keuangan 3 Dompet */}
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 space-y-5">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                            <WalletIcon className="w-5 h-5 text-purple-400" />
                            <div>
                                <h3 className="font-bold text-white text-base">Alokasi Dompet Operasional</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Atur berapa persen dari laba kotor yang otomatis disisihkan ke Dompet Operasional</p>
                            </div>
                        </div>

                        <div className="max-w-xs">
                            <Field
                                label="Persentase Dompet Operasional (%) *"
                                error={errors.persen_operasional}
                                desc={`Sisa ${(100 - (parseFloat(data.persen_operasional) || 0))}% akan masuk ke Dompet Keuntungan Murni.`}
                            >
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={data.persen_operasional}
                                        onChange={(e) => setData('persen_operasional', e.target.value)}
                                        className={inputClass}
                                        placeholder="20"
                                        min="0"
                                        max="100"
                                        step="0.1"
                                        required
                                    />
                                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                                </div>
                            </Field>
                        </div>

                        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-xs text-purple-300 space-y-1">
                            <p className="font-bold">💡 Simulasi Alokasi 3 Dompet:</p>
                            <p>Jika omset Rp 100.000 dengan modal HPP Rp 60.000 (Laba Kotor Rp 40.000):</p>
                            <ul className="list-disc list-inside text-slate-300 pl-1 mt-1 space-y-0.5">
                                <li><b>Dompet Modal (HPP):</b> Rp 60.000 (selalu 100% dari HPP barang)</li>
                                <li><b>Dompet Operasional ({data.persen_operasional || 0}%):</b> Rp {((40000 * (parseFloat(data.persen_operasional) || 0)) / 100).toLocaleString('id-ID')}</li>
                                <li><b>Dompet Keuntungan ({100 - (parseFloat(data.persen_operasional) || 0)}%):</b> Rp {((40000 * (100 - (parseFloat(data.persen_operasional) || 0))) / 100).toLocaleString('id-ID')}</li>
                            </ul>
                        </div>
                    </div>

                    {/* Struk Kasir */}
                    <div className="bg-slate-900/60 rounded-2xl border border-slate-700/50 p-6 space-y-5">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                            <DocumentTextIcon className="w-5 h-5 text-emerald-400" />
                            <h3 className="font-bold text-white text-base">Tampilan Struk Kasir</h3>
                        </div>

                        <Field
                            label="Pesan Footer Struk (Bawah)"
                            error={errors.footer_struk}
                            desc="Pesan singkat atau promo yang dicetak di bagian paling bawah struk kasir."
                        >
                            <input
                                type="text"
                                value={data.footer_struk}
                                onChange={(e) => setData('footer_struk', e.target.value)}
                                className={inputClass}
                                placeholder="Terima kasih atas kunjungan Anda!"
                            />
                        </Field>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-900 font-bold transition-all shadow-lg shadow-amber-500/20"
                    >
                        {processing ? 'Menyimpan Pengaturan...' : 'Simpan Semua Pengaturan'}
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
