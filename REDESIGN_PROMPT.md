# Fable 5 Max — Humanoid Hub e-commerce redesign prompt

> **How to use (Ben):** Open the `humanoid-hub-site` folder in Fable 5 Max, then paste everything between the two `═══` lines below as your message. Fable has file access, so it can read the code and the Obsidian notes itself. If Fable needs business context, it will read the vault notes referenced in the prompt.

═══════════════════════════════════════════════════════════════════════════

You are redesigning a live website. Work directly in the `humanoid-hub-site` codebase you have open. **Read before you write** — read the files listed under "Read first" fully before changing anything, then propose the new design tokens, then execute.

## Mission

Transform this site from its current "editorial-industrial" look into a **product-forward e-commerce experience** modeled on Amazon, AliExpress, and Made-in-China.com — the sites where the product is *immediately* in your face, the price is bold and obvious, and a first-time visitor understands "what is this, what does it cost, how do I get one" within two seconds. Those companies spent millions proving these patterns convert; copy the patterns, not the clutter.

**Direction chosen by the owner: HYBRID, executed TASTEFULLY.**
- **Amazon** gives you the clean structure: product-card grid, above-the-fold clarity, big white-background product images, star ratings, a sticky "buy box."
- **AliExpress** gives you the punch: bold prices, badges, category chips, visual density that reads as "lots on offer."
- **Made-in-China.com** gives you the B2B trust rails — and it's the closest match to this actual business: prominent search, certification badges (CE), spec-forward cards, and **"Request a quote" as the primary action instead of "Add to cart."**
- **Tasteful** means: big bold prices, trust badges, CE/spec highlights, and social proof are all good — but **NO fake scarcity** (no countdown timers, no "23 people viewing," no invented "only 2 left"). The buyers are universities, research labs, and corporate innovation teams spending $5,000–$54,000. Loud and confident, yes; carnival-barker, no.

## Business context — read first

This is a real business. Read these for full context before designing:
- **`../Humanoid Hub — Plan.md`** (in the Obsidian vault, one level up from the site folder) — the business model, who buys, the money ladder. Read it.
- **`lib/robots.js`** — the actual product catalog (5 robots, 3 manufacturers). This is your source of truth for every price, spec, and name. **Never invent specs or prices — pull them from `ROBOTS`.**
- **`lib/config.js`** — brand name (currently placeholder "Humanoid Hub"), contact, Supabase keys.
- **`README.md`** — the stack and deploy setup.

Short version: this company is the **EMEA (Europe / Middle East / Africa) sales representative for Chinese humanoid-robot brands** (EngineAI, Booster, LimX). The site is a showroom — visitors browse real robots with real specs and prices, then submit a quote request (a lead), which lands in Supabase. It is openly commercial: "we represent these brands." 5 platforms, price range roughly $5,000 (Booster K1) to $54,000 (EngineAI SE01). The primary conversion is a **lead**, not a checkout.

## The reference playbook (baked-in research — use it, don't re-derive it)

**Amazon — layout & trust**
- Above-the-fold answers *what / how much / how to buy* instantly. ~80% of conversions happen above the fold — put the product, price, and CTA there.
- Product detail page (PDP): large image gallery on the left with thumbnail rail, title + rating + review count, then a **sticky buy box** on the right holding price + primary CTA + trust bullets.
- 5 benefit-led bullets; specs in a clean two-column table; FAQ lower down.
- Colors: near-black text `#0F1111`, white background, dark navy top nav `#131921` / secondary `#232F3E`, **prices in bold dark red `#B12704`** (this is the "price in your face" signal), rating stars gold `#FFA41C`, in-stock green `#007600`, teal links `#007185`.

**AliExpress — punch & density**
- Brand energy from **orange `#F79917`** and **red `#E52F20`** used as the "energy layer" for CTAs, badges, and highlights — never as the whole background.
- Product cards are dense but scannable: image, title, **big price**, a badge or two, a secondary signal (rating / units). Category chips and a strong search bar up top.

**Made-in-China.com — B2B rails (most relevant to this business)**
- Prominent centered **search bar** at the top; immediate product discovery.
- Cards and filters foreground **certifications (CE/ISO), specs, and class** — exactly the trust signals institutional buyers scan for.
- **"Request a Quote" / RFQ is the primary action**, and tap-to-contact is everywhere. Industrial/technical goods, audited-credential framing.

**Density philosophy:** information-rich reads as *efficient and trustworthy* to these buyers when it's well-organized — not minimalist, but not chaotic. Aim for "confident catalog," not "empty gallery" and not "flea market."

