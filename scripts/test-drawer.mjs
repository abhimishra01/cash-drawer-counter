import assert from 'node:assert/strict';
import { FLOAT_PLANS } from '../src/data/floatplans.js';
import { STEPS } from '../src/data/steps.js';
import {
  DENOMS, MAX_FLOAT_BILL_CENTS, parseMoney, parseCents, formatCents, grandTotal,
  pickFloat, deposit, overShort, expectedCash, drawerResult, buildSummary,
} from '../src/lib/drawer.js';

const byId = Object.fromEntries(DENOMS.map((d) => [d.id, d]));
let checks = 0;
const eq = (a, b, msg) => { checks++; assert.deepEqual(a, b, msg); };

// ---- parsing
eq(parseCents('200'), 20000);
eq(parseCents('$1,200.25'), 120025);
eq(parseCents('0.1'), 10);
eq(parseCents('.5'), 50);
eq(parseCents('5.'), 500);
eq(parseCents(' $ 7 '), 700);
eq(parseCents('0'), 0);
eq(parseMoney('').status, 'empty');
eq(parseMoney('   ').status, 'empty');
for (const bad of ['abc', '20o', '12.345', '1e3', '-5', '.', '$', '200,50', '1,2', '1,2,3', '1,5', '12,34,567', ',100', '1,000,', '99999999999999999999', '10000000', '1.2.3']) {
  eq(parseMoney(bad).status, 'invalid', `invalid: ${bad}`);
  eq(parseCents(bad), null, `null: ${bad}`);
}
eq(parseCents('1,000'), 100000);
eq(parseCents('1,234,567.89'), 123456789);
eq(parseCents('9999999.99'), 999999999);

// ---- formatting and totals (integer cents)
eq(formatCents(123456), '$1,234.56');
eq(formatCents(-5), '-$0.05');
eq(formatCents(0), '$0.00');
eq(formatCents(100000000), '$1,000,000.00');
eq(grandTotal({ c10: 1, c5: 2 }), 20);
eq(grandTotal({ c1: 3, c10: 3 }), 33);
eq(grandTotal({}), 0);
eq(grandTotal({ r25: 1, r10: 1, r5: 1, r1: 1 }), 1750);
eq(grandTotal({ c100: 3, b1: 2 }), 500);
eq(DENOMS.length, 17);
const allOne = Object.fromEntries(DENOMS.map((d) => [d.id, 1]));
eq(grandTotal(allOne), 20741, 'one of every row, with the half dollar');
eq(grandTotal({ c50: 3 }), 150, 'half dollars');
eq(byId.c50.group, 'More coins');

// ---- worked example (article)
const ex = { b100: 2, b50: 3, b20: 20, b10: 15, b5: 30, b1: 40, c25: 20, c10: 15, c5: 10, c1: 25 };
eq(grandTotal(ex), 109725);
const rEx = drawerResult(ex, 20000, 89000);
eq(rEx.total, 109725);
eq(rEx.depositCents, 89725);
eq(rEx.missing, 0);
eq(rEx.overShort, { diff: 725, expected: 109000, label: 'Over' });
eq(grandTotal(rEx.keep), 20000);
console.log('float for the worked example:', JSON.stringify(rEx.keep));

// ---- float: realistic mix, not a stack of twenties
{
  const keep = pickFloat(ex, 20000).keep;
  assert.ok((keep.b20 || 0) * 2000 < 20000, 'float is not all twenties');
  assert.ok(keep.b5 > 0 || keep.b1 > 0, 'float has small bills');
  assert.ok(keep.c25 > 0, 'float has quarters');
  checks += 3;
}

