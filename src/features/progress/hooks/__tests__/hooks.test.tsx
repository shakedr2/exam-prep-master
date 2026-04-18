/**
 * Integration-level tests for the Phase 2 progress hook layer.
 *
 * All external data sources are mocked at the module level so the tests are
 * deterministic and free of Supabase / localStorage / React-Query plumbing.
 *
 * Key assertions:
 *  1. Σ formula — `3/10 + 7/10 = 50 %` (never the average of percentages)
 *  2. Referential stability — identical inputs → same object reference across
 *     re-renders, proving `useMemo` deps are wired correctly.
 *  3. `useResumeTarget` returns the first topic with `completionPct < 100`.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";

// ── Hoisted mutable state ─────────────────────────────────────────────────
// vi.hoisted ensures these values are initialised before the vi.mock factories
// run, even though vi.mock calls are hoisted to the top of the module.
const { state, MOCK_QUESTIONS, MOCK_MODULES } = vi.hoisted(() => {
  // 10 questions per topic — gives staticCount = 10 for each
  const MOCK_QUESTIONS = [
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `q-cond-${i}`,
      topic: "conditions",
      type: "quiz",
      difficulty: "easy",
      question: "q",
      options: [] as string[],
      correctIndex: 0,
      explanation: "",
    })),
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `q-loop-${i}`,
      topic: "loops",
      type: "quiz",
      difficulty: "easy",
      question: "q",
      options: [] as string[],
      correctIndex: 0,
      explanation: "",
    })),
  ];

  // Single module with two topics so track-level tests stay simple
  const MOCK_MODULES = [
    {
      id: "test-module",
      title: "Test Module",
      description: "desc",
      topicIds: ["conditions", "loops"],
      order: 1,
      icon: "🧪",
      track: "python-fundamentals",
    },
  ];

  // Mutable: tests write into `answeredQuestions` / `questionCounts` in
  // beforeEach; the mock factories close over this object so they always
  // serve fresh values.
  const state = {
    answeredQuestions: {} as Record<
      string,
      { correct: boolean; attempts: number }
    >,
    questionCounts: {} as Record<string, number>,
  };

  return { state, MOCK_QUESTIONS, MOCK_MODULES };
});

// ── Module mocks ──────────────────────────────────────────────────────────

vi.mock("@/hooks/useProgress", () => ({
  useProgress: () => ({
    progress: { answeredQuestions: state.answeredQuestions },
  }),
}));

vi.mock("@/hooks/useDashboardData", () => ({
  useDashboardData: () => ({
    questionCounts: state.questionCounts,
    learnMap: {},
    loading: false,
  }),
}));

vi.mock("@/data/questions", () => ({ questions: MOCK_QUESTIONS }));

// resolveTopicId is mocked so that uuid === slug; tests can then key
// questionCounts by slug without needing the real UUID map.
vi.mock("@/data/topicTutorials", () => ({
  resolveTopicId: (slug: string) => ({ uuid: slug, slug }),
}));

vi.mock("@/data/modules", () => ({
  MODULES: MOCK_MODULES,
  getModulesByTrack: (track: string) =>
    MOCK_MODULES.filter(
      (m: { track: string }) => m.track === track
    ),
  getModuleForTopic: (topicId: string) =>
    MOCK_MODULES.find((m: { topicIds: string[] }) =>
      m.topicIds.includes(topicId)
    ),
}));

// ── Imports (resolved with mocked modules above) ──────────────────────────
import { useTopicProgress } from "../useTopicProgress";
import { useModuleProgress } from "../useModuleProgress";
import { useTrackProgress, useResumeTarget } from "../useTrackProgress";

// ── Helpers ───────────────────────────────────────────────────────────────

/** Build answered-questions map: `n` correct answers for the given topic. */
function makeAnswers(
  topic: string,
  correctCount: number,
  totalAttempted = correctCount
): Record<string, { correct: boolean; attempts: number }> {
  const result: Record<string, { correct: boolean; attempts: number }> = {};
  for (let i = 0; i < totalAttempted; i++) {
    result[`q-${topic.slice(0, 4)}-${i}`] = {
      correct: i < correctCount,
      attempts: 1,
    };
  }
  return result;
}

// ── Tests ─────────────────────────────────────────────────────────────────

describe("useTopicProgress", () => {
  beforeEach(() => {
    state.answeredQuestions = {};
    state.questionCounts = {};
  });

  it("returns zero progress for an unanswered topic", () => {
    const { result } = renderHook(() => useTopicProgress("conditions"));
    expect(result.current).toEqual({
      topicId: "conditions",
      correct: 0,
      attempted: 0,
      totalQuestions: 10, // staticCount from MOCK_QUESTIONS
      completionPct: 0,
    });
  });

  it("counts only correct answers for the requested topic", () => {
    state.answeredQuestions = {
      ...makeAnswers("conditions", 3),
      // loops answers should NOT affect conditions result
      ...makeAnswers("loops", 7),
    };
    const { result } = renderHook(() => useTopicProgress("conditions"));
    expect(result.current.correct).toBe(3);
    expect(result.current.completionPct).toBe(30);
  });

  it("uses max(remote, static) for totalQuestions", () => {
    // Remote count exceeds static (10)
    state.questionCounts = { conditions: 15 };
    const { result } = renderHook(() => useTopicProgress("conditions"));
    expect(result.current.totalQuestions).toBe(15);
  });
});

