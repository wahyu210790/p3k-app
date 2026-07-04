import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import FlashMessage from '@/Components/FlashMessage';
import {
    HomeIcon, ShoppingCartIcon, CubeIcon, TruckIcon,
    BanknotesIcon, ChartBarIcon, Cog6ToothIcon,
    UsersIcon, TagIcon, ClipboardDocumentCheckIcon,
    ArrowRightStartOnRectangleIcon, Bars3Icon, XMarkIcon,
    BuildingStorefrontIcon, ReceiptPercentIcon, ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const NavLink = ({ href, active, icon: Icon, children, onClick }) => (
    <Link
        href={href}
        onClick={onClick}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
            ${active
                ? 'bg-amber-500 text-slate-900 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
    >
        <Icon className="w-5 h-5 shrink-0" />
        <span>{children}</span>
    </Link>
);

const NavSection = ({ title, children }) => (
    <div className="mb-1">
        <p className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
        {children}
    </div>
);

export default function AppLayout({ children, title = '' }) {
    const { props, url } = usePage();
    const user = props.auth?.user;
    const isOwner = user?.role === 'owner';
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path) => {
        if (path === '/') return url === '/';
        return url.startsWith(path);
    };

    const Sidebar = ({ onClose }) => (
        <aside className="flex flex-col h-full bg-slate-900 w-64 border-r border-slate-700/50">
            {/* Logo */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white p-0.5 flex items-center justify-center shadow-lg shrink-0 overflow-hidden">
                        <img src="/images/logo.png" alt="WARMINDO P3K Logo" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <p className="font-bold text-white text-sm leading-tight">WARMINDO P3K</p>
                        <p className="text-xs text-amber-400 capitalize">{user?.role}</p>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Nav Links */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">

                {/* Kasir & Owner */}
                <NavSection title="Operasional">
                    <NavLink href={route('pos.index')} active={isActive('/pos')} icon={ShoppingCartIcon} onClick={onClose}>
                        Kasir / POS
                    </NavLink>
                    <NavLink href={route('non-sales.index')} active={isActive('/non-sales')} icon={ExclamationTriangleIcon} onClick={onClose}>
                        Non-Sales
                    </NavLink>
                </NavSection>

                {/* Owner only */}
                {isOwner && (
                    <>
                        <NavSection title="Master Data">
                            <NavLink href={route('produk.index')} active={isActive('/produk')} icon={TagIcon} onClick={onClose}>
                                Produk
                            </NavLink>
                            <NavLink href={route('bahan-baku.index')} active={isActive('/bahan-baku')} icon={CubeIcon} onClick={onClose}>
                                Bahan Baku
                            </NavLink>
                            <NavLink href={route('supplier.index')} active={isActive('/supplier')} icon={TruckIcon} onClick={onClose}>
                                Supplier
                            </NavLink>
                            <NavLink href={route('promo.index')} active={isActive('/promo')} icon={ReceiptPercentIcon} onClick={onClose}>
                                Promo
                            </NavLink>
                        </NavSection>

                        <NavSection title="Keuangan">
                            <NavLink href={route('pembelian.index')} active={isActive('/pembelian')} icon={TruckIcon} onClick={onClose}>
                                Pembelian
                            </NavLink>
                            <NavLink href={route('pengeluaran.index')} active={isActive('/pengeluaran')} icon={BanknotesIcon} onClick={onClose}>
                                Pengeluaran
                            </NavLink>
                            <NavLink href={route('piutang.index')} active={isActive('/piutang')} icon={UsersIcon} onClick={onClose}>
                                Piutang
                            </NavLink>
                            <NavLink href={route('hutang.index')} active={isActive('/hutang')} icon={TruckIcon} onClick={onClose}>
                                Hutang Supplier
                            </NavLink>
                        </NavSection>

                        <NavSection title="Inventori">
                            <NavLink href={route('stock-opname.index')} active={isActive('/stock-opname')} icon={ClipboardDocumentCheckIcon} onClick={onClose}>
                                Stock Opname
                            </NavLink>
                        </NavSection>

                        <NavSection title="Laporan">
                            <NavLink href={route('laporan.penjualan')} active={isActive('/laporan/penjualan')} icon={ChartBarIcon} onClick={onClose}>
                                Penjualan
                            </NavLink>
                            <NavLink href={route('laporan.keuntungan')} active={isActive('/laporan/keuntungan')} icon={ChartBarIcon} onClick={onClose}>
                                Keuntungan
                            </NavLink>
                            <NavLink href={route('laporan.stok')} active={isActive('/laporan/stok')} icon={ChartBarIcon} onClick={onClose}>
                                Stok
                            </NavLink>
                        </NavSection>

                        <NavSection title="Sistem">
                            <NavLink href={route('dashboard')} active={isActive('/dashboard')} icon={HomeIcon} onClick={onClose}>
                                Dashboard
                            </NavLink>
                            <NavLink href={route('pengaturan.index')} active={isActive('/pengaturan')} icon={Cog6ToothIcon} onClick={onClose}>
                                Pengaturan
                            </NavLink>
                        </NavSection>
                    </>
                )}
            </nav>

            {/* User footer */}
            <div className="px-3 py-3 border-t border-slate-700/50">
                <div className="flex items-center gap-3 px-2 py-2">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                        <span className="text-amber-400 font-bold text-xs uppercase">
                            {user?.name?.[0]}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-slate-500 hover:text-red-400 transition-colors"
                        title="Logout"
                    >
                        <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </aside>
    );

    return (
        <div className="flex h-screen bg-slate-800 text-white overflow-hidden">
            {/* Desktop sidebar */}
            <div className="hidden lg:flex shrink-0">
                <Sidebar />
            </div>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <div className="absolute left-0 top-0 h-full z-50">
                        <Sidebar onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar */}
                <header className="flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur border-b border-slate-700/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden text-slate-400 hover:text-white p-1"
                        >
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                        <h1 className="font-semibold text-white text-base">{title}</h1>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>

            <FlashMessage />
        </div>
    );
}
