import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
  useExplanationCache,
  CACHE_KEY,
  TTL_MS,
  MAX_ENTRIES,
} from "@/hooks/useExplanationCache";

// ─── Helpers ────────────────────────────────────────────────────────────────

function seedCache(
  entries: Array<{ questionId: string; explanation: string; timestamp: number }>,
) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ entries }));
}

function readRawCache() {
  const raw = localStorage.getItem(CACHE_KEY);
  return raw ? JSON.parse(raw) : null;
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe("useExplanationCache", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns null for an empty cache", () => {
    const { result } = renderHook(() => useExplanationCache());
    expect(result.current.get("q1")).toBeNull();
  });

  it("stores and retrieves an explanation", () => {
    const { result } = renderHook(() => useExplanationCache());

    act(() => {
      result.current.set("q1", "This is the answer.");
    });

    expect(result.current.get("q1")).toBe("This is the answer.");
  });

  it("returns null for expired entries", () => {
    const now = Date.now();
    seedCache([
      {
        questionId: "q1",
        explanation: "old answer",
        timestamp: now - TTL_MS - 1,
      },
    ]);

    const { result } = renderHook(() => useExplanationCache());
    expect(result.current.get("q1")).toBeNull();
  });

  it("returns valid entries within TTL", () => {
    const now = Date.now();
    seedCache([
      {
        questionId: "q1",
        explanation: "fresh answer",
        timestamp: now - TTL_MS + 60_000, // 1 minute before expiry
      },
    ]);

    const { result } = renderHook(() => useExplanationCache());
    expect(result.current.get("q1")).toBe("fresh answer");
  });

  it("evicts oldest entries when exceeding MAX_ENTRIES", () => {
    const now = Date.now();
    const entries = Array.from({ length: MAX_ENTRIES }, (_, i) => ({
      questionId: `q${i}`,
      explanation: `answer ${i}`,
      timestamp: now - (MAX_ENTRIES - i) * 1000,
    }));
    seedCache(entries);

    const { result } = renderHook(() => useExplanationCache());

    // Adding one more should evict the oldest (q0)
    act(() => {
      result.current.set("q_new", "new answer");
    });

    const cached = readRawCache();
    expect(cached.entries.length).toBe(MAX_ENTRIES);
    expect(cached.entries.find((e: { questionId: string }) => e.questionId === "q0")).toBeUndefined();
    expect(cached.entries.find((e: { questionId: string }) => e.questionId === "q_new")).toBeDefined();
  });

  it("overwrites existing entry for the same questionId", () => {
    const { result } = renderHook(() => useExplanationCache());

    act(() => {
      result.current.set("q1", "first");
    });
    act(() => {
      result.current.set("q1", "second");
    });

    expect(result.current.get("q1")).toBe("second");
    const cached = readRawCache();
    const q1Entries = cached.entries.filter(
      (e: { questionId: string }) => e.questionId === "q1",
    );
    expect(q1Entries.length).toBe(1);
  });

  it("getOrGenerate returns cached value without calling generateFn", async () => {
    const { result } = renderHook(() => useExplanationCache());
    act(() => {
      result.current.set("q1", "cached");
    });

    const gen = vi.fn().mockResolvedValue("generated");
    let value: string;
    await act(async () => {
      value = await result.current.getOrGenerate("q1", gen);
    });

    expect(value!).toBe("cached");
    expect(gen).not.toHaveBeenCalled();
  });

  it("getOrGenerate calls generateFn for missing entries and caches result", async () => {
    const { result } = renderHook(() => useExplanationCache());
    const gen = vi.fn().mockResolvedValue("generated");

    let value: string;
    await act(async () => {
      value = await result.current.getOrGenerate("q1", gen);
    });

    expect(value!).toBe("generated");
    expect(gen).toHaveBeenCalledWith("q1");
    expect(result.current.get("q1")).toBe("generated");
  });

  it("clearExpired removes only expired entries", () => {
    const now = Date.now();
    seedCache([
      { questionId: "old", explanation: "x", timestamp: now - TTL_MS - 1 },
      { questionId: "fresh", explanation: "y", timestamp: now },
    ]);

    const { result } = renderHook(() => useExplanationCache());
    act(() => {
      result.current.clearExpired();
    });

    expect(result.current.get("old")).toBeNull();
    expect(result.current.get("fresh")).toBe("y");
  });

  it("clearAll removes the entire cache", () => {
    const { result } = renderHook(() => useExplanationCache());
    act(() => {
      result.current.set("q1", "data");
    });
    act(() => {
      result.current.clearAll();
    });

    expect(localStorage.getItem(CACHE_KEY)).toBeNull();
  });

  it("prefetchNext skips already-cached questions", () => {
    const { result } = renderHook(() => useExplanationCache());
    act(() => {
      result.current.set("q1", "already cached");
    });

    const gen = vi.fn().mockResolvedValue("prefetched");
    act(() => {
      result.current.prefetchNext(["q1", "q2", "q3"], gen, 3);
    });

    // q1 should be skipped, only q2 and q3 fetched
    expect(gen).toHaveBeenCalledTimes(2);
    expect(gen).toHaveBeenCalledWith("q2");
    expect(gen).toHaveBeenCalledWith("q3");
  });

  it("prefetchNext limits to the requested count", () => {
    const { result } = renderHook(() => useExplanationCache());
    const gen = vi.fn().mockResolvedValue("x");

    act(() => {
      result.current.prefetchNext(["q1", "q2", "q3", "q4"], gen, 2);
    });

    expect(gen).toHaveBeenCalledTimes(2);
  });

  it("handles corrupt localStorage gracefully", () => {
    localStorage.setItem(CACHE_KEY, "not-valid-json");
    const { result } = renderHook(() => useExplanationCache());

    // Should not throw, just return null
    expect(result.current.get("q1")).toBeNull();

    // Should be able to write after corrupt read
    act(() => {
      result.current.set("q1", "recovered");
    });
    expect(result.current.get("q1")).toBe("recovered");
  });
});
