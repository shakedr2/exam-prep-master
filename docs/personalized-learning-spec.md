# Personalized Learning Foundation — Spec

Minimal adaptive learning logic for ExamPrep Master. This is the **foundation** only — not a full SRS engine. It exists so the practice flow can pick a sensible *next* question per topic instead of walking a fixed list.

## Goals
- Pick the next question for a learner inside a topic, given their progress so far.
- Surface weaknesses (repeated mistakes, weak `pattern_family`) without overwhelming the learner.
- Stay deterministic and easy to reason about. No ML, no hidden state.

## Inputs
The selector consumes:
1. **Topic candidate pool** — all reviewed questions for the active `topic_id`.
2. **Learner progress** (existing Supabase / local progress data):
   - `answeredQuestions[id] = { correct: boolean, attempts: number }`
   - Derived: per-topic mastery, per-pattern mastery, mistake set.
3. **Optional metadata on each question** (already in the schema, may be undefined on legacy rows):
   - `difficulty` — easy | medium | hard
   - `pattern_family` — e.g. `list_reversal`, `string_parsing`, `local_maxima`
   - `common_mistake` — short tag

## Learner States (per topic)
The selector classifies the learner into one of four states for the active topic:

| State | Trigger | Selection bias |
|---|---|---|
| `warm-up` | < 3 questions answered in this topic | easy, never-seen, no `pattern_family` filter |
| `retry` | ≥ 1 unresolved mistake (answered incorrectly and not yet answered correctly later) | prefer the unresolved mistake itself, else a same-`pattern_family` peer |
| `reinforcement` | mastery 0.4–0.85, no unresolved mistakes | medium difficulty, prefer weak `pattern_family`, never-seen-correct |
| `challenge` | mastery > 0.85 and ≥ 6 answered | hard difficulty, prefer unseen, then unseen-`pattern_family` |

`mastery = correctAnswered / totalAttempted` for the topic. If the topic has no attempts, `mastery = 0` and state is `warm-up`.

## Selection Algorithm
Pure function `selectNextQuestion(pool, progress, topicId) → Question | null`.

1. Compute `state` from progress.
2. Build a candidate list filtered + scored by the bias for that state.
3. Score each candidate:
   - Base score by difficulty match for the state (+3 exact, +1 adjacent, 0 otherwise).
   - +5 if it is an unresolved mistake (only counted in `retry`).
   - +2 if its `pattern_family` is in the learner's weak set.
   - −4 if it has already been answered correctly (deprioritise but don't ban).
   - −1 per prior attempt (mild novelty bonus).
4. Pick the highest-scoring candidate. Tie-break by question id (stable / deterministic).
5. If the pool is empty, return `null`.

## What this is NOT
- Not spaced repetition with intervals.
- Not a global cross-topic recommender.
- Not a difficulty auto-tuner.
- Not personalised at the user-cohort level.

Those can be added later **on top of** this foundation without changing its public surface.

## Public surface
```ts
selectNextQuestion(pool, progress, topicId): Question | null
classifyLearnerState(progress, topicId): "warm-up" | "retry" | "reinforcement" | "challenge"
getWeakPatterns(progress, topicId): string[]
```

All functions are pure. Persistence stays in `useProgress`.
