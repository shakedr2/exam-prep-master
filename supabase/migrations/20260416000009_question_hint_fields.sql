-- ============================================================
-- Precomputed Hebrew hint/explanation fields on questions
--
-- Why: Today every hint/explanation request hits an OpenAI call at
--      question render time. That is slow, costs money, and breaks
--      offline / cold-start UX. Move the static help content onto the
--      question row itself so the client can render it instantly.
--
-- Scope (P0): add columns only. Backfill is handled in a follow-up
--      content-seeding migration so this stays small and reversible.
--
-- Locale: Hebrew is current launch language (see CLAUDE.md i18n rules).
--         The `_he` suffix keeps room for `_en` (+ any future locale)
--         without a schema rename. English fields are intentionally not
--         added yet — do not speculate schema.
--
-- Kept as live API: the chat assistant (interactive Q&A) remains the
--      only API-backed AI surface. These three fields replace the
--      pre-rendered hint/explanation endpoints only.
-- ============================================================

alter table questions
  add column if not exists general_hint_he        text,
  add column if not exists specific_hint_he       text,
  add column if not exists detailed_explanation_he text;

comment on column questions.general_hint_he is
  'Short, topic-level nudge shown before specific hint. Hebrew. No spoilers.';
comment on column questions.specific_hint_he is
  'Question-specific hint that points at the key step. Hebrew. Partial spoilers OK.';
comment on column questions.detailed_explanation_he is
  'Full worked-solution explanation shown after the user answers. Hebrew. Full spoilers.';
