# Next Steps — Approved Execution Order

This is the locked execution order for ExamPrep Master. Steps run **sequentially**. No step starts until the previous one is completed, verified, and reported. See `ROADMAP.md` for product direction.

## Step 1 — Lock roadmap into repo *(completed)*
- Commit `ROADMAP.md` and `docs/next-steps.md`.
- Deliverable: product direction and execution order are version-controlled.

## Step 2 — Finish topic normalization safely *(completed)*
- Audit frontend + data model for legacy topic IDs.
- Remap any legacy IDs to the official 8-topic taxonomy.
- Remove legacy aliases only after all questions are safely remapped.
- Verify: dashboard, all 8 practice routes, exam mode, progress page.
- No new lecturer-based content in this step.

## Step 3 — Design Supabase question schema *(completed)*
Implement a question schema (with migration if needed) supporting:
- `topic_id`
- `question_type`
- `prompt`
- `code_snippet`
- `choices`
- `correct_answer`
- `explanation`
- `difficulty`
- `source_type`
- `source_ref`
- `pattern_family`
- `common_mistake`
- `is_generated`

Document the schema in the repo.

## Step 4 — Build reviewed import pipeline *(completed)*
Minimum safe pipeline for lecturer-based questions:
1. Source extraction
2. Normalization
3. Review
4. Insertion

Small, reviewable scripts/utilities/docs only. No bulk imports yet.

## Step 5 — Add first reviewed content batch *(completed — 80 reviewed questions in Supabase, tutorials for all 8 topics)*
First real reviewed batch from lecturer materials. Priority order:
1. `strings`
2. `tuples_sets_dicts`
3. Small gap-fills in `functions` / `variables_io` if needed.

Every inserted question must have: Hebrew text, correct topic, type, answer, explanation, source metadata. No low-quality bulk dumps.

## Step 6 — Write AI tutor contract *(completed — see `docs/ai-tutor-spec.md`)*
Spec document defining:
- Input context the tutor receives
- Tutoring mode
- Hint ladder
- Attempt checking
- When full answers are allowed
- Hebrew response behavior
- Handling of course-specific vs general concept questions

The tutor is a learning assistant, not a shortcut answer bot.

## Step 7 — Prepare personalized learning foundation *(completed — see `docs/personalized-learning-spec.md`)*

## Integration *(completed)*
- `selectNextQuestion` wired into `PracticePage` to pick the first question per topic adaptively from the learner's progress.
- Hint ladder (`hintLevel` 1/2/3) wired end-to-end: `FloatingAIButton` → `ai-explain` edge function.
- Per-topic mastery shown on `ProgressPage` via `useSupabaseProgress` (`accuracy = correct / answered`) and local fallback via `getTopicCompletion`.

---

## Sprint 1 Summary *(complete — shipped to production)*

All 7 roadmap steps plus integration and UX polish landed. CI green, deployment live.

Merged PRs:
- #49 — Lock roadmap & execution order (Step 1)
- #50 — Topic normalization audit (Step 2)
- #51 — Supabase question schema + migrations (Step 3)
- #52 — Reviewed import pipeline (Step 4)
- #53 — Tutorials for all 8 topics + first reviewed content batch (Step 5)
- #54 — Roadmap merge to main
- #55 — AI tutor contract / hint-ladder spec + `ai-explain` hintLevel support (Step 6)
- #56 — Personalized learning foundation: `selectNextQuestion` (Step 7)
- #57 — Step 7 PR
- #58 — Integration: wire `selectNextQuestion` into `PracticePage`, finalize docs
- #59 — UX polish: weak-area summary, next-topic suggestion, dashboard improvements
- #60 — `ai-explain` parsing-error hotfix

Sprint 1 deliverables:
- 8-topic canonical taxonomy, stable routes
- 80 reviewed Supabase questions, tutorials for all 8 topics
- AI tutor hint ladder wired end-to-end (`hintLevel` 1/2/3)
- Adaptive next-question selection wired into practice flow
- Per-topic mastery on progress page
- End-of-topic weak-area summary + next-topic suggestion

---

## Sprint 2 — Priorities *(complete — shipped to production)*

### 1. Grow reviewed question bank to 150+ *(completed — PR #61)*
- 80 reviewed questions from Sprint 1 + 72 new reviewed Hebrew questions landed via the batch2 migration.
- All questions keep Hebrew text, source metadata, `pattern_family`, `common_mistake`.
- Bank total: **152**.

### 2. AI tutor with Gemini API *(completed — PR #62)*
- `supabase/functions/ai-explain` calls Gemini as the primary provider and falls back to OpenAI on any error (including 429 rate limits).
- Hint-ladder contract preserved (`hintLevel` 1/2/3); frontend untouched.
- Hebrew-only responses, grounded prompts.
- See `docs/operations.md` for `GEMINI_API_KEY` / `OPENAI_API_KEY` secret setup.

### 3. Exam simulation improvements *(completed — PRs #63, #64)*
- 6 questions, 110 points, 3 hours, mix of tracing/coding/MCQ/fill-blank.
- In-exam navigation between questions, flag-for-review, and per-question time awareness.
- Post-exam review with per-question explanation and mistake tagging feeding `useProgress`.

### 4. Mobile polish *(completed — PR #67)*
- Dashboard, practice and exam mode audited on small viewports.
- Tap-target sizing, sticky action bars, keyboard handling for coding questions.
- `FloatingAIButton` placement verified against answer controls on mobile.

---

## Sprint 3 — Persistence, docs, and adaptive polish

### 3.1 Persist learner progress to Supabase *(completed — PR #69, issue #68)*
- Anonymous stable UUID in `localStorage.anon_user_id` feeds `user_progress.user_id`.
- `useSaveAnswer` reads the current `attempts` count and upserts an incremented value; offline fallback queue in `examprep_pending_answers`.
- `useSupabaseProgress` works for anonymous learners via the same id.
- New `useSupabaseAnsweredQuestions` feeds the `selectNextQuestion` adaptive selector with cross-device history.
- One-time `useLocalProgressMigration` copies the legacy `examprep_progress` blob into Supabase.
- Migration: `supabase/migrations/20260408_anon_user_progress.sql` drops the `auth.users` FK, adds `attempts` + `last_attempted_at`, relaxes RLS.

### 3.2 Docs update + progress-count bug fix *(this issue — #70)*
- Fix `ProgressPage` total-question count: read from Supabase `topicStats` instead of the static `questions.length` (showed `52 / 125` vs. the dashboard's `152`).
- Mark Sprint 2 items 1–4 as completed with PR refs.
- Add Sprint 3 plan to this document.
- Verify Supabase progress persistence works end-to-end after #69.

### 3.3 Grow question bank to 200+ with Gemini candidate pipeline *(planned)*
- Add ~50 more reviewed questions via the pipeline in `docs/operations.md`.
- Gemini produces candidates grounded in lecturer materials only; every candidate goes through the reviewed import flow before insertion.
- Target gaps: `loops`, `conditions`, `functions`, `tuples_sets_dicts`.
- Acceptance: bank ≥ 200, `pattern_family` + `common_mistake` populated.

### 3.4 Enhanced adaptive learning *(planned)*
- Use `pattern_family` / `common_mistake` signals in `selectNextQuestion` scoring so learners see more questions that hit their weak patterns.
- Track per-pattern mastery and surface it on the progress page.
- Foundation for the future spaced-repetition layer — still no SRS in this step.

### Hard rules still apply
- No English in learner content
- No unrestricted AI generation into production
- No scope creep, no giant rewrites
