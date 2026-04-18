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

Each item lists: (a) surfaces involved, (b) symptom, (c) root cause hypothesis,
(d) severity.

### 3.1 Track percent: coverage formula vs. per-topic average
- (a) Home Python/OOP cards (`HomePage.tsx`) vs. OOP / DevOps track pages
  (`OopTrackPage.tsx`, `DevOpsTrackPage.tsx`).
- (b) For the same user, the home card % and the track-page "Overall
  completion" % can disagree (sometimes by several points, especially when
  topics have very different question counts).
- (c) Home computes `correctAnswers / totalQuestionsAcrossTrack` (a
  question-weighted coverage). Track pages compute the unweighted AVERAGE of
  per-topic completion. Small topics dominate the average on track pages.
- (d) High — this is the "home count != track page count" symptom the
  phase is explicitly targeting.

### 3.2 Module accordion percent vs. track-page percent
- (a) Track page hero bar vs. `ModuleSection` accordion header
  (`TrackModuleList.tsx`).
- (b) Average of module % rows does not equal the hero "Overall completion"
  in most cases.
- (c) Module % is an average over topics in one module; hero % is an average
  over all topics in the track. Averaging twice at different granularities
  does not commute.
- (d) Medium.

### 3.3 Topic card: `completion` bar vs. `{answeredCorrect} נפתרו נכון` label
- (a) `TopicCard` in `TrackModuleList.tsx`.
- (b) The percent and the raw count can visually contradict when Supabase
  has answered rows for a topic but those rows' `question_id` values aren't
  in the static `questions.ts` catalog (or vice versa).
- (c) `completion` goes through `useProgress().getTopicCompletion`, which
  for authed users reads Supabase `user_progress` rows by `topic_id` UUID;
  `answeredCorrect` is re-derived locally from `progress.answeredQuestions`
  filtered by static `question.id`. The two sets are keyed and filtered
  differently.
- (d) High — two numbers, same card, can disagree.

### 3.4 Topic card question count: `max(remote, static)` vs. denominator used for %
- (a) `TopicCard` / `ModuleSection` in `TrackModuleList.tsx`.
- (b) Displayed "`N שאלות`" can exceed the denominator used to compute the
  progress bar, producing odd ratios like "5 נפתרו נכון / 80%" with
  "20 שאלות".
- (c) Question count label uses `max(remote_count, static_count)`.
  `getTopicCompletion(topicId, totalQuestions)` is called with the same
  value, so the denominator is consistent on paper — BUT for authed users
  the numerator (`user_progress` rows with `is_correct`) is filtered by
  topic UUID while `STATIC_QUESTION_COUNTS` keys by slug. If Supabase has
  fewer static-equivalent rows than the slug filter expects, the two
  diverge.
- (d) Medium.

### 3.5 Progress page totals vs. Dashboard totals
- (a) Dashboard 3-stat grid vs. Progress page 3-stat grid.
- (b) Usually agree, but can drift immediately after a practice answer.
- (c) Both ultimately read `useDashboardStats` (precomputed
  `dashboard_stats` table), but `useSupabaseProgress` also fires its own
  read of `user_progress` with different invalidation semantics (it only
  `refetch`es on its own hook call; `dashboard_stats` is trigger-populated
  and separately cached in React Query). After a write, the two sources
  can be out of sync for one or two renders.
- (d) Medium.

### 3.6 Progress page "coverage %" vs. track page "Overall completion"
- (a) Progress page overall bar vs. OOP/DevOps track page hero bar.
- (b) Same user, different numbers.
- (c) Progress page coverage = `displayTotalCorrect / Σ topicStats.totalQuestions`
  across ALL Supabase topics (all tracks combined). Track page overall =
  average of per-topic completion for one track only. Different scopes AND
  different formulas.
- (d) High (user-visible cross-screen mismatch).

### 3.7 XP / level surfaces disagree
- (a) `XpBadge` in DashboardPage (`useGamification`) vs. `progress.xp` /
  `progress.level` from the `useProgress` facade (used in `ProgressPage`
  indirectly, and returned from `useLocalProgress` / `useRemoteProgress`).
