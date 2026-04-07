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
