# Curriculum Domain Model

## Overview

ExamPrep Master is evolving from a single-course Hebrew Python exam-prep tool into a
**structured multilingual technical learning platform**.

This document defines the canonical domain model that backs the curriculum:

```
Track > Phase > Module > Lesson > Practice > Quiz
```

---

## Entity Definitions

### Track

The top-level learning path that a learner enrols in.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `slug` | text | Machine-readable key, e.g. `devops-engineer` |
| `content_id` | text | Stable i18n key, e.g. `track.devops-engineer` |
| `name` | text | Display name |
| `description` | text | Short summary |
| `default_locale` | text | Default locale for content (`he`, `en`, …) |

**Example:** DevOps Engineer

---

### Phase

A cluster of related Modules inside a Track, completed sequentially.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `track_id` | UUID | FK → curriculum_tracks |
| `order` | int | 1-based position within the Track |
| `slug` | text | e.g. `python-fundamentals` |
| `content_id` | text | Stable i18n key |
| `name` | text | Display name |
| `description` | text | Short summary |

**Example:** Python Fundamentals (Phase 1), Linux & Bash (Phase 2)

---

### Module

A self-contained learning unit inside a Phase. Maps 1:many to the existing `topics` table
during the transition period.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `phase_id` | UUID | FK → curriculum_phases |
| `order` | int | 1-based position within the Phase |
| `slug` | text | e.g. `variables-io` |
| `content_id` | text | Stable i18n key |
| `name` | text | Display name |
| `description` | text | Short summary |
| `icon` | text | Emoji icon |
| `topic_ids` | uuid[] | Legacy topic UUIDs (transition mapping) |

**Example:** Variables & IO, File Permissions

---

### Lesson

Teaching content for a Module: rich text body + code examples.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `module_id` | UUID | FK → curriculum_modules |
| `order` | int | 1-based position within the Module |
| `content_id` | text | Stable i18n key |
| `title` | text | Lesson title |
| `body` | text | Markdown/rich-text content |

---

### Concept

A discrete knowledge item inside a Module (e.g. "for loop syntax", "list indexing").
Concepts are the granular building blocks that questions test.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `module_id` | UUID | FK → curriculum_modules |
| `lesson_id` | UUID? | Optional FK → curriculum_lessons |
| `content_id` | text | Stable i18n key |
| `name` | text | Concept name |
| `description` | text | Short description |

---

### Practice

An ungraded exercise session referencing questions from the existing `questions` table.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `module_id` | UUID | FK → curriculum_modules |
| `content_id` | text | Stable i18n key |
| `title` | text | Practice title |
| `description` | text | Short description |
| `question_ids` | uuid[] | Ordered list of question IDs |

---

### Quiz

A graded assessment for a Module with a passing score threshold.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `module_id` | UUID | FK → curriculum_modules |
| `content_id` | text | Stable i18n key |
| `title` | text | Quiz title |
| `description` | text | Short description |
| `question_ids` | uuid[] | Ordered list of question IDs |
| `passing_score` | int | Minimum % to pass (0-100, default 70) |
| `time_limit_minutes` | int? | Time limit; NULL = no limit |

---

### QuestionAttempt

Records a learner's answer to a single question within a Practice or Quiz session.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → auth.users |
| `question_id` | UUID | FK → questions |
| `module_id` | UUID | FK → curriculum_modules |
| `session_type` | text | `practice` or `quiz` |
| `session_id` | UUID | ID of the Practice or Quiz |
| `is_correct` | bool | Whether the answer was correct |
| `submitted_answer` | text | The exact answer submitted |
| `answered_at` | timestamptz | Timestamp |

---

### TrackEnrolment

Records that a user has enrolled in a Track.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → auth.users |
| `track_id` | UUID | FK → curriculum_tracks |
| `enrolled_at` | timestamptz | When the user enrolled |
| `last_active_at` | timestamptz | Last activity timestamp |

---

### ModuleProgress

Tracks a user's completion status for a Module.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → auth.users |
| `module_id` | UUID | FK → curriculum_modules |
| `lesson_completed` | bool | Lesson read/completed |
| `quiz_passed` | bool | Quiz passed |
| `best_quiz_score` | int? | Best quiz score (0-100) |
| `updated_at` | timestamptz | Last update |

---

## Entity Relationship Diagram (text)

