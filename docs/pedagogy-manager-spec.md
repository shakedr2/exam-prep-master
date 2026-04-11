# Pedagogy Manager Agent — Spec

> **Status:** Planning document. No implementation yet.
> **Owner:** Claude Code (planning) → Copilot/Claude Code (implementation, future phase).
> **Relates to:** Phase 12 (First Agents Live) and Phase 13 (Full Agent Roster) in `ROADMAP.md`.
> **Depends on:** `docs/ai-tutor-spec.md` (hint ladder), `docs/personalized-learning-spec.md` (question selection), `docs/guided-learning-plan.md` (LearnPage flow), `docs/curriculum-model.md` (Track > Phase > Module > Lesson > Practice > Quiz).

---

## 0. One-Line Summary

The **Pedagogy Manager Agent** is the "teaching methodology brain" of ExamPrep Master. It decides **how** each student should be taught a topic right now — which learning phase they are in, what kind of content to show next, when to gate progress, and when to drop difficulty. It does **not** decide *what* the correct answer is (that's the Tutor Agent) and it does **not** pick a specific question row (that's `selectNextQuestion`). It sits one level above both, orchestrating them.

---

## 1. Agent Role & Philosophy

### 1.1 What this agent is
- **Teaching methodology brain**, not an answer bot.
- Decides the **pedagogical approach** per student per topic per session.
- Orchestrates the existing primitives (`selectNextQuestion`, `useLearningProgress`, `ai-tutor` hint ladder) instead of replacing them.
- Lives between the UI layer and the Learning Flow Agent described in `ROADMAP.md` Agent Architecture. In the roadmap's vocabulary it is a **sub-capability of the Learning Flow Agent** focused on teaching method rather than path routing.

### 1.2 What it is NOT
- Not the Tutor Agent. Tutor agents (Prof. Python, Prof. Linux, …) explain specific questions using the hint ladder in `ai-tutor-spec.md`. The Pedagogy Manager tells them *when* and *how aggressively* to help.
- Not the Question Builder Agent. Question Builders draft new questions. The Pedagogy Manager decides whether a new question is even needed or an existing one from the bank fits.
- Not a chat interface. It emits **state decisions**, not free-form text.
- Not a replacement for `selectNextQuestion`. It wraps it, passing a "phase hint" to bias selection.

### 1.3 Core philosophy
1. **Beginner-first.** Default assumption is zero knowledge. Every topic starts from a relatable analogy and a single concept. The student must *earn* advanced material, not be dropped into it.
2. **Phase awareness.** The existing hint ladder (`1 → 2 → 3`) only models what happens *inside* a question. The Pedagogy Manager adds awareness of *what phase of learning* the student is in for this topic: intro, guided, practice, assessment, or review.
3. **Graded difficulty on two axes.** Difficulty ladders over (a) **learning phase** (intro → assessment) and (b) **question difficulty** (easy → hard). A hard question inside the intro phase is wrong in a way that a hard question inside the independent-practice phase is not.
4. **Fail soft.** If the student struggles, drop a phase rather than hammer them with hints at the same level. Re-teach, don't re-drill.
5. **Celebrate micro-progress.** Positive reinforcement on small wins (not gamification). No badges, no streaks, no XP — just clear acknowledgement.
6. **Never block.** Progress gates (80%) exist but the student can always choose to continue studying or re-enter a phase. Gating prevents *advancing*, never *learning*.

---

## 2. Learning Phases per Module

Every module has six phases. The Pedagogy Manager holds **exactly one active phase** per student per module at a time (but can move backwards if needed).