describe("useModuleProgress — Σ formula", () => {
  beforeEach(() => {
    state.questionCounts = {};
  });

  it("3/10 + 7/10 = 50 % (question-weighted sum, never avg-of-%)", () => {
    // conditions: 3 correct / 10 total → 30 %
    // loops:      7 correct / 10 total → 70 %
    // module:    10 correct / 20 total → 50 % (Σ formula)
    // naive avg of percentages would also be (30+70)/2 = 50 % here,
    // but the next test shows the formulas diverge with different denominators.
    state.answeredQuestions = {
      ...makeAnswers("conditions", 3),
      ...makeAnswers("loops", 7),
    };

    const { result } = renderHook(() => useModuleProgress("test-module"));

    expect(result.current.correct).toBe(10);
    expect(result.current.totalQuestions).toBe(20);
    expect(result.current.completionPct).toBe(50);
  });

  it("Σ formula diverges from avg-of-% when topic sizes differ", () => {
    // Override remote count for conditions to exceed static (10), making
    // its denominator 20 while loops stays at max(10,10)=10.
    // conditions: 1 correct / 20 total  →  5 %
    // loops:      9 correct / 10 total  → 90 %
    // avg-of-%: round((5 + 90) / 2) = 48 %
    // Σ:        round(10 / 30 * 100)   = 33 %
    state.questionCounts = { conditions: 20 };
    state.answeredQuestions = {
      "q-cond-0": { correct: true, attempts: 1 },
      ...makeAnswers("loops", 9),
    };

    const { result } = renderHook(() => useModuleProgress("test-module"));

    const avgOfPct = Math.round((5 + 90) / 2); // 48
    const sigmaPct = Math.round((10 / 30) * 100); // 33
    expect(result.current.completionPct).toBe(sigmaPct);
    expect(result.current.completionPct).not.toBe(avgOfPct);
  });

  it("includes topic-level details in topics array", () => {
    state.answeredQuestions = {
      ...makeAnswers("conditions", 3),
      ...makeAnswers("loops", 7),
    };

    const { result } = renderHook(() => useModuleProgress("test-module"));

    expect(result.current.topics).toHaveLength(2);
    const [condTopic, loopsTopic] = result.current.topics;
    expect(condTopic.topicId).toBe("conditions");
    expect(condTopic.correct).toBe(3);
    expect(loopsTopic.topicId).toBe("loops");
    expect(loopsTopic.correct).toBe(7);
  });

  it("returns empty module when moduleId is unknown", () => {
    const { result } = renderHook(() => useModuleProgress("no-such-module"));
    expect(result.current.totalQuestions).toBe(0);
    expect(result.current.completionPct).toBe(0);
  });
});

describe("useModuleProgress — referential stability", () => {
  it("returns the same object reference when data has not changed", () => {
    // Pin a stable answeredQuestions object so useMemo deps don't change
    const stable = makeAnswers("conditions", 3);
    state.answeredQuestions = stable;
    state.questionCounts = {};

    const { result, rerender } = renderHook(() =>
      useModuleProgress("test-module")
    );
    const first = result.current;

    // Re-render without changing any mock data
    rerender();
    const second = result.current;

    expect(second).toBe(first);
  });
});

describe("useTrackProgress", () => {
  beforeEach(() => {
    state.answeredQuestions = {};
    state.questionCounts = {};
  });

  it("aggregates the single mock module's progress into the track", () => {
    state.answeredQuestions = {
      ...makeAnswers("conditions", 3),
      ...makeAnswers("loops", 7),
    };

    const { result } = renderHook(() =>
      useTrackProgress("python-fundamentals")
    );

    expect(result.current.correct).toBe(10);
    expect(result.current.totalQuestions).toBe(20);
    expect(result.current.completionPct).toBe(50);
    expect(result.current.modules).toHaveLength(1);
  });

  it("returns a track with trackId 'python' (mapped from 'python-fundamentals')", () => {
    const { result } = renderHook(() =>
      useTrackProgress("python-fundamentals")
    );
    expect(result.current.trackId).toBe("python");
  });

  it("returns zero progress for an untouched track", () => {
    const { result } = renderHook(() => useTrackProgress("devops"));
    // MOCK_MODULES has no devops modules → empty track
    expect(result.current.totalQuestions).toBe(0);
    expect(result.current.completionPct).toBe(0);
  });

  it("returns the same object reference when data has not changed", () => {
    const stable = makeAnswers("loops", 5);
    state.answeredQuestions = stable;
    state.questionCounts = {};

    const { result, rerender } = renderHook(() =>
      useTrackProgress("python-fundamentals")
    );
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});

describe("useResumeTarget", () => {
  beforeEach(() => {
    state.questionCounts = {};
  });

  it("returns the first incomplete topic when nothing has been started", () => {
    state.answeredQuestions = {};

    const { result } = renderHook(() =>
      useResumeTarget("python-fundamentals")
    );

    // Both topics have completionPct = 0; first topic ("conditions") is first
    expect(result.current).toEqual({
      trackId: "python",
      moduleId: "test-module",
      topicId: "conditions",
    });
  });

  it("skips completed topics and returns the next incomplete one", () => {
    // conditions: 10/10 = 100 % → completed; loops: 5/10 = 50 % → next
    state.answeredQuestions = {
      ...makeAnswers("conditions", 10),
      ...makeAnswers("loops", 5),
    };

    const { result } = renderHook(() =>
      useResumeTarget("python-fundamentals")
    );

    expect(result.current).toEqual({
      trackId: "python",
      moduleId: "test-module",
      topicId: "loops",
    });
  });

  it("returns null when the track is 100 % complete", () => {
    state.answeredQuestions = {
      ...makeAnswers("conditions", 10),
      ...makeAnswers("loops", 10),
    };

    const { result } = renderHook(() =>
      useResumeTarget("python-fundamentals")
    );

    expect(result.current).toBeNull();
  });
});
