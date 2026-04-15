# Operations Guide

Short runbook for Sprint 2 operational tasks.

## Running the question-bank batch

`scripts/insert-questions-batch2.sql` adds 72 reviewed Hebrew questions
(9 per topic × 8 topics). It is **not** a migration — migrations live in
`supabase/migrations/` and run automatically; this script is meant to be
run once, manually, against the live Supabase database.

### Option A — Supabase CLI (preferred)

```bash
# Make sure the project is linked first:
supabase link --project-ref <your-project-ref>

# Execute the batch against the linked database:
supabase db execute --file scripts/insert-questions-batch2.sql
```

### Option B — `psql` direct

Grab the connection string from Supabase Dashboard → Project Settings →
Database → Connection string (use the **session pooler** URL), then:

```bash
psql "postgresql://postgres:<password>@<host>:5432/postgres" \
  -f scripts/insert-questions-batch2.sql
```

### Option C — Supabase Dashboard SQL editor

1. Open the project → SQL Editor → New query.
2. Paste the contents of `scripts/insert-questions-batch2.sql`.
3. Run. The whole batch is wrapped in `BEGIN; … COMMIT;` so it either
   fully succeeds or fully rolls back.

### Verification

```sql
select topic_id, count(*)
from questions
group by topic_id
order by topic_id;
```

Expected after the batch: 152 total (80 from Sprint 1 + 72 new).

---

## Configuring the Gemini API key for `ai-explain`

The `supabase/functions/ai-explain` edge function tries Gemini first and
falls back to OpenAI on any error. To enable Gemini in production, set
`GEMINI_API_KEY` as a Supabase edge-function secret.

