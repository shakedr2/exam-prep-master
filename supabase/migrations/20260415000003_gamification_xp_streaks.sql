-- ============================================================
-- Issue #148: Gamification system — XP, streaks, celebrations,
--             onboarding wizard, skeleton loading.
--
-- This migration adds server-side persistence for the gamification
-- layer so that XP, streaks, milestone state, and onboarding
-- preferences survive across devices.
--
-- Tables:
--   1. user_xp             — authoritative XP ledger per user + aggregate
--   2. user_xp_events      — append-only event log for auditability /
--                            analytics debugging
--   3. user_streaks        — daily-practice streak tracker
--   4. user_milestones     — celebration gate: "first_exam", "ten_correct",
--                            "seven_day_streak", etc. Used to avoid firing
--                            confetti twice for the same milestone.
--   5. user_onboarding     — wizard completion flag + chosen learning goals
-- ============================================================

-- ---------------------------------------------------------------------------
-- 1. user_xp — current XP + level per user
-- ---------------------------------------------------------------------------
create table if not exists public.user_xp (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer not null default 0,
  level integer not null default 1,
  updated_at timestamptz not null default now(),
  constraint user_xp_nonneg check (xp >= 0 and level >= 1)
);

alter table public.user_xp enable row level security;

drop policy if exists "Users read own xp" on public.user_xp;
create policy "Users read own xp"
  on public.user_xp for select using (auth.uid() = user_id);

drop policy if exists "Users insert own xp" on public.user_xp;
create policy "Users insert own xp"
  on public.user_xp for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own xp" on public.user_xp;
create policy "Users update own xp"
  on public.user_xp for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 2. user_xp_events — append-only ledger (audit + analytics)
-- ---------------------------------------------------------------------------
create table if not exists public.user_xp_events (
  id bigserial primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  amount integer not null,
  reason text not null,          -- 'correct_answer' | 'exam_complete' | 'daily_login' | 'streak_bonus'
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_user_xp_events_user_created
  on public.user_xp_events(user_id, created_at desc);

alter table public.user_xp_events enable row level security;

drop policy if exists "Users read own xp events" on public.user_xp_events;
create policy "Users read own xp events"
  on public.user_xp_events for select using (auth.uid() = user_id);

drop policy if exists "Users insert own xp events" on public.user_xp_events;
create policy "Users insert own xp events"
  on public.user_xp_events for insert with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 3. user_streaks — daily practice streak
-- ---------------------------------------------------------------------------
create table if not exists public.user_streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active_date date,
  updated_at timestamptz not null default now(),
  constraint user_streaks_nonneg check (current_streak >= 0 and longest_streak >= 0)
);

alter table public.user_streaks enable row level security;

drop policy if exists "Users read own streak" on public.user_streaks;
create policy "Users read own streak"
  on public.user_streaks for select using (auth.uid() = user_id);

drop policy if exists "Users insert own streak" on public.user_streaks;
create policy "Users insert own streak"
  on public.user_streaks for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own streak" on public.user_streaks;
create policy "Users update own streak"
  on public.user_streaks for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 4. user_milestones — one row per celebrated milestone, to de-dupe confetti
-- ---------------------------------------------------------------------------
create table if not exists public.user_milestones (
  user_id uuid not null references auth.users(id) on delete cascade,
  milestone text not null,       -- 'first_exam' | 'ten_correct' | 'seven_day_streak' | ...
  achieved_at timestamptz not null default now(),
  primary key (user_id, milestone)
);

alter table public.user_milestones enable row level security;

drop policy if exists "Users read own milestones" on public.user_milestones;
create policy "Users read own milestones"
  on public.user_milestones for select using (auth.uid() = user_id);

drop policy if exists "Users insert own milestones" on public.user_milestones;
create policy "Users insert own milestones"
  on public.user_milestones for insert with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 5. user_onboarding — wizard completion + learning preferences