## Design system to implement

Replace the current tokens in `app/globals.css`. Recommended palette (anchor to these; adjust shades with taste):

```
--ink:        #0F1111;   /* primary text */
--ink-soft:   #565959;   /* secondary text */
--bg:         #FFFFFF;   /* page background */
--bg-subtle:  #F7F8FA;   /* panels, alt rows, card footers */
--nav:        #131921;   /* top navigation bar */
--nav-2:      #232F3E;   /* secondary nav / footer */
--price:      #B12704;   /* bold price red — the hero of every card */
--cta:        #FF9900;   /* primary "Request a quote" button */
--cta-hover:  #F08804;
--star:       #FFA41C;   /* rating stars */
--ok:         #007600;   /* "In stock / CE-ready" green */
--badge:      #E52F20;   /* deal/highlight badge (use sparingly, tastefully) */
--link:       #007185;   /* interactive teal links */
--line:       #D5D9D9;   /* borders */
--line-soft:  #E3E6E6;
--radius:     8px;        /* cards; Amazon-ish soft corners */
```
- **Type:** switch to a clean, dense, commercial sans (system stack or Inter). Keep a monospace only for spec values/SKUs. Prices are the largest thing on a card after the image.
- **Product card anatomy (build as a component, e.g. `ProductCard.jsx`):** product image on white → title (model + maker) → class/DOF line → **big bold price in `--price`** with the "from" and "ex-works" note small beneath → 2–3 badges (e.g. `CE-ready`, `In stock`, use-case chips) → star rating + short social-proof line → full-width **"Request a quote"** CTA. The whole card is clickable to the PDP.
- **Badges:** small, rounded, high-contrast. Real ones only: `CE documentation verified`, class/DOF, use-case chips (`Education`, `Research`, `Competition`). No fake urgency.

## What to build — page by page

**1. Global chrome**
- `components/Header.jsx`: dark navy top bar (`--nav`) with brand, a **prominent search input** (Made-in-China style — even if it just filters the catalog client-side), and the quote CTA. Add a slim secondary bar of **category / use-case chips** (All · Education · Research · Competition · Content/Events) and a thin trust strip ("We represent EngineAI · Booster · LimX — CE-documented EMEA delivery").
- `components/Footer.jsx`: fuller e-commerce footer on `--nav-2` — columns (Platforms, How it works, For institutions, Contact) + the "openly commercial / we represent these brands" disclosure.

**2. Homepage (`app/page.jsx`)**
- **Hero:** compact and product-forward. Headline + one-line value prop + the primary CTA, plus a tight stat strip pulled from real data ("5 platforms · $5,000–$54,000 · 3 manufacturers · CE-documented"). Keep it short — the grid is the star.
- **Replace the lineup `<table>` with a responsive PRODUCT-CARD GRID** rendering `ROBOTS.map(...)` through the new `ProductCard`. This is the single most important change: 2–4 columns on desktop, 1–2 on mobile. Bold prices, badges, ratings, "Request a quote" on each. Add a filter/sort row (by price, by use-case) that works with the header search/chips.
- Keep the **"How it works" 3-step** section (Inquiry → Quote → Delivery) but restyle as clean e-commerce trust tiles.
- Keep the **price-list magnet band** and the **quote form** — restyle to match, keep them wired (see constraints).

**3. Robot detail pages (`app/robots/[slug]/page.jsx`) → full Amazon-style PDP**
- Two-column above-the-fold: **left** = large product image with a thumbnail rail (see image note below); **right = sticky buy box** with price in `--price`, "from … ex-works" note, the CE/trust bullets from `priceboxBullets`, and a big **"Request a quote"** button that scrolls to / opens the quote form with that model preselected.
- Below: title + rating, the 5 benefit bullets (`useCases`/`lede`), a clean **spec table** from `specs`, badges/chips, then **FAQ** from `faq`, then a **"Related platforms" rail** of other `ROBOTS` cards.
- Preserve all SEO: the `meta` fields, JSON-LD, `generateStaticParams`, and `sitemap.js`.

**4. Forms (`components/QuoteForm.jsx`)** — restyle only. See constraints.

## Hard constraints — do not break these

