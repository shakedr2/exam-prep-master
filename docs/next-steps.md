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

## Step 6 — Write AI tutor contract *(in progress — handled separately)*
Spec document defining:
- Input context the tutor receives
- Tutoring mode
- Hint ladder
- Attempt checking
- When full answers are allowed
- Hebrew response behavior
- Handling of course-specific vs general concept questions

The tutor is a learning assistant, not a shortcut answer bot.

## Step 7 — Prepare personalized learning foundation *(in progress — see `docs/personalized-learning-spec.md`)*
Minimal adaptive next-question selection that considers:
- Topic mastery
- Repeated mistakes
- `pattern_family`
- `common_mistake`
- Warm-up vs reinforcement vs challenge

Foundation only — do not overbuild.

---

### Hard rules across all steps
- No giant rewrites
- No scope creep
- No unrestricted AI generation
- No immediate-answer chat behavior by default
- No English in learner content
- No skipping verification
