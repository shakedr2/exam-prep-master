# ExamPrep Master — Roadmap & Product Direction

This document is the locked product direction for ExamPrep Master. It overrides ad-hoc requests that conflict with the principles below. Subsequent execution follows `docs/next-steps.md`.

## Product

A **multilingual, adaptive learning platform** that started as a Hebrew-only Python exam-prep tool for the Open University of Israel and is evolving into a structured technical education platform covering Python, DevOps, and beyond.

**Product identity:** Python-first, DevOps-next, agent-powered, multilingual-ready.

## Canonical Taxonomy — 8 Python Topics

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

### 2. Hebrew + English (Bilingual)
Python track: Hebrew only (RTL). DevOps track: Hebrew + English (bilingual). All new UI text uses translation keys. RTL/LTR is locale-driven.

### 3. AI agents teach, they do not solve
The AI agents are **graded learning assistants**, not answer bots:
- Default behavior is a **hint ladder** (nudge > conceptual hint > worked structure > full answer only after attempts)
- They check student attempts and explain mistakes
- They respond in the student's chosen language
- They adapt difficulty based on student performance

### 4. Hybrid question generation
Each topic has a **base question bank** (curated, high-quality) plus **AI-generated questions** for adaptive difficulty. Generated candidates pass through review before becoming permanent. Base bank saves tokens; AI generation provides personalization.

### 5. Personalized learning is the product
Question selection is adaptive. It considers topic mastery, repeated mistakes, `pattern_family`, `common_mistake` tags, and learning phase. The Learning Flow Agent controls the path.

## Guardrails — What We Will NOT Do

- No scope creep into unrelated UI redesign
- No mock/fake data — real data or remove the feature
- No duplicate practice flows (one practice flow only)
- No admin panel
- No unrestricted AI generation into production
- No immediate-answer chat behavior by default
- No giant all-in-one rewrites; prefer small, verifiable steps
- No copying SoloLearn or any other platform's design 1:1 — unique visual identity

---

## Platform Vision (April 2026)

ExamPrep is evolving from a Hebrew Python exam-prep app into a **structured, agent-powered technical learning platform**.

- **Hebrew** is current launch language
- **English** is next strategic target (DevOps track)
- **Python Fundamentals** is the foundation track (current, active)
- **DevOps Engineer** is the next learning track (planned)

The existing Python exam prep content and 8-topic taxonomy remain the **active production content**.

---

## UX Vision — Unique Design Identity

Inspired by platforms like SoloLearn, CodingForKids, and LearnPython.org, but with a **distinct visual identity**.

### Layout Structure
- **Home page:** Track cards (e.g., "Python Fundamentals", "DevOps Engineer") — each card leads into its learning path
- **Track page:** Linear list of modules with progress indicators, ordered by curriculum
- **Module page:** Lesson > AI Practice (Booster) > Practice > Quiz > Complete
- **Learning Path Map:** 3D visual map (Three.js) showing module nodes and connections

### Animation Strategy (Level C — Hybrid)
- **Framer Motion** for all UI animations: page transitions, hover effects, micro-interactions, completion celebrations
- **React Three Fiber (Three.js)** only for the Learning Path Map — 3D nodes, connections, camera movements
- Smooth, modern, with personality — not generic

### Interactive Environments
| Topic | Environment |
|---|---|
| Python | Monaco Editor (code + Run) |
| Linux/Bash | Embedded terminal simulation |
| Docker/Terraform | Virtual playground (sandboxed) |
| Git | Interactive git visualization |

### Gamification — Minimal
- Progress bars per module and track
- Completion indicators (checkmarks, filled nodes)
- No XP, no streaks, no badges, no leaderboards (for now)
- Focus on **clear progress visibility** only

---

## Agent Architecture

The platform is powered by specialized AI agents. Agents run via **Supabase Edge Functions** calling **OpenAI + Anthropic APIs**.

### Agent Types

#### 1. Tutor Agents (8 — one per topic, student-facing)
Each topic has a dedicated professor agent that:
- Teaches concepts, gives hints, explains mistakes
- Responds when student makes errors (passive mode)
- Available via "Talk to Professor" chat button (active mode)
- If student says "this is too hard" → reports to Learning Flow Agent
- Speaks Hebrew or English based on track/locale

| Agent | Topic | Track |
|---|---|---|
| Prof. Python | Python Fundamentals | Python |
| Prof. Linux | Linux & Bash | DevOps |
| Prof. Git | Git & Version Control | DevOps |
| Prof. Networking | TCP/IP, DNS, HTTP | DevOps |
| Prof. Docker | Docker & Containers | DevOps |
| Prof. CI/CD | GitHub Actions, Jenkins | DevOps |
| Prof. Cloud | AWS/GCP basics | DevOps |
| Prof. IaC | Terraform | DevOps |

