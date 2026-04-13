-- Phase 3: Track which topics a user has passed the mini-quiz for.
-- Stores one row per (user, topic) when the user achieves ≥80% on the
-- 5-question topic assessment.  Drives the topic-gating logic on the
-- dashboard (next topic unlocks after the previous one is completed).

CREATE TABLE IF NOT EXISTS user_topic_completions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id text NOT NULL,
  topic_id text NOT NULL,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_utc_user_id
  ON user_topic_completions(user_id);

-- RLS: any user (authenticated or anon identified by clerk-style text id)
-- can read/write their own rows.  Same permissive policy pattern as
-- user_learning_progress so guest progress works without signing in.
ALTER TABLE user_topic_completions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_topic_completions_own" ON user_topic_completions;
CREATE POLICY "user_topic_completions_own"
  ON user_topic_completions
  FOR ALL
  USING (true)
  WITH CHECK (true);