1. Create the API key in [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Set it as a secret against the linked Supabase project:

```bash
supabase secrets set GEMINI_API_KEY=<your-gemini-key>
```

3. (Recommended) keep an OpenAI key set as well so the fallback path
   stays live if Gemini throws 429 or any other error:

```bash
supabase secrets set OPENAI_API_KEY=<your-openai-key>
```

4. Verify the secrets are present:

```bash
supabase secrets list
```

5. Redeploy the function so it picks up the new secrets:

```bash
supabase functions deploy ai-explain
```

### Notes
- Never commit API keys to the repo.
- Rotating the key is just `supabase secrets set GEMINI_API_KEY=<new>`
  followed by a redeploy.
- If both `GEMINI_API_KEY` and `OPENAI_API_KEY` are unset the function
  returns an error — this is intentional.

---

## Security Audit — RLS & Auth Hardening (#170)

_Last reviewed: 2026-04-15 · Migration: `20260415000002_harden_rls_policies.sql`_

### RLS coverage matrix

Every table in the `public` schema has **Row Level Security enabled**. The
matrix below lists the effective policies after this hardening pass.

| Table                          | Access model                                             | Notes |
|--------------------------------|----------------------------------------------------------|-------|
| `topics`                       | public read                                              | static curriculum data |
| `questions`                    | public read; writes auth-only                            | |
| `question_candidates`          | public read; writes **service-role only**                | reviewer tool/edge fn |
| `curriculum_tracks`            | public read                                              | |
| `curriculum_phases`            | public read                                              | |
| `curriculum_modules`           | public read                                              | |
| `curriculum_lessons`           | public read                                              | |
| `curriculum_concepts`          | public read                                              | |
| `curriculum_practices`         | public read                                              | |
| `curriculum_quizzes`           | public read                                              | |
| `curriculum_translations`      | public read                                              | |
| `user_profiles`                | owner-only (auth.uid() = id) for R/W                     | |
| `user_progress`                | **anon**: permissive · **authenticated**: owner-only     | supports localStorage guest learners |
| `user_learning_progress`       | permissive (text user_id, application-layer isolation)   | documented trade-off |
| `user_topic_completions`       | permissive (text user_id, application-layer isolation)   | documented trade-off |
| `curriculum_question_attempts` | owner-only R + I (append-only, no U/D)                   | authenticated role |
| `curriculum_track_enrolments`  | owner-only R/I/U                                         | |
| `curriculum_module_progress`   | owner-only R/I/U                                         | |
| `exam_results` *(new)*         | owner-only R + I (append-only, no U/D)                   | authenticated role |
| `ai_explanation_cache` *(new)* | authenticated read; writes service-role only             | |

### Changes applied in this pass

1. **Blanket `alter table … enable row level security`** on every public
   table (idempotent safety net against tables created without RLS).
2. **`user_progress`** — replaced the three blanket permissive policies with
   role-scoped policies so authenticated users are now isolated to their own
   rows (`auth.uid() = user_id`) while anonymous guests retain the
   localStorage UUID workflow.
3. **`curriculum_question_attempts`** — re-asserted the existing policies as
   `to authenticated` only. UPDATE/DELETE remain implicitly denied (append-only
   attempts log).
4. **`question_candidates`** — revoked broad authenticated INSERT/UPDATE/DELETE
   policies. Writes now require the service role, gating them behind the
   review tooling / edge function.
5. **`exam_results`** (new) — tight owner-only R/I policies. Historical
   records are append-only: no UPDATE or DELETE policies exist.
6. **`ai_explanation_cache`** (new) — authenticated-read cache. All writes go
   through the edge function running with the service role so we can attribute
   LLM cost and enforce rate limits.
7. **Default privilege revoke** on the two new tables, followed by explicit
   `GRANT` to the `authenticated` role for the allowed commands.

### Guest vs. authenticated access

- **Guest (anon) users** can only read public content and write to legacy
  permissive progress tables using their client-generated UUID. They cannot
  call the AI tutor edge function and cannot read `ai_explanation_cache` or
  `exam_results`.
- **Authenticated users** may read/write only their own rows in
  `user_progress`, `user_profiles`, `exam_results`,
  `curriculum_question_attempts`, `curriculum_track_enrolments`, and
  `curriculum_module_progress`.

### Edge function rate limiting

All LLM-backed edge functions now apply an in-memory sliding-window rate
limiter (per authenticated user id when available, otherwise per client IP).
Hitting the limit returns `429` with a `Retry-After` header.

| Function              | Budget                 | Auth requirement                    |
|-----------------------|------------------------|-------------------------------------|
| `ai-explain`          | 30 req / 60 s / caller | public (anon allowed)               |
| `ai-tutor`            | 20 req / 60 s / user   | **authenticated only** (premium)    |
| `explain`             | 30 req / 60 s / caller | public (anon allowed)               |
| `send-welcome-email`  | idempotency guard      | authenticated + caller == userId    |

The per-instance in-memory limiter is sufficient for current volume. Migrate
to a Redis/Upstash counter if the function scales to multiple regions or
replicas.

### HTTP security headers

Security headers are applied via `vercel.json` and cover every response
(including `/api/health` and static assets):

| Header                      | Value (summary) |
|-----------------------------|-----------------|
| `Content-Security-Policy`   | `default-src 'self'`; Supabase, Sentry, PostHog, Google Fonts allow-listed; `frame-ancestors 'none'`; `upgrade-insecure-requests` |
| `X-Frame-Options`           | `DENY` |
| `X-Content-Type-Options`    | `nosniff` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `Referrer-Policy`           | `strict-origin-when-cross-origin` |
| `X-XSS-Protection`          | `1; mode=block` |
| `Permissions-Policy`        | camera, microphone, geolocation, payment, usb, interest-cohort all denied |

When updating `vercel.json`, run a staging deploy and verify with:

```bash
curl -sI https://<staging-url>/ | grep -Ei 'content-security-policy|strict-transport|x-frame|x-content|referrer-policy|permissions-policy'
```

### How to apply this migration

```bash
# Against the linked Supabase project
supabase db push
# or, to run just this file
supabase db execute --file supabase/migrations/20260415000002_harden_rls_policies.sql
```

Rollback: there is no destructive change. The migration can be reverted
by dropping the new tables and re-creating the prior permissive policies
on `user_progress` — see `supabase/migrations/20260408_anon_user_progress.sql`
for the previous shape.
