/**
 * /api/health — lightweight uptime probe.
 *
 * Purpose:
 *   External uptime monitors (BetterStack, UptimeRobot, Checkly) poll this
 *   endpoint at regular intervals. It intentionally does NOT check Supabase
 *   or any downstream dependency — that would couple uptime alerts to
 *   third-party availability and cause noisy pages.
 *
 *   If a deeper health check is needed in the future, add it as a separate
 *   `/api/ready` endpoint (liveness vs. readiness distinction).
 *
 * Response shape (stable contract — do not change without updating monitors):
 *   { status: "ok", timestamp: "<iso8601>", commit: "<sha|unknown>", version: "<sha|unknown>" }
 *
 * This file uses Node's built-in http request/response types so no additional
 * `@vercel/node` dependency is needed. Vercel auto-detects `api/*.ts` files
 * and deploys them as serverless functions.
 */
import type { IncomingMessage, ServerResponse } from "node:http";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  // Restrict to GET/HEAD — uptime probes are read-only.
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.setHeader("Allow", "GET, HEAD");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ status: "method_not_allowed" }));
    return;
  }

  const commit =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.COMMIT_SHA ||
    "unknown";

  const body = {
    status: "ok" as const,
    timestamp: new Date().toISOString(),
    commit,
    version: commit,
  };

  res.statusCode = 200;
  // Never cache — we want monitors to see the freshest liveness signal.
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
}
