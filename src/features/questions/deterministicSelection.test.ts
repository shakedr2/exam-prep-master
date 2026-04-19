import { describe, expect, it } from "vitest";
import {
  selectNextQuestion,
  type ProgressLike,
  type SelectableQuestion,
} from "@/features/progress/lib/adaptiveSelection";

function buildQueue(
  pool: SelectableQuestion[],
  topicId: string,
  initialProgress: ProgressLike
): string[] {
  const queue: string[] = [];
  const progress: ProgressLike = {
    answeredQuestions: { ...initialProgress.answeredQuestions },
  };

  while (queue.length < pool.length) {
    const remaining = pool.filter((q) => !queue.includes(q.id));
    const next = selectNextQuestion(remaining, progress, topicId);
    if (!next) break;

    queue.push(next.id);
    progress.answeredQuestions[next.id] = { correct: true, attempts: 1 };
  }

  return queue;
}

describe("deterministic question selection", () => {
  it("returns the same question order across reloads for the same seed progress", () => {
    const topicId = "topic-a";
    const pool: SelectableQuestion[] = [
      { id: "q-1", topic: topicId, difficulty: "easy", patternFamily: "pf-a" },
      { id: "q-2", topic: topicId, difficulty: "easy", patternFamily: "pf-b" },
      { id: "q-3", topic: topicId, difficulty: "medium", patternFamily: "pf-a" },
      { id: "q-4", topic: topicId, difficulty: "medium", patternFamily: "pf-b" },
      { id: "q-5", topic: topicId, difficulty: "hard", patternFamily: "pf-c" },
      { id: "q-6", topic: topicId, difficulty: "hard", patternFamily: "pf-c" },
    ];

    const seedProgress: ProgressLike = {
      answeredQuestions: {
        "q-2": { correct: false, attempts: 2 },
        "q-4": { correct: true, attempts: 1 },
      },
    };

    const queueA = buildQueue(pool, topicId, seedProgress);
    const queueB = buildQueue(pool, topicId, seedProgress);

    expect(queueA).toEqual(queueB);
    expect(queueA.length).toBe(pool.length);
  });
});
