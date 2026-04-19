# Welcome-Email Wiring Audit

**Date:** 2026-04-19
**Branch at audit:** `main` @ 44e9090 (plus inspection of `origin/claude/implement-welcome-email-jU5Om`, WIP, not merged)
**Scope:** Verify the delivery path for the "welcome" email sent on first authenticated session. Identify unfinished wiring, undocumented env vars, missing observability, and a safe smoke-test plan.

---

## TL;DR

| Component | Status | Notes |
|-----------|--------|-------|
| Edge function `send-welcome-email` | ✅ present on `main` (345 LOC) | Idempotency flag + Resend call wired |
| Supabase Auth webhook | ❌ **missing** | Currently only triggered client-side from `AuthCallbackPage` |
| `RESEND_API_KEY` / `RESEND_FROM` / `APP_URL` | ⚠️ undocumented | Referenced by edge function, absent from `.env.example` and `STAGING_SETUP.md` |
| `email_events` audit table | ❌ missing | No retry/send-status visibility |
| Sentry in edge function | ❌ missing | Failures only `console.error` to Deno logs |
| Tests (unit + smoke) | ❌ missing | No Vitest for the function, no `scripts/smoke-welcome-email.sh` |

Net: **not verified end-to-end.** A real user signup today would either succeed silently (no visibility) or fail silently (client swallows failure as non-fatal). That is the reason Phase 4 PR2 is still open.

---

## 1. Inventory on `main`

| Path | Role | LOC |
|------|------|-----|
| `supabase/functions/send-welcome-email/index.ts` | Edge function: parses body, checks idempotency flag, renders HTML, calls Resend, flips `user_profiles.welcome_email_sent` | 345 |
| `supabase/migrations/20260411000001_user_profiles.sql` | Creates `user_profiles` table | — |
| `supabase/migrations/20260411000003_add_welcome_email_sent.sql` | Adds the `welcome_email_sent boolean` idempotency flag | — |
| `src/pages/AuthCallbackPage.tsx:49-61` | Client-side invocation of the function after a successful auth callback, marked **non-fatal** on failure | — |
| `src/shared/integrations/supabase/types.ts:113, 122, 131` | Typed `welcome_email_sent` in row/insert/update | — |

Key behaviour (edge function, from agent read):
- Idempotent via `welcome_email_sent` flag — blocks duplicate sends.
- Uses `SUPABASE_SERVICE_ROLE_KEY` to flip the flag atomically on success.
- No retry loop; no backoff; no outbound event log.

Key behaviour (client):
- `AuthCallbackPage.tsx:60` logs `console.error("send-welcome-email failed (non-fatal)", err)`; the auth flow is **not** blocked.
- No Sentry capture on this specific failure.

---

## 2. WIP branch `claude/implement-welcome-email-jU5Om`

Inspected without merging or checkout.

- Latest commit on branch: `5436a98` — "[wip] Logic Flow welcome email + landing page (partial)"
- `main` is 7 commits ahead; branch is 1 commit ahead of its fork point.
- Diff touches 6+ files:
  - `supabase/functions/send-welcome-email/index.ts` — grows to ~530 LOC (richer HTML, `escapeHtml()`, dark-mode & Outlook compatibility hints).
  - `src/features/landing/components/FloatingLogosHero.tsx` + `src/features/landing/data/logos.ts` + `src/pages/WelcomePage.tsx` — unrelated landing-page work.
  - Deletes an older `supabase/functions/send-welcome/` function, plus two HTML templates and a plain-text template.
  - Deletes two migrations and two test files.
  - Modifies i18n locales, App.tsx, workflow, package-lock, and Supabase types.

**Gaps still present on the WIP branch:**
- Still no Supabase Auth webhook.
- Still no `email_events` table.
- Still no Sentry integration in the function.
- Deletes existing migrations/tests (net regression on observability and test coverage).
- Mixes landing-page work with email wiring — should be split per AGENTS.md "small reviewable PRs" constraint.

The branch is marked WIP/broken for a reason. **Do not merge**; B9 below captures the scope of a fresh, focused Phase 4 PR2.

---

## 3. Supabase Auth webhook status

- `supabase/config.toml` contains only `project_id`. No `[auth.hook.*]` or webhook config blocks.
- No migration defines a trigger on `auth.users INSERT`.
- No deploy script references `functions deploy send-welcome-email` with a webhook URL.

**Conclusion:** webhook path **does not exist**. The only trigger is the client-side `supabase.functions.invoke("send-welcome-email", …)` in `AuthCallbackPage.tsx`. That call can be spoofed by a malicious client; it also can't fire at all if the user never reaches the callback (e.g., email confirm failures, deep-links).