// ---- deposit always equals the pull list (the bug that mattered)
{
  const cases = [
    [{ b100: 3 }, 20000, 30000, 20000],          // only $100 bills: nothing can stay
    [{ b50: 4 }, 20000, 20000, 20000],
    [{ b100: 1, b20: 8 }, 20000, 26000, 10000],  // 8 x $20 stays (160), $40 short
    [{ b100: 2, b20: 3, b5: 7, c25: 4, r25: 1 }, 20000, 20000 + 6000 + 3500 + 100 + 1000, 0],
  ];
  for (const [c, f, total, _] of cases) {
    const r = drawerResult(c, f, null);
    eq(r.total, total);
    eq(r.depositCents, grandTotal(r.pull), 'deposit equals pull list value');
    eq(r.depositCents + grandTotal(r.keep), total, 'deposit plus kept equals total');
    assert.ok(r.missing > 0); checks++;
  }
  const r1 = drawerResult({ b100: 3 }, 20000, null);
  eq(r1.depositCents, 30000);
  eq(r1.keep, {});
  eq(r1.missing, 20000);
  eq(r1.underFloat, false);
  const r2 = drawerResult({ b100: 1, b20: 8 }, 20000, null);
  eq(r2.depositCents, 10000);
  eq(r2.missing, 4000);
  eq(r2.keep, { b20: 8 });
  eq(drawerResult({ b5: 1 }, 10000, null).missing, 9500);
  eq(drawerResult({ b5: 1 }, 10000, null).underFloat, true);
}

// ---- float edge cases
eq(pickFloat(ex, 0).keep, {});
eq(pickFloat({ b50: 5, c25: 8 }, 300), { keep: { c25: 8 }, kept: 200, missing: 100 });
eq(pickFloat({ c25: 1, c10: 3 }, 30), { keep: { c10: 3 }, kept: 30, missing: 0 }, 'exact set exists');
eq(pickFloat({ c25: 1, c10: 4 }, 4000 / 100).missing, 0);
eq(pickFloat({ b20: 1 }, -500), { keep: {}, kept: 0, missing: 0 });
eq(deposit({ b20: 2, c1: 3 }, { b20: 1 }), { b20: 1, c1: 3 });
{
  const f = pickFloat({ b100: 1, b20: 12, b10: 5, c1: 50 }, 20000);
  eq(f.missing, 0);
  assert.ok(!f.keep.b100); checks++;
}

// ---- over and short
eq(overShort(1000, 200, 800), { diff: 0, expected: 1000, label: 'Balanced' });
eq(overShort(1000, 200, 700), { diff: 100, expected: 900, label: 'Over' });
eq(overShort(1000, 200, 900), { diff: -100, expected: 1100, label: 'Short' });
eq(overShort(100, 200, 0), { diff: -100, expected: 200, label: 'Short' }, 'float larger than drawer');
eq(overShort(1000, null, 500), null, 'no float, no over or short');
eq(overShort(1000, 200, null), null, 'no sales, no over or short');
eq(overShort(1000, 0, 1000), { diff: 0, expected: 1000, label: 'Balanced' }, 'zero float is a real float');
// paid-outs: expected cash = float + sales - paid-outs (page example: 200 + 640 - 20 = 820, counted 812.50)
eq(expectedCash(20000, 64000, 2000), 82000);
eq(overShort(81250, 20000, 64000, 2000), { diff: -750, expected: 82000, label: 'Short' });
eq(overShort(81250, 20000, 64000), { diff: -2750, expected: 84000, label: 'Short' }, 'no paid-outs entered');
eq(overShort(84000, 20000, 64000, 0), { diff: 0, expected: 84000, label: 'Balanced' });
eq(drawerResult({ b20: 41 }, 20000, 64000, 2000).overShort.diff, 0, 'drawer result passes paid-outs');

// ---- no float entered
{
  const r = drawerResult(ex, null, 5000);
  eq(r.hasFloat, false);
  eq(r.depositCents, null);
  eq(r.overShort, null);
}

