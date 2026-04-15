# Production Monitoring Runbook

Operational playbook for production monitoring of exam-prep-master. Covers
Sentry (errors + performance), PostHog (product analytics), and uptime
checks against `/api/health`.

Related issue: [#167](https://github.com/shakedr2/exam-prep-master/issues/167)

---

## 1. Systems at a glance

| Tool | Purpose | Where configured | Owner |
|---|---|---|---|
| Sentry (@sentry/react) | Runtime errors, performance traces, session replay | `src/lib/sentry.ts`, `sentry/alerts.json` | Eng |
| PostHog (posthog-js) | Product analytics, funnels, feature engagement | `src/lib/posthog.ts`, `src/lib/analytics.ts` | Eng / PM |
| `/api/health` | Uptime probe for external monitors | `api/health.ts` | Eng |
| Source maps | Readable stack traces in Sentry | `scripts/sentry-upload-sourcemaps.mjs` | Eng |

## 2. Environment variables

All monitoring is opt-in via env vars. A missing var means the feature is
silently disabled — nothing will crash.

### Vite (client, available at runtime)

| Variable | Required | Where set |
|---|---|---|
| `VITE_SENTRY_DSN` | yes (prod) | Vercel → Project → Environment Variables |
| `VITE_SENTRY_ENVIRONMENT` | optional | Defaults to `production` in builds, `development` in `vite dev` |
| `VITE_SENTRY_RELEASE` | optional | Override the release tag; defaults to `VITE_VERCEL_GIT_COMMIT_SHA` |
| `VITE_POSTHOG_KEY` | yes (prod) | Vercel env |
| `VITE_POSTHOG_HOST` | optional | Defaults to `https://us.i.posthog.com` |

### Build-time (Vercel only — not shipped to the client)

| Variable | Required | Purpose |
|---|---|---|
| `SENTRY_AUTH_TOKEN` | yes for sourcemaps | Internal integration token with `project:releases` + `org:read` |
| `SENTRY_ORG` | yes for sourcemaps | Sentry org slug |
| `SENTRY_PROJECT` | yes for sourcemaps | Sentry project slug |
| `VERCEL_GIT_COMMIT_SHA` | auto | Used as Sentry release tag |

## 3. Sentry

### 3.1 Initialization

See `src/lib/sentry.ts`. We enable:

- `browserTracingIntegration()` with `tracesSampleRate: 0.2` in prod.
- `replayIntegration()` with `replaysSessionSampleRate: 0.1` and
  `replaysOnErrorSampleRate: 1.0`.
- `release` + `environment` tags so events line up with uploaded sourcemaps
  and we can split alerts by environment (preview vs. production).

### 3.2 Alert rules

The canonical alert definitions live in
[`sentry/alerts.json`](../sentry/alerts.json). Sentry does not pull from the
repo, so changes to that file must be mirrored in the Sentry UI:

1. Open **Sentry → Alerts → Create Alert**.
2. For each entry in `alerts.json`:
   - Name and description: copy exactly.
   - Conditions/triggers: match the thresholds in the JSON.
   - Environment: `production`.
   - Notification: route to the team's on-call channel (Slack / PagerDuty).
3. After any UI change, update `alerts.json` in a PR so the repo stays the
   source of truth.

Defined alerts:

- **Error spike: new issue burst** — first seen + 10 events in 1h.
- **Error spike: sustained high volume** — 50 events in 5m on any issue.
- **Regression: previously resolved issue reopened** — auto-regression rule.
- **Performance: frontend LCP degradation** — p75 LCP > 4s for 10m.
- **Performance: page-load transaction p95 > 5s** — p95 > 5s for 15m.
- **Reliability: frontend error rate > 2%** — errored session ratio > 2%.
- **Reliability: crash-free session rate < 98%** — SLO floor.

### 3.3 Source maps

On every Vercel build the root `build` script runs
`scripts/sentry-upload-sourcemaps.mjs` after `vite build`. The script:

1. Skips upload if `SENTRY_AUTH_TOKEN` / `SENTRY_ORG` / `SENTRY_PROJECT`
   are not set (keeps local builds silent).
2. Injects debug IDs into the JS bundles via `@sentry/cli sourcemaps inject`.
3. Uploads the `.map` files tagged with `VERCEL_GIT_COMMIT_SHA` as the
   release.
4. Deletes every `.map` file from `dist/` so the maps are never served
   publicly.

If you see "?" frames in Sentry:

- Confirm the Vercel build log shows `[sentry-sourcemaps] Uploading
  sourcemaps for release <sha>…` followed by `Sourcemap upload complete.`
- Confirm the event's `release` tag equals `VERCEL_GIT_COMMIT_SHA` of the
  deploy. If not, `VITE_SENTRY_RELEASE` is misconfigured.
- In Sentry → Settings → Projects → (project) → Source Maps, verify
  artifacts exist for the release in question.

## 4. PostHog events

Centralised in `src/lib/analytics.ts` (`trackDashboardViewed`,
`trackExamStarted`, `trackQuestionCompleted`). Prefer these helpers over
calling `posthog.capture` directly so event names stay consistent.

Key events and where they fire:

| Event | Fires when | File |
|---|---|---|
| `$pageview` | On every react-router navigation | `src/App.tsx` (`PostHogPageviewTracker`) |
| `dashboard_viewed` | Dashboard page first mounts | `src/pages/DashboardPage.tsx` |
| `exam_start` | User clicks "Start exam" on `/exam` | `src/pages/ExamMode.tsx` |
| `exam_completion` | Exam finish screen | `src/pages/ExamMode.tsx` |
| `question_completed` | User answers a question (practice, exam, or review) | `src/pages/PracticePage.tsx`, `src/pages/ExamMode.tsx` |
| `quiz_start` / `quiz_completion` | Practice session begin / end | `src/pages/PracticePage.tsx` |
| `mini_quiz_passed` / `mini_quiz_failed` | Topic mini-quiz outcome | `src/pages/PracticePage.tsx` |
| `lesson_*`, `guided_*` | Lesson flow milestones | `src/pages/LearnPage.tsx` |

Recommended PostHog dashboards:

1. **Activation funnel** — `$pageview (/)` → `dashboard_viewed` →
   `question_completed` (unique users, last 7 days).
2. **Practice engagement** — `question_completed` grouped by
   `topic_id`, segmented by `correct`.
3. **Exam usage** — `exam_start` → `exam_completion` conversion,
   grouped by `total_points`.
4. **Retention** — D1/D7/D30 retention keyed on first `dashboard_viewed`.

## 5. Uptime monitoring

### 5.1 Endpoint

`GET /api/health` returns:

```json
{
  "status": "ok",
  "timestamp": "2026-04-15T12:34:56.000Z",
  "commit": "<sha>",
  "version": "<sha>"
}
```

Source: `api/health.ts`. No downstream dependency checks — this is a pure
liveness probe so uptime alerts don't page us for Supabase incidents we
can't fix.

### 5.2 Recommended monitor configuration

Use BetterStack, UptimeRobot, or Checkly. Minimum viable setup:

- **URL:** `https://<production-host>/api/health`
- **Method:** `GET`
- **Interval:** 1 minute
- **Timeout:** 10 seconds
- **Alert condition:** 2 consecutive failures
- **Expected status:** `200`
- **Expected body (optional):** contains `"status":"ok"`
- **Regions:** at least 2 (e.g. `us-east`, `eu-west`) to reduce false
  positives from single-region network blips.

### 5.3 Alert routing

- Uptime monitor → on-call Slack channel + email.
- Sentry alerts → same Slack channel with separate routing key so incident
  responders can tell uptime vs. error spike apart at a glance.

## 6. Incident response

On alert:

1. **Acknowledge** the page in Slack.
2. **Check `/api/health`** from a browser. 200? → app is reachable.
3. **Open Sentry → Issues** filtered to `environment:production` and the
   last hour. Sort by event count.
4. **Open Vercel → Deployments**. Was there a deploy in the last hour?
   If yes, roll back (`Promote to Production` on the previous deploy)
   before debugging — restore first, diagnose second.
5. **Check PostHog → Live Events** to confirm whether real users are
   affected or only synthetic traffic.
6. Open a GitHub issue with the `incident` label, cross-link the Sentry
   issue and the Vercel deployment.

## 7. Changing what we monitor

Whenever you add a new user-visible flow:

- Add a `track*` helper in `src/lib/analytics.ts` (keep event names
  snake_case, verb-first).
- Call it from the page/component that triggers the action.
- If the flow is critical, add a corresponding Sentry alert definition to
  `sentry/alerts.json` and mirror it in the Sentry UI.
- Update the table in §4 of this document.