---

## 4. Environment variables & secrets

### Referenced by `supabase/functions/send-welcome-email/index.ts`
| Var | Line | Purpose |
|-----|------|---------|
| `RESEND_API_KEY` | ~207 | Auth header for the Resend REST call |
| `SUPABASE_URL` | ~208 | Admin client URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ~209 | Admin client key (flag update) |
| `APP_URL` | ~210 | Base URL for CTA in email |
| `RESEND_FROM_EMAIL` | ~211 | Hardcoded fallback `"ExamPrep <noreply@examprep.app>"` |
| `SUPABASE_ANON_KEY` | ~234 | Used for user-scoped reads |

### Declared in `.env.example`
`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`, `VITE_ADMIN_EMAIL`, `VITE_POSTHOG_KEY`, `VITE_SENTRY_DSN`, `VITE_APP_ENV`.

### Gap
None of the edge-function runtime vars are declared in `.env.example`, `.env.staging.example`, `STAGING_SETUP.md`, or `README.md`. An operator setting up a new environment has no signal that these must be set as Supabase function secrets.

---

## 5. Observability

- ❌ No `email_events` table in any migration.
- ❌ No Sentry import / capture in the edge function.
- ✅ `console.error` paths at ~311 (Resend API failure), ~326 (flag update failure), ~338 (catch-all).
- Client-side: `console.error("send-welcome-email failed (non-fatal)", err)` — error swallowed, no Sentry.

Consequence: if Resend throttles, DNS fails, API key rotates, or the template renders badly, no one will know unless they manually tail the function logs.

---

## 6. Tests

- No Vitest in `src/**/__tests__` or `supabase/**/__tests__` for welcome-email.
- No `scripts/smoke-welcome-email.sh`.
- `scripts/` today contains: `approve-candidates.sql`, `insert-questions-batch2.sql`, `insert-questions-batch3.sql`, `hooks/pre-commit`, `sentry-upload-sourcemaps.mjs`.

---

## 7. Live smoke-test plan (staging)

**Goal:** verify end-to-end delivery without polluting prod user data or mailing lists.

### Pre-flight (one-time per environment)
```
supabase secrets set RESEND_API_KEY=...        --project-ref <staging>
supabase secrets set RESEND_FROM_EMAIL='"ExamPrep <noreply@examprep.app>"' --project-ref <staging>
supabase secrets set APP_URL=https://staging.examprep.app                   --project-ref <staging>
supabase functions deploy send-welcome-email   --project-ref <staging>
```
Confirm in Supabase dashboard → Edge Functions → Secrets that all four names are present.

### Test with a throwaway inbox
1. Use a tagged email alias we own (`welcome-smoke+$(date +%s)@<our-domain>`) or a mailsink that we control (never a real user).
2. Sign up through the staging landing page. Complete email verification if enabled.
3. Watch three surfaces **in parallel**:
   - Supabase → Edge Functions → `send-welcome-email` → Logs (expect a 200 with Resend `id`).
   - Resend dashboard → Emails → filter by `to:` alias (expect status `delivered`).
   - Supabase SQL editor: `select id, welcome_email_sent, updated_at from user_profiles where email = '<alias>';` — should flip to `true`.
4. Re-invoke by signing in again: expect the idempotency short-circuit in the function logs (no second Resend call, no second row update).
5. Record outcome in the Phase 4 PR2 description.

### Negative cases
- Invalid `RESEND_API_KEY` → Resend returns 401, function logs the error, client swallows as non-fatal, no flag change. (Validates that idempotency does not mask failure.)
- Missing `APP_URL` → CTA link falls back or breaks. (Validates template guards.)

### Rollback
- `welcome_email_sent` defaults to `false`; to re-test with the same email, `update user_profiles set welcome_email_sent = false where id = '<uuid>';` (staging only).
- Remove the function: `supabase functions delete send-welcome-email --project-ref <staging>`. Leave the migrations in place — they are forward-compatible.
- Secrets can be rotated via `supabase secrets unset` without redeploy.

### Do NOT
- Trigger the smoke in production.
- Use a real customer inbox.
- Leave the test alias in the `user_profiles` table — delete after: `delete from auth.users where email = '<alias>';` (staging only).

---

## 8. Recommended follow-up work (captured as issues)

- **B8** — Welcome email is not verified end-to-end; document gaps and ship the smoke-test plan above.
- **B9** — Phase 4 PR2: wire the function via a Supabase Auth webhook (anti-spoof), add `email_events` audit table, add Sentry, document env vars, add Vitest + `scripts/smoke-welcome-email.sh`.

See `docs/audit-phase5.md` for the broader Phase 5 audit; this document is narrow-scope.
