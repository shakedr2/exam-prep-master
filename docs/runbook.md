# Production Runbook

Procedures for common production incidents.  
Audience: on-call engineer.

---

## Table of Contents

1. [Severity levels](#severity-levels)
2. [Alerts & notification channels](#alerts--notification-channels)
3. [Incident procedures](#incident-procedures)
   - [P0 — Full site down / Vercel deploy failed](#p0--full-site-down--vercel-deploy-failed)
   - [P1 — Supabase database unavailable](#p1--supabase-database-unavailable)
   - [P1 — Auth broken (login / OAuth loop)](#p1--auth-broken-login--oauth-loop)
   - [P1 — AI tutor returning errors for all users](#p1--ai-tutor-returning-errors-for-all-users)
   - [P2 — Elevated error rate in Sentry](#p2--elevated-error-rate-in-sentry)
   - [P2 — PostHog events missing](#p2--posthog-events-missing)
4. [Health check endpoint](#health-check-endpoint)
5. [Key dashboards & links](#key-dashboards--links)
6. [Rollback procedure](#rollback-procedure)

---

## Severity levels

| Level | Definition | Response time |
|-------|-----------|---------------|
| P0 | Complete outage — site unreachable or login impossible | 15 min |
| P1 | Critical feature broken for all users | 30 min |
| P2 | Degraded feature / elevated error rate | 2 hours |
| P3 | Minor bug / cosmetic issue | Next sprint |

---

## Alerts & notification channels

| Source | Alert type | Channel |
|--------|-----------|---------|
| Sentry | Unhandled exception spike (P0/P1) | Email + Slack `#alerts-prod` |
| Sentry | `ai.call` span p95 > 10 s | Slack `#alerts-prod` |
| UptimeRobot | HTTP 5xx or no response from production URL | SMS + Email |
| UptimeRobot | Health endpoint (`/functions/v1/health`) `"degraded"` | Email |

### Configuring Sentry alert rules

In the Sentry project, go to **Alerts → Create Alert Rule** and add:

1. **P0 — Unhandled errors**
   - Condition: *An issue is first seen* **or** *issue frequency > 10/min*
   - Action: Notify Slack + email immediately

2. **P1 — AI performance degradation**
   - Condition: Metric alert on `ai.call` span p95 latency > 10 000 ms
   - Action: Notify Slack

3. **Replay capture on error**  
   `replaysOnErrorSampleRate` is set to `1.0` so every error has a full replay.  
   Open the issue in Sentry → click **Replays** tab.

### Configuring UptimeRobot

1. Create an HTTP monitor pointing to your Vercel production URL (e.g. `https://your-app.vercel.app`).
2. Create a second monitor pointing to the health endpoint:  
   `https://<SUPABASE_PROJECT_REF>.supabase.co/functions/v1/health`
3. Set check interval to **1 minute**.
4. Alert contacts: on-call email + Slack webhook.
5. Target uptime: **99.9%** (allows ~44 min/month downtime).

---

## Incident procedures

### P0 — Full site down / Vercel deploy failed

**Symptoms:** Site returns 5xx, deploy pipeline shows red, UptimeRobot fires.

1. Check **Vercel dashboard** → Deployments → look for a failed build.
2. If build failed, inspect the build log for TypeScript / ESLint errors.
3. If build succeeded but site is down, check Vercel edge network status at https://www.vercel-status.com.
4. **Rollback:** promote the previous successful deployment via Vercel dashboard → Deployments → ⋯ → **Promote to Production**.
5. Notify stakeholders in Slack `#incidents`.

---

### P1 — Supabase database unavailable

**Symptoms:** Health endpoint returns `"degraded"` with `checks.database.status = "error"`, users see loading spinners that never resolve.

1. Check Supabase status: https://status.supabase.com
2. If a global Supabase incident, wait and follow their status page updates.
3. If project-specific, go to **Supabase Dashboard → Database → Reports** and look for connection exhaustion or long-running queries.
4. If connection exhaustion:
   ```sql
   SELECT pid, usename, state, query_start, query
   FROM pg_stat_activity
   WHERE state != 'idle'
   ORDER BY query_start;
   ```
   Terminate blocking queries:
   ```sql
   SELECT pg_terminate_backend(pid) FROM pg_stat_activity
   WHERE state = 'idle in transaction' AND query_start < now() - interval '10 minutes';
   ```
5. Enable **connection pooling (transaction mode)** in Supabase settings if not already active.

---

### P1 — Auth broken (login / OAuth loop)

**Symptoms:** Users cannot sign in; `/auth/callback` returns an error or infinite redirect.

1. Check **Supabase Dashboard → Auth → Logs** for recent errors.
2. Verify the OAuth provider (Google) credentials are still valid:
   - Supabase Dashboard → Auth → Providers → Google → check client ID / secret.
3. Verify the **Site URL** and **Redirect URLs** in Auth settings match the current production domain.
4. If Google OAuth app credentials expired, rotate them in Google Cloud Console and update in Supabase.
5. Roll back to email/password login as a fallback (no code change required — the login page already supports it).

---

### P1 — AI tutor returning errors for all users

**Symptoms:** Users see "שגיאה בשירות AI"; Sentry captures `ai_tutor_error` events; PostHog `ai_tutor_error` event spike.

1. Test the edge function directly:
   ```bash
   curl -X POST https://<PROJECT_REF>.supabase.co/functions/v1/ai-tutor \
     -H "Authorization: Bearer <SUPABASE_ANON_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"messages":[{"role":"user","content":"hello"}],"questionContext":"test"}'
   ```
2. Check edge function logs: **Supabase Dashboard → Edge Functions → ai-tutor → Logs**.
3. Common causes:
   - **Expired API key:** `supabase secrets set OPENAI_API_KEY=<new-key>` then redeploy.
   - **Rate limit (429):** Wait or request a quota increase from the LLM provider.
   - **Function not deployed:** `supabase functions deploy ai-tutor`.
4. If the fix requires a new deployment:
   ```bash
   supabase functions deploy ai-tutor
   ```

---

### P2 — Elevated error rate in Sentry

**Symptoms:** Sentry alert fires; error count > baseline.

1. Open Sentry → **Issues** → filter by `environment:production` and `is:unresolved`.
2. Sort by **Events** descending to find the highest-volume issue.
3. Click the issue → review **Stack Trace**, **Breadcrumbs**, and **Replay** (if available).
4. Identify the commit that introduced the regression using Sentry's **Suspect Commits** feature.
5. If a recent deploy caused it, **rollback** (see [Rollback procedure](#rollback-procedure)).
6. Otherwise, create a hotfix branch, fix, and deploy.

---

### P2 — PostHog events missing

**Symptoms:** PostHog dashboard shows a drop in `exam_start`, `practice_answered`, or `ai_tutor_message_sent` events.

1. Open the browser console on the production site and run:
   ```js
   posthog.debug()
   ```
   Watch for network requests to `us.i.posthog.com`.
2. Verify `VITE_POSTHOG_KEY` is set in Vercel environment variables.
3. If PostHog is being blocked by an ad-blocker, events from affected users will be absent — this is expected and not actionable.
4. If the key is missing, add `VITE_POSTHOG_KEY` to Vercel → Settings → Environment Variables, then **Redeploy**.

---

## Health check endpoint

**URL:** `https://<SUPABASE_PROJECT_REF>.supabase.co/functions/v1/health`

**Method:** `GET`

**Healthy response (200):**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-04-15T12:00:00.000Z",
  "latencyMs": 42,
  "checks": {
    "database": { "status": "ok", "latencyMs": 12 }
  }
}
```

**Degraded response (503):**
```json
{
  "status": "degraded",
  "checks": {
    "database": { "status": "error", "message": "connection refused" }
  }
}
```

Point UptimeRobot (or any HTTP monitor) at this URL, and alert if:
- HTTP status ≠ 200, **or**
- JSON body `status` ≠ `"ok"`.

---

## Key dashboards & links

| Resource | URL |
|----------|-----|
| Vercel deployments | https://vercel.com/dashboard |
| Supabase dashboard | https://supabase.com/dashboard |
| Sentry issues | https://sentry.io |
| PostHog dashboards | https://us.posthog.com |
| Supabase status | https://status.supabase.com |
| Vercel status | https://www.vercel-status.com |

### Recommended PostHog dashboards

Create the following dashboards in PostHog to track key user flows:

1. **Exam funnel** — `exam_start` → `exam_completion` (include `earned_points`, `correct`/`total` properties)
2. **Practice engagement** — `practice_answered` by topic; group by `correct` to see accuracy per topic
3. **AI tutor usage** — `ai_tutor_message_sent`, `ai_tutor_response_received` (p95 `duration_ms`), `ai_tutor_error` rate
4. **Onboarding funnel** — `$pageview` on `/onboarding` → `$pageview` on `/dashboard`

---

## Rollback procedure

### Frontend (Vercel)

1. Go to **Vercel Dashboard → Project → Deployments**.
2. Find the last known-good deployment.
3. Click **⋯ (More options) → Promote to Production**.
4. Verify the site is healthy via the UptimeRobot dashboard or by hitting the health endpoint.

### Database migrations

Supabase migrations are **not automatically rolled back**. To revert a migration:
1. Write a new migration that undoes the schema change.
2. Apply it:
   ```bash
   supabase db push
   ```
3. Never delete migration files from the repo.

### Edge functions

To revert an edge function to a previous version:
```bash
# Redeploy from the last good git commit
git checkout <good-commit-sha> -- supabase/functions/<function-name>
supabase functions deploy <function-name>
```
