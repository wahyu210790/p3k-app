import { useState, useMemo } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { rupiah } from '@/lib/utils';
import {
    PlusIcon, MinusIcon, TrashIcon, ShoppingCartIcon,
    MagnifyingGlassIcon, CheckIcon, XMarkIcon,
    BookmarkIcon, ClipboardDocumentListIcon, ClockIcon,
    ExclamationCircleIcon, ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

/* ── Komponen Kartu Produk ── */
function ProdukCard({ produk, onTambah }) {
    const harga = produk.harga_promo?.harga_promo ?? produk.harga_jual;
    const adaPromo = !!produk.harga_promo;
    const habis = produk.max_qty === 0;

    return (
        <button
            onClick={() => !habis && onTambah(produk)}
            disabled={habis}
            title={produk.nama}
            className={`relative flex flex-col items-center text-center rounded-2xl p-3 border transition-all duration-150 w-full
                ${habis
                    ? 'bg-slate-800/30 border-slate-700/30 opacity-50 cursor-not-allowed'
                    : 'bg-slate-800/70 border-slate-700/50 hover:border-amber-500/60 hover:bg-slate-800 active:scale-95'
                }`}
        >
            {adaPromo && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    PROMO
                </span>
            )}
            {produk.foto_url ? (
                <img src={produk.foto_url} alt={produk.nama}
                    className="w-16 h-16 rounded-xl object-cover mb-2" />
            ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-700 flex items-center justify-center mb-2">
                    <ShoppingCartIcon className="w-7 h-7 text-slate-500" />
                </div>
            )}
            <p className="text-xs font-semibold text-white leading-tight break-words">{produk.nama}</p>
            <div className="mt-1">
                {adaPromo && (
                    <p className="text-xs text-slate-500 line-through">{rupiah(produk.harga_jual)}</p>
                )}
                <p className="text-sm font-bold text-amber-400">{rupiah(harga)}</p>
            </div>
            {habis && <span className="text-xs text-red-400 mt-1">Stok habis</span>}
        </button>
    );
}

/* ── Komponen Item di Keranjang ── */
function KeranjangItem({ item, onUpdate, onHapus }) {
    return (
        <div className="flex items-center gap-3 py-2.5 border-b border-slate-700/40 last:border-0" title={item.nama}>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white leading-snug break-words">{item.nama}</p>
                <p className="text-xs text-amber-400 mt-0.5">{rupiah(item.harga_aktual)}</p>
            </div>
            <div className="flex items-center gap-1">
                <button onClick={() => onUpdate(item.produk_id, item.qty - 1)}
                    className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-colors">
                    <MinusIcon className="w-3.5 h-3.5 text-white" />
                </button>
                <span className="w-8 text-center text-sm font-bold text-white">{item.qty}</span>
                <button onClick={() => onUpdate(item.produk_id, item.qty + 1)}
                    disabled={item.qty >= item.max_qty}
                    className="w-7 h-7 rounded-lg bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:opacity-50 flex items-center justify-center transition-colors">
                    <PlusIcon className="w-3.5 h-3.5 text-white" />
                </button>
            </div>
            <p className="text-sm font-bold text-white w-20 text-right shrink-0">
                {rupiah(item.harga_aktual * item.qty)}
            </p>
            <button onClick={() => onHapus(item.produk_id)}
                className="text-slate-500 hover:text-red-400 transition-colors shrink-0">
                <TrashIcon className="w-4 h-4" />
            </button>
        </div>
    );
}

