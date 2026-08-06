-- Humanoid Hub — Supabase hardening
-- Run in: Supabase dashboard → SQL Editor → New query → paste → Run.
-- Safe to run more than once.
--
-- Why this matters: the anon key is public (it's in the JS bundle, by design),
-- so anyone can POST straight at /rest/v1/leads and skip every check the form
-- does. Only the rules below actually bind.


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 1 — VERIFY FIRST. Run this block on its own and read the output before
-- changing anything.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1a. Is row-level security actually ON? If rowsecurity = false, policies are
--     ignored entirely and the whole table is readable. This must be true.
select relname as table_name,
       relrowsecurity as rls_enabled,
       relforcerowsecurity as rls_forced
from pg_class
where relname = 'leads';

-- 1b. What policies exist? You want exactly one: INSERT for anon.
--     Anything with cmd = 'SELECT' and roles including anon is the problem.
select policyname, cmd, roles, qual, with_check
from pg_policies
where tablename = 'leads';

-- 1c. Direct grants. anon should have INSERT only — no SELECT, UPDATE, DELETE.
select grantee, privilege_type
from information_schema.role_table_grants
where table_name = 'leads' and grantee in ('anon', 'authenticated', 'public')
order by grantee, privilege_type;


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 2 — LOCK DOWN ACCESS. Makes insert-only real rather than assumed.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.leads enable row level security;

-- Remove any read access anon may have picked up.
revoke select, update, delete on public.leads from anon;
grant insert on public.leads to anon;

-- Drop and recreate the insert policy so its definition is known, not inherited.
drop policy if exists "anon can insert leads" on public.leads;
create policy "anon can insert leads"
  on public.leads for insert
  to anon
  with check (true);

-- Make sure no permissive select policy is lying around under another name.
-- Review the output of 1b first, then drop by name, e.g.:
-- drop policy "Enable read access for all users" on public.leads;


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 3 — CONSTRAIN THE DATA. This is the part that survives someone calling
-- the API directly. 500 MB free-tier database ÷ unbounded text = a bad evening.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.leads drop constraint if exists leads_len_name;
alter table public.leads drop constraint if exists leads_len_org;
alter table public.leads drop constraint if exists leads_len_email;
alter table public.leads drop constraint if exists leads_len_country;
alter table public.leads drop constraint if exists leads_len_message;
alter table public.leads drop constraint if exists leads_type_valid;
alter table public.leads drop constraint if exists leads_email_shape;
alter table public.leads drop constraint if exists leads_required_not_blank;

alter table public.leads
  add constraint leads_len_name    check (name    is null or char_length(name)    between 1 and 120),
  add constraint leads_len_org     check (org     is null or char_length(org)     between 1 and 160),
  add constraint leads_len_email   check (char_length(email) between 3 and 254),
  add constraint leads_len_country check (country is null or char_length(country) between 1 and 80),
  add constraint leads_len_message check (message is null or char_length(message) <= 2000);

-- Only the two form types are valid.
alter table public.leads
  add constraint leads_type_valid check (type in ('quote', 'pricelist'));

-- Rejects "a@b" and "test@localhost", which type="email" happily accepts.
alter table public.leads
  add constraint leads_email_shape check (email ~ '^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$');

-- Whitespace-only passes HTML5 `required`. This makes "   " impossible to store.
alter table public.leads
  add constraint leads_required_not_blank check (
    (name    is null or btrim(name)    <> '') and
    (org     is null or btrim(org)     <> '') and
    (country is null or btrim(country) <> '')
  );


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 4 — RATE LIMITING. Caps how fast one source can insert. Optional but
-- it is the only server-side brake that exists.
-- ─────────────────────────────────────────────────────────────────────────────

create or replace function public.leads_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recent int;
begin
  select count(*) into recent
  from public.leads
  where created_at > now() - interval '1 minute';

  -- Global ceiling: a human never trips 20/min, a script always does.
  if recent >= 20 then
    raise exception 'rate limit exceeded' using errcode = '53400';
  end if;

  -- Same email twice inside a minute is a double-click or a loop.
  if exists (
    select 1 from public.leads
    where email = new.email and created_at > now() - interval '1 minute'
  ) then
    raise exception 'duplicate submission' using errcode = '53400';
  end if;

  return new;
end;
$$;

drop trigger if exists leads_rate_limit_trg on public.leads;
create trigger leads_rate_limit_trg
  before insert on public.leads
  for each row execute function public.leads_rate_limit();

-- Keeps the rate-limit lookups fast as the table grows.
create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx      on public.leads (email);


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 5 — CLEAN UP QA TEST DATA from the 6 August 2026 pre-launch test.
-- Check what matches before deleting.
-- ─────────────────────────────────────────────────────────────────────────────

select id, type, name, org, email, country, created_at
from public.leads
where name  ilike '%QA-TEST-20260806%'
   or org   ilike '%QA-TEST%'
   or message ilike '%QA-TEST-20260806%'
   or email ilike 'ledogmanben+qa%@gmail.com'
order by created_at desc;

-- Then, once the list above looks right:
-- delete from public.leads
-- where name  ilike '%QA-TEST-20260806%'
--    or org   ilike '%QA-TEST%'
--    or message ilike '%QA-TEST-20260806%'
--    or email ilike 'ledogmanben+qa%@gmail.com';


-- ─────────────────────────────────────────────────────────────────────────────
-- STEP 6 — CONFIRM THE LOCKDOWN WORKED.
-- Run this in your browser console on the live site, NOT here.
-- Paste the anon key from lib/config.js as K.
-- ─────────────────────────────────────────────────────────────────────────────
--
--   const K = "<anon key from lib/config.js>";
--   const r = await fetch(
--     "https://jdayxvgrrrmtiouktcsg.supabase.co/rest/v1/leads?select=*&limit=5",
--     { headers: { apikey: K, Authorization: "Bearer " + K } });
--   console.log(r.status, await r.text());
--
--   PASS → 200 with []   (empty array, nothing readable)
--   PASS → 401 / "permission denied"
--   FAIL → 200 with actual lead rows. Stop and fix Step 2 before launching.
