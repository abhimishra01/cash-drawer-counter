import assert from 'node:assert/strict';
import { DENOMS, parseCents, formatCents, grandTotal, pickFloat, deposit } from '../src/lib/drawer.js';

assert.equal(parseCents('200'), 20000);
assert.equal(parseCents('$1,200.25'), 120025);
assert.equal(parseCents('0.1'), 10);
assert.equal(parseCents(''), null);
assert.equal(parseCents('abc'), null);
assert.equal(formatCents(123456), '$1,234.56');
assert.equal(formatCents(-5), '-$0.05');
// classic float trap: 0.1 + 0.2 style
assert.equal(grandTotal({ c10: 1, c5: 2 }), 20);
assert.equal(grandTotal({ c1: 3, c10: 3 }), 33);
// full example: 2x$100, 3x$20, 7x$5, 4 quarters, 1 quarter roll
const c = { b100: 2, b20: 3, b5: 7, c25: 4, r25: 1 };
assert.equal(grandTotal(c), 20000 + 6000 + 3500 + 100 + 1000);
// float $200: bills above $20 never kept. 3x$20=60, then $5 x7=35 -> 95, quarter roll 10 -> 105, 4 quarters 1 -> 106; cannot reach 200
const f = pickFloat(c, 20000);
assert.deepEqual(f.keep, { b20: 3, b5: 7, r25: 1, c25: 4 });
assert.equal(f.missing, 20000 - 10600);
// exact float
const c2 = { b100: 1, b20: 12, b10: 5, c1: 50 };
const f2 = pickFloat(c2, 20000);
assert.deepEqual(f2.keep, { b20: 10 });
assert.equal(f2.missing, 0);
const dep = deposit(c2, f2.keep);
assert.deepEqual(dep, { b100: 1, b20: 2, b10: 5, c1: 50 });
assert.equal(grandTotal(dep) + f2.kept, grandTotal(c2));
// float bigger than drawer
assert.equal(pickFloat({ b5: 1 }, 10000).missing, 9500);
// zero float
assert.deepEqual(pickFloat(c, 0).keep, {});
assert.ok(DENOMS.length === 16);
console.log('drawer maths: all tests passed');
// worked example from the article
const ex = { b100: 2, b50: 3, b20: 20, b10: 15, b5: 30, b1: 40, c25: 20, c10: 15, c5: 10, c1: 25 };
assert.equal(grandTotal(ex), 109725);
const fx = pickFloat(ex, 20000);
assert.deepEqual(fx.keep, { b20: 10 });
assert.equal(grandTotal(deposit(ex, fx.keep)), 89725);
assert.equal(109725 - 20000 - 89000, 725); // over by $7.25
// rolls and $1 coins
assert.equal(grandTotal({ r25: 1, r10: 1, r5: 1, r1: 1 }), 1000 + 500 + 200 + 50);
assert.equal(grandTotal({ c100: 3, b1: 2 }), 500);
assert.equal(grandTotal({}), 0);
// float uses small coins when bills run out; leaves no $50/$100
assert.deepEqual(pickFloat({ b50: 5, c25: 8 }, 300).keep, { c25: 8 });
assert.equal(pickFloat({ b50: 5, c25: 8 }, 300).missing, 100);
// parse edge cases
assert.equal(parseCents('12.345'), null);
assert.equal(parseCents('.5'), 50);
assert.equal(parseCents(' $ 7 '), 700);
assert.equal(formatCents(0), '$0.00');
assert.equal(formatCents(100000000), '$1,000,000.00');
console.log('worked example and edge cases: all tests passed');
