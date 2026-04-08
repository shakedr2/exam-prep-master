-- Sprint 3.3: promote approved AI-generated candidates into the live
-- questions table. Idempotent: rows already promoted (status changes to
-- 'approved' + reviewed_at set) won't be inserted twice because we filter
-- by status and use a NOT EXISTS guard against the destination text.
--
-- Workflow:
--   1. The Gemini edge function inserts rows into question_candidates
--      with status='pending_review'.
--   2. A reviewer reads each row, edits if needed, and updates the row:
--          update question_candidates
--             set status='approved', reviewer_notes='...'
--           where id = '<id>';
--      (or 'rejected' for ones that should be dropped).
--   3. Run this script. Approved rows are copied into questions and
--      marked with reviewed_at = now(); the original candidate row is
--      kept for audit.
--
-- Run with: supabase db query --file scripts/approve-candidates.sql --linked

BEGIN;

-- Promote approved candidates that haven't been copied yet.
INSERT INTO questions (
  topic_id, question_type, difficulty, pattern_family,
  text, code_snippet, expected_output,
  option_a, option_b, option_c, option_d, correct_answer,
  explanation, common_mistake, is_generated
)
SELECT
  c.topic_id, c.question_type, c.difficulty, c.pattern_family,
  c.text, c.code_snippet, c.expected_output,
  coalesce(c.option_a, ''), coalesce(c.option_b, ''),
  coalesce(c.option_c, ''), coalesce(c.option_d, ''),
  coalesce(c.correct_answer, 'a'),
  c.explanation, c.common_mistake, true
FROM question_candidates c
WHERE c.status = 'approved'
  AND c.reviewed_at IS NULL;

-- Stamp reviewed_at on the rows we just promoted so subsequent runs
-- skip them.
UPDATE question_candidates
   SET reviewed_at = now()
 WHERE status = 'approved'
   AND reviewed_at IS NULL;

COMMIT;

-- Quick sanity counts:
-- SELECT count(*) FROM question_candidates WHERE status = 'pending_review';
-- SELECT count(*) FROM question_candidates WHERE status = 'approved';
-- SELECT count(*) FROM questions;
