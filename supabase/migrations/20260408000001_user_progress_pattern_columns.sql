-- Sprint 3.4: Add pattern_family and common_mistake to user_progress.
-- These are copied from the answered question so the adaptive algorithm can
-- aggregate mistake patterns per user without joining to the questions table.

ALTER TABLE user_progress
  ADD COLUMN IF NOT EXISTS pattern_family text,
  ADD COLUMN IF NOT EXISTS common_mistake text;

-- Index to speed up per-user pattern aggregation queries.
CREATE INDEX IF NOT EXISTS idx_user_progress_pattern_family
  ON user_progress(user_id, pattern_family)
  WHERE pattern_family IS NOT NULL;
