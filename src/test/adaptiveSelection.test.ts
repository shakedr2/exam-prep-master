import { describe, it, expect } from "vitest";
import {
  selectNextQuestion,
  classifyLearnerState,
  getWeakPatterns,
  type SelectableQuestion,
  type ProgressLike,
} from "@/features/progress/lib/adaptiveSelection";

const pool: SelectableQuestion[] = [
  { id: "q1", topic: "loops", difficulty: "easy", patternFamily: "range_loop" },
  { id: "q2", topic: "loops", difficulty: "medium", patternFamily: "range_loop" },
  { id: "q3", topic: "loops", difficulty: "hard", patternFamily: "nested_loops" },
  { id: "q4", topic: "loops", difficulty: "easy", patternFamily: "while_break" },
  { id: "q5", topic: "loops", difficulty: "medium", patternFamily: "nested_loops" },
];

function emptyProgress(): ProgressLike {
  return { answeredQuestions: {} };
}

describe("adaptiveSelection – classifyLearnerState", () => {
  it("returns warm-up when fewer than 3 questions attempted", () => {
    const progress: ProgressLike = {
      answeredQuestions: { q1: { correct: true, attempts: 1 } },
    };
    expect(classifyLearnerState(pool, progress)).toBe("warm-up");
  });

  it("returns retry when there are unresolved mistakes", () => {
    const progress: ProgressLike = {
      answeredQuestions: {
        q1: { correct: false, attempts: 1 },
        q2: { correct: false, attempts: 1 },
        q3: { correct: true, attempts: 1 },
      },
    };
    expect(classifyLearnerState(pool, progress)).toBe("retry");
  });

  it("returns reinforcement when 3+ attempts, no mistakes, and mastery not > 85% (< 6 attempts)", () => {
    // 3 attempts all correct → 100% mastery but only 3 attempts (< 6), so reinforcement
    const progress: ProgressLike = {
      answeredQuestions: {
        q1: { correct: true, attempts: 1 },
        q2: { correct: true, attempts: 1 },
        q3: { correct: true, attempts: 1 },
      },
    };
    expect(classifyLearnerState(pool, progress)).toBe("reinforcement");
  });

  it("returns challenge when mastery > 85% and 6+ attempts", () => {
    // Need 6 questions in the pool; extend with an extra question
    const bigPool: SelectableQuestion[] = [
      ...pool,
      { id: "q6", topic: "loops", difficulty: "medium", patternFamily: "range_loop" },
    ];
    const progress: ProgressLike = {
      answeredQuestions: {
        q1: { correct: true, attempts: 1 },
        q2: { correct: true, attempts: 1 },
        q3: { correct: true, attempts: 1 },
        q4: { correct: true, attempts: 1 },
        q5: { correct: true, attempts: 1 },
        q6: { correct: true, attempts: 1 },
      },
    };
    expect(classifyLearnerState(bigPool, progress)).toBe("challenge");
  });
});

describe("adaptiveSelection – getWeakPatterns", () => {
  it("returns empty list when no questions answered", () => {
    expect(getWeakPatterns(pool, emptyProgress())).toEqual([]);
  });

  it("identifies weak pattern after 2+ wrong attempts", () => {
    const progress: ProgressLike = {
      answeredQuestions: {
        q1: { correct: false, attempts: 1 },
        q2: { correct: false, attempts: 1 },
      },
    };
    const weak = getWeakPatterns(pool, progress);
    expect(weak).toContain("range_loop");
  });

  it("does not flag a pattern with only 1 attempt", () => {
    const progress: ProgressLike = {
      answeredQuestions: {
        q1: { correct: false, attempts: 1 },
      },
    };
    const weak = getWeakPatterns(pool, progress);
    expect(weak).not.toContain("range_loop");
  });

  it("does not flag a well-mastered pattern", () => {
    const progress: ProgressLike = {
      answeredQuestions: {
        q1: { correct: true, attempts: 1 },
        q2: { correct: true, attempts: 1 },
      },
    };
    const weak = getWeakPatterns(pool, progress);
    expect(weak).not.toContain("range_loop");
  });
});

describe("adaptiveSelection – selectNextQuestion", () => {
  it("returns null for empty pool", () => {
    expect(selectNextQuestion([], emptyProgress(), "loops")).toBeNull();
  });

  it("returns null when no questions match the topic", () => {
    expect(selectNextQuestion(pool, emptyProgress(), "strings")).toBeNull();
  });

  it("prefers easy questions in warm-up state (< 3 attempts)", () => {
    const progress: ProgressLike = {
      answeredQuestions: { q2: { correct: true, attempts: 1 } },
    };
    const next = selectNextQuestion(pool, progress, "loops");
    expect(next?.difficulty).toBe("easy");
  });

  it("boosts a question from a weak pattern family", () => {
    // q1 and q2 share range_loop; both answered incorrectly → weak pattern
    const progress: ProgressLike = {
      answeredQuestions: {
        q1: { correct: false, attempts: 1 },
        q2: { correct: false, attempts: 1 },
        q3: { correct: true, attempts: 1 },
      },
    };
    const next = selectNextQuestion(pool, progress, "loops");
    // Should prioritise questions from the weak range_loop pattern
    expect(["q1", "q2"].includes(next?.id ?? "")).toBe(true);
  });

  it("deprioritises already-correct questions", () => {
    const progress: ProgressLike = {
      answeredQuestions: {
        q1: { correct: true, attempts: 1 },
        q2: { correct: true, attempts: 1 },
        q3: { correct: true, attempts: 1 },
        q4: { correct: true, attempts: 1 },
      },
    };
    const next = selectNextQuestion(pool, progress, "loops");
    // The only unanswered question is q5
    expect(next?.id).toBe("q5");
  });
});
