# Humanoid Hub — EMEA showcase site

Next.js (static export) showcase for Chinese humanoid robots, sold into EMEA.
Placeholder brand name — swap `BRAND_NAME` in `lib/config.js` when the real name lands.


## Stack

- **Next.js 15** App Router, `output: "export"` — pure static, no server
- **GitHub Pages** hosting via `.github/workflows/deploy.yml` (Pages source must be "GitHub Actions")
- **Supabase** stores leads — quote + price-list forms POST to `/rest/v1/leads` with the anon key; RLS allows anonymous INSERT only, nobody anonymous can read

## Configure

`lib/config.js` → set `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

## Develop

```bash
npm install
npm run dev
```

## Deploy

Push to `main` — Actions builds and publishes to Pages.
Deployed under `/humanoid-hub` base path (set in the workflow); with a custom domain later, remove `NEXT_PUBLIC_BASE_PATH`.

## Leads

Supabase Dashboard → Table Editor → `leads`. Columns: type (quote/pricelist), name, org, email, country, robot, use_case, budget, message, page, created_at.
