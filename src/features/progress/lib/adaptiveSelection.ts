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

interface TopicStats {
  attempted: number;
  correct: number;
  unresolvedMistakeIds: Set<string>;
  weakPatterns: Set<string>;
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
  topicId: string
): T | null {
  const topicPool = pool.filter(q => q.topic === topicId);
  if (topicPool.length === 0) return null;

  const stats = computeTopicStats(topicPool, progress);
  const state = classifyLearnerState(topicPool, progress);
  const target = DIFFICULTY_TARGET[state];

  let best: { q: T; score: number } | null = null;
  for (const q of topicPool) {
    const rec = progress.answeredQuestions[q.id];
    let score = difficultyScore(q, target);

    if (state === "retry" && stats.unresolvedMistakeIds.has(q.id)) score += 5;
    if (q.patternFamily && stats.weakPatterns.has(q.patternFamily)) score += 2;
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