| Phase | Slug | Student experience | Content type | Exit criterion |
|---|---|---|---|---|
| **A** | `concept_intro` | Read a short lesson, see one real-world analogy, look at 2–3 annotated examples. No pressure. | Tutorial (`topicTutorials.ts`), `commonMistakes`, `symbolExplainers`, code diagrams. | Student taps "הבנתי, בוא נראה דוגמה" or reads all concept cards. |
| **B** | `guided_example` | Step-by-step walkthrough of a worked example. The agent narrates each line of code; the student taps "Next" to advance. | One annotated worked example per concept, often from the existing `prepQuestions` mini-quiz. | Student completes the walkthrough and acknowledges it. |
| **C** | `guided_practice` | Answer easy questions. Hints are proactive — level 1 hint unlocks automatically after 10s on first wrong attempt. Mistakes are explained in full. | `selectNextQuestion` with bias `{ state: "warm-up", difficulty: "easy" }`. | ≥ 3 correct answers in a row on easy questions, or ≥ 5 total easy correct. |
| **D** | `independent_practice` | Adaptive difficulty, minimal hints. Hint button exists but is not auto-triggered. | `selectNextQuestion` with state determined by `personalized-learning-spec.md`. | Rolling mastery ≥ 0.80 over last 6 attempts. |
| **E** | `assessment` | Short quiz: 5 questions, mixed difficulty, no hints, no retries mid-quiz. Mirrors the real exam at micro-scale. | Curated question set from the module's quiz bank (no AI generation). | Score ≥ 80% → module marked passed. Score < 80% → Phase F. |
| **F** | `review_reinforce` | Re-practice only the specific weaknesses surfaced by the assessment. Spaced repetition over `pattern_family` and `common_mistake` tags. | `selectNextQuestion` with `pattern_family` filter set to the student's weak set. | Weak-pattern mastery ≥ 0.75, then loop back to Phase E. |

### 2.1 Phase transition rules
- Default forward transition is **A → B → C → D → E → (F → E) → done**.
- Any phase can transition **backwards** to an earlier phase if the decision engine detects frustration, repeated failure, or explicit "I don't understand" input.
- Phase A is idempotent — re-reading is always available as a sidebar.
- Phase F can only be entered from a failed Phase E. A student cannot be "just in review mode" without first attempting assessment.

### 2.2 Why six phases, not four
Existing spec (`personalized-learning-spec.md`) has four states (warm-up, retry, reinforcement, challenge) that act *inside* question selection. Those four states are a scoring bias, not a curriculum phase. The six phases live one level up: they decide whether the student is even answering questions yet. The four selection states remain valid inside phases C, D, and F.

---

## 3. Student Model

The agent maintains a per-student, per-module state object. This replaces nothing in Supabase — it **derives** most fields from existing tables (`user_learning_progress`, `curriculum_module_progress`, `curriculum_question_attempts`) and persists only what is genuinely new.

### 3.1 Per-module state shape

```ts
type PedagogyModuleState = {
  moduleId: string;              // curriculum_modules.id
  topicId: string;               // legacy topic UUID (transition)
  phase: "concept_intro"
       | "guided_example"
       | "guided_practice"
       | "independent_practice"
       | "assessment"
       | "review_reinforce";
  mastery: number;               // 0..1, rolling over last 6 attempts
  attempts: number;              // total attempts in this module
  correctStreak: number;         // current correct-in-a-row count
  commonMistakes: string[];      // common_mistake tags seen ≥ 2 times
  weakPatterns: string[];        // pattern_family tags with mastery < 0.5
  lastActive: string;            // ISO timestamp
  phaseEnteredAt: string;        // ISO timestamp (for frustration detection)
  frustrationSignals: number;    // 0..N counter, see 3.3
  velocity: "slow" | "normal" | "fast"; // see 3.2
};
```

### 3.2 Learning velocity detection
Velocity is a single per-student (not per-module) signal that affects how aggressively the agent advances phases.

- **Fast:** median time-to-first-correct ≤ 30s AND mastery after 10 attempts ≥ 0.85. Shorter phase A, skip guided_example when student opts in.
- **Normal:** default. Follows the standard phase ladder.
- **Slow:** median time-to-first-correct ≥ 90s OR mastery after 10 attempts ≤ 0.5. Longer phase B, earlier frustration detection, more encouragement.

Velocity is re-computed lazily (not on every attempt) — every 10 attempts or every new session.

### 3.3 Frustration detection
The agent watches for three signals. Each increments `frustrationSignals` by 1:

1. **Repeated failure:** ≥ 3 wrong answers in the last 5 attempts on the same `pattern_family`.
2. **Hint exhaustion:** student hits level 3 hint on ≥ 3 questions in a row.
3. **Idle bail:** student opens a question, does nothing for 60s, then closes it.

At `frustrationSignals ≥ 2`:
- Drop to an easier phase (D → C, C → B).
- Surface a proactive encouragement message (see §6.5).
- Pin the next 2 questions to `easy` regardless of state.
- Reset `frustrationSignals` after the student completes 2 correct answers.