- (b) Guest XP bumps locally via `useGamification` but `useLocalProgress`
  derives XP from `answeredQuestions` count; after answers both update, but
  XP awarded for non-question reasons (daily login, milestones) is only
  counted in `useGamification`. Authed `useRemoteProgress.xp` is
  `totalCorrect * XP_PER_CORRECT` and ignores `user_xp.xp` completely.
- (c) Two independent XP ledgers: Supabase `user_xp` (authoritative per
  `award_xp` RPC) and a derived `totalCorrect * 10` value in the progress
  facade.
- (d) Medium — not directly surfaced in the current UI, but will surface
  once any screen uses `progress.xp` alongside the `XpBadge`.

### 3.8 Streak surfaces disagree
- (a) `StreakBadge` (DashboardPage) vs. `progress.streak` (facade) vs.
  `dashboard_stats.current_streak`.
- (b) For authed users the facade already returns `streak: 0` by design
  (comment in `useProgress.ts`), while `StreakBadge` uses
  `useDashboardStats` / `useGamification`. Anywhere that still reads
  `progress.streak` (none in current tree, but the field is in the public
  type) would show 0 for authed users even when they have a real streak.
- (c) The facade was deliberately defanged to avoid leaking stale guest
  streak state across logins; but that leaves the public `UserProgress`
  type misleading.
- (d) Low (no consumer today), but a trap for the next caller.

### 3.9 Exam history is local-only
- (a) DashboardPage exam CTA "אחרון: X%"; ProgressPage exam history list.
- (b) On a second device / after browser storage clear, the user's exam
  history vanishes even if they're authenticated; the dashboard reverts to
  "no last exam", the progress page shows no history.
- (c) `useProgress().addExamResult` writes only to `examprep_progress` in
  localStorage. `useRemoteProgress.addExamResult` is a documented no-op
  (no `exam_results` table yet). The facade always exposes
  `local.progress.examHistory`.
- (d) Medium (trust: "I took an exam but the app forgot it").

### 3.10 Two "last position" representations
- (a) PracticePage resume behavior vs. any future "resume where I left off"
  affordance on home / track cards.
- (b) Supabase remembers only ONE last position per user
  (`user_profiles.last_topic_id` + `last_question_index`). localStorage
  remembers a per-topic map. After an authed user practices topic A then
  topic B, the remote profile forgets A's position; on another device the
  `lastPosition[A]` value is gone.
- (c) Schema shape mismatch — the server table is single-slot, the client
  shape is a map. The facade always returns an object keyed by topic, but
  only the most-recent topic's index is ever populated for authed users.
- (d) High for Phase 2 resume work — any "Continue learning X" UI that
  isn't the most-recent topic will silently default to question 0.

### 3.11 No "last-in-progress module" stored anywhere
- (a) Home track cards, track pages.
- (b) Clicking a track card goes to the track's landing page (/dashboard,
  /tracks/python-oop, /tracks/devops) which shows the first-expanded
  module by default — not the user's last active module.
- (c) The data model has `last_topic_id` but no `last_module_id` / `last_track_id`.
  No server-side or client-side computation of "which module is the user
  currently in the middle of?".
- (d) High — blocks reliable "Resume where I left off" per Phase 2 goal.

### 3.12 Guest progress visible vs. authed progress visible
- (a) All progress surfaces before and after sign-in.
- (b) A guest practices → numbers go up on home / progress. They sign in
  for the first time → some numbers drop briefly, then `mergeGuestProgress`
  uploads rows and numbers recover; some numbers (exam history, local
  `badges`) remain local-only; streak/XP come from the empty
  `dashboard_stats` row until the first authed action re-triggers the
  trigger.
- (c) Multiple independent write stores (local XP counter, local badges,
  local exam history, local `lastPosition`) aren't part of
  `mergeGuestProgress`, which only copies `user_progress` rows.
- (d) Medium — transient but visibly breaks trust on the critical
  "first sign-in" moment.

### 3.13 Static vs. Supabase question catalog divergence
- (a) TopicCard question-count label, track hero bar, progress-page
  per-topic counts.
- (b) The app can simultaneously assert "`20 שאלות`" on a topic card (from
  static `questions.ts`) while ProgressPage shows `totalQuestions: 12`
  (from the Supabase `questions` table) for the same topic.
