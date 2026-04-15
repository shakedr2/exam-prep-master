#!/usr/bin/env node
/**
 * Upload Vite source maps to Sentry during the Vercel build, then delete
 * the .map files from the output so they aren't served publicly.
 *
 * Why a script (not @sentry/vite-plugin)?
 *   • The plugin would require adding a build-time dependency and would run
 *     on every local build too. Using sentry-cli via `npx` keeps the upload
 *     opt-in: it only runs when the three env vars below are configured in
 *     Vercel, and local dev builds are unaffected.
 *
 * Required environment variables (set in Vercel project settings):
 *   • SENTRY_AUTH_TOKEN — internal integration token with `project:releases`
 *                         and `org:read` scopes
 *   • SENTRY_ORG        — Sentry organization slug
 *   • SENTRY_PROJECT    — Sentry project slug
 *
 * Optional:
 *   • VERCEL_GIT_COMMIT_SHA — used as the Sentry release name (preferred)
 *   • SENTRY_RELEASE        — explicit override
 *
 * Exit behaviour:
 *   • Missing env vars → log and exit 0 (do NOT fail the build)
 *   • sentry-cli failure → log and exit 0 (monitoring must not block ship)
 */
import { execSync } from "node:child_process";
import { readdirSync, statSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const DIST_DIR = "dist";

function log(msg) {
  // eslint-disable-next-line no-console
  console.log(`[sentry-sourcemaps] ${msg}`);
}

function run(cmd) {
  execSync(cmd, { stdio: "inherit" });
}

function deleteMapsRecursively(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      deleteMapsRecursively(full);
    } else if (entry.endsWith(".map")) {
      unlinkSync(full);
    }
  }
}

function main() {
  const { SENTRY_AUTH_TOKEN, SENTRY_ORG, SENTRY_PROJECT } = process.env;

  if (!SENTRY_AUTH_TOKEN || !SENTRY_ORG || !SENTRY_PROJECT) {
    log(
      "SENTRY_AUTH_TOKEN / SENTRY_ORG / SENTRY_PROJECT not set — skipping upload."
    );
    // Still strip .map files so nothing leaks to the CDN.
    try {
      deleteMapsRecursively(DIST_DIR);
      log("Stripped .map files from dist/.");
    } catch {
      /* dist might not exist locally; ignore */
    }
    return;
  }

  const release =
    process.env.SENTRY_RELEASE ||
    process.env.VERCEL_GIT_COMMIT_SHA ||
    "";

  if (!release) {
    log("No release SHA available — skipping upload.");
    return;
  }

  try {
    log(`Uploading sourcemaps for release ${release}…`);
    run(
      `npx --yes @sentry/cli@^2 sourcemaps inject --release ${release} ${DIST_DIR}`
    );
    run(
      `npx --yes @sentry/cli@^2 sourcemaps upload --release ${release} --org ${SENTRY_ORG} --project ${SENTRY_PROJECT} ${DIST_DIR}`
    );
    log("Sourcemap upload complete.");
  } catch (err) {
    log(`Upload failed (non-fatal): ${err?.message ?? err}`);
  } finally {
    try {
      deleteMapsRecursively(DIST_DIR);
      log("Stripped .map files from dist/.");
    } catch (err) {
      log(`Failed to strip .map files: ${err?.message ?? err}`);
    }
  }
}

main();