### 3.4 Cross-topic weakness patterns
The agent reads `curriculum_question_attempts` joined with `questions.pattern_family` and `questions.common_mistake` across *all* modules the student has attempted. This produces a **cross-topic weakness set**: patterns the student fails in multiple modules.

Example: if `off_by_one_range` shows up as a weakness in both `loops` and `strings`, the agent will:
- Flag it in the module state's `weakPatterns` whenever those modules are active.
- Prefer questions with `pattern_family: off_by_one_range` in Phase F.
- Surface a one-line heads-up in Phase A of any future module that shares that pattern: "שמנו לב שאינדקסים לפעמים מבלבלים — נתחיל איתם בזהירות."

This analysis is read-only and cached per session. It does not create new tables.

---

## 4. Decision Engine

The Pedagogy Manager is a **pure decision function** with a small persistent state. Given the current `PedagogyModuleState` + the event that just happened, it returns a `PedagogyDecision`.

### 4.1 Public surface

```ts
type PedagogyEvent =
  | { type: "enter_module" }
  | { type: "finish_concept"; conceptIndex: number }
  | { type: "answer_submitted"; questionId: string; correct: boolean; attempts: number }
  | { type: "hint_requested"; hintLevel: 1 | 2 | 3 }
  | { type: "i_dont_understand" }
  | { type: "claim_knowledge" }         // skip-exam request
  | { type: "quiz_completed"; score: number }
  | { type: "idle_timeout"; seconds: number };

type PedagogyDecision = {
  nextPhase: PedagogyModuleState["phase"];
  nextAction:
    | { kind: "show_concept_card"; index: number }
    | { kind: "show_guided_example"; exampleId: string }
    | { kind: "show_question"; selector: { difficulty?: "easy"|"medium"|"hard"; patternFamily?: string } }
    | { kind: "show_quiz"; quizId: string; questionCount: number }
    | { kind: "show_encouragement"; message: string }
    | { kind: "gate_blocked"; reason: string; suggestedAction: "review"|"retry_quiz" }
    | { kind: "module_complete" };
  hintAggressiveness: "off" | "auto_after_delay" | "on_demand_only";
  uiFlags: {
    showIDontUnderstandButton: boolean;
    showSkipExamButton: boolean;
    showProgressBar: boolean;
    showCelebration: boolean;
  };
  telemetry: Record<string, string | number | boolean>; // PostHog payload
};

function decide(state: PedagogyModuleState, event: PedagogyEvent): PedagogyDecision;
```

The function is **pure and synchronous**. Side effects (writing to Supabase, firing PostHog, invoking the Tutor Agent) happen in a thin wrapper.

### 4.2 Enter-module decision
When the student opens a module:

1. Fetch or derive `PedagogyModuleState` for this module.
2. If no prior state exists → start in **Phase A** (`concept_intro`), index 0.
3. If the student completed Phase A in a previous session but never attempted a question → resume in **Phase B**.
4. If the student has mastery ≥ 0.8 in this module → offer **Skip Exam** (see §4.6) instead of re-entering Phase A.
5. If the student has mastery 0.4–0.8 and an unresolved mistake set → start in **Phase F** (`review_reinforce`) with an explanatory banner.
6. Otherwise → resume in the last active phase.

### 4.3 Wrong-answer decision
When `event.type === "answer_submitted"` and `correct === false`:

```
IF phase == concept_intro OR phase == guided_example:
    # student should not be answering questions here — treat as exploration
    → show_concept_card (same index), hintAggressiveness = "off"
    → do NOT count this as a real attempt

IF phase == guided_practice:
    IF attempts == 1:
        → show same question again with hintLevel 1 auto-suggested
        → hintAggressiveness = "auto_after_delay"
    IF attempts == 2:
        → show same question with hintLevel 2
    IF attempts == 3:
        → show full explanation (level 3) and advance to next easier question
        → increment frustrationSignals if this is the 3rd such cycle

IF phase == independent_practice:
    IF this pattern_family has ≥ 3 failures this session:
        → drop to guided_practice with pattern pinned
    ELSE:
        → pick easier variant via selectNextQuestion(difficulty: "easy", patternFamily: current)

IF phase == assessment:
    → record attempt, do NOT interrupt, no hints
    → continue to next quiz question

IF phase == review_reinforce:
    → same as guided_practice (hints on, mistakes explained)
```

