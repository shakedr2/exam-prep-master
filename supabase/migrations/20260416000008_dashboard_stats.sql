-- ============================================================
-- Issue #161: Precompute dashboard stats with triggers
--
-- The dashboard currently computes totalAnswered, totalCorrect,
-- and streak on-the-fly by fetching all user_progress rows and
-- aggregating client-side. This migration replaces that with a
-- precomputed `dashboard_stats` table kept up-to-date via a
-- trigger on user_progress.
--
-- Changes:
--   1. dashboard_stats table (one row per authenticated user)
--   2. RLS policies (users can only read their own row)
--   3. Trigger function that updates stats on user_progress changes
--   4. Trigger on user_progress (AFTER INSERT OR UPDATE)
--   5. backfill_dashboard_stats() RPC to seed existing users
--   6. get_dashboard_stats() RPC for efficient single-row read
-- ============================================================

-- ---------------------------------------------------------------------------
-- 1. dashboard_stats table
-- ---------------------------------------------------------------------------

create table if not exists public.dashboard_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_questions_answered integer not null default 0,
  correct_answers integer not null default 0,
  total_practice_time_seconds integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_activity_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint dashboard_stats_nonneg check (
    total_questions_answered >= 0
    and correct_answers >= 0
    and total_practice_time_seconds >= 0
    and current_streak >= 0
    and longest_streak >= 0
  )
);

-- ---------------------------------------------------------------------------
-- 2. RLS policies — users can only SELECT their own row.
--    Writes happen exclusively via SECURITY DEFINER trigger/RPC functions,
--    so no INSERT/UPDATE/DELETE policies are needed for regular roles.
-- ---------------------------------------------------------------------------

alter table public.dashboard_stats enable row level security;

