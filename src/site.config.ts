// ONE config file. Change values here; every page reads from it.
// Keep this file plain (no type-only syntax): scripts/deploy.mjs imports it directly.
const cfg = {
  name: 'Cash Drawer Counter',                 // shown in header, title, footer
  domain: 'countthedrawercalculator.com',            // no https://, no www. Used for canonical, sitemap, robots
  cloudflareProject: 'cash-drawer-counter',    // Cloudflare Pages project name (used by npm run deploy)
  keyword: 'cash drawer counter',            // main keyword: goes in the H1 and title
  keywords: ['cash drawer calculator', 'till counter calculator', 'cash register counter', 'drawer count sheet', 'cash deposit calculator'], // supporting keywords
  tagline: 'Free, fast and private',  // short line shown in the pill above the H1
  description:
    'Cash drawer counter for shift end. Enter bills, coins and rolls, set your float, and see the deposit and which bills to pull. Free and private.',
  email: 'hello@countthedrawercalculator.com',       // contact email (shown on the Contact, Privacy and Terms pages)
  ga4: '',                            // GA4 measurement ID, e.g. 'G-XXXXXXXXXX'. Empty = Google Analytics off
  adsense: '',                        // AdSense publisher ID, e.g. 'ca-pub-1234567890123456'. Empty = ads off
  brand: '#15803d',                   // brand color (hex)
  locale: 'en-US',                    // BCP 47 language tag
  ogImage: '/og.png',                        // e.g. '/og.png' (1200x630 file in public/). Empty = no image
  category: 'UtilitiesApplication',   // schema.org applicationCategory
  owner: 'Cash Drawer Counter',                // name used in legal pages (person or business)
};

// Bingemind mode (SITE_MODE=bingemind): the tool lives at bingemind.com/cash-drawer-counter/.
// Canonical links always name that address. Legal pages name Bingemind as the owner.
const bingemind = process.env.SITE_MODE === 'bingemind';
export default {
  ...cfg,
  domain: 'bingemind.com/cash-drawer-counter',
  origin: 'https://bingemind.com/cash-drawer-counter',
  bingemind,
  owner: bingemind ? 'Bingemind' : cfg.owner,
  contactWord: bingemind ? 'Contact' : 'Email',
  contactHref: bingemind ? 'https://bingemind.com/#contact' : `mailto:${cfg.email}`,
  contactLabel: bingemind ? 'bingemind.com/#contact' : cfg.email,
};