- (c) `TrackModuleList.getQuestionCount` takes `max(remote, static)`;
  `useSupabaseProgress.topicStats` uses the Supabase count only. The two
  hooks hit different tables by design.
- (d) Medium for Phase 2 (user-visible mismatch), BUT the underlying
  accuracy question for DevOps topics is explicitly deferred to Phase 3
  (see §4).

### 3.14 Anon vs. authed dashboard totals
- (a) Home stats chip, Progress page stats grid.
- (b) Guests see totals computed from localStorage (`useLocalProgress`);
  authed users see totals from `dashboard_stats`. A guest who has answered
  N questions and then signs in can see totals bounce 0 → N over a few
  seconds as React Query hydrates.
- (c) Different hooks on different caches; no loading guard unifies them.
- (d) Low-to-medium (first-session UX only).

### 3.15 `useProgress.addExamResult` ignored on authed backend
- (a) ExamMode finish flow.
- (b) Works for guests, silently no-ops persistence for authed users
  (still writes to local, but not to Supabase).
- (c) Documented out of scope for the original Issue #95 migration.
- (d) Low today; upstream of §3.9.

## 4. DevOps Practice Question Count Issue

This is the canonical example where the same "how many questions does this
topic have?" question returns different answers on different screens. It is
DEFERRED to Phase 3 — Phase 2 only documents it and refuses to fix it.

### 4.1 What the user sees per surface

- Home Python track card (`HomePage.tsx`, lines 306–322) — does not show a
  DevOps question count at all, only a module count (`devopsModuleCount`,
  line 346). So there is no Home inconsistency to report for DevOps, only
  for Python and (dead-path) OOP.
- DevOps track page hero (`DevOpsTrackPage.tsx`, lines 21–29, 94–101) —
  shows "התקדמות כוללת X%" and `{devopsModules.length} מודולים`. It
  renders NO total question count, but the % it shows is sensitive to the
  denominator (see below).
- DevOps track module accordion (`TrackModuleList.tsx` → `ModuleSection`,
  lines 236–242, 268) — each accordion header shows `{moduleCompletion}%`;
  each expanded card shows `{questionCount} שאלות` via `getQuestionCount`
  (lines 229–234).
