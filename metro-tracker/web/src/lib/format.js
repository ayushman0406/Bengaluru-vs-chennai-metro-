export const UNAVAILABLE = 'Not yet announced';

export function fig(value, fallback = UNAVAILABLE) {
  if (value === null || value === undefined || value === '') return fallback;
  return value;
}

export function rupees(cr, { compact = false } = {}) {
  if (cr === null || cr === undefined) return UNAVAILABLE;
  const n = Number(cr);
  if (Number.isNaN(n)) return UNAVAILABLE;
  if (compact && n >= 100000) return `₹${(n / 100000).toFixed(2)} lakh cr`;
  return `₹${n.toLocaleString('en-IN')} cr`;
}

export function monthLabel(ym) {
  if (!ym) return UNAVAILABLE;
  const [y, m] = ym.split('-').map(Number);
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  if (!y || !m) return UNAVAILABLE;
  return `${names[m - 1]} ${y}`;
}

export function isoLabel(iso) {
  if (!iso) return UNAVAILABLE;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return UNAVAILABLE;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function cityOf(code) {
  return code === 'MAA' ? 'Chennai' : 'Bengaluru';
}
