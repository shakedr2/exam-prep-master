-- Phase 4 PR2 (issue #320, closes #319): observability table for transactional
-- email delivery. Every welcome-email attempt — success or failure — writes a
-- row here from the send-welcome-email Edge Function. RLS is service-role-only
-- for writes; a user may read their own rows for a future "email history" UI.

create table if not exists public.email_events (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  email       text not null,
  kind        text not null,
  status      text not null,
  provider_id text,
  error       text,
  created_at  timestamptz not null default now(),
  constraint email_events_kind_check
    check (kind in ('welcome', 'welcome_client_fallback')),
  constraint email_events_status_check
    check (status in ('queued', 'sent', 'failed'))
);

create index if not exists email_events_user_id_idx
  on public.email_events (user_id);
create index if not exists email_events_created_at_idx
  on public.email_events (created_at desc);

alter table public.email_events enable row level security;

-- Service role writes everything via the Edge Function.
drop policy if exists "email_events service role write" on public.email_events;
create policy "email_events service role write"
  on public.email_events
  for all
  to service_role
  using (true)
  with check (true);

-- Authenticated users may read only their own rows.
drop policy if exists "email_events user read own" on public.email_events;
create policy "email_events user read own"
  on public.email_events
  for select
  to authenticated
  using (auth.uid() = user_id);
