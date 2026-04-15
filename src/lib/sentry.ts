import * as Sentry from "@sentry/react";

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

/**
 * Wraps an async AI-call function with a Sentry performance span so latency
 * and errors are visible in Sentry Tracing / Performance dashboards.
 *
 * Usage:
 *   const result = await traceAICall("ai-tutor", () => fetch(...));
 */
export async function traceAICall<T>(
  operation: string,
  fn: () => Promise<T>,
  attributes?: Record<string, string | number | boolean>,
): Promise<T> {
  return Sentry.startSpan(
    {
      name: operation,
      op: "ai.call",
      attributes,
    },
    fn,
  );
}
