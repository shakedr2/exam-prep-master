/**
 * Centralized AI client wrapper.
 * All Edge Function calls should go through `callAIFunction` (JSON) or
 * `callAIFunctionStream` (SSE/streaming). Both provide:
 *   - Configurable per-request timeout (default 30 s)
 *   - Exponential-backoff retry (default 3 attempts)
 *   - Standardised error types with Hebrew user messages
 *   - Request/response logging for debugging
 */

// ─── Error types ────────────────────────────────────────────────────────────

export type AiErrorType = "timeout" | "rate-limit" | "server-error" | "network";

/** i18n translation key for an AI error message. */
export type AiErrorKey =
  | "ai.error.timeout"
  | "ai.error.rateLimit"
  | "ai.error.serverError"
  | "ai.error.network"
  | "ai.error.generic";

export class AiError extends Error {
  constructor(
    public readonly type: AiErrorType,
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message);
    this.name = "AiError";
  }
}

/**
 * Maps an `AiErrorType` to its i18n translation key (rooted at the
 * `ai.error` namespace in the locale files).
 */
export function getAiErrorKey(error: unknown): AiErrorKey {
  if (error instanceof AiError) {
    const map = {
      timeout: "ai.error.timeout",
      "rate-limit": "ai.error.rateLimit",
      "server-error": "ai.error.serverError",
      network: "ai.error.network",
    } as const;
    return map[error.type];
  }
  // DOMException("Aborted", "AbortError") may not pass instanceof Error in all envs
  if ((error as { name?: string })?.name === "AbortError") {
    return "ai.error.timeout";
  }
  return "ai.error.generic";
}

/**
 * Returns a Hebrew fallback error string.
 * Prefer using `getAiErrorKey` + `t()` in React components.
 * This helper is kept for use outside React contexts.
 */
export function getHumanReadableError(error: unknown): string {
  const FALLBACK_MESSAGES = {
    "ai.error.timeout": "הבקשה ל-AI ארכה יותר מדי. אנא נסה שוב.",
    "ai.error.rateLimit": "שירות ה-AI עמוס כרגע. אנא המתן מעט ונסה שוב.",
    "ai.error.serverError": "שגיאה בשרת ה-AI. אנא נסה שוב.",
    "ai.error.network": "בעיית רשת. אנא בדוק את החיבור לאינטרנט ונסה שוב.",
    "ai.error.generic": "שגיאה בשירות AI. אנא נסה שוב.",
  } as const;
  return FALLBACK_MESSAGES[getAiErrorKey(error)];
}

// ─── Options ────────────────────────────────────────────────────────────────

export interface AiClientOptions {
  /** Maximum ms to wait before aborting a single attempt. Default: 30 000 */
  timeoutMs?: number;
  /** Total number of attempts (including the first). Default: 3 */
  maxRetries?: number;
  /** Base delay in ms before the first retry (doubles for each subsequent retry). Default: 500 */
  retryDelayMs?: number;
}

