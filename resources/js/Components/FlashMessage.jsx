import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    CheckCircleIcon,
    XCircleIcon,
    XMarkIcon,
} from '@heroicons/react/24/solid';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [msg, setMsg] = useState({ type: null, text: null });

    useEffect(() => {
        if (flash?.success) {
            setMsg({ type: 'success', text: flash.success });
            setVisible(true);
        } else if (flash?.error) {
            setMsg({ type: 'error', text: flash.error });
            setVisible(true);
        }
        if (flash?.success || flash?.error) {
            const t = setTimeout(() => setVisible(false), 4000);
            return () => clearTimeout(t);
        }
    }, [flash]);

    if (!visible || !msg.text) return null;

    const isSuccess = msg.type === 'success';

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-start gap-3 max-w-sm w-full
                rounded-xl px-4 py-3 shadow-2xl border backdrop-blur-sm
                transition-all duration-300
                ${isSuccess
                    ? 'bg-emerald-900/90 border-emerald-600 text-emerald-100'
                    : 'bg-red-900/90 border-red-600 text-red-100'
                }`}
        >
            {isSuccess
                ? <CheckCircleIcon className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                : <XCircleIcon className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            }
            <p className="text-sm flex-1 leading-snug">{msg.text}</p>
            <button onClick={() => setVisible(false)} className="text-white/50 hover:text-white shrink-0">
                <XMarkIcon className="w-4 h-4" />
            </button>
        </div>
    );
}
