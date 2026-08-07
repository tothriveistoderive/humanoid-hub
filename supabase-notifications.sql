-- Humanoid Hub — lead notifications
-- Run in: Supabase dashboard → SQL Editor → New query → paste → Run.
--
-- Right now a submitted quote notifies nobody. This makes your phone buzz the
-- moment a lead lands, using ntfy.sh — no account, no signup, no API key.
--
-- ── BEFORE YOU RUN THIS ──────────────────────────────────────────────────────
-- Open https://ntfy.sh/humanoidhub-leads-234f60fc0a in a browser tab, or
-- install the ntfy app (iOS/Android) and subscribe to that topic name.
--
-- The topic name IS the password — anyone who knows it can read your
-- notifications. It's random, so don't post it publicly. If it ever leaks,
-- change the topic in this file and re-run.
-- ─────────────────────────────────────────────────────────────────────────────


-- pg_net lets Postgres make HTTP calls. Supabase ships it; this just switches
-- it on. Calls are asynchronous, so a slow notification can never block or
-- fail a form submission.
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
             || case when new.org     is not null then E'\n' || new.org     else '' end
             || E'\n' || new.email
             || case when new.robot   is not null then E'\n' || 'Platform: ' || new.robot   else '' end
             || case when new.budget  is not null then E'\n' || 'Budget: '   || new.budget  else '' end
             || case when new.use_case is not null then E'\n' || 'Use case: ' || new.use_case else '' end
             || case when new.message is not null
                     then E'\n\n' || left(new.message, 400) else '' end;
  end if;

  perform extensions.net.http_post(
    url     := 'https://ntfy.sh',
    body    := jsonb_build_object(
                 'topic',    'humanoidhub-leads-234f60fc0a',
                 'title',    title,
                 'message',  body,
                 'priority', case when new.type = 'quote' then 4 else 3 end,
                 'tags',     case when new.type = 'quote'
                                  then array['money_with_wings']
                                  else array['page_facing_up'] end
               ),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );

  return new;
end;
$$;

-- AFTER INSERT, so a notification failure can never roll back a real lead.
drop trigger if exists notify_new_lead_trg on public.leads;
create trigger notify_new_lead_trg
  after insert on public.leads
  for each row execute function public.notify_new_lead();


-- ── TEST IT ──────────────────────────────────────────────────────────────────
-- With the ntfy tab or app open, run this. You should get a notification
-- within a couple of seconds.

insert into public.leads (type, name, org, email, country, robot, budget, message)
values ('quote', 'NOTIFICATION TEST', 'QA-TEST DELETE ME',
        'ledogmanben+notifytest@gmail.com', 'Netherlands', 'halcyon-f3',
        '$30k – $60k', 'QA-TEST-20260806 notification test. Safe to delete.');

-- Did the HTTP call actually go out? (id, status, error)
select id, created, url, error_msg
from net._http_response
order by created desc
limit 3;

-- Clean up the test row once the notification arrives:
-- delete from public.leads where name = 'NOTIFICATION TEST';


-- ── LATER: upgrading to email ────────────────────────────────────────────────
-- ntfy is push-only and perfect for "a lead just landed". When you want the
-- lead in your inbox as well, the same trigger works — swap the url for a
-- Zapier/Make catch hook, or a Resend API call once you have a business
-- domain to send from. Change one function, nothing else moves.