### 4.4 Correct-answer decision
When `event.type === "answer_submitted"` and `correct === true`:

```
IF phase == guided_practice AND correctStreak + 1 ≥ 3 AND mastery ≥ 0.6:
    → advance to independent_practice
    → showCelebration = true (one-time)

IF phase == independent_practice AND rolling mastery ≥ 0.80 over last 6:
    → advance to assessment
    → showCelebration = true

IF phase == review_reinforce AND weakPatterns mastery ≥ 0.75:
    → loop back to assessment

ELSE:
    → stay in same phase, pick next question via selectNextQuestion
    → showCelebration = false (avoid notification fatigue)
```

### 4.5 Progress gate
- Assessment pass threshold is **80%**, matching `ROADMAP.md` Learning Flow Agent rules.
- A failed assessment does **not** unlock the next module. It transitions to Phase F with a non-shaming message: "כמעט! בוא נחזק שני דברים ונחזור למבחן."
- Students may re-take the assessment after completing at least 3 review questions per weak pattern.
- The gate is a *recommendation*, not a block — power users can dismiss and advance anyway. A dismissal is logged so the agent knows the student may be under-prepared when the next module starts.

### 4.6 Skip-exam flow
When `event.type === "claim_knowledge"`:

1. The agent immediately launches a **short interactive test** (5 questions from Phase E's quiz bank, mixed difficulty, no hints).
2. If score ≥ 80% → jump straight to **module_complete** and unlock next module. Seed the student model with `mastery = 0.85`, `phase = "done"`.
3. If score 50–80% → land in **Phase D** (`independent_practice`) with a note: "יש לך בסיס. בוא נחדד כמה נקודות."
4. If score < 50% → land in **Phase A** (`concept_intro`) with a non-shaming note: "יש כמה דברים שכדאי לסדר לפני שנמשיך."

### 4.7 "I don't understand" button
This button is **always** visible during phases B, C, D, E's review, and F. When clicked:

1. `frustrationSignals += 1` (without a cooldown).
2. Immediately drop one phase (D → C, C → B, B → A).
3. Show a soft message: "בסדר גמור — בוא נחזור רגע לבסיס."
4. Pin difficulty to `easy` for the next 3 questions regardless of phase.
5. Fire telemetry `pedagogy_i_dont_understand` with the module, phase, and last question id.

---

## 5. Integration Points

### 5.1 Inputs (what the agent reads)

| Source | Shape | Purpose |
|---|---|---|
| `curriculum_question_attempts` (Supabase) | `{ question_id, is_correct, attempts, answered_at }[]` | Build mastery, streak, weak patterns. |
| `user_learning_progress` (Supabase) | `{ topic_id, concept_index }[]` | Determine if Phase A is complete. |
| `curriculum_module_progress` (Supabase) | `{ module_id, lesson_completed, quiz_passed, best_quiz_score }` | Persist phase transitions across sessions. |
| `questions` table joined on `pattern_family`, `common_mistake` | per-question tags | Drive Phase F reinforcement selection. |
| `topicTutorials.ts` | `{ concepts, commonMistakes, prepQuestions, symbolExplainers }` | Content for phases A and B. |
| `selectNextQuestion` (from `personalized-learning-spec.md`) | pure function | Produce a question for phases C, D, F. |
| `ai-tutor-spec.md` hint ladder | edge function | Produce hints, escalated by the agent's `hintAggressiveness`. |

### 5.2 Outputs (what the agent emits)

| Target | How |
|---|---|
| UI state store (React) | `PedagogyDecision` → hook `usePedagogyManager(moduleId)` returning `{ state, decide }`. |
| Question-selection wrapper | `selectNextQuestion(pool, progress, topicId, { phaseHint })` — new optional 4th arg. |
| Tutor Agent edge function | `hintAggressiveness` passed through on the call, tutor still obeys `ai-tutor-spec.md`. |
| PostHog telemetry | Events listed in §5.5. |
| Supabase persistence | Writes only to two fields (see §5.4). |

### 5.3 Supabase tables — reuse first, add only if needed

**Reuse existing:**
- `curriculum_module_progress` (already exists per `curriculum-model.md`).
- `curriculum_question_attempts` (already exists).
- `user_learning_progress` (already exists, table from `20260409000001_user_learning_progress.sql`).

**Additive columns on `curriculum_module_progress`** (single migration, no new tables):

```sql
ALTER TABLE curriculum_module_progress
  ADD COLUMN pedagogy_phase text
    CHECK (pedagogy_phase IN (
      'concept_intro','guided_example','guided_practice',
      'independent_practice','assessment','review_reinforce','done'
    )),
  ADD COLUMN pedagogy_state jsonb DEFAULT '{}'::jsonb;
```

`pedagogy_state` holds the rest of `PedagogyModuleState` fields that aren't already columns: `correctStreak`, `frustrationSignals`, `weakPatterns`, `phaseEnteredAt`, `velocity`. Using `jsonb` avoids a new schema iteration each time a derived field is added.

**No new tables.** Cross-topic weakness analysis runs as a query over `curriculum_question_attempts`.

### 5.4 Edge function interface

```ts
// supabase/functions/pedagogy-manager/index.ts (future)
POST /pedagogy-manager
body: {
  user_id: string;
  module_id: string;
  event: PedagogyEvent;
}
response: {
  decision: PedagogyDecision;
  state: PedagogyModuleState;
}
```

The function is thin:
1. Load state from `curriculum_module_progress` (or seed default).
2. Enrich with a small cross-topic weakness query.
3. Call the pure `decide(state, event)` function (runs on the edge — no LLM call needed for the core decision).
4. Persist the new `pedagogy_phase` + `pedagogy_state`.
5. Return `decision` and `state`.

**Important:** the core decide function is **deterministic and LLM-free**. It's cheap, testable, and lives in TypeScript. LLMs are only invoked by downstream consumers (Tutor Agent, Question Builder) that the decision routes to.

### 5.5 Telemetry events (PostHog)

| Event | Payload | When |
|---|---|---|
| `pedagogy_phase_entered` | `{ module_id, phase, velocity }` | On any phase transition |
| `pedagogy_frustration_detected` | `{ module_id, signals, reason }` | When `frustrationSignals ≥ 2` |
| `pedagogy_i_dont_understand` | `{ module_id, phase, last_question_id }` | On button click |
| `pedagogy_gate_blocked` | `{ module_id, score, threshold }` | On failed assessment |
| `pedagogy_gate_dismissed` | `{ module_id, score }` | On power-user dismissal |
| `pedagogy_skip_exam_triggered` | `{ module_id, result }` | On skip-exam flow |
| `pedagogy_celebration_shown` | `{ module_id, reason }` | On micro-win |

---

## 6. Beginner-First Principles

These are product-level rules the decision engine and the UI must respect. They are not code paths — they are constraints on content and interaction.

### 6.1 Real-world analogy first
Every topic's Phase A **must** begin with a relatable Hebrew analogy before any code appears. This is additive to existing `topicTutorials.ts` — spec adds a new optional field `realWorldAnalogy?: string` on `TopicTutorial` (deferred from sub-issue #84-E). Example for `variables_io`:

> "חשבו על משתנה כמו על מגירה עם תווית. התווית היא השם של המשתנה, והתוכן של המגירה הוא הערך. כשאתם כותבים `x = 5`, זה כמו להדביק תווית 'x' על מגירה ולשים בה את המספר 5."

If a topic lacks an analogy, the agent refuses to start Phase A and surfaces a TODO marker in dev mode. In production, it falls back to the `introduction` field — but this is logged as content debt.

### 6.2 Visual before abstract
Phase B (guided examples) must render at least one of:
- A trace table (rows of variable values per step), OR
- A diagram from `symbolExplainers`, OR
- A code block with per-line annotation bubbles.

Pure prose explanations are not acceptable in Phase B.

### 6.3 One concept at a time
- Phase A concept cards are shown **one at a time**, not as a scrollable wall.
- Each card has exactly one "Next" button.
- No more than **one new code snippet** per card.
- No nested tabs, no collapsed sections with important content inside.

This is a hard constraint: if a concept card exceeds 120 words of Hebrew prose, it must be split.

### 6.4 Immediate feedback
Every student action gets a response within 300ms (visual) and before the next user action (logical):
- Answer submitted → color change + explanation block within 300ms.
- "Next" tapped → next card rendered within 300ms.
- Hint requested → "חושב…" skeleton within 300ms, real hint within 2s.
- Idle detected → encouragement tooltip after 60s, not sooner.

### 6.5 Positive reinforcement (not gamification)
The agent emits celebration moments only on **meaningful** transitions:

- First correct answer in Phase C: "יופי! זה הראשון. אפשר להמשיך." (one-line, 2s toast)
- First phase transition C → D: "אתה מוכן לשלב הבא — פחות רמזים, עצמאות גדולה יותר." (one-line modal, dismissible)
- Assessment passed: "עברת את המבחן — המודול הבא נפתח." (full-screen celebration, one-time)
- Mistake resolved after review: "זה היה קשה קודם. עכשיו זה ברור לך." (inline acknowledgement)

What is **forbidden**:
- No XP numbers, no stars, no confetti for every correct answer.
- No streak counters.
- No "You're on fire!" style hyperbole.
- No comparisons to other students.
- No daily-goal nagging.

### 6.6 "I don't understand" button
Always-visible button (except during an active assessment). See §4.7 for the decision behavior. UI copy: **"לא הבנתי — תסביר אחרת"**. Placement: below the question, above the submit button, always the same position.

### 6.7 No information overload
- Hints are **cumulative** per `ai-tutor-spec.md §9` — but the agent caps visible hints at two at a time. Older hints collapse into a "היסטוריה" toggle.
- Common mistakes list shows max 3 at a time. The rest are behind a "עוד טעויות" expander.
- Error messages never include stack-trace-like content. Compile errors are translated to Hebrew pedagogical messages by the Tutor Agent, not surfaced raw.

### 6.8 Every topic must fail gracefully
If the agent cannot advance a student out of Phase C after 15 attempts, it must:
1. Suggest pausing the module.
2. Offer to "try a different angle" — jump the student to a sibling concept that shares the same `pattern_family`.
3. Fire `pedagogy_stuck` telemetry so the content team can review.

This is a **content smell**, not a student failure. The agent treats repeated stickiness as a signal that the material needs work.

---

## 7. Reference Walkthrough — `variables_io` for a Complete Beginner

This walkthrough is the **canonical template**. Every other topic's pedagogy flow should mirror this structure, adjusted for content.

**Student:** Noa, first time on ExamPrep Master. No prior Python. Hebrew speaker. Guest account.

### 7.1 First visit to the module

1. Noa taps the **variables_io** module card on the Dashboard.
2. `usePedagogyManager("<variables_io module id>")` runs → no prior state → seed default.
3. Agent emits decision:
   ```
   { nextPhase: "concept_intro",
     nextAction: { kind: "show_concept_card", index: 0 },
     hintAggressiveness: "off",
     uiFlags: { showIDontUnderstandButton: true,
                showSkipExamButton: true,
                showProgressBar: true,
                showCelebration: false } }
   ```
4. UI renders **Phase A, card 0**: real-world analogy first.

   > "חשבו על משתנה כמו על מגירה עם תווית. התווית היא השם של המשתנה, והתוכן של המגירה הוא הערך."

   Below: a simple diagram of a drawer labeled `x` with a `5` inside. No code yet.

5. Noa taps "Next". Agent records `finish_concept { index: 0 }`, advances to card 1.

### 7.2 Concept intro (cards 1–3)

- **Card 1:** First code appearance. `x = 5`. One line. One annotation bubble pointing at `x` saying "שם המשתנה" and at `5` saying "הערך".
- **Card 2:** Types. `x = 5` (int) vs `name = "Noa"` (str) vs `pi = 3.14` (float). Three drawers side by side, color-coded by type.
- **Card 3:** I/O. `name = input("איך קוראים לך? ")` and `print("שלום", name)`. Trace table with two rows: "לפני input: name לא קיים" / "אחרי input: name == 'Noa'".

After card 3, the agent detects all cards read (`user_learning_progress` has 3 entries for this topic). Decision:

```
{ nextPhase: "guided_example", ... }
```

### 7.3 Guided example (Phase B)

The agent picks the first `prepQuestions` entry as a worked example:

```python
def mystery(n):
    result = ""
    for i in range(n):
        result += str(i * 2) + " "
    print(result)

mystery(3)
```

This is too advanced for Phase A, but Phase B uses it as a **narrated walkthrough**. The agent walks Noa through it step by step:

1. "בהתחלה `result` הוא מחרוזת ריקה."
2. "הלולאה רצה 3 פעמים: i=0, i=1, i=2."
3. Trace table expands row by row as Noa taps "Next": `result = "0 "`, `result = "0 2 "`, `result = "0 2 4 "`.
4. "בסוף מדפיסים `0 2 4`."

Noa taps "הבנתי" at the end. Agent advances to Phase C.

### 7.4 Guided practice (Phase C) — first question

The agent calls `selectNextQuestion(pool, progress, "variables_io", { phaseHint: "guided_practice", difficultyPin: "easy" })`. An easy question is returned:

> "מה יוצג: `x = 5; y = 3; print(x + y)`?"
> A) `53` B) `8` C) `x+y` D) שגיאה

