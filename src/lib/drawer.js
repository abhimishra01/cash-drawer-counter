// All money is integer cents. No floats anywhere in the math.
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

/** Largest bill that may stay in the drawer as float. Bills above this are always deposited. */
export const MAX_FLOAT_BILL_CENTS = 2000;
/** Money fields take at most 7 whole-dollar digits (under $10,000,000). */
const MAX_DOLLAR_DIGITS = 7;
/** Count fields take at most 6 digits. */
export const MAX_COUNT = 999999;
/** Exact float search runs only up to this float ($5,000). Above it the mix rule alone is used. */
const EXACT_SEARCH_LIMIT_CENTS = 500000;

/**
 * Parse a money text such as "200", "200.5", "$1,200.25".
 * Commas count only as thousands separators ("1,200" yes, "200,50" and "1,5" no).
 * Returns { status: 'empty' | 'ok' | 'invalid', cents }.
 */
export function parseMoney(text) {
  const raw = String(text ?? '').replace(/\s/g, '');
  if (raw === '') return { status: 'empty', cents: null };
  const t = raw.replace(/^\$/, '');
  if (!/^(\d{1,3}(,\d{3})+|\d+)?(\.\d{0,2})?$/.test(t) || !/\d/.test(t)) return { status: 'invalid', cents: null };
  const [whole, frac = ''] = t.replace(/,/g, '').split('.');
  if (whole.length > MAX_DOLLAR_DIGITS) return { status: 'invalid', cents: null };
  return { status: 'ok', cents: parseInt(whole || '0', 10) * 100 + parseInt((frac + '00').slice(0, 2), 10) };
}

/** Cents for a valid money text, otherwise null (empty and invalid both give null; use parseMoney to tell them apart). */
export function parseCents(text) {
  return parseMoney(text).cents;
}