#### 2. Question Builder Agents (8 — one per topic, backend)
Each topic has a question builder that:
- Draws from **base question bank** first (saves tokens)
- Generates **adaptive questions** in real-time when needed
- Adjusts difficulty based on student performance
- If student struggles → generates easier, more basic questions
- All generated questions can be reviewed and added to permanent bank

#### 3. Learning Flow Agent (1 — central orchestrator)
The "brain" of the system:
- Connected to all Tutor + Question Builder agents
- Controls learning path: which module is next
- **Gates progress:** must score 80%+ to advance to next module
- **Skip Exam:** if student claims "I know this" → triggers short interactive test
  - Pass (80%+) → unlock next module
  - Fail → directed back to study weak areas
- Cross-topic analysis: identifies weaknesses across subjects
- Decides optimal learning order per student

#### 4. Design Agent (1 — internal, dev-only)
Not student-facing. Helps developers:
- Generate UI components following the design system
- Maintain visual consistency
- Equivalent to installing the **Frontend Design** Claude Skill

#### 5. Notification Agent (1 — future)
- Email weekly summaries via Resend
- Google Calendar integration for study reminders
- "What to strengthen" push notifications

### Agent Flow Diagram

```
Student enters Module (e.g., Linux Basics)
        |
        v
  Tutor Agent (Linux) — teaches, hints, explains
        |
  Question Builder (Linux) — serves adaptive questions
        |
  Student completes module
        |
        v
  Learning Flow Agent checks:
    Score >= 80%?
    |         |
   YES       NO
    |         |
  Unlock    "Study more" or "Skip Exam" option
  Next       |
  Module    Skip Exam triggered (short test)
             |         |
           Pass      Fail
           (80%+)   (<80%)
             |         |
          Unlock    Back to study
          Next      + show weak areas
          Module
```

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
Python is the foundation because DevOps engineers need scripting.

## Curriculum Domain Model

```
Track > Phase > Module > Lesson > Practice > Quiz
```

- **Track:** e.g., DevOps Engineer
- **Phase:** e.g., Python Fundamentals, Linux & Bash
- **Module:** e.g., Variables & IO, File Permissions
- **Lesson:** Teaching content (text + interactive examples)
- **Practice:** Questions for a module (hybrid: bank + AI-generated)
- **Quiz:** Assessment for a module (gated: 80% to advance)

The current 8-topic Python content maps to Phase 1 modules.

## Dev Skills (for development, not production)

Claude Skills installed for development workflow:

| Skill | Purpose | Priority |
|---|---|---|
| Frontend Design | Production-grade UI, not AI slop | Install now |
| Superpowers (obra) | Structured dev: plans, subagents, TDD | Install now |
| Debugging | 4-phase disciplined debugging | Install now |
| Webapp Testing | Automated testing as system grows | Phase 10+ |

---

## Platform Phases