Hint aggressiveness: `auto_after_delay`. Noa selects **A) 53** (wrong — she thinks `+` concatenates).

### 7.5 Wrong answer, first attempt

- `event: answer_submitted { correct: false, attempts: 1 }`.
- Phase is `guided_practice`, attempts = 1 → decision: **show same question again with hintLevel 1 auto-suggested**.
- Hint bubble appears after 10s: "שים לב שגם `x` וגם `y` הם מספרים שלמים (int). מה קורה כשמחברים שני מספרים?"
- The "לא הבנתי — תסביר אחרת" button is visible at the bottom.

### 7.6 Hint works, correct answer

- Noa selects **B) 8**. Correct.
- `event: answer_submitted { correct: true }`, `correctStreak = 1`.
- Agent does **not** celebrate yet (only celebrates first-correct and transitions).
- Actually — this IS her first correct answer in Phase C. So:
  - One-line toast: "יופי! זה הראשון. אפשר להמשיך." (2s)
  - `pedagogy_celebration_shown { reason: "first_correct" }`
- Next question served. `correctStreak = 1`, need 3 in a row to advance.

### 7.7 Building streak and transitioning to Phase D

- Questions 2 and 3: correct. `correctStreak = 3`, `mastery = 1.0`.
- Agent checks Phase C exit criterion: **≥ 3 in a row on easy → advance**.
- Decision: `{ nextPhase: "independent_practice", showCelebration: true, ... }`.
- Modal: "אתה מוכן לשלב הבא — פחות רמזים, עצמאות גדולה יותר." Dismissible.
- `pedagogy_phase_entered { phase: "independent_practice" }`.