1. **Stack is Next.js 15 App Router with `output: "export"` (pure static, GitHub Pages).** No server components that fetch, no server actions, no API routes, no runtime backend. Anything interactive (search, filter, sort, gallery) is client-side (`"use client"`).
2. **Data stays in `lib/robots.js`.** Render everything from `ROBOTS`; do not hardcode prices/specs into JSX. If a card needs a field that doesn't exist yet (e.g. a rating), add it to the data model in `robots.js` with honest placeholder values and read it from there — don't scatter literals.
3. **Keep the lead pipeline intact.** `QuoteForm` and `PricelistForm` must keep POSTing to Supabase exactly as they do now — same endpoint, same **field names** (`type, name, org, email, country, robot, use_case, budget, message, page`). Restyle the markup; do not touch the submit logic or `lib/config.js` keys.
4. **Respect the GitHub Pages base path.** The site deploys under a base path via `NEXT_PUBLIC_BASE_PATH`. Use `next/link` for navigation and prefix any static asset (`<img src>`, backgrounds) with the base path, or keep using inline SVG so paths never break. If you use `next/image`, it must be `unoptimized`.
5. **No real product photos exist yet.** Keep using the existing `components/Diagram.jsx` SVG as the "product image," but restyle it to sit on a **clean white product-shot frame** inside the card and the PDP gallery. Build the image/gallery component to accept a real photo prop (`image`/`gallery` in `robots.js`) so photos can drop in later with zero rework — leave 2–3 empty thumbnail slots styled and ready.
6. **Mobile-first & accessible.** These buyers are 60–70% mobile. Everything responsive; real `alt` text; visible focus states; color contrast passes; semantic HTML; the card grid collapses cleanly.
7. **Keep copy accurate and openly commercial.** Don't overpromise ("in stock" only where the data says so). Keep the "we represent these brands / CE-documented" honesty — it's a selling point, not fine print.
8. **It must still build.** Run `npm run build` (the static export) when done and fix every error/warning you introduced.

## Workflow

1. Read the "Read first" files and skim every component.
2. Post a short plan: the new `globals.css` token block + the `ProductCard` component design, and confirm the base-path/image approach. Then proceed without waiting.
3. Implement globals + `ProductCard` first, wire the homepage grid, then the PDP, then header/footer, then forms.
4. Keep components small and reusable (`ProductCard`, `Badge`, `Rating`, `ProductGallery`, `BuyBox`).
5. `npm run build` → fix errors → done.

## Definition of done

- [ ] Homepage leads with a responsive **product-card grid** (not a table); prices are bold and unmissable; CTA on every card.
- [ ] PDPs are Amazon-style: gallery + sticky buy box + specs + FAQ + related rail.
- [ ] Palette matches the token set; navy chrome, red prices, orange CTA, tasteful badges — **no fake scarcity**.
- [ ] Search + category chips + sort work client-side over `ROBOTS`.
- [ ] Quote/price-list forms still POST to Supabase with unchanged field names.
- [ ] Mobile layout is clean; accessibility basics pass; `npm run build` succeeds.
- [ ] Every price/spec traces back to `lib/robots.js`; nothing invented.

═══════════════════════════════════════════════════════════════════════════

## Notes for Ben (not part of the prompt)

- **Why "hybrid + tasteful":** your buyers are institutions running procurement, not Temu shoppers. The research is clear that Amazon-style structure + Made-in-China B2B trust rails convert high-ticket B2B better than full AliExpress/Temu urgency — so the prompt keeps the loud, product-first *look* but cuts fake-scarcity gimmicks that would spook a university purchasing office.
- **The one big visual change** is table → product-card grid. That single move is what makes it read as "a store" instead of "a spec sheet."
- **Photos are the missing ingredient.** The prompt tells Fable to build photo-ready slots now (using your SVG diagrams as placeholders). Getting even one clean product shot per robot from the brands' press kits will make this look genuinely like Amazon.
- If you want to push *louder* later (closer to AliExpress), tell Fable to "enable the deal-badge and social-proof layer more aggressively" — the tokens are already there.

**Sources (design research):** [Amazon PDP anatomy](https://sellershorts.com/resources/blog/anatomy-of-a-winning-amazon-product-detail-page) · [Amazon brand colors](https://brandpalettes.com/amazon-color-codes/) · [AliExpress colors](https://www.brandcolorcode.com/aliexpress) · [Made-in-China vs Alibaba B2B](https://seller.alibaba.com/businessblogs/made-in-china-vs-alibaba-which-b2b-website-to-choose-px002ajsf) · [Chinese e-commerce density vs Western minimalism](https://vdelacou.medium.com/ux-design-in-china-vs-united-states-88b814aa83e8)
