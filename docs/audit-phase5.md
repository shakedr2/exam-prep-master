# Phase 5 — Teaching Flow UX Audit

**Date:** 2026-04-19
**Branch at audit:** `main` @ 44e9090 (`feat(welcome): Phase 4 PR1 — Logic Flow landing page + RootRoute gating (#310)`)
**Scope:** Read-only audit of current teaching flow, tracks, AI tutor, navigation, and paywall scaffolding. No code changes.
**Purpose:** Produce evidence-based findings to feed Phase 5 epics and bug issues.

---

## Summary Table

| # | Area | Status | Key Finding |
|---|------|--------|-------------|
| A1 | RootRoute `/` | ⚠️ Partial | Authed `/` already renders `HomePage` (track hub) — but user-reported "logo → Python" bug likely originates in a CTA/shortcut, not RootRoute. Needs verification. |
| A2 | Track flow (OOP/DevOps vs Python) | ⚠️ Inconsistent | All three track pages use the same `TrackModuleList` primitive, but OOP/DevOps modules contain only 1 topic and skip the "theory-first" experience that Python has. |
| A3 | Python modules data | 🟥 Bug | `code_tracing` module maps to two legacy topic slugs (`tracing` 24q + `math` 23q) → renders as two topic cards. `files_exceptions` has 0 questions. |
| A4 | AI Tutor persona | 🟥 Bug | Registry is correct, but fallback defaults unknown topic IDs to `pythonTutor`. Downstream resolver call sites may be passing slugs that miss the registry. |
| A5 | "הבא" next button | 🟥 Bug | Next button `z-30` fixed bottom. BottomNav `z-50` (mobile only). On mobile the nav overlays the button; on desktop BottomNav is hidden (`md:hidden`) so the issue is mobile-only by CSS — verify user's desktop report. |
| A6 | ProgressPage | ✅ Populated | Reads real Supabase + localStorage data. Not WIP (despite user report). |
| A7 | TheoryIntro / 4-stage pedagogy | ⚠️ Python-only | `TopicTutorial.tsx` encodes the 4 stages but is wired only into Python `/learn/:topicId`. OOP/DevOps topics don't get it. |
| A8 | Paywall / monetization | ❌ Absent | No Stripe, Cardcom, Tranzila, Paddle. Greenfield. |

Legend: ✅ working · ⚠️ partial / consistent but incomplete · 🟥 bug · ❌ missing

---

## A1 — RootRoute / authed `/` routing

**File:** `src/App.tsx:109-113`

```tsx
function RootRoute() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  return user ? <HomePage /> : <LandingPage />;
}
```

**Route wiring:** `src/App.tsx:134` — `/` → `<RootRoute />`.

**Unauthed landing:** `src/features/welcome/WelcomePage.tsx` (imported as `LandingPage`, `App.tsx:45`).
**Authed hub:** `src/pages/HomePage.tsx` — 495 LOC, renders Python + OOP + DevOps track cards.

### Finding
`/` itself is not wired directly to Python. The user-reported bug ("logo / 'ראשי' → Python") must originate in one of:
- A `Navbar` logo link → `/topics/python` instead of `/` (check `src/shared/components/Navbar.tsx`).
- `BottomNav` "ראשי" tab wiring (check `src/shared/components/BottomNav.tsx`).
- A CTA in `HomePage` that jumps straight to Python when no track was selected.

Root cause needs a second pass in Phase 5 PR — **not fully diagnosed in this audit**. Capture as acceptance criterion on B1.

---

## A2 — OOP and DevOps flow vs Python

All three tracks use the same `TrackModuleList` component.

| Track | Page | Module count | Per-module topic count |
|-------|------|--------------|------------------------|
| Python Fundamentals | `DashboardPage.tsx` (or via `HomePage`) | 6 | 1–3 topics |
| Python OOP | `OopTrackPage.tsx:19` — `getModulesByTrack("python-oop")` | 4 | 1 topic each |
| DevOps | `DevOpsTrackPage.tsx:18` — `getModulesByTrack("devops")` | 4 | 1 topic each |

### Evidence
- OOP and DevOps modules in `src/data/modules.ts:75-148` each have `topicIds: ["<single>"]` → there is effectively **no Module step**. The "module list" visually collapses to a list of topics.
- OOP/DevOps topics do not have `TopicTutorial` data (the 4-stage pedagogy). So opening an OOP topic jumps straight to practice instead of Theory → Concepts → Warmup → Pitfalls.

### Implication
User perception "skips Module List and jumps to Topic 1" is accurate in effect: a single-topic module is indistinguishable from jumping into the topic. Phase 5 should either:
- Re-group OOP/DevOps into multi-topic modules, or
- Acknowledge single-topic modules as a valid shape and add the TheoryIntro gate at the topic level (preferred — see A7).

---

## A3 — Python duplicate modules & "קבצים וחריגות" empty

### A3.1 — Duplicate "מעקב קוד" row

Module definition `src/data/modules.ts:54-62`:

