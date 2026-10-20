# Design and SEO review: cash-drawer-counter

Reviewer: Miranda (independent). Build: `npm run build`, preview on port 4416 (stopped). Viewed with playwright-cli at 1280 and 390 px, light and dark, empty and filled states (worked example from the article: 2 x $100, 3 x $50, 20 x $20, 15 x $10, 30 x $5, 40 x $1, coins; float 200, sales 890 -> total $1,097.25, deposit $897.25, over $7.25; matches the article).

## Scores

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Lighthouse mobile | 100 | 100 | 100 | 100 |
| Lighthouse desktop | 100 | 100 | 100 | 100 |

Mobile: FCP 0.9 s, LCP 1.0 s, CLS 0, TBT 0 ms, 23 KiB total. No horizontal scroll at 390 px. Page is about 1,250 words.

Verdict: clearly better than the page-1 competitors (a Square forum thread, POS help pages, spam). Clean, fast, one-thumb layout, both themes are good. Must-fix: 1 (the pull list advice). Should-fix: 9.

## Findings

| # | Severity | Area | Finding | Fix |
|---|---|---|---|---|
| 1 | must | Tool logic | The pull list keeps the float as the largest bills up to $20 first (`pickFloat`, greedy). With the worked example the tool says "leave ten $20 bills" in a $200 float. A cashier cannot make change from $20s, and the FAQ and article themselves say shops leave "small bills and coins". Users who follow the list leave an unusable till, and the main selling point (which bills to pull) looks wrong to the first daily user. | Fill the float from small to large with sensible caps (for example keep coins and rolls, then $1, $5, $10, then $20 last), or add a "float style" choice (small bills / mixed). Update the worked example, FAQ and the "How the pull list works" paragraph to match. Add a test. |
| 2 | should | Phone layout | On 390 px the results (deposit, over/short, pull list) and Float field are 16 rows below the hero. The sticky bar shows only "Total in drawer", not the deposit. A cashier must scroll past all rows to see the answer. | Add a "Jump to deposit" anchor button in the sticky bar, or show deposit beside total in the bar once a float is entered. Optionally put Float above the rows on phone. |
| 3 | should | Phone layout | The fixed bottom bar stays visible over the article, FAQ and footer, where it is noise and hides text (seen over the heading "How to count the drawer"). | Show the bar only while `#tool` is in view (IntersectionObserver), hide it elsewhere. |
| 4 | should | Phone layout | Float and Expected sales labels wrap differently on 390 px ("Expected sales (optional)" goes to two lines), so the two inputs sit at different heights. | Put "(optional)" in the placeholder or hint text, or use `items-end`/fixed label height so the fields align. |
| 5 | should | Error and data loss | Reset clears all 16 counts and the sales field in one tap, next to Copy and Print, with no confirm and no undo. A mis-tap after a long count loses the work. | Add a 5 second "Undo" in the status line, or a confirm step ("Tap again to clear"). |
| 6 | should | Inputs | Float and Expected sales have no "$" prefix. The float placeholder "200.00" in grey looks like a real value at a glance. Filled values show "200" and "890" with no money format. | Add a "$" prefix inside the field and format to 2 decimals on blur. Use a neutral placeholder such as "0.00" for float too. |
| 7 | should | Keyboard | 16 rows x 3 stops (minus, field, plus) = 48 tab stops before the float. Enter-to-next works well, but Tab users must pass 32 buttons. | Set `tabindex="-1"` on the +/- buttons (ArrowUp/ArrowDown already step the field). Keep them clickable and touchable. |
| 8 | should | SEO copy | The main query "count the drawer calculator" is covered well. Related phrases that users type are thin: "cash register count sheet", "till count", "cash out register", "closing the register", "cash drop". Only the H2 "Who uses a drawer count" and one mention of "cash drawer calculator" carry them. | Add a short section "How to close out a register" and use "till" and "cash out" in two headings or FAQ questions. |
| 9 | should | SEO structure | The site is one tool page plus legal pages. There are no deeper internal links, and the best long-tail pages are missing. The in-page "About, Privacy, Terms, Contact" line under the tool repeats the footer. | Later: add one page, "Printable cash count sheet" (a print-friendly blank sheet), and link to it from the article and the footer. Remove the duplicate link line under the tool. |
| 10 | should | Language (US English) | "maths" appears in Article.astro line 7 ("The tool does the maths") and about.astro line 12 ("All maths runs"). "Switch colour theme" in ThemeToggle.astro. Brief requires US English. | Change to "math" and "color". |
| 11 | nice | SEO schema | BreadcrumbList has one item and adds nothing. WebApplication has no `author`/`publisher` name. FAQPage is valid (parsed OK, 8 items) but Google shows FAQ rich results only to a few sites. Keep it for answer engines. | Remove the breadcrumb block. Add `publisher` when the owner decides the name. |
| 12 | nice | SEO meta | `<meta name="keywords">` is ignored by Google. Title (54 chars) and description (145 chars) are good. Canonical, OG image (1200x630, on-brand, good), Twitter card, sitemap (5 URLs) and robots all correct. | Remove the keywords tag (low priority). Add `lastmod` to the sitemap if easy. |
| 13 | nice | Header | At 480 px and below the header hides About and Contact. They remain in the footer, so it is fine, but the header looks sparse. | Optional: keep one "About" link or a small menu. |
| 14 | nice | Logo | Favicon and logo are clear (drawer with a bill) and work at 28 px and 180 px. `public/logo.svg` is unused. At 16 px the bill detail will blur. | Delete `logo.svg` or use it. Check the 16 px tab icon once on a real browser. |
| 15 | nice | Render | Two render-blocking requests (24 KB CSS), est. 150 ms saving on a throttled phone. LCP is already 1.0 s. | Inline the critical CSS only if the owner wants a perfect 100 under throttling. Not needed now. |
| 16 | nice | Desktop layout | The 12 count rows plus 4 roll rows push the tool to about 1,000 px tall; the right column is sticky, so the total stays in view. Works well. The empty right panel below the buttons is large when no float is entered. | Fine. Optionally show a one-line example ("Enter 200 to see which bills to leave") in the empty space. |

## Checked and passed

- Hierarchy: pill, H1, one-line promise, then the tool. Big numbers in mono tabular type. Spacing and radii consistent.
- Colour and contrast: light and dark both good (Lighthouse contrast pass). Over is green, short is red, and the words Over, Short and Balanced also show, so colour is not the only cue.
- Touch: +/- buttons 44-48 px, fields 48 px. Numeric keypad (`inputmode`) set. Enter moves to the next row. ArrowUp and ArrowDown step the count.
- Dark mode: no flash, theme saved in try/catch. Reduced-motion respected. Skip link and focus ring present.
- Layout shift: CLS 0.
- Weight: 23 KiB total transfer, 5 KB script, no third-party requests.
- JSON-LD parses: WebApplication, FAQPage, BreadcrumbList. One H1, 11 H2 sections in a logical outline. FAQ answers are short and correct.
- Writing: no em dashes found, no hype, no vendor or AI mentions (only the "maths" and "colour" spellings, row 10).

## Counts

Must-fix: 1. Should-fix: 9 (rows 2 to 10). Nice: 6.
