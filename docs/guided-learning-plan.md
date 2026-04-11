# Issue #84 — Guided Learning Flow: Gap-Closure Plan

> **Source issue:** shakedr2/exam-prep-master#84 — "Sprint 4.0: NeetCode-style guided learning flow"
> **Status:** Phases A-D partially implemented. This plan closes the remaining gaps.

---

## Context

Issue #84 proposes a four-phase build (LearnPage → Dashboard wiring → content → Supabase
progress). **Exploration revealed that most of it is already built.** The remaining work
is a set of targeted gap closures, not a rewrite.

**What already exists (DO NOT re-implement):**
- `src/pages/LearnPage.tsx` at route `/learn/:topicId` — step-through concept cards,
  progress bar, prev/next, collapsible symbol-explainer hints, PostHog telemetry,
  lazy-loaded from `src/App.tsx` behind `AuthGuard`.
- `src/pages/DashboardPage.tsx` — TopicCard already renders "למידה" (BookOpen) +
  "תרגול" (Brain) buttons wired to the two routes.
- `src/hooks/useLearningProgress.ts` — Supabase read/write + localStorage mirror
  (`learn_progress_<topicId>`) + guest-user fallback via `getAnonUserId()`.
- `supabase/migrations/20260409000001_user_learning_progress.sql` — table exists with
  unique constraint on `(user_id, topic_id, concept_index)`.
- `src/data/topicTutorials.ts` — UUID-keyed tutorials for all 8 canonical topics
  (`11111111-000[1-8]-...`). Fields already defined: `concepts`, `commonMistakes`,
  `quickTip`, `prepQuestions`, `symbolExplainers`.

---

## 1) Gap Analysis Summary

| # | Area | Gap | Severity | Evidence |
|---|---|---|---|---|
| 1 | Dashboard | Topic cards show practice progress but no "X/Y מושגים" learning badge | **High** | `DashboardPage.tsx:65-92` — no call to `useLearningProgress` |
| 2 | Dashboard | "Start with learning" tip banner keys off `hasPracticed` instead of `hasLearned`; inverted signal | **High** | `DashboardPage.tsx:181, 346` |
| 3 | LearnPage | `tutorial.commonMistakes` populated for every topic but never rendered | **Medium** | `LearnPage.tsx` has no reference to `commonMistakes` |
| 4 | LearnPage | `tutorial.prepQuestions` has data for several topics but no mini-quiz UI between cards | **Medium** | Field read nowhere in `LearnPage.tsx` |
| 5 | ProgressPage | No "learned vs practiced" split — topics treated uniformly via question counts | **Medium** | `ProgressPage.tsx:197-217` |
| 6 | Data cleanup | 5 slug-keyed tutorial entries (`variables_io`, etc.) at `topicTutorials.ts:621-734` are unreachable; Dashboard passes UUIDs | **Low** | `getTutorialByTopicId` only called from LearnPage, which receives UUIDs |

**Explicitly deferred (needs product sign-off, not in scope):**
- Broad "9th-grader language" rewrite of existing tutorial copy — violates the
  "do not refactor existing content without explicit user request" rule in
  `CLAUDE.md`.
- Adding new schema fields `realWorldAnalogy`, `targetAge` to every tutorial — Issue #84
  mentions them but they're additive nice-to-haves, not AC.

---

## 2) Sub-Issues to Create

Five independent, parallelizable chunks. A-D address all documented ACs; E is optional
product polish.

| Sub-issue | Title | Scope | Parallel-safe with |
|---|---|---|---|
| **#84-A** | Dashboard learning-progress signals | Add "X/Y מושגים" badge per topic card + fix soft-lock banner to key off learning, not practicing | B, D |
| **#84-B** | LearnPage content sections (commonMistakes + prepQuestions mini-quiz) | Render existing unused tutorial fields | A, C, D |
| **#84-C** | ProgressPage learned-vs-practiced split | Add second progress dimension; split topics into "נלמדו ותורגלו" / "תורגלו בלבד" | B, D (depends on A's hook) |
| **#84-D** | Content integrity cleanup in `topicTutorials.ts` | Remove 5 dead slug-keyed entries (or reconcile if a legacy caller is found) | A, B, C |
| **#84-E** *(optional)* | Real-world analogies + 9th-grader copy pass | Add `realWorldAnalogy` field + render; audit existing copy | Independent |

---

## 3) File Changes per Sub-Issue

### Sub-issue #84-A — Dashboard learning-progress signals