| Phase | Focus | Status |
|---|---|---|
| Phase 0 | Stabilization, audit, verify issues/PRs, protect existing UX | Done |
| Phase 1 | Identity foundation: Supabase auth, Google OAuth, callback, profiles | Done |
| Phase 2 | Guest-to-user conversion: threshold, signup wall, merge progress | Done |
| Phase 3 | Curriculum foundation: tracks, phases, modules, lessons, quizzes | Done |
| Phase 4 | Real learning memory: attempts, weak topics, dashboard memory | In Progress |
| Phase 5 | Multilingual foundation: Hebrew launch, English next, i18n-ready | Next |
| Phase 6 | NeetCode-style guided learning flow (Issue #84 sub-tasks) | In Progress |
| Phase 7 | Welcome email via Edge Function + Resend | Next |
| Phase 8 | PostHog + Sentry monitoring (done) | Done |
| Phase 9 | Monetization readiness + growth operations | Later |
| **Phase 10** | **UX Overhaul — Unique design, animations, interactive environments** | **Planned** |
| **Phase 11** | **Agent Infrastructure — Registry, Router, Chat UI, Memory** | **Planned** |
| **Phase 12** | **First Agents Live — Python + Linux + Git professors** | **Planned** |
| **Phase 13** | **Full Agent Roster + Learning Flow Agent** | **Planned** |
| **Phase 14** | **Advanced UX — 3D Learning Path Map, celebrations** | **Planned** |
| **Phase 15** | **Smart Notifications — Calendar, email summaries** | **Future** |

---

## Phase Details (New Phases)

### Phase 10: UX Overhaul
- 10.1 Design System foundation (colors, typography, spacing, component library)
- 10.2 Track cards home page (unique design, not SoloLearn copy)
- 10.3 Module Flow redesign: Lesson > Booster > Practice > Quiz > Complete
- 10.4 Progress visualization: bars per module and track
- 10.5 Framer Motion micro-animations: transitions, hover, completion
- 10.6 Interactive code editor (Monaco) embedded in Python lessons
- 10.7 Embedded terminal simulation for Linux/Bash lessons
- 10.8 Mobile-responsive redesign
- 10.9 Dark/Light theme with smooth transitions

### Phase 11: Agent Infrastructure
- 11.1 Agent Registry (config schema per agent in Supabase)
- 11.2 Agent Router Edge Function (module context > correct agent)
- 11.3 Agent Chat UI Shell (generic reusable chat component)
- 11.4 Agent Memory Layer (student history per agent per topic)
- 11.5 API key management (OpenAI + Anthropic, encrypted in env)
- 11.6 Rate limiting + token budget per user
- 11.7 Agent system prompt templates

### Phase 12: First Agents Live
- 12.1 Prof. Python Tutor (upgrade existing AI tutor to agent format)
- 12.2 Python Question Builder (hybrid: base bank + AI generation)
- 12.3 Prof. Linux Tutor + Linux Question Builder
- 12.4 Prof. Git Tutor + Git Question Builder
- 12.5 Learning Flow Agent v1 (path control, 80% gate, skip exam)

### Phase 13: Full Agent Roster
- 13.1 Prof. Networking + Question Builder
- 13.2 Prof. Docker + Question Builder
- 13.3 Prof. CI/CD + Question Builder
- 13.4 Prof. Cloud (AWS) + Question Builder
- 13.5 Prof. IaC (Terraform) + Question Builder
- 13.6 Learning Flow Agent v2 (cross-topic weakness analysis)

### Phase 14: Advanced UX + 3D
- 14.1 3D Learning Path Map (React Three Fiber scene)
- 14.2 3D completion celebrations (confetti, trophies)
- 14.3 Virtual playground for Docker/Terraform
- 14.4 Interactive git visualization for Git module
- 14.5 Sound effects (optional, toggle)

### Phase 15: Smart Notifications & Growth
- 15.1 Notification Agent: email weekly summaries (Resend)
- 15.2 Google Calendar integration (study reminders)
- 15.3 Push notifications (what to strengthen)
- 15.4 Monetization: pricing tiers, payment integration

---

## Dependencies

- Phases 4-7 are current work (auth, progress, i18n, email)
- Phase 10 (UX Overhaul) can begin after Phase 6 is complete
- Phase 11 (Agent Infra) depends on Phase 4 (progress persistence must work)
- Phase 12 (First Agents) depends on Phase 11 (infrastructure must exist)
- Phase 13 depends on Phase 12 (expand after first agents proven)
- Phase 14 (3D) depends on Phase 10 (design system must exist first)
- Phase 15 depends on Phases 11-12 (notifications need agent data)

## Priority Order

1. Finish current open issues (#84 sub-tasks, #95, #97, #98)
2. Phase 10: UX Overhaul (design system + track cards + animations)
3. Phase 11: Agent Infrastructure
4. Phase 12: First Agents Live
5. Phase 13-15: Expand incrementally

## Execution

Implementation follows the locked phase order above. No phase begins until the prior one is verified and reported. Small, verifiable steps only.

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
- [x] LearnPage: render commonMistakes + prepQuestions mini-quiz (PR #111)

### In Progress
- [ ] Move progress from localStorage to Supabase (Issue #95, Claude Code)
- [ ] Dashboard learning-progress signals: badge + banner fix (Issue #107)
- [ ] ProgressPage: learned-vs-practiced topic split (Issue #110)

### Remaining (Current Sprint)
- [ ] Multilingual strategy + i18n foundation (Issue #97)
- [ ] Welcome email via Edge Function + Resend (Issue #98)
- [ ] NeetCode-style guided learning flow (Issue #84)

### Planned (Future Sprints)
- [ ] Phase 10: UX Overhaul
- [ ] Phase 11: Agent Infrastructure
- [ ] Phase 12: First Agents Live
- [ ] Phase 13: Full Agent Roster
- [ ] Phase 14: Advanced UX + 3D
- [ ] Phase 15: Smart Notifications & Growth
