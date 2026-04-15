-- ============================================================
-- Security hardening: RLS audit and lock-down
-- Issue: Harden Supabase RLS policies and authentication flow
-- ============================================================

-- ---------------------------------------------------------------------------
-- 1. user_learning_progress — was missing RLS entirely
--    user_id is a plain text column storing client-generated anonymous UUIDs
--    (not linked to auth.uid()), so row-level isolation by auth identity is
--    not possible without a schema change. We enable RLS and use the same
--    permissive pattern as user_topic_completions (which has the same
--    design constraint). The client layer is responsible for always
--    querying / writing with its own user_id. Without RLS enabled, even
--    a misconfigured Supabase client could bypass all policies, so enabling
--    it provides the deny-by-default foundation.
-- ---------------------------------------------------------------------------
alter table user_learning_progress enable row level security;

drop policy if exists "user_learning_progress_own" on user_learning_progress;
create policy "user_learning_progress_own"
  on user_learning_progress
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- 2. questions — remove overly-permissive write policies.
--    Any authenticated user could previously insert, update, or delete
--    questions. Migrations run as the service role, which bypasses RLS, so
--    content management is unaffected. Direct API writes by end-users are
--    blocked by removing these policies (deny-by-default).
-- ---------------------------------------------------------------------------
drop policy if exists "Authenticated users can insert questions" on questions;
drop policy if exists "Authenticated users can update questions" on questions;
drop policy if exists "Authenticated users can delete questions" on questions;

-- ---------------------------------------------------------------------------
-- 3. question_candidates — tighten write access.
--    Reads remain open (review UI, public). Writes should be service-role
--    only (edge functions that generate candidates). Drop the policies that
--    allowed any authenticated user to insert/update/delete candidates.
-- ---------------------------------------------------------------------------
drop policy if exists "Authenticated can insert candidates" on question_candidates;
drop policy if exists "Authenticated can update candidates" on question_candidates;
drop policy if exists "Authenticated can delete candidates" on question_candidates;

-- ---------------------------------------------------------------------------
-- 4. topics — no write policy was ever defined, so RLS already denied all
--    writes from non-service-role callers. This is correct: topics are
--    seeded via migrations only. No change required, but document it.
-- ---------------------------------------------------------------------------
-- (no-op — deny-by-default is already in effect for writes)