### 7.8 Independent practice (Phase D) — a harder question and a stumble

- Agent requests a medium question. `selectNextQuestion` returns a tracing question involving `input()` and `int()` conversion.
- Noa answers wrong. Attempts = 1. Phase is `independent_practice` → no auto hint, hint button available on demand.
- Noa taps the hint button → hintLevel 1 fires.
- Noa answers wrong again. Attempts = 2.
- Agent checks: is this `pattern_family` (`input_conversion`) failing ≥ 3 times this session? No, this is the first failure.
- Decision: pick an easier variant with same `pattern_family`. `selectNextQuestion({ difficulty: "easy", patternFamily: "input_conversion" })`.
- Noa solves the easier variant. Agent returns to normal Phase D flow.

### 7.9 Mastery reaches 0.80 → Assessment (Phase E)

- After ~10 questions in Phase D, rolling mastery over last 6 is 0.83.
- Agent advances to Phase E.
- Modal: "מוכנה למבחן קצר? 5 שאלות, בלי רמזים. ציון מעבר: 80%."
- Student can opt to delay ("עוד קצת תרגול") — this is respected, Phase D continues.
- Student accepts → quiz starts. No hints, no retries mid-quiz.

### 7.10 Assessment outcome A — pass

- Noa scores 4/5 = 80%. Just over the gate.
- `event: quiz_completed { score: 80 }`.
- Decision: `{ nextPhase: "done", nextAction: { kind: "module_complete" }, showCelebration: true }`.
- Full-screen celebration: "עברת את המבחן — המודול הבא נפתח."
- `curriculum_module_progress.quiz_passed = true`, `best_quiz_score = 80`.
- Dashboard now unlocks `arithmetic` module.