```ts
{
  id: "code_tracing",
  title: "מעקב קוד",
  description: "מעקב ביצוע וחישובים מתמטיים",
  topicIds: ["tracing", "math"],   // ← TWO legacy slugs in one module
  order: 5,
  icon: "🔍",
  track: "python-fundamentals",
},
```

Question counts in `src/data/questions.ts` (via `grep -oE 'topic: "[a-z_]+"' | sort | uniq -c`):

| Topic slug | Count |
|------------|-------|
| `loops` | 30 |
| `conditions` | 25 |
| `tracing` | **24** |
| `math` | **23** |
| `lists` | 23 |
| `classes_objects`, `inheritance`, `polymorphism`, `decorators_special` | 5 each |
| `linux_basics`, `file_permissions`, `bash_scripting`, `networking_fundamentals` | 5 each |
| `variables_io`, `arithmetic`, `functions`, `strings`, `tuples_sets_dicts`, `files_exceptions` | **0 each** |

`src/components/TrackModuleList.tsx:196-210` maps `module.topicIds` to topic cards, so the `code_tracing` module renders **two sibling topic cards** with the module's title/description duplicated on each — this is exactly what the user sees ("24 q + 23 q" both labelled "מעקב קוד").

Inline comment in `src/data/questions.ts:4` confirms this is tech debt:
> `// "tracing" and "math" are legacy aliases kept until PR 1B remaps all questions.`

### A3.2 — `files_exceptions` shows 0 questions

Module `src/data/modules.ts:63-71` references `topicIds: ["files_exceptions"]` but **no** question entries in `src/data/questions.ts` have `topic: "files_exceptions"`. The topic is in the `TopicId` union but never populated.

### A3.3 — Broader data integrity gap (bonus finding)
Five Python topics declared in the syllabus (`variables_io`, `arithmetic`, `functions`, `strings`, `tuples_sets_dicts`) also have **0 static questions**. If they are meant to come from Supabase, that should be explicit; if they're expected to exist statically, they're missing seeds. Out of scope for B3 but worth capturing in a follow-up data-integrity issue.

---

## A4 — AI Tutor persona resolution

**Registry:** `src/features/curriculum/prompts/index.ts:46-78`

```ts
export const tutorRegistry: Record<string, TutorConfig> = {
  variables_io: pythonTutor,
  arithmetic: pythonTutor,
  // ... all legacy Python slugs → pythonTutor
  python: pythonTutor,
  linux: linuxTutor,
  oop: oopTutor,
  git: gitTutor,
  networking: networkingTutor,
  docker: dockerTutor,
  cicd: cicdTutor,
  cloud: cloudTutor,
  iac: iacTutor,
};

export function getTutorConfig(topicId: string | undefined): TutorConfig {
  if (!topicId) return pythonTutor;
  return tutorRegistry[topicId] ?? pythonTutor;
}
```

### Existing personas (11)

| # | File | Hebrew name |
|---|------|-------------|
| 1 | `prompts/python-tutor.ts` | פרופ׳ פייתון / Prof. Python |
| 2 | `prompts/oop-tutor.ts` | פרופ׳ OOP / Prof. OOP |
| 3 | `prompts/linux-tutor.ts` | פרופ׳ לינוקס / Prof. Linux |
| 4 | `prompts/bash-tutor.ts` | Prof. Bash |
| 5 | `prompts/permissions-tutor.ts` | Prof. Permissions |
| 6 | `prompts/git-tutor.ts` | Prof. Git |
| 7 | `prompts/networking-tutor.ts` | Prof. Networking |
| 8 | `prompts/docker-tutor.ts` | Prof. Docker |
| 9 | `prompts/cicd-tutor.ts` | Prof. CI/CD |
| 10 | `prompts/cloud-tutor.ts` | Prof. Cloud |
| 11 | `prompts/iac-tutor.ts` | Prof. IaC |

### Root cause of "פרופסור פייתון for all topics"
Two plausible failure modes, both consistent with the user report:

1. **Wrong key passed in.** Call sites may pass a module ID (`classes_objects`, `file_permissions`, `bash_scripting`, `networking_fundamentals`) that is **not** in the registry. Registry only keys on the curriculum topic IDs (`oop`, `linux`, `git`, etc.), not on module slugs. `getTutorConfig` silently falls through to `pythonTutor`.

2. **Registry missing keys** for per-module DevOps and OOP content — `bash`, `permissions` have tutor files but no registry entries.

Fix is additive: extend the registry (or introduce a `moduleId → tutor` lookup table) and remove the silent fallback (return `null` / throw in dev for unknown topics).

---

## A5 — "הבא" (Next) button obscured by bottom nav

### Button
`src/pages/PracticePage.tsx:1152-1180`:
```tsx
<div className="fixed bottom-0 inset-x-0 z-30 border-t bg-background/95 backdrop-blur-sm pb-16 md:pb-0">
  <Button className="flex-1 min-h-[44px]" onClick={handleNext} disabled={!answers[current.id]}>
    {currentIndex + 1 >= totalTarget ? "סיום" : "הבא"}
  </Button>
</div>
```
- `fixed bottom-0` · `z-30` · `pb-16 md:pb-0` (64px bottom padding on mobile to clear BottomNav).