/* ── Modal Checkout ── */
function ModalCheckout({ total, keranjang, onClose, onSubmit, processing, errorMsg }) {
    const [metode, setMetode] = useState('cash');
    const [piutang, setPiutang] = useState({ nama_pelanggan: '', nomor_wa: '' });
    const [useCustomDate, setUseCustomDate] = useState(false);
    const [customDate, setCustomDate] = useState(new Date().toLocaleDateString('en-CA'));

    const metodeList = [
        { value: 'cash', label: '💵 Cash' },
        { value: 'qris', label: '📱 QRIS' },
        { value: 'transfer', label: '🏦 Transfer' },
        { value: 'piutang', label: '📝 Piutang' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-slate-900 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl z-10">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
                    <h3 className="font-bold text-white text-lg">Konfirmasi Pembayaran</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
                    {/* Error Display */}
                    {errorMsg && (
                        <div className="bg-red-900/50 border border-red-500 rounded-xl p-3 text-xs text-red-200 flex items-start gap-2 shadow-sm animate-pulse">
                            <ExclamationCircleIcon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-red-300">Gagal Memproses Pesanan:</p>
                                <p className="whitespace-pre-line mt-0.5 leading-relaxed">{errorMsg}</p>
                            </div>
                        </div>
                    )}

                    {/* Total */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-center">
                        <p className="text-xs text-amber-400 font-medium">TOTAL PEMBAYARAN</p>
                        <p className="text-3xl font-black text-amber-400">{rupiah(total)}</p>
                        <p className="text-xs text-slate-500 mt-1">{keranjang.length} item</p>
                    </div>

                    {/* Opsi Tanggal Transaksi (Untuk Backdate Orderan Lama) */}
                    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-3 transition-all">
                        <div className="flex items-center justify-between">
                            <label onClick={() => setUseCustomDate(!useCustomDate)} className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer select-none">
                                <ClockIcon className="w-4 h-4 text-amber-400" />
                                <span>Input Untuk Tanggal Lama?</span>
                            </label>
                            <input
                                type="checkbox"
                                checked={useCustomDate}
                                onChange={e => setUseCustomDate(e.target.checked)}
                                className="rounded bg-slate-700 border-slate-500 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                            />
                        </div>
                        {useCustomDate && (
                            <div className="mt-2.5 pt-2.5 border-t border-slate-700 animate-fadeIn">
                                <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                    Pilih Tanggal Orderan:
                                </label>
                                <input
                                    type="date"
                                    value={customDate}
                                    onChange={e => setCustomDate(e.target.value)}
                                    max={new Date().toLocaleDateString('en-CA')}
                                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                                />
                                <p className="text-[10px] text-amber-400 mt-1.5 leading-relaxed">
                                    💡 <span className="font-semibold">Info:</span> Transaksi, laporan & riwayat keuntungan akan tercatat di tanggal yang dipilih ini.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Metode Pembayaran */}
                    <div>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Metode Bayar</p>
                        <div className="grid grid-cols-2 gap-2">
                            {metodeList.map(m => (
                                <button key={m.value} onClick={() => setMetode(m.value)}
                                    className={`py-2.5 rounded-xl text-sm font-semibold border transition-all
                                        ${metode === m.value
                                            ? 'bg-amber-500 border-amber-500 text-slate-900'
                                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                                        }`}>
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Form Piutang */}
                    {metode === 'piutang' && (
                        <div className="space-y-2">
                            <input
                                type="text" placeholder="Nama Pelanggan *"
                                value={piutang.nama_pelanggan}
                                onChange={e => setPiutang(p => ({ ...p, nama_pelanggan: e.target.value }))}
                                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                            />
                            <input
                                type="text" placeholder="Nomor WA (opsional)"
                                value={piutang.nomor_wa}
                                onChange={e => setPiutang(p => ({ ...p, nomor_wa: e.target.value }))}
                                className="w-full bg-slate-800 border border-slate-600 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                            />
                        </div>
                    )}
                </div>

                <div className="px-5 pb-5 flex gap-3">
                    <button onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300 font-semibold text-sm hover:bg-slate-800 transition-colors">
                        Batal
                    </button>
                    <button
                        onClick={() => onSubmit(metode, metode === 'piutang' ? piutang : {}, useCustomDate ? customDate : null)}
                        disabled={processing || (metode === 'piutang' && !piutang.nama_pelanggan)}
                        className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                        {processing ? (
                            <span className="animate-spin w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full" />
                        ) : (
                            <><CheckIcon className="w-4 h-4" /> Proses</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Modal Simpan / Update Open Bill (Meja) ── */
function ModalOpenBill({ initialData, total, itemCount, onClose, onSubmit, processing }) {
    const [namaMeja, setNamaMeja] = useState(initialData?.nama_meja || '');
    const [catatan, setCatatan] = useState(initialData?.catatan || '');

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-slate-900 rounded-2xl w-full max-w-sm border border-slate-700 shadow-2xl z-10">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
                    <h3 className="font-bold text-white text-lg">
                        {initialData?.id ? 'Update Pesanan Meja' : 'Simpan ke Meja (Open Bill)'}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-4">
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-center">
                        <p className="text-xs text-amber-400 font-medium">TOTAL ESTIMASI</p>
                        <p className="text-2xl font-black text-amber-400">{rupiah(total)}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{itemCount} item di keranjang</p>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            Nomor Meja / Nama Pelanggan *
                        </label>
                        <input
                            type="text"
                            placeholder="Misal: Meja 4 - Pak Budi"
                            value={namaMeja}
                            onChange={e => setNamaMeja(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            Catatan Dapur / Pesanan (Opsional)
                        </label>
                        <textarea
                            rows={2}
                            placeholder="Misal: Pedas, jangan pakai daun bawang..."
                            value={catatan}
                            onChange={e => setCatatan(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        />
                    </div>
                </div>

                <div className="px-5 pb-5 flex gap-3">
                    <button onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-300 font-semibold text-sm hover:bg-slate-800 transition-colors">
                        Batal
                    </button>
                    <button
                        onClick={() => onSubmit({ nama_meja: namaMeja, catatan })}
                        disabled={processing || !namaMeja.trim()}
                        className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                        {processing ? (
                            <span className="animate-spin w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full" />
                        ) : (
                            <><BookmarkIcon className="w-4 h-4" /> {initialData?.id ? 'Update Meja' : 'Simpan Meja'}</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Modal Daftar Meja Aktif ── */
function ModalDaftarMeja({ openBills, onClose, onSelectBill, onDeleteBill }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-slate-900 rounded-2xl w-full max-w-2xl border border-slate-700 shadow-2xl z-10 flex flex-col max-h-[85vh]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 shrink-0">
                    <div className="flex items-center gap-2">
                        <ClipboardDocumentListIcon className="w-5 h-5 text-amber-400" />
                        <h3 className="font-bold text-white text-lg">Daftar Meja / Open Bill ({openBills.length})</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto space-y-3 flex-1">
                    {openBills.length === 0 ? (
                        <div className="py-12 text-center text-slate-500">
                            <ClipboardDocumentListIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p className="text-sm font-medium">Belum ada pesanan meja yang aktif</p>
                            <p className="text-xs mt-1">Gunakan tombol "Simpan ke Meja" di keranjang saat ada pelanggan makan di tempat.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {openBills.map(bill => {
                                const totalQty = bill.keranjang?.reduce((s, i) => s + i.qty, 0) || 0;
                                return (
                                    <div key={bill.id}
                                        className="bg-slate-800/80 border border-slate-700 hover:border-amber-500/50 rounded-xl p-4 flex flex-col justify-between transition-all group">
                                        <div>
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h4 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                                                    {bill.nama_meja}
                                                </h4>
                                                <span className="text-xs bg-amber-500/10 text-amber-400 font-semibold px-2 py-0.5 rounded-full border border-amber-500/20 shrink-0">
                                                    {totalQty} item
                                                </span>
                                            </div>
                                            <p className="text-xl font-black text-amber-400 mb-2">
                                                {rupiah(bill.total_estimasi)}
                                            </p>
                                            {bill.catatan && (
                                                <p className="text-xs text-slate-400 bg-slate-900/60 p-2 rounded-lg mb-3 italic border border-slate-700/50">
                                                    "{bill.catatan}"
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 pt-3 border-t border-slate-700/60 mt-auto">
                                            <button
                                                onClick={() => onDeleteBill(bill)}
                                                className="px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 text-xs font-semibold transition-colors flex items-center justify-center">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => onSelectBill(bill)}
                                                className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                                                📂 Buka & Tambah Item
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="px-5 py-3 border-t border-slate-700 bg-slate-900/50 flex justify-end shrink-0">
                    <button onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ── Halaman Utama POS ── */
export default function POSIndex({ produk_per_kategori, open_bills = [] }) {
    const [keranjang, setKeranjang] = useState([]);
    const [search, setSearch] = useState('');
    const [kategoriAktif, setKategoriAktif] = useState('Semua');
    const [showCheckout, setShowCheckout] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    // Open Bill state
    const [activeOpenBill, setActiveOpenBill] = useState(null);
    const [showModalOpenBill, setShowModalOpenBill] = useState(false);
    const [showModalDaftarMeja, setShowModalDaftarMeja] = useState(false);
    const [openBillProcessing, setOpenBillProcessing] = useState(false);
    const [showMobileCart, setShowMobileCart] = useState(false);

    const semuaProduk = useMemo(() => {
        return Object.values(produk_per_kategori).flat();
    }, [produk_per_kategori]);

    const kategoriList = useMemo(() => {
        const defaultOrder = ['Makanan', 'Minuman', 'Rokok', 'Add-On / Topping', 'Lainnya'];
        const keys = Object.keys(produk_per_kategori);
        const sorted = keys.sort((a, b) => {
            const idxA = defaultOrder.indexOf(a);
            const idxB = defaultOrder.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return a.localeCompare(b);
        });
        return ['Semua', ...sorted];
    }, [produk_per_kategori]);

    const produkFiltered = useMemo(() => {
        let list = kategoriAktif === 'Semua' ? semuaProduk : (produk_per_kategori[kategoriAktif] ?? []);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(p => p.nama.toLowerCase().includes(q));
        }
        return list;
    }, [search, kategoriAktif, semuaProduk, produk_per_kategori]);

    const tambahKeKeranjang = (produk) => {
        const hargaAktual = produk.harga_promo?.harga_promo ?? produk.harga_jual;
        setKeranjang(prev => {
            const exists = prev.find(i => i.produk_id === produk.id);
            if (exists) {
                if (exists.qty >= produk.max_qty) return prev;
                return prev.map(i => i.produk_id === produk.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, {
                produk_id: produk.id,
                nama: produk.nama,
                qty: 1,
                harga_aktual: hargaAktual,
                max_qty: produk.max_qty,
                promo_id: produk.harga_promo?.promo_id ?? null,
            }];
        });
    };

    const updateQty = (produkId, qty) => {
        if (qty <= 0) {
            setKeranjang(prev => prev.filter(i => i.produk_id !== produkId));
        } else {
            setKeranjang(prev => prev.map(i =>
                i.produk_id === produkId ? { ...i, qty: Math.min(qty, i.max_qty) } : i
            ));
        }
    };

    const hapusItem = (produkId) => {
        setKeranjang(prev => prev.filter(i => i.produk_id !== produkId));
    };

    const total = useMemo(() => keranjang.reduce((s, i) => s + i.harga_aktual * i.qty, 0), [keranjang]);

    const handleSaveOpenBill = (data) => {
        setOpenBillProcessing(true);
        const payload = {
            nama_meja: data.nama_meja,
            catatan: data.catatan,
            keranjang: keranjang,
            total_estimasi: total,
        };

        if (activeOpenBill?.id) {
            router.put(route('pos.open-bill.update', activeOpenBill.id), payload, {
                onSuccess: () => {
                    setKeranjang([]);
                    setActiveOpenBill(null);
                    setShowModalOpenBill(false);
                },
                onFinish: () => setOpenBillProcessing(false),
            });
        } else {
            router.post(route('pos.open-bill.store'), payload, {
                onSuccess: () => {
                    setKeranjang([]);
                    setShowModalOpenBill(false);
                },
                onFinish: () => setOpenBillProcessing(false),
            });
        }
    };

    const handleSelectBill = (bill) => {
        setKeranjang(bill.keranjang || []);
        setActiveOpenBill({ id: bill.id, nama_meja: bill.nama_meja, catatan: bill.catatan });
        setShowModalDaftarMeja(false);
    };

    const handleDeleteBill = (bill) => {
        if (confirm(`Hapus / Batal pesanan meja '${bill.nama_meja}'?`)) {
            router.delete(route('pos.open-bill.destroy', bill.id), {
                onSuccess: () => {
                    if (activeOpenBill?.id === bill.id) {
                        setActiveOpenBill(null);
                        setKeranjang([]);
                    }
                }
            });
        }
    };

    const handleSubmit = (metode, piutangData, tanggalTransaksi = null) => {
        setProcessing(true);
        setErrors({});
        router.post(route('pos.checkout'), {
            items: keranjang.map(i => ({
                produk_id: i.produk_id,
                qty: i.qty,
                promo_id: i.promo_id,
            })),
            metode_pembayaran: metode,
            piutang_data: piutangData,
            open_bill_id: activeOpenBill?.id || null,
            tanggal_transaksi: tanggalTransaksi,
        }, {
            onSuccess: () => {
                setKeranjang([]);
                setActiveOpenBill(null);
                setShowCheckout(false);
            },
            onError: (e) => {
                setErrors(e);
                setProcessing(false);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AppLayout title="Kasir / POS">
            <div className="flex flex-col lg:flex-row gap-4 h-full">

                {/* ── Panel Produk (kiri/atas) ── */}
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Search + Filter Kategori + Tombol Meja Aktif Mobile */}
                    <div className="mb-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text" value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    placeholder="Cari produk..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                                />
                            </div>
                            {/* Tombol Meja Aktif (Khusus HP / Mobile) */}
                            <button
                                onClick={() => setShowModalDaftarMeja(true)}
                                className="lg:hidden shrink-0 px-3 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm">
                                <ClipboardDocumentListIcon className="w-4 h-4" />
                                <span>Meja ({open_bills.length})</span>
                            </button>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                            {kategoriList.map(k => (
                                <button key={k} onClick={() => setKategoriAktif(k)}
                                    className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all
                                        ${kategoriAktif === k
                                            ? 'bg-amber-500 border-amber-500 text-slate-900'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                                        }`}>
                                    {k}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Grid Produk */}
                    {produkFiltered.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
                            Produk tidak ditemukan
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 gap-2 overflow-y-auto pb-24 lg:pb-4">
                            {produkFiltered.map(p => (
                                <ProdukCard key={p.id} produk={p} onTambah={tambahKeKeranjang} />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Panel Keranjang (kanan/bawah - Khusus PC / Desktop) ── */}
                <div className="hidden lg:flex lg:w-[410px] xl:w-[440px] flex-col bg-slate-900/80 rounded-2xl border border-slate-700/50 overflow-hidden shrink-0">
                    <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <ShoppingCartIcon className="w-5 h-5 text-amber-400" />
                            <h2 className="font-bold text-white">Keranjang</h2>
                            {keranjang.length > 0 && (
                                <span className="bg-amber-500 text-slate-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                    {keranjang.length}
                                </span>
                            )}
                        </div>

                        {/* Tombol Daftar Meja Aktif */}
                        <button
                            onClick={() => setShowModalDaftarMeja(true)}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm">
                            <ClipboardDocumentListIcon className="w-4 h-4" />
                            <span>Meja Aktif ({open_bills.length})</span>
                        </button>
                    </div>

                    {/* Banner Jika Sedang Melayani Meja Aktif */}
                    {activeOpenBill && (
                        <div className="mx-4 mt-3 px-3 py-2.5 bg-amber-500/15 border border-amber-500/50 rounded-xl flex items-center justify-between gap-2 shadow-sm">
                            <div className="min-w-0">
                                <p className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">Sedang Melayani:</p>
                                <p className="text-sm font-black text-white break-words">{activeOpenBill.nama_meja}</p>
                            </div>
                            <button
                                onClick={() => { setActiveOpenBill(null); setKeranjang([]); }}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold shrink-0 border border-slate-600 transition-colors">
                                Tutup / Lepas
                            </button>
                        </div>
                    )}

                    {/* Error */}
                    {errors.message && (
                        <div className="mx-4 mt-3 px-3 py-2.5 bg-red-900/50 border border-red-500 rounded-xl text-xs text-red-200 flex items-start gap-2 shadow-sm">
                            <ExclamationCircleIcon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-red-300">Gagal Memproses Pesanan:</p>
                                <p className="whitespace-pre-line mt-0.5 leading-relaxed">{errors.message}</p>
                            </div>
                        </div>
                    )}

                    {/* Items */}
                    <div className="flex-1 overflow-y-auto px-4 py-2">
                        {keranjang.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-slate-600">
                                <ShoppingCartIcon className="w-10 h-10 mb-2" />
                                <p className="text-sm">Keranjang kosong</p>
                                <p className="text-xs mt-1">Ketuk produk untuk menambahkan</p>
                            </div>
                        ) : (
                            keranjang.map(item => (
                                <KeranjangItem key={item.produk_id} item={item}
                                    onUpdate={updateQty} onHapus={hapusItem} />
                            ))
                        )}
                    </div>

                    {/* Total + Checkout */}
                    {keranjang.length > 0 && (
                        <div className="px-4 py-4 border-t border-slate-700/50 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-sm">Total</span>
                                <span className="text-xl font-black text-amber-400">{rupiah(total)}</span>
                            </div>

                            {/* Tombol Simpan ke Meja (Open Bill) */}
                            <button
                                onClick={() => setShowModalOpenBill(true)}
                                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-amber-500/30 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm">
                                <BookmarkIcon className="w-4 h-4" />
                                {activeOpenBill ? `Update Pesanan '${activeOpenBill.nama_meja}'` : '📌 Simpan ke Meja (Open Bill)'}
                            </button>

                            <div className="flex gap-2">
                                <button onClick={() => { setKeranjang([]); setActiveOpenBill(null); }}
                                    className="px-3 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                                <button onClick={() => setShowCheckout(true)}
                                    className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <CheckIcon className="w-4 h-4" />
                                    Bayar Sekarang
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Bar / Tombol Keranjang Bawah (Khusus HP / Mobile) ── */}
            {keranjang.length > 0 && !showMobileCart && (
                <div 
                    onClick={() => setShowMobileCart(true)}
                    className="fixed bottom-4 left-4 right-4 z-30 lg:hidden bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-900 rounded-2xl p-3.5 shadow-2xl flex items-center justify-between gap-3 transition-all cursor-pointer border-2 border-amber-300">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="bg-slate-900 text-amber-400 font-extrabold text-xs px-2.5 py-1 rounded-xl shrink-0 flex items-center gap-1.5 shadow-sm">
                            <ShoppingCartIcon className="w-4 h-4" />
                            <span>{keranjang.reduce((s, i) => s + i.qty, 0)}</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-900/80 uppercase leading-none">
                                {activeOpenBill ? `Meja: ${activeOpenBill.nama_meja}` : 'Total Keranjang'}
                            </p>
                            <p className="text-base font-black text-slate-900 truncate leading-tight mt-0.5">
                                {rupiah(total)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-xs bg-slate-900/10 px-3 py-1.5 rounded-xl shrink-0">
                        <span>Lihat / Bayar</span>
                        <span>➔</span>
                    </div>
                </div>
            )}

            {/* ── Mobile Drawer / Bottom Sheet Keranjang (Khusus HP / Mobile) ── */}
            {showMobileCart && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-xs" onClick={() => setShowMobileCart(false)} />
                    <div className="relative bg-slate-900 rounded-t-3xl border-t border-slate-700 shadow-2xl max-h-[85vh] flex flex-col w-full overflow-hidden z-10">
                        {/* Drawer Header */}
                        <div className="px-5 py-3.5 border-b border-slate-700 flex items-center justify-between gap-2 shrink-0 bg-slate-800/60">
                            <div className="flex items-center gap-2">
                                <ShoppingCartIcon className="w-5 h-5 text-amber-400" />
                                <h3 className="font-bold text-white text-base">Keranjang Pesanan</h3>
                                {keranjang.length > 0 && (
                                    <span className="bg-amber-500 text-slate-900 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {keranjang.length} item
                                    </span>
                                )}
                            </div>
                            <button onClick={() => setShowMobileCart(false)}
                                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Banner Jika Sedang Melayani Meja Aktif */}
                        {activeOpenBill && (
                            <div className="mx-4 mt-3 px-3 py-2.5 bg-amber-500/15 border border-amber-500/50 rounded-xl flex items-center justify-between gap-2 shadow-sm shrink-0">
                                <div className="min-w-0">
                                    <p className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">Sedang Melayani:</p>
                                    <p className="text-sm font-black text-white break-words">{activeOpenBill.nama_meja}</p>
                                </div>
                                <button
                                    onClick={() => { setActiveOpenBill(null); setKeranjang([]); setShowMobileCart(false); }}
                                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold shrink-0 border border-slate-600 transition-colors">
                                    Tutup / Lepas
                                </button>
                            </div>
                        )}

                        {/* Error Display di Drawer Mobile */}
                        {errors.message && (
                            <div className="mx-4 mt-3 p-3 bg-red-900/50 border border-red-500 rounded-xl text-xs text-red-200 flex items-start gap-2 shadow-sm shrink-0 animate-pulse">
                                <ExclamationCircleIcon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold text-red-300">Gagal Memproses Pesanan:</p>
                                    <p className="whitespace-pre-line mt-0.5 leading-relaxed">{errors.message}</p>
                                </div>
                            </div>
                        )}

                        {/* Drawer Items */}
                        <div className="p-4 overflow-y-auto space-y-2 flex-1">
                            {keranjang.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-center">
                                    <ShoppingCartIcon className="w-10 h-10 mb-2 opacity-50" />
                                    <p className="text-sm font-semibold">Keranjang masih kosong</p>
                                    <p className="text-xs mt-1 text-slate-600">Pilih menu di layar belakang untuk menambah</p>
                                </div>
                            ) : (
                                keranjang.map(item => (
                                    <KeranjangItem key={item.produk_id} item={item}
                                        onUpdate={updateQty} onHapus={hapusItem} />
                                ))
                            )}
                        </div>

                        {/* Drawer Footer & Actions */}
                        {keranjang.length > 0 && (
                            <div className="p-4 border-t border-slate-700/80 bg-slate-900/95 space-y-3 shrink-0">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-400 text-sm font-semibold">Total Pembayaran</span>
                                    <span className="text-xl font-black text-amber-400">{rupiah(total)}</span>
                                </div>

                                {/* Tombol Simpan ke Meja (Open Bill) */}
                                <button
                                    onClick={() => { setShowMobileCart(false); setShowModalOpenBill(true); }}
                                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-amber-500/30 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm">
                                    <BookmarkIcon className="w-4 h-4" />
                                    {activeOpenBill ? `Update Pesanan '${activeOpenBill.nama_meja}'` : '📌 Simpan ke Meja (Open Bill)'}
                                </button>

                                <div className="flex gap-2">
                                    <button onClick={() => { setKeranjang([]); setActiveOpenBill(null); setShowMobileCart(false); }}
                                        className="px-3 py-3 rounded-xl bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-400 border border-slate-700 transition-colors">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => { setShowMobileCart(false); setShowCheckout(true); }}
                                        className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
                                        <CheckIcon className="w-5 h-5" />
                                        Bayar Sekarang ({rupiah(total)})
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal Checkout */}
            {showCheckout && (
                <ModalCheckout
                    total={total}
                    keranjang={keranjang}
                    onClose={() => { setShowCheckout(false); setErrors({}); }}
                    onSubmit={handleSubmit}
                    processing={processing}
                    errorMsg={errors.message}
                />
            )}

            {/* Modal Open Bill */}
            {showModalOpenBill && (
                <ModalOpenBill
                    initialData={activeOpenBill}
                    total={total}
                    itemCount={keranjang.reduce((s, i) => s + i.qty, 0)}
                    onClose={() => setShowModalOpenBill(false)}
                    onSubmit={handleSaveOpenBill}
                    processing={openBillProcessing}
                />
            )}

            {/* Modal Daftar Meja */}
            {showModalDaftarMeja && (
                <ModalDaftarMeja
                    openBills={open_bills}
                    onClose={() => setShowModalDaftarMeja(false)}
                    onSelectBill={handleSelectBill}
                    onDeleteBill={handleDeleteBill}
                />
            )}
        </AppLayout>
    );
}