### 7.11 Assessment outcome B — fail (alternate branch)

- If Noa scores 3/5 = 60%:
- Decision: `{ nextPhase: "review_reinforce", nextAction: { kind: "gate_blocked", reason: "score_below_threshold", suggestedAction: "review" } }`.
- Non-shaming message: "כמעט! יש שני דברים שכדאי לחזק. בוא נעבור עליהם ונחזור."
- Agent inspects the 2 failed quiz questions, extracts their `pattern_family` tags (e.g. `input_conversion`, `print_end`), adds them to `weakPatterns`.
- Phase F serves 3 questions per weak pattern. After `weakPatterns` mastery ≥ 0.75, loop back to Phase E for a retry.

### 7.12 Skip-exam alternate branch

If Noa had instead tapped "אני כבר יודעת את זה" on first entry:
- `event: claim_knowledge`.
- Agent serves 5 mixed-difficulty quiz questions immediately.
- Score ≥ 80% → module marked done, seed mastery 0.85, skip phases A–E entirely.
- Score 50–80% → land in Phase D with a note.
- Score < 50% → land in Phase A with a non-shaming note and the full walkthrough above begins.

### 7.13 Template takeaways

This walkthrough defines the template every topic must follow:

1. **Analogy first, code second, abstraction last.**
2. **Phase A is never skipped for a true beginner** — only the skip-exam flow bypasses it, and only after a proctored mini-test.
3. **First-correct celebration is sacred** — every student gets it exactly once per module, never more.
4. **Frustration = drop phase, not drop student.** Wrong answers never trigger shame copy.
5. **The 80% gate is a recommendation, not a wall.** Dismissing it is logged, but never blocked.
6. **"I don't understand" always works.** It's the student's escape hatch at every phase except assessment.

