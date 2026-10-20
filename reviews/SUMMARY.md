# Fix summary: cash-drawer-counter (Wanda)

## Fixed (money first)
- **Deposit vs pull list (must, 2 reviewers):** deposit is now the value of the pull list (`drawerResult` in `src/lib/drawer.js`), never `total - float`. Test: deposit + kept = total and deposit = pull value on 400 random drawers plus the 3x$100, 4x$50 and 1x$100+8x$20 cases.
- **Float pick (must, design + customers):** realistic float. Aims for about 40% $20, then $10, $5, $1 and some coins; fills gaps largest first; never leaves bills above $20. $200 example now leaves 8x$20, 1x$10, 3x$5, 10x$1, 13 quarters, 11 dimes, 10 nickels, 15 pennies. Exact search (bounded knapsack) when the mix misses: "$0.30 from 1 quarter + 3 dimes" and `{c25:1,c10:4}` now exact. Tested against an independent oracle (missing = float - max reachable). A "Leave in the drawer" list now shows next to the pull list.
- **Parsing (must):** commas only as thousands groups ("200,50", "1,5", "1,2,3" rejected), max 7 dollar digits, `maxlength` 12. Invalid float or sales shows an inline red error (aria-invalid), hides deposit and over/short, and blocks Copy and Print. Counts reject decimals and letters with a message instead of changing them ("12.5" no longer becomes 125); +/- capped at 999,999; minus on an empty row keeps it empty.
- **Print (must):** 5 blank pages gone. The sheet moves under body, print CSS uses `display:none` for everything else. Checked with a PDF: 1 page. Time stamp is made at press time. Sheet has a Counted by / Checked by line.
- **Over/short (should):** one code path, `overShort()` in drawer.js, tested. Needs both float and sales; otherwise it says "Add your float (0 if none)". Deposit shows a dash until a float is entered.
- Reset needs two taps (3 s window) and its message stays 8 s and says sales were cleared. Counts now survive a refresh (localStorage in try/catch, cleared by Reset). Float and sales explained in one line each; "$" prefix; placeholder "e.g. 200"; labels align at 390 px. Sticky total bar shows only while the tool is in view. +/- buttons skip the tab order.
- Privacy now matches the product (float and counts stored; no "upload"; consent through Google's consent message when ads are on, no banner claimed). Fixed "Last updated" date (October 20, 2026) on Privacy and Terms.
- SEO and copy: US spelling (math, color, personalized), removed meta keywords and the one-item breadcrumb, JSON-LD escapes `<`, added a "How to close out a register" section (till, cash out, cash drop), article and FAQ match the new float rule and the worked example.
- Template items: README rewritten for this tool; `scripts/new-tool.sh` removed; `screenshots/`, `.playwright-cli/` untracked and ignored; duplicate legal links on home removed (footer keeps them); deploy runs `npm test` first; `engines` node >=22.6; unused `logo.svg`, `rowTotal` dead export (now used) cleaned. Stale config comments fixed.
- Tailwind scan limited: `@import "tailwindcss" source(none); @source "../";`. CSS before 24,317 B (5,797 B gzip), after 24,285 B (about 5.8 KB gzip). Almost no change: the 117 KB figure in a review did not match the built file; the scan was already small.
- **GitHub Pages:** `PAGES_BASE` and `PAGES_SITE` read in `astro.config.mjs`; `src/lib/url.ts` builds every internal link, icon, manifest and og:image; manifest uses relative paths; canonical always the real domain; `.github/workflows/pages.yml` added (checkout@v4, setup-node@v4 Node 22, npm ci, npm test, build with the two env vars, upload-pages-artifact@v3, deploy-pages@v4). Verified: built with `PAGES_BASE=/cash-drawer-counter/`, served at /cash-drawer-counter/, clicked home, about, privacy, terms, contact, 404; all icons, manifest, CSS and JS returned 200. dist-pages deleted. Branch is `main`. Not pushed.

## Rejected or deferred
- Register and employee name fields, copy for spreadsheet (customers #7): turns it into a bigger app. Only the sign-off line was added.
- Float presets buttons, "Jump to deposit" anchor, deposit in the sticky bar, user-chosen float mix or locked rows: later features, not needed for correct money. Listed for the owner.
- Inline critical CSS (nice): LCP already about 1 s.
- Header About/Contact below 480 px: footer has them.
- Reviewer claim "tracked noise bloats Tailwind CSS": not the cause (see sizes above).

## Tests and status
- `npm test`: 2,917 checks, 400 random drawers vs an independent oracle, all pass. `npm run build` passes. Screenshots (1280 and 390, light and dark, results and error states) viewed and fine; they are in `screenshots/` (ignored by git).
- Lighthouse: not re-run (not installed here). Review baseline was 100 on all four; page weight is unchanged (JS 5.5 KB to 9.0 KB, CSS same).

## Left for the owner
- Decide on a publisher name for schema, and the real email inbox for hello@countthedrawercalculator.com.
- GitHub Pages: create the repo, enable Pages with the Actions source, then push `main`. Sitemap on github.io lists github.io URLs (temporary).
- Optional features above (presets, register/name fields).

## Phase 2 SEO pages (not built)
1. Printable cash count sheet (blank, print-friendly)
2. Cash drawer count sheet PDF template
3. Cash register closing procedure checklist
4. How much cash to leave in the register (float by business type)
5. Restaurant cash drawer starting float
6. Coffee shop cash drawer float and count
7. Retail till float amounts
8. Cash drawer over and short: causes and fixes
9. How to count coin rolls (values and counts)
10. Bank deposit slip calculator
11. Cash drop and safe drop log
12. Daily cash reconciliation sheet
13. Cash drawer count for food trucks
14. Bar cash drawer count and tip-out
15. Convenience store drawer count
16. Cash drawer float with $1 and $5 bill breakdown
17. Cash strap values ($100, $1,000, $2,000)
18. Blind cash drawer count explained
19. Two-person cash count policy template
20. Change order calculator (small bills and coin rolls to get from the bank)
