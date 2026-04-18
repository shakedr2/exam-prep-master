# Phase 2 — Progress Trust Layer: Audit

Status: Draft (Step 1 of Phase 2). Planning document only — no code changes.
Branch: `claude/phase2-progress-trust`.

This audit maps every place in the UI that displays progress, identifies where
those displays disagree, and proposes a single canonical source of truth to use
going forward. Implementation is Step 2 and waits for user review.

## 1. Current Progress Surfaces (inventory)

Bulleted inventory of every UI surface that renders progress, completion,
stats, or resume hints. Analysis/inconsistencies are deferred to §3.

### 1.1 Home (`/`) — track cards
- File: `src/pages/HomePage.tsx`
- Python track card (`TrackCard` with `progressPercent`)
  - Metric: `pythonPercent` — correct-answered Python questions ÷ total Python
    static questions, rounded to integer %.
  - Data source: `useProgress()` → `progress.answeredQuestions` (local or
    Supabase via facade) filtered by topic IDs in Python modules from
    `MODULES` (`src/data/modules.ts`) against static `questions` array
    (`src/data/questions.ts`).
- Python track card — module count
  - Metric: count of non-`comingSoon` modules where `track ==="python-fundamentals"`.
  - Data source: static `MODULES`.
- DevOps track card
  - Metric: module count only; NO progress bar rendered.
  - Data source: static `MODULES` filtered by `track === "devops"`.
- OOP track — computed but NOT rendered
  - `oopPercent` / `oopModuleCount` are calculated but no `<TrackCard>` for
    OOP exists in the JSX (dead data path).
- Hero "actions" strip
  - Metric: `totalCorrect`, `totalAnswered` (global, across ALL tracks).
  - Data source: `useProgress()` totals.

### 1.2 Python Fundamentals track page (`/dashboard`)
- File: `src/pages/DashboardPage.tsx`
- Top-right badges: `XpBadge` (XP + level), `StreakBadge` (current + longest).
  - Data source: `useGamification()` + `useDashboardStats()` (Supabase
    `dashboard_stats` RPC) for authed users; zeros for guests.
- 3-stat grid (when `hasPracticed`): `totalCorrect`, `totalAnswered`,
  `currentStreak` / last-active label.
  - Data source: `useDashboardStats()` / `useGamification()` for authed;
    zeros for guests.
- Last exam score chip on exam CTA.
  - Data source: `useProgress().progress.examHistory` (localStorage only).
- Module list (`TrackModuleList`, Python only).
  - See §1.5 for metrics rendered inside.

### 1.3 Python OOP track page (`/tracks/python-oop`)
- File: `src/pages/OopTrackPage.tsx`
- Hero banner "Overall completion" bar + %.
  - Metric: `overallCompletion` = average of per-topic `getTopicCompletion`
    across all topic IDs in OOP modules.
  - Data source: `useProgress().getTopicCompletion` + `useDashboardData().questionCounts`.
- Module count label (`{modules.length} מודולים`).
- Module list (`TrackModuleList`).

### 1.4 DevOps track page (`/tracks/devops`)
- File: `src/pages/DevOpsTrackPage.tsx`
- Hero banner "Overall completion" bar + %. Same shape as OOP track.
  - Data source: identical to §1.3 but filtered to `track === "devops"`.
- Module count label.
- Module list (`TrackModuleList`).

### 1.5 Module / topic list (all track pages)
- File: `src/components/TrackModuleList.tsx`
- Per-module accordion header:
  - Metric: `moduleCompletion` = average of per-topic completion within the
    module (rounded, capped at 100).
  - Data source: `getTopicCompletion(slug, max(remoteCount, staticCount))`.
- Per-module question count implied by topic cards inside the accordion.
- Per-topic card (`TopicCard`):
  - `{questionCount} שאלות` label — `max(remote_from_RPC, static_from_questions.ts)`.
  - `{conceptsLearned}/{totalConcepts} מושגים` badge — `learnMap[topicId]`
    length vs. tutorial concept count.
  - Progress bar value = `completion` (from `getTopicCompletion`).
  - `{answeredCorrect} נפתרו נכון` — re-derived locally from
    `progress.answeredQuestions` filtered by static question IDs of topic.
  - `{completion}%` label next to progress bar.
  - CTA text depending on state ("שולט בנושא!", "המשך לתרגל (X/Y)",
    "המשך ללמוד (X/Y)", "התחל לתרגל", "התחל ללמוד", "נעול").
  - Unlocked / completed / locked visual state.
  - Data sources: `useProgress()`, `useDashboardData().learnMap`,
    `useTopicCompletion()`, static `questions`, `getTutorialByTopicId`.