---

## 8. Open Questions (Not Decided Yet)

These are deliberately unanswered and should be revisited before implementation:

1. **Where does the decide function run?** Edge function (slow, has full DB access) vs client-side TypeScript (fast, needs synced state). Leaning client-side with edge validation, but needs benchmarking.
2. **How aggressive is cross-topic weakness propagation?** Should a weakness in `loops` pre-flag `strings` preemptively, or only after `strings` starts? Trade-off: helpfulness vs overwhelming intro.
3. **Does the agent ever generate new content**, or is it strictly a selector over existing banks? `ROADMAP.md §4 Hybrid question generation` allows AI generation, but the Pedagogy Manager may not need to — Question Builder Agents handle generation.
4. **How does the agent interact with guest users** who have no Supabase row? Probably via the existing `getAnonUserId()` fallback plus localStorage mirrors, but the exact state shape needs confirmation.
5. **How do we avoid phase thrashing** — a student who keeps bouncing C ↔ D on borderline mastery? Candidate rule: minimum 4 questions per phase before a re-transition. Needs validation.

---

## 9. Non-Goals for v1

To keep scope tight:

- No per-student time-of-day modeling.
- No social features, ever.
- No LLM-driven phase decisions (decision engine is deterministic TypeScript).
- No new Supabase tables (reuse existing, add columns only).
- No UI chat interface for the Pedagogy Manager — it emits decisions, not conversation.
- No cross-track pedagogy (Python → DevOps). Each track gets its own Pedagogy Manager config.
- No A/B testing of phase strategies in v1. That comes once telemetry proves the baseline works.

---

## 10. Success Criteria

The v1 implementation is successful when:

1. A complete beginner can enter `variables_io`, complete Phase A→E following §7's walkthrough, pass the assessment, and have the next module unlocked — with zero English in the UI and RTL correct throughout.
2. A student who fails assessment is routed to review, targets only their weak patterns, and can retry without the agent serving the same failed questions identically.
3. Frustration detection triggers a phase drop at least once in a simulated struggling-student session, and the student recovers (reaches correct answer) within 3 subsequent questions.
4. Skip-exam flow works end-to-end: a knowledgeable student can bypass phases A–D and still be correctly placed.
5. Telemetry events fire correctly for every phase transition, gate hit, and frustration signal, and show up in PostHog.
6. The `decide` function has ≥ 90% unit-test coverage on its decision branches.
7. No new Supabase tables are added — only the two additive columns on `curriculum_module_progress`.

---

## 11. Related Documents

- `ROADMAP.md` — Phases 10–13 (agent roadmap)
- `docs/ai-tutor-spec.md` — hint ladder contract
- `docs/personalized-learning-spec.md` — `selectNextQuestion` public surface
- `docs/guided-learning-plan.md` — LearnPage content and gap-closure work
- `docs/curriculum-model.md` — Track > Phase > Module domain model
- `CLAUDE.md` — product rules and no-break constraints