- DevOps topic card (`TopicCard` inside `TrackModuleList.tsx`, lines 130–157)
  — "`{questionCount} שאלות`" + progress bar + "`{answeredCorrect}
  נפתרו נכון`" + "`{completion}%`".
- Progress page (`ProgressPage.tsx`, lines 102–178) — global totals + per-
  topic cards. DevOps topics appear here only if they exist in Supabase
  `topics` (§4.2) and show `{stat.answered}/{stat.totalQuestions}` per topic.

### 4.2 What the DB contains

- Static catalog `src/data/questions.ts` (source of truth per `CLAUDE.md`)
  currently has 5 questions for each of the four DevOps topics:
  - `linux_basics`: 5
  - `file_permissions`: 5
  - `bash_scripting`: 5
  - `networking_fundamentals`: 5
  (Verified via `grep -c 'topic: "<slug>"'` against `questions.ts`.)
- Supabase `public.questions` table — question rows are seeded via the
  migrations under `supabase/migrations/` (notably
  `20260416000001_seed_curriculum_linux_bash_phase2.sql` and
  `20260417000001_seed_networking_fundamentals.sql`). The per-topic count
  returned by `get_dashboard_data` reflects rows physically present in
  the DB, which is NOT guaranteed to equal the static catalog count:
  historical PRs #285 and #286 exist precisely because at least three
  DevOps topics previously had static questions but zero seeded rows in
  Supabase.
- Topic UUIDs for DevOps slugs live in
  `src/data/topicTutorials.ts` (lines ~1149–1156):
  - `linux_basics` → `22222222-0001-0000-0000-000000000000`
  - `bash_scripting` → `22222222-0002-0000-0000-000000000000`
  - `file_permissions` → `22222222-0003-0000-0000-000000000000`
  - `networking_fundamentals` → `22222222-0004-0000-0000-000000000000`

### 4.3 Which hook produces which number

- Denominator-for-count-label on TopicCard:
  - `TrackModuleList.getQuestionCount(slug)` (lines 229–234) returns
    `max(remote, static)` where remote is `questionCounts[uuid]` (Supabase
    `get_dashboard_data`) and static is `STATIC_QUESTION_COUNTS[slug]`.
  - Effect: label always shows at least the static count even when
    Supabase is under-seeded.
- Denominator-for-percent on the track hero bar:
  - `DevOpsTrackPage.overallCompletion` (lines 21–29) calls
    `getTopicCompletion(tid, questionCounts[tid] ?? 0)` — using ONLY the
    remote count, not `max(remote, static)`. `tid` here is the slug
    (from `module.topicIds`), and `questionCounts` is keyed by UUID in
    the RPC payload (see `get_dashboard_data` in
    `supabase/migrations/20260415000001_db_indexes_rls_rpc.sql`, lines
    74–113). Result: for slug-keyed lookups on a UUID-keyed object, the
    lookup usually returns `undefined`, so the denominator collapses to
    `0`, `getTopicCompletion` clamps to `0`, and the hero bar stays at 0%.
- Numerator-for-percent on the track hero bar (authed):
  - `useRemoteProgress.getTopicCompletion` filters `user_progress` rows
    where `topic_id === topicId`. In the authed path `topicId` is the
    slug passed from `DevOpsTrackPage` BUT `user_progress.topic_id` is a
    UUID — so the filter misses every row and the numerator is `0`.
- Per-module accordion percent (`ModuleSection.moduleCompletion`, lines
  236–242) — calls `getTopicCompletion(t.id, getQuestionCount(t.id))`
  where `t.id` has already been normalised back to the slug in
  `moduleTopics`. Uses `max(remote, static)` as denominator, so per-
  module percent can be non-zero while the hero percent is zero on the
  same page.
- Progress page per-topic counts:
  - `useSupabaseProgress.topicStats` (lines 34–93) reads
    `topics` + `questions` directly and groups `questions` by `topic_id`
    (UUID). `totalQuestions` per topic therefore equals the Supabase-
    seeded count only — NOT `max(remote, static)`. If Supabase has fewer
    seeded DevOps questions than the static file, ProgressPage will show
    a smaller denominator than TrackModuleList for the same topic.
- Totals on the Progress page overall bar:
  - `totalQuestions = Σ topicStats.totalQuestions`
    (`ProgressPage.tsx`, lines 102–105). Inherits the
    under-reporting above for any topic where `max(remote, static) > remote`.

### 4.4 Exact files and line references

- `src/pages/DevOpsTrackPage.tsx:19-29, 94-101` — hero % + module count.
- `src/pages/OopTrackPage.tsx:19-29, 94-101` — identical formula (same
  bug shape in the OOP track, not DevOps-specific).
- `src/components/TrackModuleList.tsx:23-29` — `STATIC_QUESTION_COUNTS`.
- `src/components/TrackModuleList.tsx:208-234` — slug↔UUID resolution
  inside `moduleTopics` and `getQuestionCount`.
- `src/components/TrackModuleList.tsx:236-242` — module % formula.
- `src/components/TrackModuleList.tsx:129-157` — topic-card label + bar
  + `נפתרו נכון` count.
- `src/features/progress/hooks/useRemoteProgress.ts:325-331` — authed
  `getTopicCompletion` filter by `topic_id`.
- `src/features/progress/hooks/useLocalProgress.ts:127-135` — guest
  `getTopicCompletion` uses static slug filter (so guests see
  non-zero % on DevOps topics while authed users see 0% on the hero).
- `src/hooks/useSupabaseProgress.ts:34-93` — ProgressPage per-topic
  count (`totalQuestions` = Supabase-only).
- `src/hooks/useDashboardData.ts:51-113` — `questionCounts` payload
  keyed by `topic_id` from the RPC.
- `src/data/topicTutorials.ts:1149-1156` — DevOps slug↔UUID map.
- `supabase/migrations/20260415000001_db_indexes_rls_rpc.sql:74-113` —
  `get_dashboard_data` RPC definition.
- `supabase/migrations/20260416000001_seed_curriculum_linux_bash_phase2.sql`,
  `supabase/migrations/20260417000001_seed_networking_fundamentals.sql` —
  DevOps question seeds (authoritative for the Supabase `questions` count).

### 4.5 Why the numbers diverge

Four compounding root causes, any one of which is enough to produce a
mismatch:
- Slug vs. UUID keying. `questionCounts` from the RPC is UUID-keyed;
  DevOps track page passes slug IDs straight through without resolving
  them. Lookups miss → 0 denominator on the hero bar.
- Authed vs. guest numerator keying. Guests filter `answeredQuestions`
  by static `question.topic` (slug); authed users filter Supabase rows
  by `topic_id` (UUID). Same user could see different percents in an
  incognito vs. signed-in tab.
- Two question-count sources never reconciled. `TrackModuleList` takes
  `max(remote, static)`; `ProgressPage` uses remote only. Anywhere one
  of these paths uses a denominator the other doesn't know about, the
  percent moves.
- Formula mismatch (coverage vs. average) already called out in §3.1
  still applies to DevOps — even if the per-topic numbers were perfect,
  hero % and module % would still not average out.

### 4.6 Phase 2 stance

DO NOT fix the DevOps count accuracy in Phase 2. Phase 2 centralizes the
PROGRESS reads so that every DevOps surface agrees on whatever number the
canonical source produces; reconciling the underlying question catalog
(static vs. Supabase seeding) is a Phase 3 task. The acceptable outcome for
Phase 2 is "home / track / module all show the same DevOps percent, even
if that percent is imperfect" — not "the percent becomes correct".

## 5. Proposed Single Source of Truth

### 5.1 Where the SoT lives

Phase 2 introduces a CLIENT-SIDE canonical source. No new DB table, no new
RPC, no changes to migrations — this keeps the change reversible and avoids
trespassing into the Phase 3 question-catalog work.

- New pure module: `src/features/progress/lib/progressSelectors.ts`
  - Pure, synchronous functions. No hooks, no network, no React.
  - Single place that resolves slug↔UUID (via `resolveTopicId` from
    `src/data/topicTutorials.ts`), applies the `max(remote, static)`
    question-count policy uniformly, and computes all percentages with
    ONE shared formula.
- New hook layer: `src/features/progress/hooks/`
  - `useTopicProgress(topicIdOrSlug)` → `TopicProgress`.
  - `useModuleProgress(moduleId)` → `ModuleProgress`.
  - `useTrackProgress(trackId)` → `TrackProgress`.
  - `useResumeTarget(trackId?)` → `ResumeTarget | null`.
  - All four hooks compose the same set of raw queries (see §5.4) and
    run the selectors in §5.1. UI surfaces call ONLY these hooks for
    progress / resume data — they stop calling `useProgress`,
    `useRemoteProgress`, `useSupabaseProgress`, `useDashboardData`
    directly for display-layer numbers.
- Existing hooks stay as the data access layer:
  - `useProgress` remains the write API (`answerQuestion`,
    `addExamResult`, `updateLastPosition`, `setUsername`) and the source
    of the raw `answeredQuestions` map. The selectors read from it.
  - `useDashboardStats` remains the authoritative source for precomputed
    global totals (answered / correct / streak / last-activity) on the
    dashboard stat cards only. Percent/coverage math for tracks,
    modules, and topics is moved out of it.
  - `useSupabaseProgress` is narrowed to the Progress page only; its
    `topicStats` will be rebuilt on top of the selectors so progress
    numbers align across screens.
  - `useLearningProgress` / `useAllLearningProgress` /
    `useTopicCompletion` continue to own learning + mastery gating; the
    selectors read from them.

### 5.2 Exact shape returned by the SoT

Stable TypeScript types, single definition in
`src/features/progress/lib/progressTypes.ts`:

```ts
type TrackId = "python-fundamentals" | "python-oop" | "devops";

