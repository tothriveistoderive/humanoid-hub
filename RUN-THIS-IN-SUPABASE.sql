-- ═══════════════════════════════════════════════════════════════════════════
-- HUMANOID HUB — one paste, one Run.
--
-- Before you hit Run, open this in a tab so you can see the test notification:
--    https://ntfy.sh/humanoidhub-leads-234f60fc0a
--
-- Everything below is safe to run more than once.
-- ═══════════════════════════════════════════════════════════════════════════


-- ── 1. CLEAN UP QA TEST DATA FIRST ──────────────────────────────────────────
-- Done before the constraints go on, so old test rows can't block them.

delete from public.leads
where name    ilike '%QA-TEST%'
   or org     ilike '%QA-TEST%'
   or message ilike '%QA-TEST-20260806%'
   or name    = 'NOTIFICATION TEST'
   or email   ilike 'ledogmanben+qa%@gmail.com'
   or email   ilike 'ledogmanben+notifytest@gmail.com';


-- ── 2. LOCK DOWN ACCESS ─────────────────────────────────────────────────────
-- Makes insert-only real rather than assumed.

alter table public.leads enable row level security;

revoke select, update, delete on public.leads from anon;
grant insert on public.leads to anon;

drop policy if exists "anon can insert leads" on public.leads;
create policy "anon can insert leads"
  on public.leads for insert
  to anon
  with check (true);


-- ── 3. CONSTRAIN THE DATA ───────────────────────────────────────────────────
-- The part that can't be bypassed. Anything hitting the API directly and
-- skipping the form still has to satisfy these.

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
  add constraint leads_len_message check (message is null or char_length(message) <= 2000),
  add constraint leads_type_valid  check (type in ('quote', 'pricelist')),
  add constraint leads_email_shape check (email ~ '^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$'),
  add constraint leads_required_not_blank check (
    (name    is null or btrim(name)    <> '') and
    (org     is null or btrim(org)     <> '') and
    (country is null or btrim(country) <> '')
  );


-- ── 4. RATE LIMITING ────────────────────────────────────────────────────────
-- 20 inserts a minute globally, and no repeat from the same email inside a
-- minute. A human never trips either; a script always does.

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

  if recent >= 20 then
    raise exception 'rate limit exceeded' using errcode = '53400';
  end if;

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

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx      on public.leads (email);


-- ── 5. NOTIFICATIONS ────────────────────────────────────────────────────────
-- Pushes to ntfy.sh the moment a lead lands. No account, no API key.
-- The topic name is the only secret — don't post it publicly.

create extension if not exists pg_net with schema extensions;

create or replace function public.notify_new_lead()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  title text;
  body  text;
begin
  if new.type = 'pricelist' then
    title := 'Price list request';
    body  := new.email;
  else
    title := 'New quote request'
             || case when new.country is not null then ' — ' || new.country else '' end;
    body  := coalesce(new.name, '(no name)')
             || case when new.org      is not null then E'\n' || new.org else '' end
             || E'\n' || new.email
             || case when new.robot    is not null then E'\n' || 'Platform: ' || new.robot   else '' end
             || case when new.budget   is not null then E'\n' || 'Budget: '   || new.budget  else '' end
             || case when new.use_case is not null then E'\n' || 'Use case: ' || new.use_case else '' end
             || case when new.message  is not null then E'\n\n' || left(new.message, 400) else '' end;
  end if;

  perform extensions.net.http_post(
    url     := 'https://ntfy.sh',
    body    := jsonb_build_object(
                 'topic',    'humanoidhub-leads-234f60fc0a',
                 'title',    title,
                 'message',  body,
                 'priority', case when new.type = 'quote' then 4 else 3 end
               ),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );

  return new;
end;
$$;

-- AFTER INSERT, so a failed notification can never lose you a lead.
drop trigger if exists notify_new_lead_trg on public.leads;
create trigger notify_new_lead_trg
  after insert on public.leads
  for each row execute function public.notify_new_lead();


-- ── 6. REPORT BACK ──────────────────────────────────────────────────────────
-- Read these three results. Everything should say the same thing: locked down.

select 'RLS enabled (must be true)' as check, relrowsecurity::text as result
from pg_class where relname = 'leads'
union all
select 'policies on leads (want 1, INSERT)', count(*)::text
from pg_policies where tablename = 'leads'
union all
select 'anon can SELECT? (want 0)', count(*)::text
from information_schema.role_table_grants
where table_name = 'leads' and grantee = 'anon' and privilege_type = 'SELECT'
union all
select 'constraints added (want 8)', count(*)::text
from pg_constraint where conrelid = 'public.leads'::regclass and contype = 'c'
union all
select 'rows left in table', count(*)::text from public.leads;
