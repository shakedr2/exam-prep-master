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
