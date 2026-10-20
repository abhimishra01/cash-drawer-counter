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

## Gap fix (Wanda, 2026-10-20)
Source: `~/Desktop/personal/microtools/comparison/cash-drawer-counter.md`.

### Done
- **Must 1, blank printable count sheet:** new page `/cash-register-count-sheet/` with a "Print blank sheet" button, opening and closing columns, over and short block, date, cashier, register, shift and signature lines. Prints on one Letter page (checked with a PDF, 1 page). The home page has a "Cash register count sheet" H2 (`#count-sheet`) that links to it, and the tool links to it too.
- **Must 2, cashier and register on the filled sheet:** optional "Sheet details" fields, remembered on the device (localStorage in try/catch), shown in Copy and Print. The date is the time stamp already on the sheet.
- **Must 3, half dollars:** new row under a closed "More coins" fold (opens by itself when a saved count has half dollars). Enter skips the fold when closed. Counts toward totals and the float search.
- **Should 4, paid-outs:** "Paid out of the drawer" field. Expected = float + cash sales - paid-outs, shown under the over/short result and in the summary. `overShort` and `drawerResult` take the new argument; tested.
- **Should 5, count as float:** "Use this count as my float" link under the float field.
- **Should 6, synonyms:** till count, register balance, cashing up, close out, cash drop in headings and copy on the home page and guide pages.
- **Should 7, labels:** "Pull for the deposit" is now "Take out for the deposit" (screen, summary, article). Green check "Leaves exactly $X" when the leave list equals the float.
- **Should 8, print:** summary print is 12px monospace and fits one Letter page with all 17 rows plus long leave and take-out lists (PDF check, 1 page); `@page` Letter with half-inch margins. "Save as PDF" hint added next to Print and on the blank sheet page.
- **Nice 13, HowTo schema** for the six steps (steps live in `src/data/steps.js`, shared with the article).
- **10 SEO pages (all real, pre-rendered, linked from the home page and from each other, preset float in the tool, own title, H1, text, table or list, FAQ and FAQPage schema):** cash-register-count-sheet, cash-drawer-float-calculator, how-much-to-leave-in-cash-drawer, cash-drawer-over-short-calculator, cash-drop-calculator, cash-drawer-count-with-rolls, coffee-shop-cash-drawer-count, food-truck-cash-drawer-count, close-out-register-checklist, bar-cash-drawer-count. Float tables on the pages are checked by `npm test` to add up to their float.
- Tests: 2,939 checks pass (new: half dollar, expected cash, paid-outs, summary lines, float plans). `npm run build`: 16 pages. Pages build stays noindex.

### Skipped, with reason
- **Nice 9 (several drawers as tabs), 10 (CSV download), 11 (checks and card slips line):** each adds state or a second job. Not single-purpose. Bar page tells people to copy or print each drawer, then Reset.
- **Nice 12 (Next: float button on the keypad):** Enter already goes to the float field after the last row.
- **Nice 14:** already true (no ads, no signup, privacy line).
- Hand-written float table for "bills to leave" as its own page: merged into the float page to avoid a thin duplicate.
- Backlinks and a fresh domain: not code. Still the main ranking limit.
- Lighthouse (Google Chrome, desktop defaults): 100 on all four for home, count sheet and over/short pages. LCP about 1.0 s.
