import { useCallback, useRef } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────

interface CacheEntry {
  questionId: string;
  explanation: string;
  timestamp: number;
}

interface CacheStore {
  entries: CacheEntry[];
}

// ─── Constants ─────────────────────────────────────────────────────────────

const CACHE_KEY = "ai_explanation_cache";
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_ENTRIES = 50;

// ─── localStorage helpers ──────────────────────────────────────────────────

function readCache(): CacheStore {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return { entries: [] };
    return JSON.parse(raw) as CacheStore;
  } catch {
    return { entries: [] };
  }
}

function writeCache(store: CacheStore): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(store));
  } catch {
    // localStorage full — evict oldest half and retry
    const trimmed: CacheStore = {
      entries: store.entries.slice(Math.floor(store.entries.length / 2)),
    };
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
    } catch {
      // give up silently
    }
  }
}

// ─── Pure cache operations ─────────────────────────────────────────────────

/** Remove entries older than TTL_MS and enforce the MAX_ENTRIES cap. */
function purgeExpired(store: CacheStore): CacheStore {
  const now = Date.now();
  const fresh = store.entries.filter((e) => now - e.timestamp < TTL_MS);
  // Keep only the most recent MAX_ENTRIES
  return { entries: fresh.slice(-MAX_ENTRIES) };
}

function getEntry(store: CacheStore, questionId: string): string | null {
  const now = Date.now();
  const entry = store.entries.find(
    (e) => e.questionId === questionId && now - e.timestamp < TTL_MS,
  );
  return entry?.explanation ?? null;
}

function setEntry(
  store: CacheStore,
  questionId: string,
  explanation: string,
): CacheStore {
  // Remove any existing entry for the same question
  const filtered = store.entries.filter((e) => e.questionId !== questionId);
  filtered.push({ questionId, explanation, timestamp: Date.now() });
  // Enforce cap
  const capped = filtered.slice(-MAX_ENTRIES);
  return { entries: capped };
}

// ─── Hook ──────────────────────────────────────────────────────────────────

type GenerateFn = (questionId: string) => Promise<string>;

/**
 * localStorage-based cache for AI-generated explanations, keyed by question ID.
 *
 * Features:
 *   - 24-hour TTL per entry
 *   - LRU-style eviction (max 50 entries)
 *   - Automatic purge of expired entries on read
 *   - `prefetchNext` to background-generate explanations for upcoming questions
 *   - Offline fallback: recent explanations available even when the network is down
 */
export function useExplanationCache() {
  // Track in-flight prefetch requests so we don't duplicate work
  const inflightRef = useRef<Set<string>>(new Set());

  /** Retrieve a cached explanation (or null if missing / expired). */
  const get = useCallback((questionId: string): string | null => {
    const store = purgeExpired(readCache());
    writeCache(store); // persist the purge
    return getEntry(store, questionId);
  }, []);

  /** Store an explanation in the cache. */
  const set = useCallback((questionId: string, explanation: string): void => {
    const store = purgeExpired(readCache());
    writeCache(setEntry(store, questionId, explanation));
  }, []);

  /**
   * Fetch an explanation — returns the cached version if available,
   * otherwise calls `generateFn` and caches the result.
   */
  const getOrGenerate = useCallback(
    async (
      questionId: string,
      generateFn: GenerateFn,
    ): Promise<string> => {
      const cached = get(questionId);
      if (cached) return cached;

      const explanation = await generateFn(questionId);
      set(questionId, explanation);
      return explanation;
    },
    [get, set],
  );

  /**
   * Background-prefetch explanations for the next N question IDs.
   * Skips questions that are already cached or currently being fetched.
   */
  const prefetchNext = useCallback(
    (questionIds: string[], generateFn: GenerateFn, count = 3): void => {
      const store = purgeExpired(readCache());
      const toPrefetch = questionIds
        .filter(
          (id) =>
            !getEntry(store, id) && !inflightRef.current.has(id),
        )
        .slice(0, count);

      for (const id of toPrefetch) {
        inflightRef.current.add(id);
        generateFn(id)
          .then((explanation) => {
            set(id, explanation);
          })
          .catch(() => {
            // Prefetch failures are non-critical — silently ignore
          })
          .finally(() => {
            inflightRef.current.delete(id);
          });
      }
    },
    [set],
  );

  /** Clear all expired entries from the cache. */
  const clearExpired = useCallback((): void => {
    writeCache(purgeExpired(readCache()));
  }, []);

  /** Clear the entire cache. */
  const clearAll = useCallback((): void => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { get, set, getOrGenerate, prefetchNext, clearExpired, clearAll };
}

// Export constants for testing
export { CACHE_KEY, TTL_MS, MAX_ENTRIES };
