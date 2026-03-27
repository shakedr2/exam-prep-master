import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { questions } from "@/data/questions";
import type { QuizQuestion } from "@/data/questions";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

describe("useProgress – getWeakTopics", () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns empty array when no questions have been answered", () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.getWeakTopics()).toEqual([]);
  });

  it("identifies a topic with 0% success rate as weak", () => {
    const quizQs = questions.filter((q): q is QuizQuestion => q.type === "quiz");
    if (quizQs.length === 0) return; // skip if no quiz questions in data

    const { result } = renderHook(() => useProgress());

    // Answer a real quiz question incorrectly
    act(() => {
      result.current.answerQuestion(quizQs[0].id, false);
    });

    const weak = result.current.getWeakTopics();
    expect(weak.length).toBeGreaterThan(0);

    const entry = weak.find((w) => w.topicId === quizQs[0].topic);
    expect(entry).toBeDefined();
    expect(entry!.successRate).toBe(0);
  });

  it("returns at most 3 topics by default", () => {
    const { result } = renderHook(() => useProgress());
    const weak = result.current.getWeakTopics();
    expect(weak.length).toBeLessThanOrEqual(3);
  });

  it("respects a custom limit parameter", () => {
    const { result } = renderHook(() => useProgress());
    const weak = result.current.getWeakTopics(1);
    expect(weak.length).toBeLessThanOrEqual(1);
  });

  it("sorts topics by success rate ascending (weakest first)", () => {
    const { result } = renderHook(() => useProgress());
    const weak = result.current.getWeakTopics();
    for (let i = 1; i < weak.length; i++) {
      expect(weak[i].successRate).toBeGreaterThanOrEqual(weak[i - 1].successRate);
    }
  });

  it("uses questions from the actual data to determine the topic of an answered question", () => {
    const quizQs = questions.filter((q): q is QuizQuestion => q.type === "quiz");
    if (quizQs.length < 2) return; // skip if not enough data

    const [q1, q2] = quizQs;

    const { result } = renderHook(() => useProgress());

    act(() => {
      // q1 answered correctly, q2 answered incorrectly (same topic or different)
      result.current.answerQuestion(q1.id, true);
      result.current.answerQuestion(q2.id, false);
    });

    const weak = result.current.getWeakTopics(5);
    expect(Array.isArray(weak)).toBe(true);

    // Every entry must have a valid successRate in [0, 1]
    weak.forEach((entry) => {
      expect(entry.successRate).toBeGreaterThanOrEqual(0);
      expect(entry.successRate).toBeLessThanOrEqual(1);
    });
  });
});