drop policy if exists "Users read own dashboard stats" on public.dashboard_stats;
create policy "Users read own dashboard stats"
  on public.dashboard_stats
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Revoke direct write access — only trigger/RPC functions (security definer) write.
revoke all on public.dashboard_stats from public;
grant select on public.dashboard_stats to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Trigger function: update_dashboard_stats()
--
-- Fires AFTER INSERT OR UPDATE on user_progress. Computes the delta
-- and applies it to the precomputed row. Anonymous users (whose user_id
-- doesn't exist in auth.users) are silently skipped via FK exception.
-- ---------------------------------------------------------------------------

create or replace function public.update_dashboard_stats()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_uuid uuid;
  v_answered_delta integer := 0;
  v_correct_delta integer := 0;
begin
  -- user_progress.user_id is text; try casting to uuid
  begin
    v_user_uuid := NEW.user_id::uuid;
  exception when invalid_text_representation then
    return NEW;
  end;

  if TG_OP = 'INSERT' then
    v_answered_delta := 1;
    v_correct_delta := case when NEW.is_correct then 1 else 0 end;
  elsif TG_OP = 'UPDATE' then
    -- Same question re-attempted: answered count unchanged, correct may flip
    v_answered_delta := 0;
    v_correct_delta := case
      when NEW.is_correct and not OLD.is_correct then 1
      when not NEW.is_correct and OLD.is_correct then -1
      else 0
    end;
  end if;

  -- Upsert into dashboard_stats; FK violation means anonymous user → skip
  begin
    insert into public.dashboard_stats (
      user_id,
      total_questions_answered,
      correct_answers,
      last_activity_at,
      updated_at
    ) values (
      v_user_uuid,
      greatest(0, v_answered_delta),
      greatest(0, v_correct_delta),
      now(),
      now()
    )
    on conflict (user_id) do update set
      total_questions_answered = greatest(0, dashboard_stats.total_questions_answered + v_answered_delta),
      correct_answers          = greatest(0, dashboard_stats.correct_answers + v_correct_delta),
      last_activity_at         = now(),
      updated_at               = now();
  exception when foreign_key_violation then
    -- anonymous user_id not in auth.users, skip silently
    null;
  end;

  return NEW;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Attach trigger to user_progress
-- ---------------------------------------------------------------------------

drop trigger if exists trg_update_dashboard_stats on public.user_progress;

create trigger trg_update_dashboard_stats
  after insert or update on public.user_progress
  for each row
  execute function public.update_dashboard_stats();

-- ---------------------------------------------------------------------------
-- 5. Backfill RPC — seeds dashboard_stats for all existing authenticated
--    users from their user_progress rows. Also pulls streak data from
--    user_streaks. Safe to call multiple times (idempotent via ON CONFLICT).
-- ---------------------------------------------------------------------------

create or replace function public.backfill_dashboard_stats()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Aggregate user_progress rows for authenticated users only
  insert into public.dashboard_stats (
    user_id,
    total_questions_answered,
    correct_answers,
    last_activity_at,
    updated_at
  )
  select
    au.id,
    count(up.id),
    count(up.id) filter (where up.is_correct),
    max(up.last_attempted_at),
    now()
  from auth.users au
  inner join public.user_progress up on up.user_id = au.id::text
  group by au.id
  on conflict (user_id) do update set
    total_questions_answered = excluded.total_questions_answered,
    correct_answers          = excluded.correct_answers,
    last_activity_at         = excluded.last_activity_at,
    updated_at               = now();

  -- Pull streak data from user_streaks (already precomputed)
  update public.dashboard_stats ds
  set
    current_streak = us.current_streak,
    longest_streak = us.longest_streak,
    updated_at     = now()
  from public.user_streaks us
  where ds.user_id = us.user_id;

  -- Create rows for authenticated users who have streaks but no progress rows
  insert into public.dashboard_stats (
    user_id,
    current_streak,
    longest_streak,
    last_activity_at,
    updated_at
  )
  select
    us.user_id,
    us.current_streak,
    us.longest_streak,
    us.updated_at,
    now()
  from public.user_streaks us
  where not exists (
    select 1 from public.dashboard_stats ds where ds.user_id = us.user_id
  )
  on conflict (user_id) do nothing;
end;
$$;

revoke all on function public.backfill_dashboard_stats() from public;
grant execute on function public.backfill_dashboard_stats() to authenticated;

-- ---------------------------------------------------------------------------
-- 6. get_dashboard_stats RPC — efficient single-row read for the dashboard.
--    Returns NULL fields (not an error) when no row exists yet, so the
--    frontend can fall back gracefully.
-- ---------------------------------------------------------------------------

create or replace function public.get_dashboard_stats(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_result jsonb;
begin
  select jsonb_build_object(
    'total_questions_answered', ds.total_questions_answered,
    'correct_answers',          ds.correct_answers,
    'total_practice_time_seconds', ds.total_practice_time_seconds,
    'current_streak',           ds.current_streak,
    'longest_streak',           ds.longest_streak,
    'last_activity_at',         ds.last_activity_at,
    'updated_at',               ds.updated_at
  )
  into v_result
  from public.dashboard_stats ds
  where ds.user_id = p_user_id;

  return coalesce(v_result, '{}'::jsonb);
end;
$$;

revoke all on function public.get_dashboard_stats(uuid) from public;
grant execute on function public.get_dashboard_stats(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- 7. Sync streak changes into dashboard_stats
--
-- When touch_streak() updates user_streaks, we also want dashboard_stats
-- to reflect the new streak values. This trigger keeps them in sync.
-- ---------------------------------------------------------------------------

create or replace function public.sync_streak_to_dashboard_stats()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.dashboard_stats (
    user_id,
    current_streak,
    longest_streak,
    last_activity_at,
    updated_at
  ) values (
    NEW.user_id,
    NEW.current_streak,
    NEW.longest_streak,
    now(),
    now()
  )
  on conflict (user_id) do update set
    current_streak   = NEW.current_streak,
    longest_streak   = NEW.longest_streak,
    last_activity_at = now(),
    updated_at       = now();

  return NEW;
end;
$$;

drop trigger if exists trg_sync_streak_to_dashboard on public.user_streaks;

create trigger trg_sync_streak_to_dashboard
  after insert or update on public.user_streaks
  for each row
  execute function public.sync_streak_to_dashboard_stats();
