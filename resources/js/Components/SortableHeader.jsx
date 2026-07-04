import React from 'react';
import { ChevronUpIcon, ChevronDownIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';

/**
 * Komponen header tabel (<th>) yang bisa diklik untuk sorting A-Z / Z-A
 */
export default function SortableHeader({ label, sortKey, currentSort, onSort, className = '', align = 'left' }) {
    const isSorted = currentSort && currentSort.key === sortKey;
    const direction = isSorted ? currentSort.direction : null;

    const alignClass = {
        left: 'justify-start text-left',
        center: 'justify-center text-center',
        right: 'justify-end text-right',
    }[align] || 'justify-start text-left';

    return (
        <th 
            className={`px-4 py-3 cursor-pointer select-none group hover:bg-slate-800/80 hover:text-amber-400 transition-colors ${className}`}
            onClick={() => onSort(sortKey)}
            title={`Sortir berdasarkan ${typeof label === 'string' ? label : sortKey} (${!isSorted ? 'A-Z' : direction === 'asc' ? 'Z-A' : 'A-Z'})`}
        >
            <div className={`flex items-center gap-1.5 ${alignClass}`}>
                <span>{label}</span>
                <span className="inline-flex flex-col items-center justify-center shrink-0">
                    {!isSorted && <ChevronUpDownIcon className="w-3.5 h-3.5 text-slate-500 opacity-60 group-hover:opacity-100 transition-opacity" />}
                    {isSorted && direction === 'asc' && <ChevronUpIcon className="w-3.5 h-3.5 text-amber-400 font-bold" />}
                    {isSorted && direction === 'desc' && <ChevronDownIcon className="w-3.5 h-3.5 text-amber-400 font-bold" />}
                </span>
            </div>
        </th>
    );
}