export function formatCents(cents) {
  const neg = cents < 0;
  const a = Math.abs(cents);
  const d = Math.floor(a / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return (neg ? '-' : '') + '$' + d + '.' + String(a % 100).padStart(2, '0');
}

export function rowTotal(def, count) { return def.cents * count; }

export function grandTotal(counts) {
  return DENOMS.reduce((s, d) => s + rowTotal(d, counts[d.id] || 0), 0);
}

// Share of the float aimed at each denomination (the rest is filled largest first).
// This gives a till with small bills and coins for change instead of a stack of twenties.
const FLOAT_MIX = [
  ['b20', 0.40], ['b10', 0.15], ['b5', 0.20], ['b1', 0.15],
  ['c25', 0.05], ['c10', 0.02], ['c5', 0.01], ['c1', 0.0025],
];

function floatCandidates() {
  return DENOMS.filter((d) => d.cents <= MAX_FLOAT_BILL_CENTS).slice().sort((a, b) => b.cents - a.cents);
}

/**
 * Exact search: the largest amount not above the float that the cash can make, preferring
 * larger bills first. Bounded knapsack over reachable sums.
 */
function exactPick(counts, floatCents) {
  const items = floatCandidates()
    .map((d) => ({ id: d.id, c: d.cents, h: Math.min(counts[d.id] || 0, Math.floor(floatCents / d.cents)) }))
    .filter((it) => it.h > 0);
  const m = items.length;
  const reach = new Array(m + 1);
  reach[m] = new Uint8Array(floatCents + 1);
  reach[m][0] = 1;
  const cnt = new Int32Array(floatCents + 1);
  for (let k = m - 1; k >= 0; k--) {
    const { c, h } = items[k];
    const next = reach[k + 1];
    const cur = new Uint8Array(floatCents + 1);
    for (let s = 0; s <= floatCents; s++) {
      cnt[s] = (s >= c ? cnt[s - c] : 0) + next[s];
      const lower = s - (h + 1) * c;
      cur[s] = cnt[s] - (lower >= 0 ? cnt[lower] : 0) > 0 ? 1 : 0;
    }
    reach[k] = cur;
  }
  let best = floatCents;
  while (best > 0 && !reach[0][best]) best--;
  const keep = {};
  let left = best;
  for (let k = 0; k < m; k++) {
    const { id, c, h } = items[k];
    for (let n = Math.min(h, Math.floor(left / c)); n >= 0; n--) {
      if (reach[k + 1][left - n * c]) {
        if (n > 0) keep[id] = n;
        left -= n * c;
        break;
      }
    }
  }
  return keep;
}

/**
 * Pick what to leave in the drawer as the float.
 * 1. Aim for a realistic mix (mostly $20, $10, $5 and $1 bills plus some coins).
 * 2. Fill what is still missing, largest value first.
 * 3. If that cannot make the float exactly, aim for a smaller share of the mix and make the
 *    rest with an exact search over the remaining cash, so the float is exact when it can be.
 * Bills above $20 are never left in the drawer.
 * Returns { keep: {id: n}, kept, missing } where missing > 0 means the drawer cannot make the float.
 */
export function pickFloat(counts, floatCents) {
  const target = Math.max(0, floatCents);
  const mixed = (scale) => {
    const keep = {};
    let left = target;
    const take = (d, want) => {
      const n = Math.min((counts[d.id] || 0) - (keep[d.id] || 0), want);
      if (n > 0) { keep[d.id] = (keep[d.id] || 0) + n; left -= n * d.cents; }
    };
    for (const [id, share] of FLOAT_MIX) {
      const d = DENOMS.find((x) => x.id === id);
      take(d, Math.floor(Math.floor(target * share * scale) / d.cents));
    }
    return { keep, left, take };
  };

  const first = mixed(1);
  for (const d of floatCandidates()) first.take(d, Math.floor(first.left / d.cents));
  let best = { keep: first.keep, kept: target - first.left, missing: first.left };
  if (best.missing === 0 || target > EXACT_SEARCH_LIMIT_CENTS) return best;

  for (const scale of [0.85, 0.7, 0.5, 0.25, 0]) {
    const m = mixed(scale);
    const rest = {};
    for (const d of DENOMS) rest[d.id] = (counts[d.id] || 0) - (m.keep[d.id] || 0);
    const extra = exactPick(rest, m.left);
    const extraKept = grandTotal(extra);
    const keep = { ...m.keep };
    for (const [id, n] of Object.entries(extra)) keep[id] = (keep[id] || 0) + n;
    const kept = target - m.left + extraKept;
    if (kept > best.kept) best = { keep, kept, missing: target - kept };
    if (best.missing === 0) break;
  }
  return best;
}

export function deposit(counts, keep) {
  const out = {};
  for (const d of DENOMS) {
    const n = (counts[d.id] || 0) - (keep[d.id] || 0);
    if (n > 0) out[d.id] = n;
  }
  return out;
}

/** Over or short: total minus float minus expected cash sales. Needs both float and sales. */
export function overShort(totalCents, floatCents, salesCents) {
  if (floatCents === null || salesCents === null) return null;
  const diff = totalCents - floatCents - salesCents;
  return { diff, label: diff === 0 ? 'Balanced' : diff > 0 ? 'Over' : 'Short' };
}

/**
 * Everything the screen and the summary show. The deposit is the value of the pull list,
 * so the headline number and the list always agree.
 */
export function drawerResult(counts, floatCents, salesCents) {
  const total = grandTotal(counts);
  const result = { total, hasFloat: floatCents !== null, keep: {}, pull: {}, depositCents: null, missing: 0, underFloat: false, overShort: overShort(total, floatCents, salesCents) };
  if (floatCents === null) return result;
  const pick = pickFloat(counts, floatCents);
  result.keep = pick.keep;
  result.pull = deposit(counts, pick.keep);
  result.depositCents = grandTotal(result.pull);
  result.missing = pick.missing;
  result.underFloat = total < floatCents;
  return result;
}

const lineList = (m) => DENOMS.filter((d) => m[d.id]).map((d) => `${m[d.id]} x ${d.label}`);
export { lineList as describeCounts };

/** Plain-text count sheet for Copy and Print. `when` is a ready-made date text. */
export function buildSummary(counts, floatCents, salesCents, when) {
  const r = drawerResult(counts, floatCents, salesCents);
  const out = ['CASH DRAWER COUNT', when, ''];
  out.push(...DENOMS.filter((d) => counts[d.id]).map((d) => `${d.label.padEnd(22)} ${String(counts[d.id]).padStart(4)}  ${formatCents(rowTotal(d, counts[d.id])).padStart(11)}`));
  out.push('', `Total in drawer: ${formatCents(r.total)}`);
  if (r.hasFloat) {
    out.push(`Starting float: ${formatCents(floatCents)}`, `Cash to deposit: ${formatCents(r.depositCents)}`);
  }
  if (salesCents !== null) out.push(`Expected cash sales: ${formatCents(salesCents)}`);
  if (r.overShort) out.push(r.overShort.diff === 0 ? 'Balanced ($0.00)' : `${r.overShort.label} ${formatCents(Math.abs(r.overShort.diff))}`);
  if (r.hasFloat) {
    if (r.missing > 0) out.push(`Note: only ${formatCents(floatCents - r.missing)} of the ${formatCents(floatCents)} float can be left in the drawer.`);
    const keepLines = lineList(r.keep), pullLines = lineList(r.pull);
    out.push('', 'Leave in the drawer:', ...(keepLines.length ? keepLines.map((l) => '  ' + l) : ['  Nothing']));
    out.push('', 'Pull for the deposit:', ...(pullLines.length ? pullLines.map((l) => '  ' + l) : ['  Nothing']));
  }
  out.push('', 'Counted by: ____________________   Checked by: ____________________');
  return out.join('\n');
}