**Files to create:**
- `src/hooks/useAllLearningProgress.ts` — new helper that fetches every
  `user_learning_progress` row for the current user in one query, returns
  `Record<topicId, number[]>`. Mirrors to localStorage using the existing
  `learn_progress_<topicId>` keys (no new storage surface).

**Files to modify:**
- `src/pages/DashboardPage.tsx`
  - Import `useAllLearningProgress` and `getTutorialByTopicId`.
  - In `TopicCard` (lines ~45-155): compute
    `conceptsLearned = learnMap[topic.id]?.length ?? 0` and
    `totalConcepts = getTutorialByTopicId(topic.id)?.concepts.length ?? 0`.
    Render a new `<Badge>` next to the practice count:
    `{conceptsLearned}/{totalConcepts} מושגים`. Hide when `totalConcepts === 0`.
  - Fix the banner around line 181: derive
    `hasLearnedAny = Object.values(learnMap).some(arr => arr.length > 0)`. Show the
    "נסה להתחיל עם למידת המושגים" tip when `hasPracticed && !hasLearnedAny`. Keep
    the existing dismissal pattern via the `dismissedTipKey`.

**What to reuse:**
- Existing `useLearningProgress` query shape (mirror it, don't duplicate).
- `getTutorialByTopicId` from `src/data/topicTutorials.ts`.
- Existing `Badge` component, existing dismissible banner pattern.

**Do NOT touch:** LearnPage, Progress page, tutorial data, route config.

---

### Sub-issue #84-B — LearnPage content sections

**Files to modify:**
- `src/pages/LearnPage.tsx` (only)

**Changes:**
1. **Common mistakes card** — render a yellow-tinted `Card` showing
   `tutorial.commonMistakes` as a bulleted list, gated on `isLast` (so it appears
   only once, before the "מוכנים לתרגול?" CTA). Reuse the existing yellow palette
   from the symbol-explainer `Collapsible` section (lines 160-186).
2. **Mini-quiz** — when `tutorial.prepQuestions?.[currentIndex]` exists, render it
   between the concept card and the Next button as a radio-button multi-choice
   panel. Feedback on pick: green/red tint + short Hebrew "נכון!"/"לא נכון, נסה שוב"
   copy. Disable Next until a choice is made; add a "דלג" text link for accessibility.
   Fire `posthog.capture('lesson_quiz_answered', { topic_id, concept_index, correct })`.
3. **Schema note** — `prepQuestions` is currently a topic-level array. Attach one
   per concept via index pairing (`prepQuestions?.[currentIndex]`). No data-shape
   change needed; topics with fewer questions than concepts simply skip.
4. RTL: wrapper `dir="rtl"`, code blocks `dir="ltr"`. Mobile-first: stack vertically
   under `sm` breakpoint; verify on iPhone SE width (375px).

**What to reuse:** `PythonCodeBlock`, `Card`/`CardContent`, `Button`, `Badge`,
existing `Collapsible` yellow pattern, existing PostHog capture pattern.

**Do NOT touch:** `useLearningProgress`, tutorial data, routing.

---

### Sub-issue #84-C — ProgressPage learned-vs-practiced split

**Files to modify:**
- `src/pages/ProgressPage.tsx` — per-topic stats section, roughly lines 197-217.

**Changes:**
1. Import `useAllLearningProgress` (shipped by Sub-issue #84-A). If A hasn't landed
   yet, fall back to an inline Supabase query with the same shape.
2. For each topic compute two values:
   - `practiceCompletion` — existing logic based on answered-correct counts.
   - `learnCompletion = completedConcepts.length / totalConcepts` from
     `getTutorialByTopicId(topic.id)`.
3. Split topics into two sections with Hebrew headers:
   - **"נלמדו ותורגלו"** — both values > 0.
   - **"תורגלו בלבד"** — `practiceCompletion > 0 && learnCompletion === 0`.
   - Optionally a third **"נלמדו בלבד"** for symmetry.
4. Add a second `<Progress>` bar inside each topic's existing stat card for the
   learn dimension.

**What to reuse:** Existing stat card, `Progress` bar, `getTutorialByTopicId`.

**Do NOT touch:** Other sections of ProgressPage (weak patterns, exam history).

---

### Sub-issue #84-D — Content integrity cleanup in topicTutorials.ts

**Files to modify:**
- `src/data/topicTutorials.ts` (lines ~621-734)

**Changes:**
1. Grep for all callers of `getTutorialByTopicId(`. Currently only `LearnPage.tsx`
   uses it, and it receives a UUID from the Supabase topics query.
2. Delete the 5 slug-keyed trailing entries (`variables_io`, `arithmetic`,
   `functions`, `strings`, `tuples_sets_dicts`). They are unreachable dead code.
3. If grep finds any other caller passing a slug, switch the approach: keep slug
   entries and add the 3 missing ones (`conditions`, `loops`, `lists`).
4. Run `npm run build` and `npm run test`; smoke-test `/learn/<each UUID>`.

**What to reuse:** Nothing. Pure cleanup.

**Do NOT touch:** UUID-keyed entries, type definitions, any UI.

---

### Sub-issue #84-E (OPTIONAL) — Real-world analogies + 9th-grader polish

**Files to modify:**
- `src/data/topicTutorials.ts` — add optional `realWorldAnalogy?: string` to the
  `TopicTutorial` interface and write one per topic.
- `src/pages/LearnPage.tsx` — render `tutorial.realWorldAnalogy` under the
  `introduction` header, only when present.

**Gate:** Do not start this sub-issue without explicit user approval. It touches
every tutorial entry and risks regressions in passing content.

---

## 4) Agent Assignment

Mirrors Issue #84's proposed split — Claude Code owns logic/data/hooks, Copilot owns
UI-heavy styling work, with overlap on pages that have both.

| Sub-issue | Primary owner | Rationale |
|---|---|---|
| **#84-A** Dashboard learning signals | **Claude Code** → Copilot for final polish | New hook + data-flow logic is Claude Code's strength; Copilot can refine badge placement and dismissible-banner animation. |
| **#84-B** LearnPage sections | **Copilot** | UI rendering, mobile-responsive layout, animation timing — Copilot territory. Claude Code should review the `prepQuestions` index-pairing logic before merge. |
| **#84-C** ProgressPage split | **Claude Code** | New data aggregation + conditional grouping. UI changes are small and reuse existing card. |
| **#84-D** Tutorial cleanup | **Claude Code** | Pure refactor/dead-code removal; no UI. |
| **#84-E** Content pass (optional) | **Product owner + Claude Code** | Copy edits need human judgment; Claude Code drafts, owner reviews. |

---

## 5) Implementation Order and Dependencies

### Dependency graph

```
#84-D  ──────────────┐   (independent, de-risks lookup)
                     │
#84-A  ──┐           │
         │           ▼
         ├──► #84-C  (needs useAllLearningProgress from A)
#84-B  ──┘
         (independent of A/C/D)

#84-E  ──────────────    (optional, independent, needs sign-off)
```

### Recommended serial order (one agent)

1. **#84-D** — quick cleanup; no risk to UX, removes ambiguity for downstream work.
2. **#84-A** — highest user-visible value; produces the `useAllLearningProgress`
   hook that #84-C consumes.
3. **#84-B** — independent of A/C; slot here or run in parallel.
4. **#84-C** — consumes A's hook; run after A merges.
5. **#84-E** — only if the user explicitly asks for the content pass.

### Recommended parallel schedule (multiple agents)

- **Wave 1 (parallel):** #84-A (Claude Code), #84-B (Copilot), #84-D (Claude Code).
- **Wave 2:** #84-C (Claude Code), once #84-A is merged.
- **Wave 3:** #84-E, on user request only.

### Verification per sub-issue

Every PR must pass:
1. `npm run build` — zero TS errors.
2. `npm run test` — vitest green.
3. Manual smoke (Hebrew, RTL, mobile 375px):
   - **A:** Topic cards show `{learned}/{total} מושגים`. As a guest: practice one
     question → banner appears; learn one concept → banner disappears globally;
     dismiss persists across refresh.
   - **B:** `/learn/<variables UUID>` renders mini-quiz between concept and Next
     button when data exists. Last card shows "טעויות נפוצות" before the practice
     CTA. No horizontal scroll at 375px.
   - **C:** `/progress` groups topics into "נלמדו ותורגלו" and "תורגלו בלבד"; each
     card shows two progress bars.
   - **D:** `/learn/<each of 8 UUIDs>` still loads the correct title and concepts;
     no console warnings.
4. Supabase round-trip: mark concept complete → refresh → progress persists from
   remote, not only localStorage.
5. PostHog: `lesson_progress` and `lesson_completed` still fire; `lesson_quiz_answered`
   fires from #84-B.

### Out-of-scope / will NOT do (guarding against scope creep)

- Hard-locking practice behind learning (issue explicitly says soft lock).
- New Supabase tables — `user_learning_progress` is sufficient.
- `react-syntax-highlighter`, Prism, Monaco — `PythonCodeBlock` is the codebase
  standard.
- Refactoring `useLearningProgress` internals — additive helper only.
- Route structure / lazy-load changes.
- Broad copy rewrites without explicit user approval (#84-E only).
