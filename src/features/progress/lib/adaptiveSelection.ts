// Personalized learning foundation — minimal next-question selector.
// Spec: docs/personalized-learning-spec.md

export type LearnerState = "warm-up" | "retry" | "reinforcement" | "challenge";

export interface AnswerRecord {
  correct: boolean;
  attempts: number;
}

export interface ProgressLike {
  answeredQuestions: Record<string, AnswerRecord>;
}

export interface SelectableQuestion {
  id: string;
  topic: string;
  difficulty?: "easy" | "medium" | "hard";
  patternFamily?: string;
  commonMistake?: string;
}

/**
 * Optional inputs that refine question selection with cross-topic data.
 *
 * `globalWeakPatterns` typically comes from `useWeakPatterns()` and lets the
 * selector favour pattern families the learner is weak at across every topic,
 * not just the current pool. Topic-local weak patterns (computed from the
 * in-memory `progress` argument) still outrank them.
 *
 * `mistakeTagHistory` is a set of `common_mistake` tags the learner has hit
 * before. Questions whose `commonMistake` matches a tag in this set get an
 * extra boost, directly targeting "specific mistakes" per Issue #75.
 */
export interface SelectOptions {
  globalWeakPatterns?: ReadonlySet<string>;
  mistakeTagHistory?: ReadonlySet<string>;
}

interface TopicStats {
  attempted: number;
  correct: number;
  unresolvedMistakeIds: Set<string>;
  weakPatterns: Set<string>;
  /** `common_mistake` tags from questions the learner got wrong. */
  mistakeTags: Set<string>;
}

function computeTopicStats(
  pool: SelectableQuestion[],
  progress: ProgressLike
): TopicStats {
  const byId = new Map(pool.map(q => [q.id, q]));
  const stats: TopicStats = {
    attempted: 0,
    correct: 0,
    unresolvedMistakeIds: new Set(),
    weakPatterns: new Set(),
    mistakeTags: new Set(),
  };
  const patternAttempts: Record<string, { correct: number; total: number }> = {};

  for (const [id, rec] of Object.entries(progress.answeredQuestions)) {
    const q = byId.get(id);
    if (!q) continue;
    stats.attempted += 1;
    if (rec.correct) {
      stats.correct += 1;
    } else {
      stats.unresolvedMistakeIds.add(id);
      if (q.commonMistake) stats.mistakeTags.add(q.commonMistake);
    }
    if (q.patternFamily) {
      const p = (patternAttempts[q.patternFamily] ||= { correct: 0, total: 0 });
      p.total += 1;
      if (rec.correct) p.correct += 1;
    }
  }

  for (const [pattern, p] of Object.entries(patternAttempts)) {
    if (p.total >= 2 && p.correct / p.total < 0.6) {
      stats.weakPatterns.add(pattern);
    }
  }
  return stats;
}

export function classifyLearnerState(
  pool: SelectableQuestion[],
  progress: ProgressLike
): LearnerState {
  const s = computeTopicStats(pool, progress);
  if (s.attempted < 3) return "warm-up";
  if (s.unresolvedMistakeIds.size > 0) return "retry";
  const mastery = s.correct / s.attempted;
  if (mastery > 0.85 && s.attempted >= 6) return "challenge";
  return "reinforcement";
}

export function getWeakPatterns(
  pool: SelectableQuestion[],
  progress: ProgressLike
): string[] {
  return [...computeTopicStats(pool, progress).weakPatterns];
}

/** Exposed so callers (PracticePage) can read the same mistakeTags the selector uses. */
export function getMistakeTags(
  pool: SelectableQuestion[],
  progress: ProgressLike
): string[] {
  return [...computeTopicStats(pool, progress).mistakeTags];
}

const DIFFICULTY_TARGET: Record<LearnerState, "easy" | "medium" | "hard"> = {
  "warm-up": "easy",
  retry: "medium",
  reinforcement: "medium",
  challenge: "hard",
};

const DIFFICULTY_ORDER: Array<"easy" | "medium" | "hard"> = ["easy", "medium", "hard"];

function difficultyScore(
  q: SelectableQuestion,
  target: "easy" | "medium" | "hard"
): number {
  if (!q.difficulty) return 1;
  if (q.difficulty === target) return 3;
  const di = DIFFICULTY_ORDER.indexOf(q.difficulty);
  const ti = DIFFICULTY_ORDER.indexOf(target);
  return Math.abs(di - ti) === 1 ? 1 : 0;
}

export function selectNextQuestion<T extends SelectableQuestion>(
  pool: T[],
  progress: ProgressLike,
  topicId: string,
  options: SelectOptions = {}
): T | null {
  const topicPool = pool.filter(q => q.topic === topicId);
  if (topicPool.length === 0) return null;

  const stats = computeTopicStats(topicPool, progress);
  const state = classifyLearnerState(topicPool, progress);
  const target = DIFFICULTY_TARGET[state];

  // Auto-populate mistakeTagHistory from the current progress if the caller
  // didn't provide one — most callers just want "tags the learner has hit
  // in this topic".
  const mistakeTagHistory = options.mistakeTagHistory ?? stats.mistakeTags;
  const globalWeakPatterns = options.globalWeakPatterns;

  let best: { q: T; score: number } | null = null;
  for (const q of topicPool) {
    const rec = progress.answeredQuestions[q.id];
    let score = difficultyScore(q, target);

    if (state === "retry" && stats.unresolvedMistakeIds.has(q.id)) score += 5;
    if (q.patternFamily && stats.weakPatterns.has(q.patternFamily)) score += 2;
    if (
      q.patternFamily &&
      globalWeakPatterns?.has(q.patternFamily) &&
      !stats.weakPatterns.has(q.patternFamily)
    ) {
      // Cross-topic weak pattern — weaker boost than topic-local so that
      // local signals still dominate when both are present.
      score += 1;
    }
    if (
      q.commonMistake &&
      mistakeTagHistory.has(q.commonMistake) &&
      !rec?.correct
    ) {
      // Target questions that address a mistake the learner has hit before,
      // but only while the learner hasn't yet answered this specific one
      // correctly.
      score += 3;
    }
    if (rec?.correct) score -= 4;
    if (rec) score -= rec.attempts;

    if (
      !best ||
      score > best.score ||
      (score === best.score && q.id < best.q.id)
    ) {
      best = { q, score };
    }
  }
  return best?.q ?? null;
}
