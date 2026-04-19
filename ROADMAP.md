# Exam Prep Master — Product Roadmap

_Last updated: 2026-04-19 (ROADMAP v4 — Phase 4 active, Phase 5/7/8 added, Welcome Email scope landed)_

> **SSOT.** This file replaces the old `docs/ROADMAP.md` as the single source of truth.
> Constraints (apply to every phase): no broad refactors, no unrelated design work, small reviewable PRs (<400 LOC), preserve working flows, rollback path mandatory, every PR links to one issue.

---

## At a glance

| Phase | Title | Status | Driver |
|-------|-------|--------|--------|
| 1 | Foundation | Done ✅ | — |
| 2 | Progress Trust | Done ✅ | Epic #290 |
| 3 | Questions Audit & Modules Migration | Done ✅ | Epic #298 / PR #309 |
| 4 | Landing, Welcome & Auth (Logic Flow) | **Active (NOW)** | Epic #310 · PR1 #311 merged · PR2 #320 pending |
| 5 | Teaching Flow UX | **Active (NOW)** | Epic #321 · drives #312–#318 |
| 6 | C# Track + C# Tutor | Next | Epic #308 |
| 7 | Monetization infrastructure | Next | Epic #322 (supersedes #218) |
| 8 | Adaptive AI Difficulty | Next | Epic #323 |
| 9 | Content Completion | Later | TBD |
| 10 | Production Readiness | Later | TBD |
| ∞ | Continuous — regression suite, smoke tests | Ongoing | #163 + CI |

---

## Phase 1 — Foundation  **[DONE]**

**Goal:** stand up the React + TypeScript + Vite + Supabase stack with a single practice flow.
**Entry:** greenfield.
**Exit:** user can sign in and answer Python questions; progress saved to localStorage.
**Expected PR count:** N/A (historical).

---

## Phase 2 — Progress Trust  **[DONE]**

**Goal:** make progress reliable across devices; normalize topics and questions schema.
**Entry:** Phase 1 complete.
**Exit (met):** Supabase `user_progress` + `user_streaks` sync; dashboard stats materialized; Epic #290 closed.
**Driver epic:** #290.

---

## Phase 3 — Questions Audit & Modules Migration  **[DONE]**

