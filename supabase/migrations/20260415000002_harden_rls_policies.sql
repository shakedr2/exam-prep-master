-- ============================================================
-- Issue #170: Harden Supabase RLS policies and authentication flow
--
-- Security audit of every table in the public schema with these goals:
--   1. RLS is enabled on every table (defence-in-depth even for public data)
--   2. Authenticated users can only read/write their own rows where applicable
--   3. Public/anon access is explicitly scoped to the minimum needed
--   4. New security-sensitive tables (exam_results, ai_explanation_cache)
--      are created with tight policies from day one
--
-- See docs/operations.md §Security Audit for the full matrix of tables and
-- policies resulting from this migration.
-- ============================================================

-- ---------------------------------------------------------------------------
-- 1. Ensure RLS is enabled on every public table (idempotent safety net)
-- ---------------------------------------------------------------------------

alter table if exists public.topics                        enable row level security;
alter table if exists public.questions                     enable row level security;
alter table if exists public.user_progress                 enable row level security;
alter table if exists public.user_profiles                 enable row level security;
alter table if exists public.user_learning_progress        enable row level security;
alter table if exists public.user_topic_completions        enable row level security;
alter table if exists public.question_candidates           enable row level security;
alter table if exists public.curriculum_tracks             enable row level security;
alter table if exists public.curriculum_phases             enable row level security;
alter table if exists public.curriculum_modules            enable row level security;
alter table if exists public.curriculum_lessons            enable row level security;
alter table if exists public.curriculum_concepts           enable row level security;
alter table if exists public.curriculum_practices          enable row level security;
alter table if exists public.curriculum_quizzes            enable row level security;
alter table if exists public.curriculum_translations       enable row level security;
alter table if exists public.curriculum_question_attempts  enable row level security;
alter table if exists public.curriculum_track_enrolments   enable row level security;
alter table if exists public.curriculum_module_progress    enable row level security;

-- ---------------------------------------------------------------------------
-- 2. Tighten user_progress RLS
--
-- Previous state (20260408_anon_user_progress.sql): three permissive policies
-- allowed both anon and authenticated to read/write ANY row. That was intended
-- to support localStorage-based anonymous learners whose client-generated UUIDs
-- don't map to auth.users.
--
-- This migration keeps the permissive behaviour for the `anon` role only (no
-- identity to check against) and adds tight per-row isolation for the
-- `authenticated` role so signed-in users can only read/write their own rows.
-- ---------------------------------------------------------------------------

drop policy if exists "Anyone can read progress"   on public.user_progress;
drop policy if exists "Anyone can insert progress" on public.user_progress;
drop policy if exists "Anyone can update progress" on public.user_progress;

-- Anonymous learners (no auth session) — unchanged permissive behaviour.
create policy "Anon can read progress"
  on public.user_progress for select
  to anon
  using (true);

create policy "Anon can insert progress"
  on public.user_progress for insert
  to anon
  with check (true);

create policy "Anon can update progress"
  on public.user_progress for update
  to anon
  using (true)
  with check (true);

-- Authenticated users — row-level isolation against the signed-in UID.
create policy "Authenticated can read own progress"
  on public.user_progress for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Authenticated can insert own progress"
  on public.user_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Authenticated can update own progress"
  on public.user_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Authenticated can delete own progress"
  on public.user_progress for delete
  to authenticated
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 3. Close curriculum_question_attempts gaps
--
-- The original migration only created SELECT/INSERT policies. With RLS on,
-- UPDATE and DELETE are implicitly denied — which is the desired behaviour
-- for an append-only attempts log. Explicit policies documented here so the
-- intent is obvious in the policy list (no policy = deny for that command).
-- ---------------------------------------------------------------------------

-- Re-assert the existing policies are scoped to authenticated role only.
-- Anonymous attempts (if we support them later) should go through a separate
-- anon-scoped policy.
drop policy if exists "Users can read own question attempts"
  on public.curriculum_question_attempts;
