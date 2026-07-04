import { useState, useMemo } from 'react';

/**
 * Custom hook untuk melakukan sorting data tabel secara instant di sisi client (browser)
 * Sangat aman, tanpa resiko merusak database atau logika bisnis server.
 */
export function useSortableData(items, defaultSort = { key: null, direction: null }) {
    const [sortConfig, setSortConfig] = useState(defaultSort);

    const sortedItems = useMemo(() => {
        if (!items || !Array.isArray(items)) return [];
        if (!sortConfig.key) return items;

        return [...items].sort((a, b) => {
            // Helper untuk mengambil nilai dari path nested seperti 'supplier.nama' atau 'user.name'
            const getVal = (obj, path) => {
                if (!obj || !path) return '';
                return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined && acc[part] !== null ? acc[part] : ''), obj);
            };

            let aValue = getVal(a, sortConfig.key);
            let bValue = getVal(b, sortConfig.key);

            // Perbandingan untuk teks/string (A-Z dan Z-A, case-insensitive)
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                const cmp = aValue.localeCompare(bValue, 'id', { numeric: true, sensitivity: 'base' });
                return sortConfig.direction === 'asc' ? cmp : -cmp;
            }

            // Perbandingan untuk angka, tanggal, atau boolean
            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, sortConfig, requestSort };
}