- Coming-soon modules: "בקרוב" badge only.

### 1.6 Progress page (`/progress`)
- File: `src/pages/ProgressPage.tsx`
- 3-stat grid: `displayTotalAnswered`, `displayTotalCorrect`, `displayAccuracy%`.
  - Data source: `useSupabaseProgress()` (which internally prefers
    `useDashboardStats()` totals, falls back to direct `user_progress` query).
- Overall progress bar + `coveragePct` = correct ÷ total-question-count-summed-from-topicStats.
  - Data source: `useSupabaseProgress().topicStats` (sum of `totalQuestions`
    across Supabase `topics` rows) + `displayTotalCorrect`.
- Mastery-by-pattern cards (weak / in-progress / mastered).
  - Data source: `useWeakPatterns()` (Supabase `user_progress` joined to
    question pattern families).
- Per-topic cards (learned+practiced vs practiced-only):
  - Learn % = `conceptsLearned / totalConcepts` from `useAllLearningProgress()`.
  - Practice % = `answered / totalQuestions` per `topicStats` entry.
  - Accuracy % per topic.
  - Data source: `useSupabaseProgress().topicStats` + `useAllLearningProgress()`.
- "חזרה על N טעויות" button — count of incorrect questions.
  - Data source: `useProgress().getIncorrectQuestions()`.
- Exam history list (last 5).
  - Data source: `useProgress().progress.examHistory` (localStorage only).

### 1.7 Practice page (`/practice/:topicId`)
- File: `src/pages/PracticePage.tsx`
- Header progress bar (question `i/N` within session).
  - Data source: local session state (`currentIndex`, `effectiveQueue.length`).
- Resume-to-saved-index behavior (no visible UI, but affects which question
  appears first).
  - Data source: `progress.lastPosition?.[topicId]` (Supabase
    `user_profiles.last_question_index` for authed, localStorage for guests).
- Session correct-count, streak, attempts displayed in mastery banner /
  encouragement toasts.
  - Data source: local `useState` counters, not persisted progress.
- Global `totalCorrect` used for milestone claims.
  - Data source: `useProgress().totalCorrect`.

### 1.8 Learn page (`/learn/:topicId`)
- File: `src/pages/LearnPage.tsx`
- Concept progress bar (`completedConcepts.length / totalConcepts`).
  - Data source: `useLearningProgress(topicId)` — Supabase
    `user_learning_progress` merged with `learn_progress_<topicId>` in
    localStorage.
- Resume-to-first-incomplete-concept on mount.

### 1.9 Review mistakes (`/review-mistakes`)
- File: `src/pages/ReviewMistakes.tsx`
- Count of mistakes, per-topic filter counts, session progress bar.
  - Data source: `useProgress().getIncorrectQuestions`, `getAttempts`.

### 1.10 Exam mode (`/exam`)
- File: `src/pages/ExamMode.tsx`
- Per-attempt score, timer; writes `examHistory` via `useProgress`.
  - Data source: local session state + `useProgress().addExamResult`
    (localStorage only).

### 1.11 Navbar (global)
- File: `src/shared/components/Navbar.tsx`
- Shows username avatar/initial from `useProgress().progress.username`.
- Active-track pill (Python / DevOps) derived from current `pathname`; no
  progress numbers shown here.

### 1.12 Onboarding / auth-related
- File: `src/pages/OnboardingPage.tsx` — writes `username` via
  `useProgress().setUsername`. No progress display.
- File: `src/features/guest/lib/mergeProgress.ts` — one-shot guest→authed
  merge into `user_progress` on login. No UI, but relevant: guest writes
  reach the canonical table after sign-in.

## 2. Data Sources & Flow

### 2.1 Persistence layers