drop policy if exists "Users can insert own question attempts"
  on public.curriculum_question_attempts;

create policy "Users can read own question attempts"
  on public.curriculum_question_attempts for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own question attempts"
  on public.curriculum_question_attempts for insert
  to authenticated
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- 4. Tighten question_candidates writes
--
-- Candidates are staging data for reviewer promotion. Public SELECT is fine,
-- but writes must go through the service role (edge function + review tool)
-- rather than any authenticated user. Revoke the broad authenticated policies.
-- ---------------------------------------------------------------------------

drop policy if exists "Authenticated can insert candidates" on public.question_candidates;
drop policy if exists "Authenticated can update candidates" on public.question_candidates;
drop policy if exists "Authenticated can delete candidates" on public.question_candidates;

-- Public read stays (Anyone can read candidates). Writes are now service-role only.

-- ---------------------------------------------------------------------------
-- 5. exam_results — new user-owned table for completed exam simulations
--
-- Per issue #95 the app persists exam history only in localStorage today. This
-- creates the server-side home for signed-in users' exam history with tight
-- RLS from day one: users can read/insert their own results, never update or
-- delete (historical record).
-- ---------------------------------------------------------------------------

create table if not exists public.exam_results (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  score            integer not null check (score >= 0),
  total            integer not null check (total > 0),
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  answers          jsonb not null default '[]'::jsonb,
  started_at       timestamptz not null default now(),
  completed_at     timestamptz not null default now()
);

create index if not exists idx_exam_results_user_id
  on public.exam_results(user_id);

create index if not exists idx_exam_results_completed_at
  on public.exam_results(completed_at desc);

alter table public.exam_results enable row level security;

drop policy if exists "Users can read own exam results"   on public.exam_results;
drop policy if exists "Users can insert own exam results" on public.exam_results;

create policy "Users can read own exam results"
  on public.exam_results for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own exam results"
  on public.exam_results for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Intentionally no UPDATE or DELETE policies: exam history is append-only.

-- ---------------------------------------------------------------------------
-- 6. ai_explanation_cache — shared, read-only-for-clients cache table
--
-- The `explain` / `ai-explain` edge functions write AI-generated explanations
-- keyed by a hash of (question, user_answer). Clients can read cached entries
-- directly to skip the LLM call. All writes go through the service role only.
-- ---------------------------------------------------------------------------

create table if not exists public.ai_explanation_cache (
  cache_key     text primary key,
  question_hash text not null,
  explanation   text not null,
  model         text,
  hit_count     integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_ai_explanation_cache_question_hash
  on public.ai_explanation_cache(question_hash);

alter table public.ai_explanation_cache enable row level security;

drop policy if exists "Authenticated can read explanation cache"
  on public.ai_explanation_cache;

-- Read-only for any authenticated user. Anonymous clients must go through
-- the edge function (which runs with service role) so we can enforce rate
-- limits and attribute LLM cost against a real identity.
create policy "Authenticated can read explanation cache"
  on public.ai_explanation_cache for select
  to authenticated
  using (true);

-- No INSERT / UPDATE / DELETE policies: writes are service-role only.

-- ---------------------------------------------------------------------------
-- 7. Touch-updated-at trigger for ai_explanation_cache
-- ---------------------------------------------------------------------------

create or replace function public.touch_ai_explanation_cache_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists ai_explanation_cache_set_updated_at on public.ai_explanation_cache;
create trigger ai_explanation_cache_set_updated_at
  before update on public.ai_explanation_cache
  for each row execute function public.touch_ai_explanation_cache_updated_at();

-- ---------------------------------------------------------------------------
-- 8. Revoke default privileges (defence-in-depth)
--
-- Even with RLS, make sure the public grants don't accidentally bypass it.
-- ---------------------------------------------------------------------------

revoke all on public.exam_results          from public;
revoke all on public.ai_explanation_cache  from public;

grant select, insert on public.exam_results          to authenticated;
grant select         on public.ai_explanation_cache  to authenticated;
