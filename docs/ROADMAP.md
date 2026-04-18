# Logic Flow — Product Roadmap

> Single source of truth for Logic Flow product direction, phase order, and issue triage.
> Last updated: 2026-04-18 (post PR #287)

## Vision

Logic Flow is evolving from a Python quiz app into a serious technical learning platform:
structured lessons, guided practice, simulation scenarios, real progress tracking, AI guidance,
and future premium technical/business tracks.

We optimize for **product trust first, growth second**. A landing page that promises
more than the app delivers is a net negative. Pedagogy, progress, and content integrity
come before landing, before payments, and before infra polish.

---

## Phase order (dependency locked)

1. **Phase 1** — Core Product Cleanup  ✅ Done (PR #287 merged to main)
2. **Phase 2** — Progress Trust Layer  ⬅️ **Active (NOW)**
3. **Phase 3** — Question Source of Truth + Regression
4. **Phase 4** — Landing + Preview Onboarding + Auth Handoff
5. **Phase 5** — Pedagogy Completion
6. **Phase 6** — GTM / Monetization Readiness

This is not a wishlist. It is a dependency chain. Do not start Phase N+1 until Phase N is Done.

---

## Phase 1 — Core Product Cleanup  ✅ Done

**Status:** Delivered via PR #287 (merged into `main`). Logic Flow branding, track
structure, and home grid are live.

**Goal:** make the existing product coherent, trustworthy, and correctly branded as Logic Flow.

### In scope (delivered)
- Branding cleanup: ExamPrep → Logic Flow across UI ✅
- Welcome / hero copy cleanup ✅
- Dashboard / home consistency ✅
- 3-track home grid: Python, Python OOP, DevOps ✅
- OOP track separated from base Python ✅
- Placeholder / debug copy removed from production ✅

### Known follow-ups (not Phase 1 blockers — tracked in later phases)
- **DevOps track question-count accuracy is NOT yet solved.** Cards display counts
  that do not match the real module/question state. This is explicitly deferred to
  Phase 3 (Question Source of Truth + Regression). See #242.
- OOP / DevOps content depth is intentionally thin — addressed in Phase 5.

### Out of scope
- Progress redesign
- Question-count source-of-truth migration
- Landing build
- Billing / infra / legal

### Agents
- Primary: Claude Code
- Polish (closed): Copilot

### Done means (met)
- No visible "ExamPrep" string in the UI ✅
- No placeholder / debug copy in production ✅
- Python / OOP / DevOps read as consistent tracks ✅
- Home feels like a real product, not a prototype ✅

### Linked issues
- #224 — stable positive learning flow (partially supported; core content work continues in Phase 5)
- #242 — DevOps question-count accuracy flagged here, resolved in Phase 3

---

## Phase 2 — Progress Trust Layer  ⬅️ Active

**Goal:** make progress feel real, consistent, and useful. The product promises structured
learning, not fake gamification, so progress must be honest before anything else ships on top.

### In scope
- Progress page redesign / cleanup
- Track-level progress clarity (Python, OOP, DevOps)
- Module-level progress semantics
- "Return to last state" / resume behavior
- Fix misleading or inconsistent percentages
- Align dashboard progress with real saved state
- Guest → authed progress continuity basics

### Out of scope
- Full analytics platform
- Leaderboards / heavy gamification
- New content authoring
- Landing work
- Payments / infra

### Agents
- Primary: Claude Code (structure)
- Secondary: Copilot (polish)

### Done means
- Percentages and counts never contradict each other across home, track page, and module
- "Resume where I left off" works reliably on Python, OOP, and DevOps
- Every track card shows trustworthy progress that matches the underlying data
- Progress page supports learning decisions, not vanity counters

### Linked issues
- #224 — stable positive learning flow (progress is the trust half of this)

---

## Phase 3 — Question Source of Truth + Regression

**Goal:** clean up the split between static question files and Supabase, resolve the
DevOps count discrepancy from Phase 1, and lock behavior in with regression tests.

### In scope
- Audit question counts across all tracks and modules (Python, OOP, DevOps)
- Reconcile static vs Supabase question sources; choose a canonical source per track/module
- Fix DevOps question-count accuracy (carried over from Phase 1)
- Regression tests for: question counts, question selection, module completion
- Minimum Vitest coverage on critical flows

### Out of scope
- Large new content authoring (Phase 5)
- Large visual changes
- Landing / auth

### Agents
- Primary: Claude Code (data + architecture)
- Secondary: Codex (regression + validation)

### Done means
- No track shows a wrong question count anywhere in the UI
- Canonical question source is documented per track/module
- Completion logic is stable and deterministic across reloads and devices
- Tests cover track select, module progression, completion, and question selection

### Linked issues
- #163 — Vitest coverage for core features
- #242 — DevOps 18-module content accuracy (count slice; content build continues in Phase 5)

---

## Phase 4 — Landing + Preview Onboarding + Auth Handoff

**Goal:** marketing-grade entry layer that connects cleanly into the app.
Only viable after Phases 1–3 make the product itself trustworthy.

### In scope
- English-first landing page
- Practical / guided / trustworthy copy (no inflated promises)
- Dark, premium visual system
- Founder section (Shaked Rosenfeld)
- Hero video integration
- Preview onboarding before auth
- 3 real tracks + 1 "future tracks" card
- CTA handoff to auth, then dashboard
- Welcome email on first auth

### Out of scope
- Stripe integration (Phase 6)
- Full 3D system (can be replaced by simpler visuals)
- Deep personalization pre-auth
- Broad multilingual rollout

### Agents
- Primary: Claude Code (implementation)
- Secondary: Copilot (responsive + microcopy)
- QA: Codex

### Done means
- Landing promise matches app reality
- "Start learning" flow is smooth from landing → preview → auth → dashboard
- Preview is short and useful
- Future-tracks card does not mislead
- New users receive a welcome email on first auth

### Linked issues
- #217 — Welcome email agent (onboarding)
- #215 — UX / learning path map (UX intent only; heavy 3D deferred)

---

## Phase 5 — Pedagogy Completion

**Goal:** strengthen the learning core so tracks feel like real curriculum, not decorated quizzes.
This is where the platform earns its "serious technical learning platform" claim.

### In scope
- Stable positive learning flow end-to-end
- Guided explanations before practice
- Graded hint ladder (hint → nudge → solution walkthrough)
- Clear "next step" after each module
- OOP track content maturation
- DevOps content build-out across the 18 planned modules
- Practice / explanation coupling per module

### Out of scope
- Advanced B2B flows
- Hiring / integration systems
- New tracks beyond Python / OOP / DevOps

### Agents
- Primary: Claude Code
- UX touches: Copilot

### Done means
- A beginner always knows what to do next
- AI guidance supports learning, not answer dumping
- Modules feel like real curriculum, not a question bank
- DevOps track has real lesson + practice content across all planned modules

### Linked issues
- #222 — Pedagogical agent collaboration (8 topics)  [type:epic]
- #242 — DevOps 18-module content build (content slice)
- #138 — Epic: Pedagogy-first learning flow (master reference) [type:epic]
- #147 — Production-readiness umbrella — cross-cutting reference epic; pedagogy slices live here, infra and monetization slices live in their own phases (Phase 6 / parked), not here [type:epic, area:infra]

Remaining #224 content work will be split into a new issue at the end of Phase 2; do not re-label #224.

---

## Phase 6 — GTM / Monetization Readiness

**Goal:** monetize only after product trust and activation flow are proven.

### In scope
- Pricing strategy alignment (Free vs Pro)
- Affiliate / partner hooks
- GTM surface planning
- Pricing page refinement (copy first, billing last)

### Out of scope
- Rushing Stripe before product trust exists
- Team / enterprise tiers
- Legal paperwork (handled separately, not a dev task)

### Agents
- Strategy: human-led (Shaked)
- Implementation (when scope is clear): Claude Code / Copilot

### Done means
- Pricing reflects real delivered value
- No fake premium promises
- Acquisition path connects to actual retention data from Phase 2

### Linked issues
- #218 — Stripe integration (parked until Phase 6 scope is confirmed)

---

## Parked (explicitly not now)

These are real work items that do not block the current phase chain. They stay
`phase:parked` until they become a blocker or the chain reaches them.

- #258 — Custom domain (wait for Logic Flow rebrand to stabilize; not blocking dev)
- #256 — Supabase DPA (legal/admin task for the founder, not a dev task)
- #166 — Terraform IaC (premature until Phase 4 stabilizes)
- #156 — PWA service worker optimization (perf polish, not a trust blocker)
- #218 — Stripe (see Phase 6)

---

## Epics / Reference (not direct tasks)

- #138 — Pedagogy-first learning flow (master reference)  [type:epic, area:pedagogy]
- #147 — Production-readiness umbrella (cross-cutting; infra + monetization slices live outside Phase 5)  [type:epic, area:infra]
- #222 — Pedagogical agent collaboration  [type:epic, area:pedagogy]

Epics stay open and are pointed at from the phase that currently owns their slices.
Do not close an epic until all child issues ship.

---

## Labels (issue triage scheme)

**Phase labels (exactly one per issue):**
- `phase:now` — active this week, drives the product. Reserved for the single Phase 2 driver issue (#224) while Phase 2 is active. No other issue may hold `phase:now`.
- `phase:next` — queued right after the current phase (Phase 3)
- `phase:later` — roadmap, future phases (Phases 4–5 content)
- `phase:parked` — not now (infra, legal, payments, premature optimization)

**Type labels:**
- `type:epic` — strategic direction / tracking issue, not directly actionable

**Area labels (exactly one per issue):**
- `area:pedagogy` — teaching flow, course content, curriculum, AI guidance
- `area:devops` — DevOps track content and tooling
- `area:infra` — infra, hosting, DNS, IaC, performance, tests, CI
- `area:landing` — landing page, onboarding, preview, auth handoff, welcome email
- `area:legal` — privacy, ToS, DPA, compliance
- `area:monetization` — GTM, pricing, payments, subscriptions

---

## Issue triage checklist (for new issues)

1. Which phase does this belong to? (`phase:now` | `phase:next` | `phase:later` | `phase:parked`)
2. Is it product-core, pedagogy, infra, landing, legal, or growth? (pick one `area:*`)
3. Is it a task or an epic? (`type:epic` if not directly actionable)
4. Does it conflict with the current phase focus? If yes, default to `phase:parked` or `phase:later`.

**Rules:**
- If an issue cannot get a `phase:*` label, it is not ready to be an issue yet.
- `phase:now` is reserved for the single active-phase driver issue. While Phase 2 is active, that issue is #224. No other issue may hold `phase:now`.
- Landing / onboarding / GTM / monetization MUST NOT be `phase:now`.
- Legal, infra, payments default to `phase:parked` unless they directly block the active phase.

---

## Current focus

**Active phase: Phase 2 — Progress Trust Layer.**
Phase 1 is Done (PR #287 merged). Primary driver issue: #224 (progress trust half).
`phase:now` is reserved for #224 only while Phase 2 is active — no other issue may
hold `phase:now`. Do not start Phase 3 work until Phase 2 Done means criteria are met.
