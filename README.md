# Cash drawer counter

Free shift-end cash drawer calculator for US cashiers and shop staff. Domain: countthedrawercalculator.com.
Astro (static) + Tailwind 4. No backend. All money is integer cents.

## What it does
- Rows for $100 to $1 bills, $1 coins, quarters, dimes, nickels, pennies and coin rolls, with live row and grand totals.
- Starting float: shows the cash to deposit, what to leave in the drawer and what to pull.
- Optional expected cash sales: shows over, short or balanced.
- Copy summary, Print (one page, with sign-off line), two-tap Reset.
- Saves the last float and the current counts in the browser (localStorage, in try/catch).

## Where the logic lives
- `src/lib/drawer.js`: all the math (parsing, float pick, deposit, over/short, summary text). No DOM.
- `src/components/Tool.astro`: markup and the thin script that reads inputs and renders `drawerResult()`.
- `scripts/test-drawer.mjs`: tests for the math, including 400 random drawers checked against an independent oracle.

Float rule: aim for a mix of small bills and coins (about 40% $20, then $10, $5, $1, a few coins), fill gaps largest first, never leave bills above $20, and search for an exact set when the mix cannot hit the float. The deposit always equals the value of the pull list.

## Commands
- `npm run dev`: work on the site.
- `npm test`: run the math tests.
- `npm run build`: build `dist/`.
- `npm run deploy`: test, build and upload to Cloudflare Pages (you run `npx wrangler login` once). Needs Node 22.6 or newer.

## GitHub Pages
`.github/workflows/pages.yml` builds on every push to `main` and serves the site at https://abhimishra01.github.io/cash-drawer-counter/. The build sets `PAGES_BASE=/cash-drawer-counter/` and `PAGES_SITE=https://abhimishra01.github.io`. Canonical URLs always point to the real domain. Internal links use `src/lib/url.ts`.

## Config
`src/site.config.ts` holds name, domain, keyword, description, email, GA4 and AdSense IDs (empty means off).
