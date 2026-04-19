# Welcome Email — Audit & Implementation Status

Companion document for issues #319 (bug/infra) and #320 (Phase 4 PR2 spec).

## 1. Goal

A **production-grade** welcome email that fires once per user, immediately
after they sign up via Supabase Auth. Delivered via Resend. Fully audited
via a `email_events` table. Idempotent (the webhook is the single source of
truth; client-side invoke was a belt-and-braces fallback during ramp-up).

## 2. Historical note

A draft branch `claude/implement-welcome-email-jU5Om` was explored and
abandoned because it coupled the send path to the client's JWT and did
not provide server-side audit. Do **not** merge that branch.

## 3. Architecture (as built)

```
auth.users INSERT
    │
    ▼
Supabase Auth Hook (HTTP)
    │   Authorization: Bearer <WEBHOOK_SECRET>
    │   payload: { type:"INSERT", table:"users", record:{id,email,raw_user_meta_data} }
    ▼
Edge Function: send-welcome-email (Deno)
    ├─ Resend SDK → HTML+text welcome email (Logic Flow tokens, RTL HE + EN fallback)
    └─ public.email_events row (status='sent'|'failed', provider_id, error)
```

- Entry: `supabase/functions/send-welcome-email/index.ts`
- Pure handler: `supabase/functions/send-welcome-email/handler.ts`
- Templates: `supabase/functions/send-welcome-email/template.ts`
- Tests: `supabase/functions/send-welcome-email/__tests__/index.test.ts`
- Migration: `supabase/migrations/20260419000002_email_events.sql`
- Smoke test: `scripts/smoke-welcome-email.sh`
- Dashboard hook setup: `supabase/functions/send-welcome-email/README.md`

## 4. Required env (Supabase function secrets)

| Name | Purpose |
|------|---------|
| `RESEND_API_KEY` | Resend API key (`re_...`). |
| `RESEND_FROM` | From address. Default `Logic Flow <onboarding@resend.dev>`. |
| `APP_URL` | Public app URL used in the CTA. |
| `WEBHOOK_SECRET` | Shared bearer secret the DB webhook sends (legacy `SUPABASE_WEBHOOK_SECRET` kept as a fallback for rotation). |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Auto-injected by Supabase. |
| `UNSUBSCRIBE_EMAIL` | Footer mailto (default `unsubscribe@logicflow.dev`). |

## 5. Observability

Every attempt — success or failure — writes a row:

```sql
select status, provider_id, error, created_at
from public.email_events
where kind = 'welcome'
order by created_at desc;
```

`captureException` fires on Resend errors and on audit-insert errors. The
hook currently logs to the Deno function log; wiring to Sentry is a follow-up.

## 6. Smoke test (staging)

```bash
SUPABASE_URL=https://<staging-ref>.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<staging-service-role> \
  bash scripts/smoke-welcome-email.sh
```

The script creates a throwaway `test+smoke-<ts>@logicflow.dev` user, waits up
to 30s for an `email_events` row, prints a Resend dashboard URL, then deletes
the user. Exits non-zero if no `status='sent'` row appears.

## 7. Implementation status (Phase 4 PR2)

| Item | Status |
|------|--------|
| Edge Function (webhook handler, Bearer secret) | ✅ shipped |
| HTML template (Logic Flow tokens, RTL HE + EN fallback, logo, CTA, unsubscribe) | ✅ shipped |
| Plain-text fallback | ✅ shipped |
| `email_events` table + RLS | ✅ shipped (`20260419000002_email_events.sql`) |
| Resend SDK via `npm:resend` | ✅ shipped |
| Vitest unit tests (valid, invalid auth, Resend failure, missing env, audit failure) | ✅ shipped |
| Smoke script against staging | ✅ shipped |
| Dashboard hook registration instructions | ✅ shipped (function README) |
| Sentry capture on failure paths | ⏳ logged via `captureException` hook; Deno Sentry SDK integration is follow-up |
| Deprecate client-side invoke to fallback role | ⏳ deferred — the `AuthCallbackPage` invoke now 401s harmlessly (try/catch); a follow-up will either remove it or reshape it to log `welcome_client_fallback` |

## 8. Rollback

1. Disable the Auth Hook in the Supabase dashboard.
2. (Optional) `supabase functions delete send-welcome-email`.
3. For individual users, delete their `email_events` rows to allow re-send.