```
auth.users
  |
  +-- curriculum_track_enrolments --> curriculum_tracks
  |                                       |
  |                                       +-- curriculum_phases (ordered)
  |                                               |
  |                                               +-- curriculum_modules (ordered)
  |                                                       |
  |       +-----------------------------------------------+
  |       |              |              |              |
  |  curriculum_    curriculum_    curriculum_    curriculum_
  |  lessons        concepts       practices      quizzes
  |       |
  +-- curriculum_module_progress --> curriculum_modules
  |
  +-- curriculum_question_attempts --> questions
                                   --> curriculum_modules
```

---

## Python Topics → Phase 1 Module Mapping

The existing 8 Python topics (seeded with fixed UUIDs in migration `20260403000004`)
map directly to Phase 1 modules as follows:

| # | Topic ID | Topic UUID (suffix) | Module slug | Module order |
|---|----------|---------------------|-------------|-------------|
| 1 | `variables_io` | `0001` | `variables-io` | 1 |
| 2 | `arithmetic` | `0002` | `arithmetic` | 2 |
| 3 | `conditions` | `0003` | `conditions` | 3 |
| 4 | `loops` | `0004` | `loops` | 4 |
| 5 | `functions` | `0005` | `functions` | 5 |
| 6 | `strings` | `0006` | `strings` | 6 |
| 7 | `lists` | `0007` | `lists` | 7 |
| 8 | `tuples_sets_dicts` | `0008` | `tuples-sets-dicts` | 8 |

> **Migration note:** The `topic_ids` column on `curriculum_modules` holds these UUIDs.
> The existing `topics` and `questions` tables are **not altered** — this is a forward-only
> scaffold. Future migrations will back-fill `module_id` on the `questions` table.

---

## DevOps Track A — Linux/Bash + Git Example

The same model accommodates the planned DevOps Engineer track:

```
Track: DevOps Engineer  (slug: devops-engineer)
│
├── Phase 1: Python Fundamentals  (order: 1)
│   └── [8 modules — see above]
│
├── Phase 2: Linux & Bash  (order: 2)
│   ├── Module 1: Filesystem & Navigation  (cd, ls, pwd, find)
│   ├── Module 2: File Operations  (cp, mv, rm, cat, less)
│   ├── Module 3: Permissions  (chmod, chown, umask)
│   ├── Module 4: Text Processing  (grep, sed, awk, cut)
│   ├── Module 5: Pipes & Redirects  (|, >, >>, 2>&1)
│   └── Module 6: Bash Scripting  (variables, if, loops, functions)
│
└── Phase 3: Git & Version Control  (order: 3)
    ├── Module 1: Git Basics  (init, clone, add, commit)
    ├── Module 2: Branching & Merging  (branch, checkout, merge, rebase)
    ├── Module 3: Remote Repos  (remote, push, pull, fetch)
    └── Module 4: Collaboration  (PR workflow, code review, tags)
```

Each Module follows the same `Lesson → Practice → Quiz` flow, and each Lesson/Practice/Quiz
entity uses a stable `content_id` that can carry translations.

---

## Multilingual / i18n Strategy

All content entities carry a **`content_id`** (e.g. `module.python.variables-io`).
Human-readable fields (name, description, body, …) are stored in two layers:

1. **Default locale** — stored directly on the entity row (Hebrew for existing content).
2. **Translations layer** — `curriculum_translations` table holds `(content_id, locale, fields jsonb)`.

### Rules

- Hebrew (`he`) is the current default locale.
- English (`en`) is the next expansion target.
- RTL/LTR is determined by locale, not hard-coded.
- Do **NOT** refactor existing Hebrew UI to i18n yet; apply only to new curriculum content.
- Every new content entity **must** have a stable `content_id` before being shipped.

### Translation lookup algorithm

```
1. Look up curriculum_translations WHERE content_id = ? AND locale = user_locale
2. If found → use translated fields
3. Else → fall back to default_locale fields on the entity row
```

---

## Migration Files

| File | Purpose |
|------|---------|
| `20260411000001_curriculum_domain_model.sql` | Creates all curriculum tables, indexes, RLS |
| `20260411000002_seed_curriculum_python_phase1.sql` | Seeds DevOps track + Phase 1 + 8 modules + Hebrew translations |

---

## TypeScript Types

All interfaces live in `src/types/curriculum.ts` and are re-exported from
`src/features/curriculum/index.ts`.

Key types: `Track`, `Phase`, `Module`, `Lesson`, `Concept`, `Practice`, `Quiz`,
`QuestionAttempt`, `TrackEnrolment`, `ModuleProgress`, `ContentTranslation`.

---

## What Is NOT Changed

- The existing `topics` and `questions` tables are untouched.
- No existing UI or functionality is altered.
- The `src/data/questions.ts` and `src/data/modules.ts` files are untouched.
- Data migration (back-filling `module_id` on questions) is a future task.
