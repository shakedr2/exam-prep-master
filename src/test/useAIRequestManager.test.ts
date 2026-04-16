import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAIRequestManager } from "@/hooks/useAIRequestManager";

describe("useAIRequestManager", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with loading = false", () => {
    const { result } = renderHook(() => useAIRequestManager());
    expect(result.current.loading).toBe(false);
  });

  it("sets loading = true while request is in-flight", async () => {
    const { result } = renderHook(() =>
      useAIRequestManager({ debounceMs: 0 }),
    );

    let resolve!: () => void;
    const pending = new Promise<void>((r) => {
      resolve = r;
    });

    act(() => {
      result.current.submit(() => pending);
    });

    // Flush the 0ms debounce timer
    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolve();
    });

    expect(result.current.loading).toBe(false);
  });

  it("debounces rapid-fire submissions", async () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useAIRequestManager({ debounceMs: 500 }),
    );

    // Submit 3 times in quick succession
    act(() => {
      result.current.submit(fn);
    });
    act(() => {
      result.current.submit(fn);
    });
    act(() => {
      result.current.submit(fn);
    });

    // Before debounce fires
    expect(fn).not.toHaveBeenCalled();

    // After debounce fires, only the last submit should execute
    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("cancels in-flight request when a new one is submitted", async () => {
    const signals: AbortSignal[] = [];
    const { result } = renderHook(() =>
      useAIRequestManager({ debounceMs: 0 }),
    );

    // First request — will hang until aborted
    act(() => {
      result.current.submit(
        (signal) =>
          new Promise((_, reject) => {
            signals.push(signal);
            signal.addEventListener("abort", () =>
              reject(new DOMException("Aborted", "AbortError")),
            );
          }),
      );
    });

    await act(async () => {
      vi.advanceTimersByTime(0);
    });

    // Second request cancels the first
    act(() => {
      result.current.submit(vi.fn().mockResolvedValue(undefined));
    });

    // The first signal should have been aborted
    expect(signals[0]?.aborted).toBe(true);
  });

  it("cancel() clears pending debounce and aborts in-flight", async () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useAIRequestManager({ debounceMs: 500 }),
    );

    act(() => {
      result.current.submit(fn);
    });

    // Cancel before debounce fires
    act(() => {
      result.current.cancel();
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(fn).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it("swallows AbortError from cancelled requests", async () => {
    const { result } = renderHook(() =>
      useAIRequestManager({ debounceMs: 0 }),
    );

    // This should not throw
    act(() => {
      result.current.submit((signal) => {
        return new Promise((_, reject) => {
          signal.addEventListener("abort", () =>
            reject(new DOMException("Aborted", "AbortError")),
          );
          // Immediately abort
          setTimeout(() => result.current.cancel(), 0);
        });
      });
    });

    await act(async () => {
      vi.advanceTimersByTime(10);
    });

    expect(result.current.loading).toBe(false);
  });

  it("cleans up timer and abort on unmount", async () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    const { result, unmount } = renderHook(() =>
      useAIRequestManager({ debounceMs: 500 }),
    );

    act(() => {
      result.current.submit(fn);
    });

    unmount();

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    // Function should not have been called after unmount
    expect(fn).not.toHaveBeenCalled();
  });
});