type MasteryState =
  | "locked"        // predecessor topic not yet completed
  | "unstarted"     // unlocked, zero attempts
  | "in_progress"   // some attempts, below mastery threshold
  | "mastered";     // completion >= mastery threshold (80%)

interface TopicProgress {
  slug: string;                 // canonical key in the app
  uuid: string | null;          // null for topics not in SLUG_TO_UUID
  trackId: TrackId;
  moduleId: string;

  totalQuestions: number;       // max(remoteCount, staticCount)
  attempted: number;            // distinct questions answered (any result)
  correct: number;              // distinct questions answered correctly
  completionPct: number;        // round(correct / totalQuestions * 100), 0..100
  accuracyPct: number;          // round(correct / attempted * 100), 0..100

  conceptsTotal: number;        // tutorial concepts, 0 if no tutorial
  conceptsDone: number;
  learnPct: number;             // round(conceptsDone / conceptsTotal * 100)

  masteryState: MasteryState;
  unlocked: boolean;            // derived from useTopicCompletion gating
}

interface ModuleProgress {
  moduleId: string;
  trackId: TrackId;
  title: string;
  icon: string;
  order: number;
  comingSoon: boolean;

  topics: TopicProgress[];

  totalQuestions: number;       // Σ topics[i].totalQuestions
  correct: number;              // Σ topics[i].correct
  completionPct: number;        // round(correct / totalQuestions * 100)

