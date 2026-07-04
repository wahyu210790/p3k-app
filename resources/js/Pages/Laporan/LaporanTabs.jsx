import { Link } from '@inertiajs/react';
import { 
    ChartBarIcon, 
    CurrencyDollarIcon, 
    CubeIcon, 
    ReceiptRefundIcon, 
    FireIcon, 
    ClockIcon, 
    CreditCardIcon 
} from '@heroicons/react/24/outline';

const tabs = [
    { name: 'Penjualan & Omset', href: 'laporan.penjualan', icon: ChartBarIcon },
    { name: 'Laba / Rugi', href: 'laporan.keuntungan', icon: CurrencyDollarIcon },
    { name: 'Stok & Nilai HPP', href: 'laporan.stok', icon: CubeIcon },
    { name: 'Produk Terlaris', href: 'laporan.produk-terlaris', icon: FireIcon },
    { name: 'Pengeluaran', href: 'laporan.operasional', icon: ReceiptRefundIcon },
    { name: 'Piutang Pelanggan', href: 'laporan.piutang', icon: ClockIcon },
    { name: 'Hutang Supplier', href: 'laporan.hutang', icon: CreditCardIcon },
];

export default function LaporanTabs({ activeTab }) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-800 scrollbar-none">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.href;
                return (
                    <Link
                        key={tab.href}
                        href={route(tab.href)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                            isActive
                                ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20'
                                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50'
                        }`}
                    >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-slate-900' : 'text-amber-400'}`} />
                        <span>{tab.name}</span>
                    </Link>
                );
            })}
        </div>
    );
}