- Supabase table `public.user_progress`
  - Columns used: `user_id`, `question_id`, `topic_id`, `is_correct`,
    `attempts`, `answered_at`, `last_attempted_at`.
  - Writers: `useRemoteProgress.syncAnswer` (via RPC
    `upsert_user_progress`), `mergeGuestProgress` (direct insert),
    legacy `useSaveAnswer` / `useSubmitAnswer` paths.
  - Readers: `useRemoteProgress` (full rows for authed), `useSupabaseProgress`
    (direct read), `get_dashboard_stats` trigger aggregates, `useWeakPatterns`.
- Supabase table `public.user_profiles`
  - Columns: `id`, `username`, `last_topic_id`, `last_question_index`.
  - File: `supabase/migrations/20260411000001_user_profiles.sql`.
  - Writers: `useRemoteProgress.updateLastPosition`,
    `useRemoteProgress.setUsername`.
  - Readers: `useRemoteProgress` (used for `username`, `lastPosition`).
- Supabase table `public.dashboard_stats` (precomputed, trigger-populated)
  - Columns: `total_questions_answered`, `correct_answers`,
    `total_practice_time_seconds`, `current_streak`, `longest_streak`,
    `last_activity_at`.
  - File: `supabase/migrations/20260416000008_dashboard_stats.sql`.
  - Writers: SQL triggers on `user_progress` (SECURITY DEFINER); no direct
    client writes.
  - Readers: `useDashboardStats` via RPC `get_dashboard_stats`; consumed by
    `DashboardPage` and indirectly by `useSupabaseProgress` for totals.
- Supabase table `public.user_learning_progress`
  - Columns: `user_id`, `topic_id`, `concept_index`.
  - Writers: `useLearningProgress.markConceptComplete`.
  - Readers: `useLearningProgress` (per topic), `useAllLearningProgress`
    (all topics), `useDashboardData` (merged into `learnMap`).
- Supabase table `public.user_topic_completions`
  - Columns: `user_id`, `topic_id`.
  - Writers: `useTopicCompletion.markTopicComplete`.
  - Readers: `useTopicCompletion` → `isTopicComplete`, `isTopicUnlocked`.
- Supabase tables `public.user_xp`, `public.user_streaks`, `public.user_milestones`
  - Writers: RPCs `award_xp`, `touch_streak`, `claim_milestone`.
  - Readers: `useGamification` (initial load + after each action).
- Supabase tables `public.topics`, `public.questions`
  - Read-only from the client.
  - Readers: `useSupabaseTopics`, `useSupabaseQuestionsByTopic`,
    `useSupabaseAnsweredQuestions`, `useSupabaseProgress` (for topic metadata
    + question counts in progress page).
- localStorage (guest + cache)
  - `examprep_progress` — the whole `UserProgress` blob for guests
    (`useLocalProgress`).
  - `examprep_guest_merged` — one-shot flag set after `mergeGuestProgress`.
  - `learn_progress_<topicId>` — array of completed concept indices
    (`useLearningProgress`, mirrored by `useAllLearningProgress` and
    `useDashboardData`).
  - `guided_example_completed_<topicId>` — boolean flag
    (`useLearningProgress`).
  - `topic_quiz_passed_v1` — `{ [topicId]: true }` map
    (`useTopicCompletion`).
  - `practice_tip_dismissed` — UI flag only.
  - Stable anonymous UUID used as `user_id` for guest writes to
    `user_progress`, `user_learning_progress`, etc. (`src/lib/anonUserId.ts`).
- Static files
  - `src/data/questions.ts` — single source of truth for question content
    and topic slug. Used to compute static question counts and to resolve
    `question.topic` to the topic slug.
  - `src/data/modules.ts` — tracks, modules, `topicIds[]` (slug).
  - `src/data/topicTutorials.ts` — tutorials + `SLUG_TO_UUID` /
    `UUID_TO_SLUG` maps via `resolveTopicId`.

### 2.2 Hooks and services

- `useProgress` — `src/hooks/useProgress.ts`
  - Facade that returns `useLocalProgress` for guests and `useRemoteProgress`
    for authed users, with a few merged fields (`examHistory`, `badges`
    always from local). Exposes: `progress`, `answerQuestion`,
    `addExamResult`, `updateLastPosition`, `getTopicCompletion`,
    `getIncorrectQuestions`, `getIncorrectByTopic`, `getWeakTopics`,
    `getAttempts`, `getTopicPosition`, `totalCorrect`, `totalAnswered`.
  - Readers: HomePage, DashboardPage, OopTrackPage, DevOpsTrackPage,
    TrackModuleList, TopicCard, PracticePage, ProgressPage, ReviewMistakes,
    ExamMode, Navbar, OnboardingPage, AuthGuard tests.