const DEFAULT_OPTIONS: Required<AiClientOptions> = {
  timeoutMs: 30_000,
  maxRetries: 3,
  retryDelayMs: 500,
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns the delay in ms before the nth retry attempt.
 * attempt=1 → baseMs, attempt=2 → 2*baseMs, attempt=3 → 4*baseMs, etc.
 */
function retryDelay(attempt: number, baseMs: number): number {
  return baseMs * Math.pow(2, attempt - 1);
}

function classifyHttpError(status: number): AiError {
  if (status === 429) {
    return new AiError("rate-limit", "Rate limit exceeded", status);
  }
  return new AiError("server-error", `Server error (HTTP ${status})`, status);
}

/**
 * Combines multiple AbortSignals into one. The returned signal is aborted as
 * soon as any of the source signals is aborted.
 */
function combineSignals(...signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();
  for (const signal of signals) {
    if (signal.aborted) {
      controller.abort(signal.reason);
      return controller.signal;
    }
    signal.addEventListener("abort", () => controller.abort(signal.reason), {
      once: true,
    });
  }
  return controller.signal;
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Calls a Supabase Edge Function that returns a JSON body.
 * Retries up to `maxRetries` times with exponential backoff.
 */
export async function callAIFunction<T>(
  url: string,
  payload: unknown,
  headers: Record<string, string>,
  options?: AiClientOptions,
): Promise<T> {
  const { timeoutMs, maxRetries, retryDelayMs } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    console.log(`[aiClient] attempt ${attempt}/${maxRetries} → ${url}`);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = classifyHttpError(response.status);
        console.warn(
          `[aiClient] attempt ${attempt} failed: HTTP ${response.status}`,
        );
        // Rate-limit errors won't resolve with an immediate retry
        if (error.type === "rate-limit") throw error;
        lastError = error;
      } else {
        const data = (await response.json()) as T;
        console.log(`[aiClient] attempt ${attempt} succeeded`);
        return data;
      }
    } catch (e) {
      clearTimeout(timeoutId);
      if (e instanceof AiError) throw e; // already classified, propagate
      if ((e as Error).name === "AbortError") {
        const timeoutError = new AiError("timeout", "Request timed out");
        console.warn(`[aiClient] attempt ${attempt} timed out`);
        lastError = timeoutError;
      } else {
        const networkError = new AiError("network", "Network error");
        console.warn(`[aiClient] attempt ${attempt} network error:`, e);
        lastError = networkError;
      }
    }

    if (attempt < maxRetries) {
      const delay = retryDelay(attempt, retryDelayMs);
      console.log(`[aiClient] retrying in ${delay}ms…`);
      await sleep(delay);
    }
  }

  throw lastError ?? new AiError("server-error", "Server error");
}

/**
 * Calls a Supabase Edge Function that returns a streaming SSE response.
 * Retries the *connection* up to `maxRetries` times. Once connected the
 * returned `Response` is passed back to the caller for stream processing.
 *
 * @param userSignal - AbortSignal controlled by the caller (e.g. user cancel).
 *   If this signal fires mid-retry the function throws an AbortError immediately
 *   without further retries.
 */
export async function callAIFunctionStream(
  url: string,
  payload: unknown,
  headers: Record<string, string>,
  userSignal: AbortSignal,
  options?: AiClientOptions,
): Promise<Response> {
  const { timeoutMs, maxRetries, retryDelayMs } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    // Abort if the user already cancelled before we start this attempt
    if (userSignal.aborted) throw new DOMException("Aborted", "AbortError");

    const timeoutController = new AbortController();
    const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);
    const combinedSignal = combineSignals(userSignal, timeoutController.signal);

    console.log(
      `[aiClient] stream attempt ${attempt}/${maxRetries} → ${url}`,
    );

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: combinedSignal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = classifyHttpError(response.status);
        console.warn(
          `[aiClient] stream attempt ${attempt} failed: HTTP ${response.status}`,
        );
        if (error.type === "rate-limit") throw error;
        lastError = error;
      } else {
        console.log(`[aiClient] stream attempt ${attempt} connected`);
        return response;
      }
    } catch (e) {
      clearTimeout(timeoutId);
      if (e instanceof AiError) throw e;
      if ((e as Error).name === "AbortError") {
        // Distinguish user cancellation from timeout
        if (userSignal.aborted) throw e;
        const timeoutError = new AiError("timeout", "Request timed out");
        console.warn(`[aiClient] stream attempt ${attempt} timed out`);
        lastError = timeoutError;
      } else {
        const networkError = new AiError("network", "Network error");
        console.warn(`[aiClient] stream attempt ${attempt} network error:`, e);
        lastError = networkError;
      }
    }

    if (attempt < maxRetries) {
      const delay = retryDelay(attempt, retryDelayMs);
      console.log(`[aiClient] retrying stream in ${delay}ms…`);
      await sleep(delay);
    }
  }

  throw lastError ?? new AiError("server-error", "Server error");
}