**Goal:** canonical question set, canonical slug↔UUID map, DevOps module scaffolding seeded.
**Entry:** Phase 2 closed.
**Exit (met):** `docs/questions-source-of-truth.md` landed; DevOps networking seeded (PR #309); Epic #298 closed.
**Driver epic:** #298.

---

## Phase 4 — Landing, Welcome & Auth (Logic Flow Design)  **[ACTIVE — NOW]**

**Goal:** production-quality unauthenticated landing + welcome flow + auth using the Logic Flow Design System, Hebrew-first RTL, with Navbar/BottomNav/AppFooter hidden on `/` for guests.
**Entry:** Phase 3 closed.
**Exit criteria:**
- [x] PR1 — `WelcomePage` + `RootRoute` gating (PR #311 merged).
- [ ] PR2 — Resend welcome email wired via Supabase Auth webhook (B9 #320), closes B8 #319. **In Progress 🚧 (PR #326)**
- [ ] PR3 — Auth flows (signup / signin / magic-link / password reset).
- [ ] Codex regression PR4 — route + auth tests.
- [ ] Vercel preview green; `npm run build` passes.

**Linked epics/bugs:**
- Epic: #310.
- Bugs: B8 #319 (welcome email not verified), B9 #320 (wire via webhook).

**Expected remaining PR count:** 3 (PR2, PR3, PR4).

**Inherited WIP:** `claude/implement-welcome-email-jU5Om` — do not merge (see `docs/audit-welcome-email.md` §2).

---

## Phase 5 — Teaching Flow UX  **[ACTIVE — NOW]**

**Goal:** every track presents the same 4-stage pedagogy (סקירת תיאוריה → מושגי מפתח → שאלת חימום → מלכודות נפוצות), with correct navigation, visible controls, and persistent sense of progress.
**Entry:** Phase 4 PR1 merged (hub gating is in place).
**Exit criteria:**
- [ ] TheoryIntro gate rendered before practice for every track/topic.
- [ ] 4-stage pedagogy component extracted out of `src/components/TopicTutorial.tsx` into `src/features/curriculum/components/` and reused by OOP/DevOps.
- [ ] Navigation bugs closed: B1 #312, B2 #313, B5 #316, B6 #317.
- [ ] Data integrity fix B3 #314 (duplicate 'מעקב קוד' + 0-question 'קבצים וחריגות').
- [ ] Tutor-persona fix B4 #315.
- [ ] Global course-progress bar in Practice/Exam (B7 #318).
- [ ] Learning Tracks Hub + Resume CTA + Tutor Persona registry (E4 #324).

**Driver epic:** #321. Audit: `docs/audit-phase5.md`.
**Expected PR count:** 5–7 small PRs (one per bug, one for the hub/registry).

---

## Phase 6 — C# Track + C# Pedagogical AI Tutor  **[NEXT]**

**Goal:** ship a full C# track at the same production quality as Python.
**Entry:** Phase 5 at exit criteria; Phase 4 PR2+3 merged.
**Exit criteria:**
- [ ] ~18 modules authored; questions in Supabase under `track = 'csharp'`.
- [ ] C# AI Tutor cloned from Python with identical pedagogy.
- [ ] `/csharp` navigable end-to-end in he + en.
- [ ] Vitest regression green, no regressions elsewhere.

**Driver epic:** #308. Currently `phase:next` (do not activate early).

---

## Phase 7 — Monetization infrastructure  **[NEXT]**

**Goal:** provider-agnostic billing adapter. First concrete adapter is Israeli (Cardcom **or** Tranzila — decide in spec PR). Stripe and Paddle adapters land as type-complete stubs behind the same interface. Billing cycles: monthly + annual (2 months free yearly). Tiers: **TBD**. Paywall mapping: **TBD** (separate epic after this one).

**Entry:** Phase 5 closed; Phase 6 scaffolded.
**Exit criteria:**
- [ ] `src/features/billing/` module + `BillingProvider` interface.
- [ ] Israeli provider adapter implemented + tested.
- [ ] Stripe + Paddle stub adapters compile.
- [ ] `subscriptions` table + RLS + types regenerated.
- [ ] `supabase/functions/billing-webhook/index.ts` with provider-specific verification.
- [ ] `/pricing` page with placeholder tiers.

**Driver epic:** #322. Supersedes #218.
**Expected PR count:** 3–4.

---

## Phase 8 — Adaptive AI Difficulty  **[NEXT]**

**Goal:** hybrid adaptive engine. Deterministic Elo/IRT handles ~80% of decisions; LLM invoked only on "stuck" / "drift" edge cases. Metrics collected: `answer_time_ms`, `attempts`, `hint_used`.

**Entry:** Phase 5 closed; Phase 4 AI tutor stable.
**Exit criteria:**
- [ ] `answer_events` table + migration + RLS.
- [ ] Elo/IRT engine with convergence Vitest.
- [ ] Edge-case trigger with tunable thresholds.
- [ ] Tutor hand-off payload documented in `docs/ai-tutor-spec.md`.
- [ ] PostHog dashboard shows < 20% of answer events hit the LLM path.

**Driver epic:** #323.
**Expected PR count:** 3–4.

---

## Phase 9 — Content Completion  **[LATER]**

**Goal:** every track has full 4-stage pedagogy coverage, question banks at CLAUDE.md distribution targets (≥15 q/topic, type mix ~40/30/20/10, difficulty ~25/45/30), Hebrew explanations, reference solutions.

**Entry:** Phase 5 exit criteria met; Phase 6 scaffolded.
**Exit criteria:**
- [ ] Every module in `src/data/modules.ts` has ≥ 15 seeded questions.
- [ ] Every topic has a `TopicTutorial` data entry.
- [ ] No "0-question" or "duplicate module" warnings in the integrity test suite.

**Driver epic:** TBD (open when Phase 5 closes).
**Expected PR count:** content-heavy, many small PRs.

---

## Phase 10 — Production Readiness  **[LATER]**

**Goal:** custom domain, DPA / ToS / Privacy, observability alerts, SEO for landing.
**Entry:** Phases 4–6 closed; paywall + adaptive engine stable.
**Exit criteria:**
- [ ] Custom domain + DNS + HTTPS verified.
- [ ] DPA + ToS + Privacy policy reviewed and live.
- [ ] Sentry alerts + PostHog dashboards for: signups/day, activation (first practice completed), retention D1/D7, welcome-email delivery rate.
- [ ] SEO basics on landing: OpenGraph, sitemap, robots.txt, structured data for course offerings.

**Driver epic:** TBD.

---

## Continuous — regression suite & smoke tests

- Vitest coverage for core features (#163) — always on `phase:now`, no end state.
- Staging smoke tests (planned under #163) currently blocked by `VERCEL_AUTOMATION_BYPASS_SECRET` — fix is a small CI infra task, not a phase.
- Secret scanning (TruffleHog PR #303 fix already shipped) and Dependabot (#169) stay on.

---

## Issue index

| Issue | Area | Phase |
|-------|------|-------|
| #218 | Payments (Stripe-only framing) | Superseded by #322 |
| #290 | Progress Trust epic | Phase 2 (Done) |
| #298 | Questions audit epic | Phase 3 (Done) |
| #299 | ROADMAP v3 update (closes with this v4) | Phase 3 (Done — v4 rolls it forward) |
| #308 | C# track epic | Phase 6 |
| #310 | Phase 4 epic (landing/welcome/auth) | Phase 4 (Active) |
| #311 | Phase 4 PR1 (merged) | Phase 4 (Done) |
| #312–#318 | B1–B7 Teaching Flow bugs | Phase 5 |
| #319 | B8 — Welcome email not verified e2e | Phase 4 |
| #320 | B9 — Phase 4 PR2 Resend via webhook | Phase 4 |
| #321 | E1 — Phase 5 Teaching Flow UX epic | Phase 5 (Active) |
| #322 | E2 — Phase 7 Monetization epic | Phase 7 (Next) |
| #323 | E3 — Phase 8 Adaptive AI epic | Phase 8 (Next) |
| #324 | E4 — Tracks Hub + Tutor registry | Phase 5 |

---

## Supporting docs

- `docs/audit-phase5.md` — teaching flow audit (bugs B1–B7).
- `docs/audit-welcome-email.md` — welcome email wiring + staging smoke-test plan (B8, B9).
- `docs/questions-source-of-truth.md` — canonical question schema + slug↔UUID map.
- `docs/ai-tutor-spec.md` — AI tutor contract + RAG payload.
- `CLAUDE.md` — product rules, architecture constraints, agent workflow.
- `AGENTS.md` — roles per agent.
- `EXECUTION_RULES.md` — commit/branch/PR rules.