- `useLocalProgress` — `src/features/progress/hooks/useLocalProgress.ts`
  - Reads / writes `examprep_progress` in localStorage. Computes `xp`,
    `level`, `streak`, `answeredQuestions`, `totalCorrect`, `totalAnswered`,
    `getTopicCompletion` (against `src/data/questions.ts`).
- `useRemoteProgress` — `src/features/progress/hooks/useRemoteProgress.ts`
  - React Query: `user_progress` rows, `user_profiles` row.
  - Mutations: `syncAnswer` (RPC `upsert_user_progress`),
    `updateLastPosition`, `setUsername`.
  - Derives `answeredQuestions`, `xp` (from `totalCorrect`), `level`,
    `lastPosition` (only the single `last_topic_id` pair),
    `getTopicCompletion` (filters `user_progress` rows by `topic_id`).
- `useDashboardData` — `src/hooks/useDashboardData.ts`
  - Calls RPC `get_dashboard_data(userId_or_anonUuid)` → returns
    `{ learning, topic_counts }`. Merges with localStorage
    `learn_progress_*`. Exposes `learnMap`, `questionCounts`.
  - Readers: DashboardPage, OopTrackPage, DevOpsTrackPage, TrackModuleList.
- `useDashboardStats` — `src/hooks/useDashboardStats.ts`
  - Calls RPC `get_dashboard_stats(userId)` (authed only). Returns
    `total_questions_answered`, `correct_answers`,
    `total_practice_time_seconds`, `current_streak`, `longest_streak`,
    `last_activity_at`.
  - Readers: DashboardPage (primary stats), `useSupabaseProgress` (prefers
    these totals over direct `user_progress` sum).
- `useSupabaseProgress` — `src/hooks/useSupabaseProgress.ts`
  - Direct query: `user_progress`, `topics`, `questions` — computes
    `topicStats` (per-topic `answered`, `correct`, `accuracy`, `totalQuestions`).
    Totals come from `useDashboardStats` when available, else from direct
    query.
  - Readers: ProgressPage.
- `useTopicCompletion` — `src/hooks/useTopicCompletion.ts`
  - Reads / writes `user_topic_completions` + localStorage
    `topic_quiz_passed_v1`. Exposes `isTopicComplete`, `isTopicUnlocked`
    (sequential gating against hard-coded `SYLLABUS_ORDER`).
  - Readers: DashboardPage, OopTrackPage, DevOpsTrackPage, TrackModuleList,
    PracticePage.
- `useLearningProgress(topicId)` — `src/hooks/useLearningProgress.ts`
  - Reads / writes `user_learning_progress` + localStorage
    `learn_progress_<topicId>` + `guided_example_completed_<topicId>`.
  - Readers: LearnPage.
- `useAllLearningProgress` — `src/hooks/useAllLearningProgress.ts`
  - Fetches every `user_learning_progress` row for current user (or
    anon UUID) and merges with localStorage keys. Exposes `learnMap`.
  - Readers: ProgressPage.
- `useGamification` — `src/features/gamification/hooks/useGamification.ts`
  - Reads `user_xp`, `user_streaks`, `user_milestones`. Writes via RPCs.
  - Readers: DashboardPage, PracticePage (awards XP + claims milestones).
- `useWeakPatterns` — `src/hooks/useWeakPatterns.ts`
  - Aggregates `user_progress` rows by question `pattern_family`. Used by
    ProgressPage and PracticePage.
- `useSupabaseAnsweredQuestions`, `useSupabaseQuestionsByTopic`,
  `useSupabaseQuestionCount`, `useSupabaseTopics`
  - Topic / question lookups used by PracticePage and TrackModuleList.
- `useSaveAnswer` — `src/hooks/useSaveAnswer.ts`
  - Additional write path into `user_progress` used by PracticePage alongside
    `useProgress().answerQuestion` (see §2.3 flow note).
