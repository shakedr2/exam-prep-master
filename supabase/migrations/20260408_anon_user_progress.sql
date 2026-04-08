-- Sprint 3.1: persist learner progress via anonymous localStorage UUIDs.
-- Makes user_progress usable without Supabase auth.
-- Trade-off: the anon role can read/write any progress row. Acceptable
-- because the data is non-sensitive (question_id + correct/incorrect).

-- 1. Drop the FK to auth.users so client-generated anon UUIDs can be stored.
alter table user_progress drop constraint if exists user_progress_user_id_fkey;

-- 2. New columns expected by the app layer.
alter table user_progress
  add column if not exists attempts integer not null default 1,
  add column if not exists last_attempted_at timestamptz not null default now();

-- Backfill last_attempted_at from the existing answered_at column.
update user_progress
  set last_attempted_at = answered_at
  where answered_at is not null;

-- 3. Relaxed RLS for anonymous clients. Drop the auth-gated policies and
-- replace them with permissive ones that work for both anon and authenticated.
drop policy if exists "Users can read own progress" on user_progress;
drop policy if exists "Users can insert own progress" on user_progress;
drop policy if exists "Users can update own progress" on user_progress;

create policy "Anyone can read progress" on user_progress
  for select
  to anon, authenticated
  using (true);

create policy "Anyone can insert progress" on user_progress
  for insert
  to anon, authenticated
  with check (true);

create policy "Anyone can update progress" on user_progress
  for update
  to anon, authenticated
  using (true)
  with check (true);

create index if not exists idx_user_progress_last_attempted_at
  on user_progress(last_attempted_at);