-- ---------------------------------------------------------------------------
create table if not exists public.user_onboarding (
  user_id uuid primary key references auth.users(id) on delete cascade,
  completed boolean not null default false,
  goal_daily_questions integer,              -- e.g. 10 questions/day
  goal_exam_date date,                       -- target exam date
  preferred_topics text[] not null default '{}',
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.user_onboarding enable row level security;

drop policy if exists "Users read own onboarding" on public.user_onboarding;
create policy "Users read own onboarding"
  on public.user_onboarding for select using (auth.uid() = user_id);

drop policy if exists "Users insert own onboarding" on public.user_onboarding;
create policy "Users insert own onboarding"
  on public.user_onboarding for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own onboarding" on public.user_onboarding;
create policy "Users update own onboarding"
  on public.user_onboarding for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 6. award_xp RPC — atomic XP increment + event log
--
-- Clients call this instead of doing a read/update dance on user_xp, which
-- would be racy. Level is derived from XP using the same formula as the
-- client (`XP_PER_LEVEL = 100`). Returns the new (xp, level) so the UI can
-- detect level-ups for celebrations.
-- ---------------------------------------------------------------------------
create or replace function public.award_xp(
  p_amount integer,
  p_reason text,
  p_metadata jsonb default '{}'::jsonb
)
returns table(xp integer, level integer, leveled_up boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_old_level integer;
  v_new_xp integer;
  v_new_level integer;
begin
  if v_user is null then
    raise exception 'award_xp requires an authenticated user';
  end if;
  if p_amount is null or p_amount < 0 then
    raise exception 'award_xp amount must be >= 0';
  end if;

  insert into public.user_xp (user_id, xp, level, updated_at)
    values (v_user, p_amount, greatest(1, (p_amount / 100) + 1), now())
  on conflict (user_id) do update
    set xp = public.user_xp.xp + excluded.xp,
        level = greatest(1, ((public.user_xp.xp + excluded.xp) / 100) + 1),
        updated_at = now()
  returning public.user_xp.xp, public.user_xp.level into v_new_xp, v_new_level;

  -- fetch the previous level for leveled_up calculation
  v_old_level := greatest(1, ((v_new_xp - p_amount) / 100) + 1);

  insert into public.user_xp_events (user_id, amount, reason, metadata)
    values (v_user, p_amount, p_reason, coalesce(p_metadata, '{}'::jsonb));

  return query select v_new_xp, v_new_level, (v_new_level > v_old_level);
end;
$$;

grant execute on function public.award_xp(integer, text, jsonb) to authenticated;

-- ---------------------------------------------------------------------------
-- 7. touch_streak RPC — idempotent per-day streak update
--
-- Logic:
--   • same day as last_active_date   → no change
--   • one day after                   → current_streak += 1
--   • otherwise                       → current_streak = 1 (reset)
-- Longest streak is maintained as max(longest_streak, current_streak).
-- Returns (current_streak, longest_streak, incremented) so the UI can
-- celebrate milestones (7-day, 30-day) only when the streak actually ticks.
-- ---------------------------------------------------------------------------
create or replace function public.touch_streak()
returns table(current_streak integer, longest_streak integer, incremented boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_today date := (now() at time zone 'UTC')::date;
  v_last date;
  v_current integer;
  v_longest integer;
  v_incremented boolean := false;
begin
  if v_user is null then
    raise exception 'touch_streak requires an authenticated user';
  end if;

  select s.last_active_date, s.current_streak, s.longest_streak
    into v_last, v_current, v_longest
    from public.user_streaks s
    where s.user_id = v_user
    for update;

  if not found then
    insert into public.user_streaks (user_id, current_streak, longest_streak, last_active_date)
      values (v_user, 1, 1, v_today);
    return query select 1, 1, true;
    return;
  end if;

  if v_last = v_today then
    -- already counted today
    return query select v_current, v_longest, false;
    return;
  elsif v_last = v_today - interval '1 day' then
    v_current := v_current + 1;
    v_incremented := true;
  else
    v_current := 1;
    v_incremented := true;
  end if;

  v_longest := greatest(v_longest, v_current);

  update public.user_streaks
     set current_streak = v_current,
         longest_streak = v_longest,
         last_active_date = v_today,
         updated_at = now()
   where user_id = v_user;

  return query select v_current, v_longest, v_incremented;
end;
$$;

grant execute on function public.touch_streak() to authenticated;

-- ---------------------------------------------------------------------------
-- 8. claim_milestone RPC — returns true only the first time
-- ---------------------------------------------------------------------------
create or replace function public.claim_milestone(p_milestone text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_inserted boolean;
begin
  if v_user is null then
    raise exception 'claim_milestone requires an authenticated user';
  end if;

  insert into public.user_milestones (user_id, milestone)
    values (v_user, p_milestone)
    on conflict (user_id, milestone) do nothing;

  get diagnostics v_inserted = row_count;
  return v_inserted;
end;
$$;

grant execute on function public.claim_milestone(text) to authenticated;