### BottomNav
`src/shared/components/BottomNav.tsx:22`:
```tsx
<nav className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t bg-background/80 backdrop-blur-md pb-safe">
```
- `fixed bottom-0` · `z-50` · `md:hidden` (mobile only).

### Analysis
- **Mobile:** BottomNav `z-50` > button wrapper `z-30`. Even though the button has `pb-16` inner padding, the fixed nav renders *on top of* the button's container, partially hiding "הבא".
- **Desktop:** BottomNav is `md:hidden`, so it should not overlap. User's desktop report needs verification — the most likely desktop cause is a different chrome element (Navbar, footer, `AppFooter`) eating space below, or the user testing on a narrow viewport that still hits the mobile breakpoint.
- **ExamView:** The same button markup pattern likely appears in `src/pages/ExamMode.tsx`; confirm during B5 fix.

### Fix sketch (not in scope for this audit)
- Raise the button wrapper to `z-50` or higher, and push BottomNav to `z-40`, or
- Render the Next button inside a safe-area-aware "action dock" that sits above BottomNav with explicit margin, or
- Hide BottomNav during practice/exam routes entirely.

---

## A6 — ProgressPage

**File:** `src/pages/ProgressPage.tsx:73-100`

```ts
const { progress, getIncorrectQuestions, totalCorrect, totalAnswered, isLoading } = useProgress();
const pythonTrack = useTrackProgress("python-fundamentals");
const oopTrack = useTrackProgress("python-oop");
const devopsTrack = useTrackProgress("devops");
const { topics, loading: topicsLoading } = useSupabaseTopics();
const { learnMap } = useAllLearningProgress();
const weakPatterns = useWeakPatterns();
```

No TODO markers, no mock data, no placeholder strings. This page is **not WIP** — contrary to the user's report. Possible the user saw empty state because they have no recorded progress yet; suggest verifying the empty-state copy rather than re-implementing.

---

## A7 — TheoryIntro / 4-stage pedagogy

**File:** `src/components/TopicTutorial.tsx:20-42`

```ts
const STEP_LABELS = ["סקירת תיאוריה", "מושגי מפתח", "שאלת חימום", "מלכודות נפוצות"];
const steps = hasWarmup
  ? ["theory", "concepts", "warmup", "pitfalls"]
  : ["theory", "concepts", "pitfalls"];
```

- Stage 1 Theory — renders `tutorial.introduction` (`TopicTutorial.tsx:129-140`)
- Stage 2 Concepts — maps `tutorial.concepts` array (`:143-178`)
- Stage 3 Warmup — renders `tutorial.prepQuestions[0]` (`:181-240`)
- Stage 4 Pitfalls — renders `tutorial.commonMistakes` + `tutorial.quickTip` (`:243-278`)

Data comes from `src/data/topicTutorials.ts` (`import type { TopicTutorial } from "@/data/topicTutorials"`), which is Python-only.

### What needs to move for Phase 5
- Relocate `TopicTutorial.tsx` from `src/components/` to `src/features/curriculum/components/` (cross-track reuse).
- Generalize the tutorial data type so non-Python tracks can provide their own lesson content.
- Author OOP + DevOps tutorial data.
- Insert TheoryIntro gate into `LearnPage` (and/or practice flow) for every track.

---

## A8 — Payment / subscription scaffolding

Searched (case-insensitive) for: `stripe`, `cardcom`, `tranzila`, `paddle`, `subscription`, `billing`, `paywall`, `checkout`, `pricing`, `monetization`.

Hits (after filtering false positives):
- `subscription` — only in `src/contexts/AuthContext.tsx` (Supabase auth subscription, not billing).
- `billing`, `checkout` — string occurrences in tutor prompts and Cloud topic description, **not payment code**.

**Verdict: 0% scaffolded.** Phase 7 starts from scratch.

---

## Appendix — Files consulted

| Path | Purpose |
|------|---------|
| `src/App.tsx` | Route table, `RootRoute`, chrome wiring |
| `src/pages/HomePage.tsx` | Authed hub |
| `src/pages/DashboardPage.tsx` · `OopTrackPage.tsx` · `DevOpsTrackPage.tsx` | Track pages |
| `src/data/modules.ts` | Module definitions + `getModulesByTrack` |
| `src/data/questions.ts` | Static question seeds (4671 LOC) |
| `src/components/TrackModuleList.tsx` | Per-track module/topic rendering |
| `src/components/TopicTutorial.tsx` | 4-stage pedagogy (Python-only) |
| `src/pages/PracticePage.tsx` · `src/pages/ExamMode.tsx` | Next-button location |
| `src/shared/components/BottomNav.tsx` | Bottom nav z-index |
| `src/features/curriculum/prompts/index.ts` | Tutor registry |
| `src/features/curriculum/prompts/*-tutor.ts` | Persona definitions |
| `src/pages/ProgressPage.tsx` | Progress view (real data confirmed) |
