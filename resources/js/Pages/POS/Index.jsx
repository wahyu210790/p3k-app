import { useState, useMemo } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { rupiah } from '@/lib/utils';
import {
    PlusIcon, MinusIcon, TrashIcon, ShoppingCartIcon,
    MagnifyingGlassIcon, CheckIcon, XMarkIcon,
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
            <p className="text-xs font-semibold text-white leading-tight line-clamp-2">{produk.nama}</p>
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
        <div className="flex items-center gap-3 py-2.5 border-b border-slate-700/40 last:border-0">
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white leading-tight truncate">{item.nama}</p>
                <p className="text-xs text-amber-400">{rupiah(item.harga_aktual)}</p>
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
function ModalCheckout({ total, keranjang, onClose, onSubmit, processing }) {
    const [metode, setMetode] = useState('cash');
    const [piutang, setPiutang] = useState({ nama_pelanggan: '', nomor_wa: '' });

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

                <div className="px-5 py-4 space-y-4">
                    {/* Total */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 text-center">
                        <p className="text-xs text-amber-400 font-medium">TOTAL PEMBAYARAN</p>
                        <p className="text-3xl font-black text-amber-400">{rupiah(total)}</p>
                        <p className="text-xs text-slate-500 mt-1">{keranjang.length} item</p>
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
                        onClick={() => onSubmit(metode, metode === 'piutang' ? piutang : {})}
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

/* ── Halaman Utama POS ── */
export default function POSIndex({ produk_per_kategori }) {
    const [keranjang, setKeranjang] = useState([]);
    const [search, setSearch] = useState('');
    const [kategoriAktif, setKategoriAktif] = useState('Semua');
    const [showCheckout, setShowCheckout] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const semuaProduk = useMemo(() => {
        return Object.values(produk_per_kategori).flat();
    }, [produk_per_kategori]);

    const kategoriList = ['Semua', ...Object.keys(produk_per_kategori)];

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

    const handleSubmit = (metode, piutangData) => {
        setProcessing(true);
        router.post(route('pos.checkout'), {
            items: keranjang.map(i => ({
                produk_id: i.produk_id,
                qty: i.qty,
                promo_id: i.promo_id,
            })),
            metode_pembayaran: metode,
            piutang_data: piutangData,
        }, {
            onSuccess: () => {
                setKeranjang([]);
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
                    {/* Search + Filter Kategori */}
                    <div className="mb-4 space-y-3">
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                                type="text" value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Cari produk..."
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                            />
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
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-4 gap-2 overflow-y-auto pb-4">
                            {produkFiltered.map(p => (
                                <ProdukCard key={p.id} produk={p} onTambah={tambahKeKeranjang} />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Panel Keranjang (kanan/bawah) ── */}
                <div className="lg:w-80 xl:w-96 flex flex-col bg-slate-900/80 rounded-2xl border border-slate-700/50 overflow-hidden shrink-0">
                    <div className="px-4 py-3 border-b border-slate-700/50 flex items-center gap-2">
                        <ShoppingCartIcon className="w-5 h-5 text-amber-400" />
                        <h2 className="font-bold text-white">Keranjang</h2>
                        {keranjang.length > 0 && (
                            <span className="ml-auto bg-amber-500 text-slate-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {keranjang.length}
                            </span>
                        )}
                    </div>

                    {/* Error */}
                    {errors.message && (
                        <div className="mx-4 mt-3 px-3 py-2 bg-red-900/40 border border-red-700/50 rounded-xl text-xs text-red-300">
                            {errors.message}
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
                            <div className="flex gap-2">
                                <button onClick={() => setKeranjang([])}
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

            {/* Modal Checkout */}
            {showCheckout && (
                <ModalCheckout
                    total={total}
                    keranjang={keranjang}
                    onClose={() => setShowCheckout(false)}
                    onSubmit={handleSubmit}
                    processing={processing}
                />
            )}
        </AppLayout>
    );
}
