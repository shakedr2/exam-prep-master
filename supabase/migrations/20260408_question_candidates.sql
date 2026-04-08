-- Sprint 3.3: staging table for AI-generated question candidates.
-- Candidates land here in `pending_review` status; the reviewer changes the
-- status to `approved` or `rejected` before any row is promoted into
-- `questions` via scripts/approve-candidates.sql. Nothing in this table is
-- shown to learners.

create table if not exists question_candidates (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references topics(id) on delete cascade,
  question_type text not null check (question_type in ('multiple_choice','tracing','fill_blank','coding')),
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  pattern_family text,
  text text not null,
  code_snippet text,
  expected_output text,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  correct_answer char(1) check (correct_answer in ('a','b','c','d')),
  explanation text,
  common_mistake text,
  source_type text,
  source_ref text,
  status text not null default 'pending_review' check (status in ('pending_review','approved','rejected')),
  generated_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewer_notes text,
  is_generated boolean not null default true
);

create index if not exists idx_question_candidates_status on question_candidates(status);
create index if not exists idx_question_candidates_topic on question_candidates(topic_id);
create index if not exists idx_question_candidates_generated_at on question_candidates(generated_at);

-- RLS: candidates are non-sensitive review-stage data. Reads are open to
-- everyone (so the future review UI can fetch the queue without auth).
-- Writes are restricted to authenticated users only. The edge function
-- runs with the service role, which bypasses RLS.
alter table question_candidates enable row level security;

create policy "Anyone can read candidates" on question_candidates
  for select
  to anon, authenticated
  using (true);

create policy "Authenticated can insert candidates" on question_candidates
  for insert
  to authenticated
  with check (true);

create policy "Authenticated can update candidates" on question_candidates
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete candidates" on question_candidates
  for delete
  to authenticated
  using (true);
