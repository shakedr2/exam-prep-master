import { describe, it, expect } from "vitest";
import {
  selectNextQuestion,
  classifyLearnerState,
  getWeakPatterns,
  getMistakeTags,
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

  it("accepts a globalWeakPatterns option and boosts matching questions", () => {
    // No topic-local weak patterns, but the caller marks `while_break` as a
    // cross-topic weak pattern. With a single correct answer the learner is
    // in warm-up (target: easy). Both q1 (range_loop) and q4 (while_break)
    // are easy — the global weak boost should tip q4 ahead of q1.
    const progress: ProgressLike = {
      answeredQuestions: { q3: { correct: true, attempts: 1 } },
    };
    const next = selectNextQuestion(pool, progress, "loops", {
      globalWeakPatterns: new Set(["while_break"]),
    });
    expect(next?.id).toBe("q4");
  });

  it("keeps topic-local weak patterns ranked above global ones", () => {
    // range_loop is topic-local weak (q1, q2 both wrong). while_break is
    // globally weak. Topic-local should still win when both are possible.
    const progress: ProgressLike = {
      answeredQuestions: {
        q1: { correct: false, attempts: 1 },
        q2: { correct: false, attempts: 1 },
      },
    };
    const next = selectNextQuestion(pool, progress, "loops", {
      globalWeakPatterns: new Set(["while_break"]),
    });
    // Topic-local range_loop (q1/q2) should still be picked; unresolved
    // mistakes take priority in the retry state.
    expect(["q1", "q2"].includes(next?.id ?? "")).toBe(true);
  });

  it("boosts questions whose commonMistake matches mistakeTagHistory", () => {
    // A pool where two questions share difficulty but only one matches a
    // known mistake tag.
    const taggedPool: SelectableQuestion[] = [
      { id: "a", topic: "strings", difficulty: "medium", patternFamily: "string_slicing", commonMistake: "off_by_one_slice" },
      { id: "b", topic: "strings", difficulty: "medium", patternFamily: "string_methods" },
    ];
    // 3 attempts so we're out of warm-up, all correct so we're in
    // reinforcement (target medium).
    const progress: ProgressLike = {
      answeredQuestions: {
        other1: { correct: true, attempts: 1 },
        other2: { correct: true, attempts: 1 },
        other3: { correct: true, attempts: 1 },
      },
    };
    const next = selectNextQuestion(taggedPool, progress, "strings", {
      mistakeTagHistory: new Set(["off_by_one_slice"]),
    });
    expect(next?.id).toBe("a");
  });

  it("does not boost commonMistake matches on already-correct questions", () => {
    // If the learner already answered the question correctly, the
    // mistake-tag boost should not apply (they no longer need the extra
    // targeting).
    const taggedPool: SelectableQuestion[] = [
      { id: "a", topic: "strings", difficulty: "medium", patternFamily: "string_slicing", commonMistake: "off_by_one_slice" },
      { id: "b", topic: "strings", difficulty: "medium", patternFamily: "string_methods" },
    ];
    const progress: ProgressLike = {
      answeredQuestions: {
        a: { correct: true, attempts: 1 },
        other1: { correct: true, attempts: 1 },
        other2: { correct: true, attempts: 1 },
      },
    };
    const next = selectNextQuestion(taggedPool, progress, "strings", {
      mistakeTagHistory: new Set(["off_by_one_slice"]),
    });
    expect(next?.id).toBe("b");
  });

  it("is backwards-compatible when called without options", () => {
    // Positional-only call must still work and match the pre-options
    // behaviour (no global-weak / mistake-tag boosts, just local logic).
    const progress: ProgressLike = {
      answeredQuestions: { q2: { correct: true, attempts: 1 } },
    };
    const next = selectNextQuestion(pool, progress, "loops");
    expect(next).not.toBeNull();
    expect(next?.topic).toBe("loops");
  });
});

describe("adaptiveSelection – getMistakeTags", () => {
  it("returns mistake tags from wrong answers only", () => {
    const tagPool: SelectableQuestion[] = [
      { id: "a", topic: "t", commonMistake: "tag1" },
      { id: "b", topic: "t", commonMistake: "tag2" },
      { id: "c", topic: "t", commonMistake: "tag3" },
    ];
    const progress: ProgressLike = {
      answeredQuestions: {
        a: { correct: false, attempts: 1 },
        b: { correct: true, attempts: 1 },
        c: { correct: false, attempts: 1 },
      },
    };
    const tags = getMistakeTags(tagPool, progress).sort();
    expect(tags).toEqual(["tag1", "tag3"]);
  });

  it("returns an empty list when no questions answered", () => {
    expect(getMistakeTags(pool, emptyProgress())).toEqual([]);
  });
});
