# Phase 2 — Progress Trust Layer: Audit

Status: Draft (Step 1 of Phase 2). Planning document only — no code changes.
Branch: `claude/phase2-progress-trust`.

This audit maps every place in the UI that displays progress, identifies where
those displays disagree, and proposes a single canonical source of truth to use
going forward. Implementation is Step 2 and waits for user review.

## 1. Current Progress Surfaces (inventory)

TBD — enumerate every UI surface that shows progress (home, track pages,
dashboard, module accordion, topic cards, progress page, practice page,
navbar), with the specific metric each one renders.

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
