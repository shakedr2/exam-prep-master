# Logic Flow — Product Roadmap

> Single source of truth for Logic Flow product direction, phase order, and issue triage.
> Last updated: 2026-04-18

## Vision

Logic Flow is evolving from a Python quiz app into a serious technical learning platform:
structured lessons, guided practice, simulation scenarios, real progress tracking, AI guidance,
and future premium technical/business tracks.

We optimize for **product trust first, growth second**. A landing page that promises
more than the app delivers is a net negative.

---

## Phase order (dependency locked)

1. **Phase 1** — Core Product Cleanup
2. **Phase 2** — Progress Trust Layer
3. **Phase 3** — Question Source of Truth + Regression
4. **Phase 4** — Landing + Preview Onboarding + Auth Handoff
5. **Phase 5** — Pedagogy Completion
6. **Phase 6** — GTM / Monetization Readiness

This is not a wishlist. It is a dependency chain. Do not start Phase N+1 until Phase N is Done.

---

## Phase 1 — Core Product Cleanup

**Goal:** make the existing product coherent, trustworthy, and correctly branded as Logic Flow.

### In scope
- Branding cleanup: ExamPrep -> Logic Flow across UI
- Welcome / hero copy cleanup
- Dashboard / home consistency
- OOP track separation from base Python
- Remove placeholder / debug copy
- Align visible track cards and naming (Python, Python OOP, DevOps, ...)

### Out of scope
- Progress redesign
- Question-count source-of-truth migration
- Landing build
- Billing / infra / legal

### Agents
- Primary: Claude Code
- Polish (later): Copilot

### Done means
- No visible "ExamPrep" string in the UI
- No placeholder / debug copy in production
- Python / OOP / DevOps read as consistent tracks
- Home feels like a real product, not a prototype

### Linked issues
- #224 — stable positive learning flow (core driver)
- #242 (visual consistency slice only) — DevOps question-count display

---

## Phase 2 — Progress Trust Layer

**Goal:** make progress feel real, consistent, and useful. The product promises structured learning,
not fake gamification, so progress must be honest.

### In scope
- Progress page redesign / cleanup
- Track-level progress clarity
- Module-level progress semantics
- Return-to-last-state behavior
- Fix misleading or inconsistent percentages
- Align dashboard progress with real saved state

### Out of scope
- Full analytics platform
- Leaderboards / heavy gamification
- Full IRS rollout

### Agents
- Primary: Claude Code (structure)
- Secondary: Copilot (polish)

### Done means
- Percentages and counts do not contradict each other
- Resume where I left off works reliably
- Every track card shows trustworthy progress
- Progress page helps learning decisions, not vanity counters

---

## Phase 3 — Question Source of Truth + Regression

**Goal:** clean up the split between static question files and Supabase without breaking UX.

### In scope
- Audit question counts across tracks and modules
- Reconcile static vs Supabase question sources
- Decide canonical source per track / module
- Add regression tests for question counts, selection, and completion logic

### Out of scope
- Large new content authoring
- Large visual changes

### Agents
- Primary: Claude Code (data + architecture)
- Secondary: Codex (regression + validation)

### Done means
- No track shows a wrong question count
- Completion logic is stable and deterministic
- Tests cover the critical flows (track select, module progression, completion)

### Linked issues
- #163 — Vitest coverage for core features
- #242 (content slice) — DevOps 18 modules content build

---

## Phase 4 — Landing + Preview Onboarding + Auth Handoff

**Goal:** marketing-grade entry layer that connects cleanly into the app.
Only viable after Phases 1-3 make the product itself trustworthy.

### In scope
- English-first landing page
- Practical / guided / trustworthy copy
- Dark, premium visual system
- Founder section (Shaked Rosenfeld)
- Hero video integration
- Preview onboarding before auth
- 3 real tracks + 1 future tracks card
- CTA handoff to auth, then dashboard

### Out of scope
- Stripe integration
- Full 3D system
- Deep personalization pre-auth
- Broad multilingual rollout

### Agents
- Primary: Claude Code (implementation)
- Secondary: Copilot (responsive + microcopy)
- QA: Codex

### Done means
- Landing promise matches app reality
- Start learning flow is smooth
- Preview is short and useful
- Future-tracks card does not mislead
- Post-auth handoff feels natural

### Linked issues
- #217 — Welcome email agent (onboarding)
- #215 — UX / learning path map (UX intent only, no heavy 3D now)

---

## Phase 5 — Pedagogy Completion

**Goal:** strengthen the learning core so tracks feel like real curriculum, not decorated quizzes.

### In scope
- Stable positive learning flow
- Guided explanations before practice
- Graded hints
- Clear next step after each module
- OOP track content maturation
- Practice / explanation coupling

### Out of scope
- Advanced B2B flows
- Hiring / integration systems

### Agents
- Primary: Claude Code
- UX touches: Copilot

### Done means
- Beginner always knows what to do next
- AI guidance supports learning, not answer dumping
- Modules feel like real curriculum, not a question bank

### Linked issues
- #222 — Pedagogical agent collaboration (8 topics)
- #138 — Epic: Pedagogy-first learning flow (reference)

---

## Phase 6 — GTM / Monetization Readiness

**Goal:** monetize only after product trust and activation flow are proven.

### In scope
- Pricing strategy alignment
- Free vs Pro packaging
- Affiliate / partner hooks
- GTM surface planning
- Pricing page refinement (without full billing first)

### Out of scope
- Rushing Stripe before product trust exists

### Agents
- Strategy: human-led (Shaked)
- Implementation (when scope is clear): Claude Code / Copilot

### Done means
- Pricing reflects real delivered value
- No fake premium promises
- Acquisition path connects to actual retention

### Linked issues
- #218 — Stripe integration (parked until Phase 6)

---

## Parked (explicitly not now)

- #258 — Custom domain (wait for Logic Flow rebrand to stabilize)
- #256 — Supabase DPA (handle manually / legally; not a dev task)
- #166 — Terraform IaC
- #156 — PWA service worker optimization
- #218 — Stripe (see Phase 6)

---

## Epics / Reference (not direct tasks)

- #138 — Pedagogy-first learning flow (master reference)
- #147 — Production-readiness umbrella

---

## Labels (issue triage scheme)

Phase labels (exactly one per issue):
- phase:now — active this week, drives the product
- phase:next — up next after cleanup + pedagogy basics
- phase:later — roadmap, future ideas and expansions
- phase:parked — not now (infra, legal, payments, premature optimization)

Type labels:
- type:epic — strategic direction / tracking issue, not a task

Area labels:
- area:pedagogy — teaching flow, course content, curriculum
- area:devops — DevOps track content and tooling
- area:infra — infra, hosting, DNS, IaC, performance
- area:landing — landing, onboarding, preview, auth handoff
- area:legal — privacy, ToS, DPA, compliance
- area:monetization — GTM, pricing, payments, subscriptions

---

## Issue triage checklist (for new issues)

1. Which phase does this belong to? (phase:now|next|later|parked)
2. Is it product-core, pedagogy, infra, landing, legal, or growth? (pick area:*)
3. Is it a task or an epic? (type:epic if not directly actionable)
4. Does it conflict with the current phase focus? If yes, default to phase:parked or phase:later.

If it cannot get a phase:* label, it is not ready to be an issue yet.

---

## Current focus

**Active phase: Phase 1 — Core Product Cleanup.**
Primary driver issue: #224. Agent: Claude Code.
Do not start Phase 2 work until Phase 1 Done means criteria are met.
