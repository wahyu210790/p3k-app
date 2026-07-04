import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MagnifyingGlassIcon, ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function SearchableSelect({
    options = [],
    value,
    onChange,
    placeholder = "Pilih opsi...",
    className = "",
    disabled = false,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // Cari label untuk nilai yang sedang terpilih
    const selectedOption = useMemo(() => {
        return options.find((opt) => opt.value == value);
    }, [options, value]);

    // Filter opsi berdasarkan query pencarian
    const filteredOptions = useMemo(() => {
        if (!query.trim()) return options;
        const q = query.toLowerCase();
        return options.filter((opt) => {
            const labelMatch = opt.label?.toLowerCase().includes(q);
            const sublabelMatch = opt.sublabel?.toLowerCase().includes(q);
            return labelMatch || sublabelMatch;
        });
    }, [options, query]);

    // Tutup dropdown saat klik di luar komponen
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset highlight dan fokus ke input saat dropdown dibuka
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setHighlightedIndex(0);
            setTimeout(() => {
                inputRef.current?.focus();
            }, 10);
        }
    }, [isOpen]);

    const handleSelect = (val) => {
        onChange(val);
        setIsOpen(false);
        setQuery('');
    };

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
                e.preventDefault();
                setIsOpen(true);
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredOptions[highlightedIndex]) {
                handleSelect(filteredOptions[highlightedIndex].value);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsOpen(false);
        }
    };

    return (
        <div ref={containerRef} className={`relative ${isOpen ? 'z-50' : 'z-10'} ${className}`}>
            {/* Tombol Utama (Pemicu Dropdown) */}
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                tabIndex={disabled ? -1 : 0}
                onKeyDown={handleKeyDown}
                className={`w-full bg-slate-800 border ${
                    isOpen ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-700 hover:border-slate-600'
                } rounded-xl px-3 py-2.5 text-sm text-white flex items-center justify-between gap-2 cursor-pointer transition-all ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
            >
                <div className="flex-1 truncate text-left">
                    {selectedOption ? (
                        <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-white truncate">{selectedOption.label}</span>
                            {selectedOption.sublabel && (
                                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-700/80 text-amber-400 shrink-0">
                                    {selectedOption.sublabel}
                                </span>
                            )}
                        </div>
                    ) : (
                        <span className="text-slate-500 italic">{placeholder}</span>
                    )}
                </div>
                <ChevronUpDownIcon className="w-4 h-4 text-slate-400 shrink-0" />
            </div>

            {/* Menu Dropdown Pencarian */}
            {isOpen && (
                <div className="absolute left-0 right-0 mt-1.5 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* Kotak Pencarian */}
                    <div className="p-2 border-b border-slate-700/80 bg-slate-900/90 sticky top-0 z-10 flex items-center gap-2">
                        <MagnifyingGlassIcon className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setHighlightedIndex(0);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Ketik nama bahan baku untuk mencari..."
                            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none pr-2 py-1"
                        />
                    </div>

                    {/* Daftar Pilihan */}
                    <ul className="max-h-60 overflow-y-auto divide-y divide-slate-700/30 py-1">
                        {filteredOptions.length === 0 ? (
                            <li className="px-4 py-6 text-center text-xs text-slate-500 italic">
                                🔍 Tidak menemukan bahan baku dengan nama "<span className="text-slate-300 font-semibold">{query}</span>"
                            </li>
                        ) : (
                            filteredOptions.map((opt, idx) => {
                                const isSelected = opt.value == value;
                                const isHighlighted = idx === highlightedIndex;

                                return (
                                    <li
                                        key={opt.value}
                                        onClick={() => handleSelect(opt.value)}
                                        onMouseEnter={() => setHighlightedIndex(idx)}
                                        className={`px-3.5 py-2.5 text-xs sm:text-sm cursor-pointer transition-colors flex items-center justify-between gap-3 ${
                                            isHighlighted
                                                ? 'bg-amber-500/20 text-white'
                                                : isSelected
                                                ? 'bg-slate-700/60 text-amber-400 font-bold'
                                                : 'text-slate-200 hover:bg-slate-700/30'
                                        }`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className={`truncate ${isSelected || isHighlighted ? 'font-semibold text-white' : 'text-slate-200'}`}>
                                                {opt.label}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {opt.sublabel && (
                                                <span className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                                                    isHighlighted
                                                        ? 'bg-amber-500/30 text-amber-300 font-bold'
                                                        : isSelected
                                                        ? 'bg-amber-500/20 text-amber-400 font-bold'
                                                        : 'bg-slate-700/80 text-slate-400'
                                                }`}>
                                                    {opt.sublabel}
                                                </span>
                                            )}
                                            {isSelected && (
                                                <CheckIcon className="w-4 h-4 text-amber-400 shrink-0" />
                                            )}
                                        </div>
                                    </li>
                                );
                            })
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
