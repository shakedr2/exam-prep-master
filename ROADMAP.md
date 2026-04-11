# ExamPrep Master — Roadmap & Product Direction

This document is the locked product direction for ExamPrep Master. It overrides ad-hoc requests that conflict with the principles below. Subsequent execution follows `docs/next-steps.md`.

## Product
A **Hebrew-only, RTL** exam preparation tool for the Open University of Israel course **"Introduction to Programming with Python" (מבוא לתכנות בפייתון)**. Students practice topic-by-topic, simulate the real exam, and track progress.

## Canonical Taxonomy — 8 Topics
The official syllabus (see `CLAUDE.md`) defines exactly 8 topics, in order:

1. `variables_io` — משתנים, טיפוסים וקלט/פלט
2. `arithmetic` — אריתמטיקה ואופרטורים
3. `conditions` — תנאים
4. `loops` — לולאות
5. `functions` — פונקציות
6. `strings` — מחרוזות
7. `lists` — רשימות
8. `tuples_sets_dicts` — טאפלים, סטים ומילונים

No other topic IDs are valid. Legacy IDs must be remapped, not extended.

## Core Principles

### 1. Lecturer materials are the single source of truth
All real question content must originate from official course materials (lectures, exam papers, course book). Generic/internet-sourced Python questions are not acceptable as production content.

### 2. Hebrew only
All learner-facing content — prompts, explanations, hints, UI — is in Hebrew. The layout is RTL. No mixed-language content in the question bank.

### 3. AI tutor teaches, it does not solve
The AI tutor is a **graded learning assistant**, not an answer bot:
- Default behavior is a **hint ladder** (nudge → conceptual hint → worked structure → full answer only after attempts)
- It checks student attempts and explains mistakes
- It gives full solutions only when explicitly justified (e.g., student gave up after multiple attempts, or asked for the post-mortem of an already-answered question)
- It responds in Hebrew
- It distinguishes course-specific questions from general programming concept questions

### 4. Gemini is a constrained candidate generator
Gemini (or any LLM) is used **only** to propose candidate questions grounded in supplied lecturer materials. Generated candidates are **never** inserted directly into production. Every generated item passes through the reviewed import pipeline before becoming a real question.

### 5. Personalized learning is a core feature
Question selection is adaptive. It considers:
- Topic mastery
- Repeated mistakes
- `pattern_family` (e.g., list reversal, string parsing, local maxima)
- `common_mistake` tags
- Phase: warm-up vs reinforcement vs challenge

This is not a nice-to-have; it is the product.

## Guardrails — What We Will NOT Do
- No scope creep into unrelated UI redesign
- No English UI or English question content
- No mock/fake data — real data or remove the feature
- No duplicate practice flows (one practice flow only)
- No social/gamification features beyond basic progress
- No admin panel
- No unrestricted AI generation into production
- No immediate-answer chat behavior by default
- No giant all-in-one rewrites; prefer small, verifiable steps

- ---

## Updated Vision — Platform Evolution (April 2026)

ExamPrep is evolving from a Hebrew Python exam-prep app into a **structured multilingual technical learning platform**.

**Product identity:** Python-first, DevOps-next, multilingual-ready.

- **Hebrew** is current launch language
- **English** is next strategic target
- **Multilingual** is a future platform capability
- **Python Fundamentals** is the foundation track (current)
- **DevOps Engineer** is the next learning track (planned)

The existing Python exam prep content and 8-topic taxonomy remain the **active production content**. Everything below is additive direction, not a replacement.

---

## Platform Phases

