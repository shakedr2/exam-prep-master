import { useCallback, useRef, useState, useEffect } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

interface UseAIRequestManagerOptions {
  /** Debounce delay in milliseconds. Default: 500 */
  debounceMs?: number;
}

interface UseAIRequestManagerReturn<T> {
  /** Submit a request. Debounced — rapid calls within `debounceMs` are collapsed. */
  submit: (fn: (signal: AbortSignal) => Promise<T>) => void;
  /** Whether a request is currently in-flight. */
  loading: boolean;
  /** Cancel the pending debounce timer and any in-flight request. */
  cancel: () => void;
}

// ─── Hook ──────────────────────────────────────────────────────────────────

/**
 * Manages AI API request lifecycle with:
 *   1. **Debounce** — collapses rapid-fire submissions into one call
 *   2. **Concurrency lock** — only one request in-flight at a time
 *   3. **Stale cancellation** — aborts the previous request when a new one arrives
 *
 * The caller provides the actual async work as a callback that receives an
 * `AbortSignal`. The hook handles timing, cancellation, and the loading flag.
 *
 * Usage:
 * ```ts
 * const { submit, loading, cancel } = useAIRequestManager<string>();
 * submit((signal) => fetchExplanation(questionId, signal));
 * ```
 */
export function useAIRequestManager<T = void>(
  options?: UseAIRequestManagerOptions,
): UseAIRequestManagerReturn<T> {
  const { debounceMs = 500 } = options ?? {};

  const [loading, setLoading] = useState(false);

  // Mutable refs so the debounce callback always sees the latest state
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const loadingRef = useRef(false);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    abortRef.current?.abort();
    setLoading(false);
    loadingRef.current = false;
  }, []);

  const submit = useCallback(
    (fn: (signal: AbortSignal) => Promise<T>) => {
      // Clear any pending debounce timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // Abort any in-flight request (stale cancellation)
      abortRef.current?.abort();

      timerRef.current = setTimeout(async () => {
        timerRef.current = null;

        const controller = new AbortController();
        abortRef.current = controller;

        setLoading(true);
        loadingRef.current = true;

        try {
          await fn(controller.signal);
        } catch (e) {
          // Swallow AbortError — it means we cancelled intentionally
          if ((e as Error).name === "AbortError") return;
          throw e;
        } finally {
          // Only clear loading if this controller is still the active one
          // (i.e. hasn't been superseded by a newer request)
          if (abortRef.current === controller) {
            setLoading(false);
            loadingRef.current = false;
          }
        }
      }, debounceMs);
    },
    [debounceMs],
  );

  return { submit, loading, cancel };
}