// ---- summary text
{
  const s = buildSummary(ex, 20000, 89000, 'TIME');
  assert.ok(s.includes('Total in drawer: $1,097.25')); 
  assert.ok(s.includes('Cash to deposit: $897.25'));
  assert.ok(s.includes('Over $7.25'));
  assert.ok(s.includes('Leave in the drawer:') && s.includes('Take out for the deposit:'));
  assert.ok(s.includes('Counted by:'));
  assert.ok(!buildSummary(ex, null, null, 'T').includes('Cash to deposit'));
  const short = buildSummary({ b100: 3 }, 20000, null, 'T');
  assert.ok(short.includes('Cash to deposit: $300.00'));
  assert.ok(short.includes('only $0.00 of the $200.00 float'));
  checks += 8;
  const m = buildSummary(ex, 20000, 89000, 'T', { cashier: 'Sam', register: '2', paidOutCents: 500 });
  assert.ok(m.includes('Cashier: Sam') && m.includes('Register: 2'));
  assert.ok(m.includes('Paid out of the drawer: $5.00'));
  assert.ok(m.includes('Expected in drawer: $1,085.00 (float + cash sales - paid-outs)'));
  assert.ok(m.includes('Over $12.25'));
  assert.ok(!s.includes('Cashier:') && !s.includes('Paid out'), 'optional lines hidden when empty');
  checks += 5;
}

// ---- float plans on the guide pages add up to their float
for (const [key, p] of Object.entries(FLOAT_PLANS)) {
  eq(grandTotal(p.counts), p.cents, `float plan ${key} adds up`);
  for (const id of Object.keys(p.counts)) assert.ok(byId[id], `known row ${id}`);
}
eq(STEPS.length, 6);

// ---- half dollars can be part of the float
{
  const r = drawerResult({ c50: 4, b20: 1 }, 2000, null);
  eq(r.keep, { b20: 1 });
  const r2 = drawerResult({ c50: 4, c10: 1 }, 210, null);
  eq(r2.missing, 0);
  eq(r2.keep, { c50: 4, c10: 1 });
}

// ---- property tests: fixed seed
let seed = 12345;
const rnd = (n) => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed % n; };
function oracleMax(counts, target) {
  // independent check: reachable sums with a plain Set walk (small cases only)
  let sums = new Set([0]);
  for (const d of DENOMS.filter((x) => x.cents <= MAX_FLOAT_BILL_CENTS)) {
    const next = new Set();
    for (const s0 of sums) for (let n = 0; n <= (counts[d.id] || 0); n++) { const v = s0 + n * d.cents; if (v > target) break; next.add(v); }
    sums = next;
  }
  return Math.max(...sums);
}
for (let i = 0; i < 400; i++) {
  const counts = {};
  for (const d of DENOMS) if (rnd(3) > 0) counts[d.id] = rnd(d.cents >= 1000 ? 6 : 14);
  const target = rnd(2) ? rnd(60) * 5 : rnd(4000);
  const r = drawerResult(counts, target, null);
  for (const d of DENOMS) {
    assert.ok((r.keep[d.id] || 0) <= (counts[d.id] || 0), 'keep within counts');
    if (d.group === 'Bills' && d.cents > MAX_FLOAT_BILL_CENTS) assert.ok(!r.keep[d.id], 'no big bills in float');
    assert.equal((r.keep[d.id] || 0) + (r.pull[d.id] || 0), counts[d.id] || 0, 'keep plus pull is the count');
  }
  assert.equal(grandTotal(r.keep) + r.missing, target, 'kept plus missing is the float');
  assert.equal(r.depositCents + grandTotal(r.keep), r.total, 'deposit plus kept is the total');
  assert.equal(r.depositCents, grandTotal(r.pull), 'deposit is the pull list');
  assert.equal(r.missing, target - oracleMax(counts, target), 'float is exact whenever the cash allows it');
  checks += 7 * 16 / 16;
}

console.log(`drawer tests passed (${checks} checks, 400 random drawers)`);