  // First topic in this module that is unlocked and not mastered.
  // null if all topics are mastered or the module is comingSoon.
  nextTopicSlug: string | null;
}

interface TrackProgress {
  trackId: TrackId;
  modules: ModuleProgress[];    // excludes comingSoon by default

  moduleCount: number;          // active modules only
  totalQuestions: number;       // Σ modules[i].totalQuestions
  correct: number;              // Σ modules[i].correct
  completionPct: number;        // SINGLE formula: question-weighted coverage

  // Denormalised resume pointer (see §5.5). Points to the last module the
  // user touched; if none, the first unlocked module.
  resumeModuleId: string | null;
  resumeTopicSlug: string | null;
  resumeQuestionIndex: number | null;
}

interface ResumeTarget {
  trackId: TrackId;
  moduleId: string;
  topicSlug: string;
  questionIndex: number;        // 0 if no saved index
  reason: "last_position" | "first_unlocked" | "first_module";
}
```

Invariants the selectors MUST preserve:
- `TrackProgress.completionPct === round(Σ correct / Σ totalQuestions * 100)`
  — never the average of module/topic percents. This locks down §3.1/§3.6.
- `ModuleProgress.completionPct` uses the same question-weighted formula.
- `TopicProgress.totalQuestions === max(remoteCount, staticCount)` —
  matching the current TopicCard label policy so the label and the
  denominator never drift apart (§3.4).
- Numerator is always computed from the SAME `answeredQuestions` map
  regardless of slug/UUID keying (selectors pre-resolve both keys once and
  use the slug internally). Closes §3.3, §3.13 for display purposes.
- All percents clamp to `[0, 100]` and round consistently via a single
  helper `pct(num, den)`.

### 5.3 Consumers — who calls what

- `HomePage` track cards → `useTrackProgress("python-fundamentals")`,
  `useTrackProgress("python-oop")` (re-instating the card the data path
  already computes), `useTrackProgress("devops")`.
  Reads `completionPct`, `moduleCount`, optionally `resumeTopicSlug`.
- `DashboardPage` (Python track page) →
  - `useDashboardStats` for the 3-stat grid (unchanged).
  - `useTrackProgress("python-fundamentals")` for the hero bar and the
    module list.
  - `useTopicCompletion` for gating (unchanged).
- `OopTrackPage` / `DevOpsTrackPage` → `useTrackProgress(trackId)` for the
  hero + module list. `overallCompletion` stops being computed in-page.
- `TrackModuleList` → receives a `TrackProgress` prop (or reads via
  `useTrackProgress(trackId)` itself). `ModuleSection` renders from
  `ModuleProgress`; `TopicCard` renders from `TopicProgress`. No more
  ad-hoc `getQuestionCount` / `getTopicCompletion` calls inside this file.
- `ProgressPage` →
  - Global totals keep coming from `useDashboardStats`.
  - Per-topic cards and "overall coverage" come from the same selectors:
    Σ over `useTrackProgress` for each active track, NOT from a separate
    `useSupabaseProgress` math path. `useSupabaseProgress` stays as a
    data access helper but its `topicStats` are recomputed by the
    selectors.
- `PracticePage` → `useResumeTarget(trackId)` for the entry index; it
  keeps its own session state but stops reading `progress.lastPosition`
  directly.
- `Navbar`, `LearnPage`, `ReviewMistakes`, `ExamMode`, `OnboardingPage`
  — unchanged. These surfaces don't display cross-track progress numbers
  and can keep their current narrow hook usage.

### 5.4 Cache / invalidation

The selectors are pure; caching happens in the underlying React Query keys.

- Base queries (unchanged, already defined):
  - `["user_progress", userId]` — full answer rows (from
    `useRemoteProgress` for authed, from `useLocalProgress` snapshot for
    guests; the selector accepts either shape).
  - `["user_profile", userId]` — includes `last_topic_id` /
    `last_question_index`.
  - `["dashboard_stats", userId]` — precomputed totals.
  - `["learning_progress", userId]` — flat list of
    `(topic_id, concept_index)` rows used to build `learnMap`.
  - `["topic_completions", userId]` — `user_topic_completions` rows.
- Selector-level composition (no new query keys needed for Phase 2):
  - `useTopicProgress(slug)` subscribes to the four queries above +
    static catalog. Memoised by `(slug, userId)`.
  - `useModuleProgress(moduleId)` derives from
    `getModulesByTrack(...)` + `useTopicProgress` per topic.
  - `useTrackProgress(trackId)` derives from module list + topic
    selectors.
- Invalidation rules (single write path):
  - On `answerQuestion` mutation (authed): the existing
    `onSettled: invalidateQueries(["user_progress", userId])` in
    `useRemoteProgress` already covers it. We ALSO invalidate
    `["dashboard_stats", userId]` so the 3-stat grid refreshes
    simultaneously with the track %.
  - On `updateLastPosition`: invalidate `["user_profile", userId]`
    (already done).
  - On guest → authed merge (`mergeGuestProgress`): invalidate all five
    keys once after the merge.
- `staleTime`: `dashboard_stats` keeps its 30s stale time; the other
  queries stay at React Query defaults. No prefetching added in Phase 2.

### 5.5 Auth vs anon behavior

Intentionally identical from the selectors' point of view.

- Authed users — selectors read from Supabase-backed queries (as today).
- Guests with an anonymous UUID — writes have been reaching Supabase
  already (see §2.1); the selectors read from the same queries. No
  special-case code is added for guests in the selectors themselves.
- Guests with no Supabase connectivity / empty remote state — the
  `useProgress` facade's local branch feeds `answeredQuestions` into the
  selectors; the shape is identical. The selectors never branch on
  `isAuthenticated`.
- Username / `examHistory` / `badges` — still merged by the existing
  `useProgress` facade; the new selectors do not touch those fields.
- `resumeModuleId` / `resumeTopicSlug`:
  - Authed: prefer `user_profiles.last_topic_id`, fall back to the local
    `lastPosition` map if the profile row is empty.
  - Guest: read from the local `lastPosition` map.
  - If neither is set, `useResumeTarget` returns the first module whose
    `nextTopicSlug` is non-null with `reason: "first_unlocked"`, or the
    first module in `MODULES` order with `reason: "first_module"` if the
    whole track is still locked.
  - Per-track resume state is derived client-side by joining
    `last_topic_id` / `lastPosition` keys to `getModuleForTopic(slug)`
    and its `track`. The single-slot server schema is kept untouched;
    per-track memory is a client-side enrichment. (Noted as a Phase 3
    candidate to also persist per-track last positions server-side.)

### 5.6 What this intentionally does NOT do in Phase 2

- Does not change the Supabase schema.
- Does not add a new RPC or DB view.
- Does not change how questions are sourced (static vs. Supabase).
- Does not change the mastery threshold, XP formula, or streak logic.
- Does not touch the visual design of the Progress page.
- Does not fix DevOps question-count accuracy (Phase 3, see §4).

## 6. Migration Plan (Phase 2 steps)

TBD — ordered, reversible steps to adopt the canonical source across every
surface without breaking current behavior.

## 7. Risks & Rollback

TBD — what could regress, how we detect it, and how we roll back per step.
