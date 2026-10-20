// All money is integer cents. No floats anywhere in the maths.
export const DENOMS = [
  { id: 'b100', label: '$100 bills', cents: 10000, group: 'Bills' },
  { id: 'b50', label: '$50 bills', cents: 5000, group: 'Bills' },
  { id: 'b20', label: '$20 bills', cents: 2000, group: 'Bills' },
  { id: 'b10', label: '$10 bills', cents: 1000, group: 'Bills' },
  { id: 'b5', label: '$5 bills', cents: 500, group: 'Bills' },
  { id: 'b2', label: '$2 bills', cents: 200, group: 'Bills' },
  { id: 'b1', label: '$1 bills', cents: 100, group: 'Bills' },
  { id: 'c100', label: '$1 coins', cents: 100, group: 'Coins' },
  { id: 'c25', label: 'Quarters', cents: 25, group: 'Coins' },
  { id: 'c10', label: 'Dimes', cents: 10, group: 'Coins' },
  { id: 'c5', label: 'Nickels', cents: 5, group: 'Coins' },
  { id: 'c1', label: 'Pennies', cents: 1, group: 'Coins' },
  { id: 'r25', label: 'Quarter rolls ($10)', cents: 1000, group: 'Rolls' },
  { id: 'r10', label: 'Dime rolls ($5)', cents: 500, group: 'Rolls' },
  { id: 'r5', label: 'Nickel rolls ($2)', cents: 200, group: 'Rolls' },
  { id: 'r1', label: 'Penny rolls ($0.50)', cents: 50, group: 'Rolls' },
];

/** Parse a money text like "200", "200.5", "$1,200.25" to cents. Returns null if empty or invalid. */
export function parseCents(text) {
  const t = String(text ?? '').replace(/[$,\s]/g, '');
  if (!/^\d*\.?\d{0,2}$/.test(t) || t === '' || t === '.') return null;
  const [d, c = ''] = t.split('.');
  return (parseInt(d || '0', 10) * 100) + parseInt((c + '00').slice(0, 2), 10);
}

export function formatCents(cents) {
  const neg = cents < 0;
  const a = Math.abs(cents);
  const d = Math.floor(a / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (neg ? '-' : '') + '$' + d + '.' + String(a % 100).padStart(2, '0');
}

export function rowTotal(def, count) { return def.cents * count; }

export function grandTotal(counts) {
  return DENOMS.reduce((s, d) => s + d.cents * (counts[d.id] || 0), 0);
}

/**
 * Pick what to leave in the drawer for the float. Greedy, largest first.
 * Bills above $20 are never left in the drawer. Loose coins and rolls fill the rest.
 * Returns { keep: {id: n}, kept: cents, missing: cents } where missing > 0 means the drawer cannot make the float exactly.
 */
export function pickFloat(counts, floatCents) {
  const order = DENOMS.filter((d) => d.cents <= 2000).sort((a, b) => b.cents - a.cents);
  const keep = {};
  let left = Math.max(0, floatCents);
  for (const d of order) {
    const have = counts[d.id] || 0;
    const n = Math.min(have, Math.floor(left / d.cents));
    if (n > 0) { keep[d.id] = n; left -= n * d.cents; }
  }
  return { keep, kept: Math.max(0, floatCents) - left, missing: left };
}

export function deposit(counts, keep) {
  const out = {};
  for (const d of DENOMS) {
    const n = (counts[d.id] || 0) - (keep[d.id] || 0);
    if (n > 0) out[d.id] = n;
  }
  return out;
}
