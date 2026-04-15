# Operations Guide

Short runbook for Sprint 2 operational tasks.

---

## Production Monitoring

See [`docs/runbook.md`](./runbook.md) for full incident response procedures.

### Sentry

Sentry is initialised in `src/lib/sentry.ts` and wraps the entire app via
`<Sentry.ErrorBoundary>` in `App.tsx`.

Key configuration:
- `environment` is set from `import.meta.env.MODE` (`production` / `development`).
- `release` is set from `VITE_APP_VERSION` (inject the git SHA or semver tag in CI).
- Session replays are captured for 10% of sessions and 100% of error sessions.
- Performance traces are sampled at 20% in production; 100% in development.
- Custom `ai.call` spans are added to every AI tutor request (see `src/components/useAIChat.ts`).

**Alert rules to configure in the Sentry dashboard:**
1. P0 — issue first seen **or** frequency > 10/min → notify Slack + email.
2. P1 — `ai.call` span p95 latency > 10 000 ms → notify Slack.

### PostHog

PostHog is initialised in `src/lib/posthog.ts`.  
Key events tracked:

| Event | Where fired | Key properties |
|-------|------------|----------------|
| `$pageview` | `PostHogPageviewTracker` in `App.tsx` | path |
| `exam_start` | `ExamMode.tsx` | `question_count` |
| `exam_completion` | `ExamMode.tsx` | `earned_points`, `correct`, `total` |
| `ai_tutor_message_sent` | `useAIChat.ts` | `question_type`, `topic` |
| `ai_tutor_response_received` | `useAIChat.ts` | `question_type`, `topic`, `duration_ms` |
| `ai_tutor_error` | `useAIChat.ts` | `question_type`, `topic`, `error` |
| `lesson_completed` | `LearnPage.tsx` | `topic_id`, `topic_name` |
| `guided_practice_graduated` | `PracticePage.tsx` | `topic_id` |

**Recommended dashboards in PostHog:**
1. Exam funnel — `exam_start` → `exam_completion`
2. Practice engagement — `practice_answered` by topic
3. AI tutor usage — `ai_tutor_message_sent` / error rate / p95 latency
4. Onboarding funnel — `/onboarding` pageview → `/dashboard` pageview

### Uptime monitoring

Deploy the `health` edge function:
```bash
supabase functions deploy health
```

The endpoint returns HTTP 200 with `{ "status": "ok" }` when the database is
reachable, and HTTP 503 with `{ "status": "degraded" }` otherwise.

**UptimeRobot setup:**
1. Create an HTTP monitor for the Vercel production URL (check every 1 min).
2. Create an HTTP monitor for `https://<PROJECT_REF>.supabase.co/functions/v1/health`.
3. Set alert contacts to the on-call email and a Slack webhook.
4. Target uptime: **99.9%**.

---

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
