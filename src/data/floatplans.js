// Hand-built float breakdowns shown on guide pages. Each one must add up to its float:
// scripts/test-drawer.mjs checks it, so a typo here fails the tests.
export const FLOAT_PLANS = {
  f100: { label: '$100 float', cents: 10000, counts: { b20: 2, b10: 2, b5: 4, b1: 12, c25: 24, c10: 10, c5: 10, c1: 50 } },
  f200: { label: '$200 float', cents: 20000, counts: { b20: 4, b10: 5, b5: 10, b1: 12, c25: 20, c10: 20, c5: 10, c1: 50 } },
  f300: { label: '$300 float', cents: 30000, counts: { b20: 8, b10: 6, b5: 10, b1: 15, c25: 40, c10: 30, c5: 30, c1: 50 } },
  coffee: { label: 'Coffee shop, $150', cents: 15000, counts: { b20: 2, b10: 2, b5: 8, b1: 35, c25: 40, c10: 30, c5: 20, c1: 100 } },
  truck: { label: 'Food truck, $200', cents: 20000, counts: { b20: 4, b10: 4, b5: 10, b1: 20, c25: 24, c10: 20, c5: 20, c1: 100 } },
  bar: { label: 'Bar, $300', cents: 30000, counts: { b20: 5, b10: 5, b5: 20, b1: 30, c25: 80 } },
};
