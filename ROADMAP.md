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

## Execution
Implementation follows the locked 7-step order in `docs/next-steps.md`. No step begins until the prior one is verified and reported.
