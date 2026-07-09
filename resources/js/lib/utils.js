/**
 * Format angka ke format Rupiah Indonesia
 * Contoh: rupiah(15000) → "Rp 15.000"
 */
export function rupiah(amount, short = false) {
    if (amount === null || amount === undefined) return 'Rp 0';
    const num = parseFloat(amount);
    if (short && num >= 1_000_000) {
        return 'Rp ' + (num / 1_000_000).toFixed(1).replace('.', ',') + 'jt';
    }
    return 'Rp ' + num.toLocaleString('id-ID', { minimumFractionDigits: 0 });
}

/**
 * Format angka stok / kuantitas (menghilangkan .000 desimal berlebih dan memakai format desimal Indonesia)
 * Contoh: formatStok("37.000") -> "37", formatStok("2.500") -> "2,5"
 */
export function formatStok(amount) {
    if (amount === null || amount === undefined || amount === '') return '0';
    const num = parseFloat(amount);
    if (isNaN(num)) return '0';
    return num.toLocaleString('id-ID', { maximumFractionDigits: 3 });
}

/**
 * Format tanggal ke format Indonesia
 */
export function tanggalIndo(dateStr) {
    if (!dateStr) return '-';
    const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
    const d = new Date(dateStr);
    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Format datetime ke format ringkas
 */
export function datetimeIndo(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const jam = d.getHours().toString().padStart(2, '0');
    const mnt = d.getMinutes().toString().padStart(2, '0');
    return `${tanggalIndo(dateStr)}, ${jam}:${mnt}`;
}
