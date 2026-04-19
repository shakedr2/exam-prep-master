# Questions — Canonical Source of Truth

> Phase 3 deliverable (Epic #298). Reconciles `src/data/questions.ts` (static) and the Supabase `questions` table across Python, OOP, and DevOps tracks.
> Last updated: 2026-04-19

## TL;DR

| Track                 | Canonical source | Status     | Practice uses        |
| --------------------- | ---------------- | ---------- | -------------------- |
| Python Fundamentals   | **Supabase**     | Canonical  | Supabase (by UUID)   |
| Python OOP            | **Supabase**     | Canonical  | Supabase (by UUID)   |
| DevOps Engineer       | **Supabase**     | Canonical  | Supabase (by UUID)   |

- `PracticePage` (`src/pages/PracticePage.tsx:118`) calls `useSupabaseQuestionsByTopic(topicId)` — **all three tracks** serve practice questions exclusively from the Supabase `questions` table. Supabase is therefore the de-facto canonical source for every track.
- `src/data/questions.ts` is retained for:
  1. TypeScript types (`Question`, `QuestionType`, `TopicId`, `Difficulty`) shared across the UI.
  2. Progress-denominator fallback via `max(remote, static)` (see [Known inconsistency](#known-inconsistency--python-over-count)).
  3. Review-mistakes lookup by question ID in `useLocalProgress.ts` / `useRemoteProgress.ts` (legacy locally-answered questions only).
- No surface serves static questions to the live Practice flow.

## Audit — question counts by track and topic

Counts taken on 2026-04-19 from the checked-in source files. Supabase counts are computed from the `INSERT INTO questions` statements across `supabase/migrations/` (idempotent seeds deduped on `ON CONFLICT DO NOTHING`).

### Python Fundamentals

Topic UUID prefix: `11111111-0001..0008-0000-0000-000000000000`.

| Module                  | Topic ID            | Supabase seeded | Static (`questions.ts`) |
| ----------------------- | ------------------- | --------------: | ----------------------: |
| Getting Started         | `variables_io`      | 19              | 0                       |
| Getting Started         | `arithmetic`        | 19              | 0                       |
| Control Flow            | `conditions`        | 19              | 25                      |
| Control Flow            | `loops`             | 19              | 30                      |
| Data Structures         | `strings`           | 19              | 0                       |
| Data Structures         | `lists`             | 19              | 23                      |
| Data Structures         | `tuples_sets_dicts` | 19              | 0                       |
| Functions               | `functions`         | 19              | 0                       |
| Code Tracing (legacy)   | `tracing`           | 0               | 24                      |
| Code Tracing (legacy)   | `math`              | 0               | 23                      |
| Files & Exceptions      | `files_exceptions`  | 0               | 0                       |

Seed migrations:
- `20260403000004_seed_python_exam_questions.sql` — 1 per topic × 8 topics = 8
- `20260403000005_seed_questions_batch2.sql` — 4 per topic × 8 = 32
- `20260405000006_seed_questions_batch3.sql` — 5 per topic × 8 = 40
- `20260407_add_questions_batch2.sql` — 9 per topic × 8 = 72
- Grand total: **152** Python fundamentals questions in Supabase (19 per topic).

**Legacy `tracing` / `math` topics**: still present in `src/data/questions.ts` and referenced by `MODULES[4]` (`code_tracing`). They have no UUID in `SLUG_TO_UUID` and no Supabase rows; Practice cannot serve them. The static catalog is the only source that exposes these questions, and they remain reachable only through the progress-denominator fallback, not through a Practice session. Slated for remap/removal in Phase 5.

**`files_exceptions`**: declared as a topic in the OOP track migration (`20260416000001_oop_topics_and_phase2.sql`) but currently has 0 Supabase questions AND 0 static questions. Content for this module is owned by Phase 5.

### Python OOP

Topic UUID prefix: `11111111-0009..000d-0000-0000-000000000000`.

| Module                      | Topic ID              | Supabase seeded | Static (`questions.ts`) |
| --------------------------- | --------------------- | --------------: | ----------------------: |
| Classes & Objects           | `classes_objects`     | 16              | 5                       |
| Inheritance                 | `inheritance`         | 16              | 5                       |
| Polymorphism                | `polymorphism`        | 16              | 5                       |
| Files & Exceptions          | `files_exceptions`    | 16              | 0                       |
| Decorators & Special        | `decorators_special`  | 16              | 5                       |
| *(legacy umbrella slug)*    | `python_oop`          | 0               | 4 (via `python-oop.ts`) |

Seed migrations: `20260416000002..6_oop_questions_*.sql` — 16 questions × 5 modules = **80** OOP questions in Supabase.

`python_oop` is a legacy umbrella slug seeded only via `src/data/topicTutorials/python-oop.ts` (4 items spread across OOP concepts). It is not part of `modules.ts` topic lists; its content feeds tutorials, not practice.

### DevOps Engineer

Topic UUID prefix: `22222222-0001..0004-0000-0000-000000000000`.

| Module                   | Topic ID                  | Supabase seeded | Static (`questions.ts`) |
| ------------------------ | ------------------------- | --------------: | ----------------------: |
| Linux Basics             | `linux_basics`            | 10              | 5                       |
| File Permissions         | `file_permissions`        | 10              | 5                       |
| Bash Scripting           | `bash_scripting`          | 10              | 5                       |
| Networking Fundamentals  | `networking_fundamentals` | **0** → 5       | 5                       |

Seed migration: `20260416000001_seed_curriculum_linux_bash_phase2.sql` — 10 × 3 modules = **30** DevOps questions seeded through this migration.

`networking_fundamentals` has a slug↔UUID mapping declared in `src/data/topicTutorials.ts:1151` referencing `20260417000001_seed_networking_fundamentals.sql` — **that file does not exist**. The 5 static networking questions in `src/data/questions.ts` are never served by Practice because Practice uses the topic UUID, which has no rows.

This is the root cause of the count-slice of #242: the networking topic card reports 5 questions via the static-count fallback, but clicking Practice returns 0 questions from Supabase.

**Fix in this PR**: `supabase/migrations/20260419000001_seed_networking_fundamentals.sql` transcribes the 5 existing static networking questions into Supabase using the declared UUID. After the migration, counts and Practice are consistent (5 in card, 5 in Practice).

## Canonical-source policy (going forward)

1. **Practice content is Supabase-only.** `src/pages/PracticePage.tsx` and all question-rendering hooks read from `useSupabaseQuestionsByTopic`. Do not add a static fallback for Practice.
2. **New questions land in Supabase via a migration.** `supabase/migrations/<YYYYMMDDHHMMSS>_seed_*.sql`, idempotent (`ON CONFLICT DO NOTHING`) with fixed UUIDs. Never add new rows to `src/data/questions.ts`.
3. **Static `questions.ts` is frozen.** It retains types and the legacy progress-denominator fallback but does not accept new question content. Entries may be removed once the topic is fully covered by Supabase and any cleanup is unblocked by a passing test run.
4. **Slug↔UUID mapping is the contract.** Any new topic must be added to `SLUG_TO_UUID` in `src/data/topicTutorials.ts` AND have a matching Supabase migration on the same PR. Do not declare a UUID without seeding.

### Count-display policy

`TrackModuleList.getQuestionCount` currently returns `max(remoteCount, staticCount)`. This policy is kept for Phase 3 to avoid a cross-track behavior change. Rationale:

- For topics where Supabase is fully seeded and exceeds static (Python fundamentals non-legacy topics, all OOP, DevOps Linux/Bash/File-Perms), `max` returns the Supabase count — which matches Practice.
- For topics where Supabase is missing or partial, `max` falls back to the static catalog so progress denominators do not collapse to 0.
- After this PR, every module in every track satisfies `remote ≥ static`, so `max` degenerates to the Supabase count everywhere except the legacy `tracing`/`math` topics (which are out of Practice's reach anyway).

A future phase can drop the `max` policy in favor of strict Supabase-canonical counts once the legacy `tracing`/`math` static pool is remapped to `variables_io` / `arithmetic` Supabase rows.

## Known inconsistency — Python over-count

For the following Python Fundamentals topics, the track page currently reports a number HIGHER than what Practice serves:

| Topic        | Card shows (max) | Practice serves (Supabase) | Delta |
| ------------ | ---------------: | -------------------------: | ----: |
| `conditions` | 25               | 19                         | +6    |
| `loops`      | 30               | 19                         | +11   |
| `lists`      | 23               | 19                         | +4    |

This is a pre-existing inconsistency inherited from Phase 1 and is intentionally **out of scope for Phase 3**. It is NOT the DevOps count bug from #242. Options for a follow-up phase:

1. Migrate the excess static content to Supabase (additive — raises the Supabase count to match).
2. Prune the excess static content (subtractive — shrinks the display count to match Practice).
3. Flip `getQuestionCount` to strict-Supabase (`remoteCount || staticCount`), which silently drops the over-reported counts to the Supabase reality.

None of these are applied here; tracked in the roadmap's Phase 5 content-completion scope.

## Migration plan

Applied in this PR:

1. `supabase/migrations/20260419000001_seed_networking_fundamentals.sql` — seeds 5 networking questions using topic UUID `22222222-0004-0000-0000-000000000000`. Idempotent. Content transcribed verbatim from the static catalog; no new authoring.

Deferred to later phases:

- Remap legacy `tracing` / `math` static questions onto the `variables_io` / `arithmetic` topic UUIDs and re-seed (Phase 5).
- Resolve the Python over-count inconsistency once content authoring ownership is allocated (Phase 5).
- Remove the redundant static DevOps question blocks from `src/data/questions.ts` once regression tests cover review-mistakes lookups by ID (Phase 3 test slice, #163).

## References

- `docs/ROADMAP.md` — Phase 3 scope and Done means.
- Epic: #298.
- DevOps content epic: #242 (count slice closed here; content slice continues in Phase 5).
- Regression tests: #163.
