-- Multi-topic tutor system (Phase 10.3) — per-lesson completion tracking.
--
-- The existing `user_topic_completions` table tracks whole-topic mastery
-- (a topic is "complete" once the learner scores ≥80% on its mini-quiz).
-- This new `topic_progress` table is finer-grained: one row per lesson that
-- a learner has marked completed inside a multi-topic tutor page
-- (/topics/python, /topics/linux, …).
--
-- A lesson here is identified by two string ids that live in application
-- code (`src/features/curriculum/topics/*.ts`), NOT as foreign keys into
-- another Supabase table. This keeps content authoring in code while the
-- table stays small and indexable.

CREATE TABLE IF NOT EXISTS topic_progress (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_id text NOT NULL,
  module_id text NOT NULL,
  lesson_id text NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, topic_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_topic_progress_user_topic
  ON topic_progress(user_id, topic_id);

CREATE INDEX IF NOT EXISTS idx_topic_progress_user
  ON topic_progress(user_id);

-- Row-level security: each user can read and write only their own rows.
-- Unlike `user_topic_completions` (which supports anonymous string ids),
-- this table is authenticated-only so we can tie it to auth.uid() directly.
ALTER TABLE topic_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "topic_progress_select_own" ON topic_progress;
CREATE POLICY "topic_progress_select_own"
  ON topic_progress
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "topic_progress_insert_own" ON topic_progress;
CREATE POLICY "topic_progress_insert_own"
  ON topic_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "topic_progress_update_own" ON topic_progress;
CREATE POLICY "topic_progress_update_own"
  ON topic_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "topic_progress_delete_own" ON topic_progress;
CREATE POLICY "topic_progress_delete_own"
  ON topic_progress
  FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE topic_progress IS
  'Per-lesson completion for the multi-topic tutor system. topic_id / module_id / lesson_id are application-level ids defined in src/features/curriculum.';
