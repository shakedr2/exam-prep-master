/**
 * `retryLazy` wraps a dynamic `import(...)` factory so that a transient chunk
 * load failure (common after a new deploy, when the old HTML references asset
 * hashes that no longer exist on the CDN) is recovered automatically with a
 * single hard reload.
 *
 * How it works:
 *   1. Try the import. If it resolves, return the module.
 *   2. If it rejects with a signature that looks like a chunk-load / dynamic
 *      import failure, set a sentinel flag in sessionStorage and reload the
 *      page once. The fresh page will fetch the current index.html and its
 *      up-to-date asset manifest.
 *   3. If the sentinel flag is already set when we fail again, we do NOT
 *      reload — otherwise a permanent 404 would trap the user in an infinite
 *      refresh loop. Instead, we re-throw so the surrounding error boundary
 *      can render a recovery UI.
 *
 * Non-chunk-load errors (e.g. a runtime error inside the imported module) are
 * always re-thrown without reloading — reloading would not help.
 *
 * Refs: issue #152 (Learn route crashed with "Failed to fetch dynamically
 * imported module" after a deploy).
 */

const RETRY_FLAG_KEY = "retryLazy:reloaded";

function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;
  const message =
    error instanceof Error
      ? `${error.name} ${error.message}`
      : typeof error === "string"
        ? error
        : "";
  if (!message) return false;
  return (
    /Failed to fetch dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message) ||
    /Loading chunk [^\s]+ failed/i.test(message) ||
    /ChunkLoadError/i.test(message) ||
    /dynamically imported module/i.test(message)
  );
}

function safeSessionStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function hasAlreadyRetried(): boolean {
  const storage = safeSessionStorage();
  if (!storage) return false;
  try {
    return storage.getItem(RETRY_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

function markRetried(): void {
  const storage = safeSessionStorage();
  if (!storage) return;
  try {
    storage.setItem(RETRY_FLAG_KEY, "1");
  } catch {
    /* quota / privacy-mode: best-effort only */
  }
}

/**
 * Clear the retry sentinel. Call this after a successful import so that a
 * future chunk load failure (after the next deploy) can trigger a fresh
 * recovery reload instead of being treated as a second failure.
 */
export function clearRetryLazyFlag(): void {
  const storage = safeSessionStorage();
  if (!storage) return;
  try {
    storage.removeItem(RETRY_FLAG_KEY);
  } catch {
    /* ignore */
  }
}

export function retryLazy<T>(factory: () => Promise<T>): () => Promise<T> {
  return async () => {
    try {
      const mod = await factory();
      // Success: clear the sentinel so the next deploy can recover again.
      clearRetryLazyFlag();
      return mod;
    } catch (error) {
      if (!isChunkLoadError(error)) {
        throw error;
      }
      if (hasAlreadyRetried()) {
        // Already reloaded once; don't loop. Let the error boundary handle it.
        throw error;
      }
      markRetried();
      if (typeof window !== "undefined" && typeof window.location?.reload === "function") {
        window.location.reload();
        // Return a never-resolving promise so React's Suspense stays in the
        // fallback state while the browser tears the page down.
        return new Promise<T>(() => {});
      }
      throw error;
    }
  };
}
