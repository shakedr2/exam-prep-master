-- Issue #95: Persist authenticated user metadata that doesn't fit in the
-- existing user_progress table. Specifically:
--   - username       : displayed in the dashboard greeting
--   - last_topic_id  : the topic the user was last practicing
--   - last_question_index : the question index within that topic
-- Together they let a returning user resume from the exact spot they left.
--
-- Unlike user_progress, which has permissive RLS to support anonymous
-- writers, user_profiles is auth-only: a row exists only for users who
-- have signed in, and it's keyed by auth.users(id).

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  last_topic_id text,
  last_question_index integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

drop policy if exists "Users can read own profile" on public.user_profiles;
create policy "Users can read own profile"
  on public.user_profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.user_profiles;
create policy "Users can insert own profile"
  on public.user_profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
  on public.user_profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create or replace function public.touch_user_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_profiles_set_updated_at on public.user_profiles;
create trigger user_profiles_set_updated_at
  before update on public.user_profiles
  for each row execute function public.touch_user_profiles_updated_at();
