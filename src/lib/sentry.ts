import * as Sentry from "@sentry/react";

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  // Release + environment let Sentry match uploaded sourcemaps to incoming
  // events and segment alerts by environment (preview vs. production).
  // VITE_SENTRY_RELEASE is injected by Vercel via the build env
  // (VERCEL_GIT_COMMIT_SHA) when configured; falls back to undefined.
  const release =
    import.meta.env.VITE_SENTRY_RELEASE ||
    import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA ||
    undefined;

  const environment =
    import.meta.env.VITE_SENTRY_ENVIRONMENT ||
    (import.meta.env.DEV ? "development" : "production");

  Sentry.init({
    dsn,
    release,
    environment,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: import.meta.env.DEV ? 1.0 : 0.2,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
