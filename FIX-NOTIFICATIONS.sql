-- ═══════════════════════════════════════════════════════════════════════════
-- URGENT FIX — run this now. Paste, Run, done.
--
-- My notification trigger called extensions.net.http_post, which Postgres
-- reads as "database extensions, schema net" and rejects. pg_net's functions
-- live in a schema called `net`, full stop.
--
-- Because the trigger threw, every insert was being rolled back — the forms
-- were rejecting real leads. This fixes the call AND wraps it so a broken
-- notification can never block a submission again.
-- ═══════════════════════════════════════════════════════════════════════════

create extension if not exists pg_net;

create or replace function public.notify_new_lead()
returns trigger
language plpgsql
security definer
set search_path = public, net, extensions
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

  -- THE IMPORTANT PART: a lead is worth more than a notification.
  -- If anything in here fails, swallow it and keep the row.
  begin
    perform net.http_post(
      url     := 'https://ntfy.sh',
      body    := jsonb_build_object(
                   'topic',    'humanoidhub-leads-234f60fc0a',
                   'title',    title,
                   'message',  body,
                   'priority', case when new.type = 'quote' then 4 else 3 end),
      headers := '{"Content-Type": "application/json"}'::jsonb);
  exception when others then
    raise warning 'lead notification failed: %', sqlerrm;
  end;

  return new;
end;
$$;

drop trigger if exists notify_new_lead_trg on public.leads;
create trigger notify_new_lead_trg
  after insert on public.leads
  for each row execute function public.notify_new_lead();