- `useLocalProgressMigration` — `src/hooks/useLocalProgressMigration.ts`
  - One-shot upload of legacy `examprep_progress` entries to Supabase on
    first render of PracticePage for authed users.
- `mergeGuestProgress` — `src/features/guest/lib/mergeProgress.ts`
  - One-shot merge of the guest `examprep_progress` blob into
    `user_progress` on first sign-in.

### 2.3 Data flow

Write paths (user answers a question):
- Practice page calls:
  1. `useProgress().answerQuestion(questionId, topicId, correct)`
     → facade routes to `useRemoteProgress.syncAnswer` (RPC
     `upsert_user_progress`) for authed, or `useLocalProgress.answerQuestion`
     (localStorage) for guests.
  2. `useSaveAnswer().saveAnswer(...)` — additional write into
     `user_progress` / `curriculum_question_attempts`.
  3. `useProgress().updateLastPosition(topicId, nextIdx)` — writes
     `user_profiles.last_topic_id` + `last_question_index` (authed) and
     `lastPosition` map in localStorage.
  4. `useGamification().awardXp(...)` + `claimMilestone(...)` on correct
     answers.
- SQL trigger on `user_progress` rolls each insert/update into
  `dashboard_stats` (counts, streak, last activity).
- Exam completion: `useProgress().addExamResult(score, total)` writes to
  localStorage only (no Supabase table for exams yet).

Read paths (user opens a page):
- Home → `useProgress()` → filters local or remote `answeredQuestions` by
  static Python topic IDs → percent.
- Dashboard → `useDashboardStats()` for totals/streaks; `useProgress()` for
  `examHistory` and `getTopicCompletion`; `useDashboardData()` for
  `learnMap` + `questionCounts`; `useSupabaseTopics()` for topic metadata;
  `useTopicCompletion()` for gating.
- Track pages (OOP, DevOps) → same hook set as Dashboard, but re-derive
  "Overall completion" as the unweighted average of
  `getTopicCompletion(slug, questionCounts[...])` across the track's topic
  slugs.
- TrackModuleList → re-derives per-module average from the same
  `getTopicCompletion` and picks the larger of remote / static question
  counts per topic.
- Progress page → `useSupabaseProgress()` (with precomputed totals via
  `useDashboardStats()`) + `useWeakPatterns()` + `useAllLearningProgress()`
  + `useProgress().getIncorrectQuestions()` + `useProgress().progress.examHistory`.
- Practice page → `useProgress().progress.lastPosition[topicId]` decides the
  resume index; adaptive queue rebuilt from `useSupabaseAnsweredQuestions`
  (authed) or `progress.answeredQuestions` (guest) plus in-memory session
  answers.
- Learn page → `useLearningProgress(topicId)` seeds `currentIndex` to the
  first incomplete concept.

Notable flow observations (neutral, no judgment):
- The same logical fact ("how many correct Python answers does this user
  have?") can be computed by at least four different code paths:
  `useLocalProgress.totalCorrect`, `useRemoteProgress.totalCorrect`,
  `useDashboardStats.correctAnswers`, and per-topic sums from
  `useSupabaseProgress.topicStats`.
- "Last position" is stored in two different shapes: a single
  `(last_topic_id, last_question_index)` pair on `user_profiles` and a
  per-topic map `lastPosition[topicId]` in localStorage. The remote hook
  only surfaces the most recent pair.
- Guest writes use a stable anon UUID and actually reach Supabase tables
  (`user_progress`, `user_learning_progress`), so the "guest vs authed"
  split is not purely local vs remote — guests also have remote rows.

## 3. Inconsistencies Found

TBD — concrete cases where home, track page, module view, and progress page
can show different numbers for the same underlying data.

## 4. DevOps Practice Question Count Issue

TBD — deferred to Phase 3. Document the symptom and why it is out of scope
for this phase so we don't accidentally fix it here.

## 5. Proposed Single Source of Truth

TBD — which hook/service should become canonical and why, plus a short API
sketch (no implementation) for `useTrackProgress` / `useModuleProgress` /
`useTopicProgress` / resume helpers.

## 6. Migration Plan (Phase 2 steps)

TBD — ordered, reversible steps to adopt the canonical source across every
surface without breaking current behavior.

## 7. Risks & Rollback

TBD — what could regress, how we detect it, and how we roll back per step.