| Phase | Focus | Status |
|---|---|---|
| Phase 0 | Stabilization, audit, verify issues/PRs, protect existing UX | Done |
| Phase 1 | Identity foundation: Supabase auth, Google OAuth, callback, profiles, session persistence | In progress |
| Phase 2 | Guest-to-user conversion: threshold, signup wall, merge progress, resume exact point | Next |
| Phase 3 | Real learning memory: attempts, weak topics, last position, dashboard memory | Next |
| Phase 4 | Curriculum foundation: tracks, phases, modules, lessons, quizzes | Next |
| Phase 5 | Multilingual foundation: Hebrew launch, English next, i18n-ready architecture | Next |
| Phase 6 | DevOps Track A: Linux/Bash + Git | Later |
| Phase 7 | DevOps Track B: Networking + Docker + CI/CD | Later |
| Phase 8 | DevOps Track C: Cloud + Terraform | Later |
| Phase 9 | Monetization readiness + growth operations | Later |

---

## DevOps Engineer Track (planned)

```
Track: DevOps Engineer
|- Foundation Block
|  |- Phase 1: Python Fundamentals (current content)
|  |- Phase 2: Linux & Bash (cd, ls, grep, pipes, scripting)
|  |- Phase 3: Git & Version Control
|- Core Block
|  |- Phase 4: Networking Basics (TCP/IP, DNS, HTTP)
|  |- Phase 5: Docker & Containers
|  |- Phase 6: CI/CD (GitHub Actions, Jenkins)
|- Advanced Block
|  |- Phase 7: Cloud (AWS/GCP basics)
|  |- Phase 8: Infrastructure as Code (Terraform)
```

Each phase = set of modules with the same flow: Lesson > Practice > Quiz > Progress.

Python is the foundation because DevOps engineers need scripting. Then tools follow.

---

## Curriculum Domain Model

```
Track > Phase > Module > Lesson > Practice > Quiz
```

- **Track:** e.g., DevOps Engineer
- **Phase:** e.g., Python Fundamentals, Linux & Bash
- **Module:** e.g., Variables & IO, File Permissions
- **Lesson:** Teaching content
- **Practice:** Questions for a module
- **Quiz:** Assessment for a module

The current 8-topic Python content maps to Phase 1 modules.

---

## Multilingual Strategy

- Hebrew remains default launch locale
- All new UI text should use translation keys
- All new content should have stable content IDs with a translations layer
- RTL/LTR must be locale-driven
- Do NOT refactor existing Hebrew content to i18n yet
- English is the first expansion target

---

## Priority Order

1. Auth + callback + profile bootstrap
2. Guest merge + real progress persistence
3. Curriculum/domain model
4. i18n foundation
5. DevOps Track A content
6. DevOps Track B content
7. Growth + monetization readiness

---

## Dependencies

- Phases 2-3 depend on Phase 1 (auth must work before progress persistence)
- Phase 4 depends on Phase 3 (curriculum model needs working progress)
- Phase 5 depends on Phase 4 (i18n needs curriculum structure)
- Phases 6-8 depend on Phase 4 (DevOps content needs curriculum model)
- Phase 9 depends on Phases 1-5 (monetization needs identity + content platform)

## Execution
Implementation follows the locked 7-step order in `docs/next-steps.md`. No step begins until the prior one is verified and reported.


---

## Progress Log (Updated April 11, 2026)

### Completed
- [x] Google OAuth (PR #90) - frontend auth flow
- [x] Google Cloud OAuth consent screen - published to production
- [x] Supabase Google provider + URL configuration
- [x] Auth callback route + user_profiles table + RLS (Issue #93)
- [x] PostHog analytics integration (PR #100)
- [x] Sentry error monitoring integration (PR #100)
- [x] Vercel env vars configured for production
- [x] Guest-to-user progress merge + signup wall (PR #101, Issue #94)
- [x] Curriculum domain model: Track > Phase > Module (PR #102, Issue #96)
  - [x] Supabase-backed progress persistence (PR #103, Issue #95)

### In Progress
  - [ ] Multilingual strategy + i18n foundation (Issue #97, Copilot)
  - [ ] Welcome email via Edge Function + Resend (Issue #98, Copilot)

### Remaining
  - [ ] NeetCode-style guided learning flow (Issue #84)
