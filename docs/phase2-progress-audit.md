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

TBD — list every hook/service that feeds a progress surface
(`useProgress`, `useLocalProgress`, `useRemoteProgress`, `useDashboardData`,
`useDashboardStats`, `useSupabaseProgress`, `useTopicCompletion`,
`useAllLearningProgress`, `useLearningProgress`), and the Supabase tables /
RPCs / localStorage keys behind each one.

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
