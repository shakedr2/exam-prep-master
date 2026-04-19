# send-welcome-email

Supabase Edge Function that sends the Logic Flow welcome email via Resend.
It is triggered by a Supabase **Auth Hook** on `auth.users` INSERT; clients do
not invoke it directly.

Part of Phase 4 PR2 — issue [#320](https://github.com/shakedr2/exam-prep-master/issues/320),
closes [#319](https://github.com/shakedr2/exam-prep-master/issues/319).

## Files

| File | Purpose |
|------|---------|
| `index.ts` | Deno entrypoint. Wires env + Resend + Supabase client. |
| `handler.ts` | Pure TypeScript handler (testable under Node/Vitest). |
| `template.ts` | HTML + plain-text template builders. |
| `__tests__/index.test.ts` | Vitest unit tests. |

## Required environment variables

Set these as **function secrets** in Supabase — never as Vite envs.

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | yes | Resend API key (`re_...`). |
| `RESEND_FROM` | no | From address. Defaults to `Logic Flow <onboarding@resend.dev>` until the custom domain is verified. |
| `APP_URL` | yes | Public URL of the app, used for the CTA (e.g. `https://logicflow.dev`). |
| `WEBHOOK_SECRET` | yes | Shared secret expected in the `Authorization: Bearer …` header. Rotate quarterly. Supabase reserves the `SUPABASE_` prefix for Edge Function secrets, so this must be set under the unprefixed name. The runtime still falls back to the legacy `SUPABASE_WEBHOOK_SECRET` env var for backwards compatibility during rotation. |
| `SUPABASE_URL` | yes | Project URL (auto-injected by Supabase runtime). |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Service-role key (auto-injected by Supabase runtime). |
| `UNSUBSCRIBE_EMAIL` | no | Address used in the footer `mailto:` link. Defaults to `unsubscribe@logicflow.dev`. |

Set via the CLI:

```bash
supabase secrets set \
  RESEND_API_KEY=re_xxx \
  RESEND_FROM='Logic Flow <onboarding@resend.dev>' \
  APP_URL=https://logicflow.dev \
  WEBHOOK_SECRET=$(openssl rand -hex 32)
```

## Deploy

```bash
supabase functions deploy send-welcome-email --project-ref gppwqdfxbakcuybohzor
```

The function URL is:

```
https://<project-ref>.supabase.co/functions/v1/send-welcome-email
```

## Register the Auth Hook (Supabase dashboard)

1. Open **Dashboard → Authentication → Hooks** (the Auth Hooks UI — not
   Database → Webhooks).
2. Click **Add a new hook** → choose **Send HTTP Request**.
3. Event: **User signup** (or the closest "after user created" event your
   Supabase tier exposes).
4. URL:
   `https://<project-ref>.supabase.co/functions/v1/send-welcome-email`
5. Headers:
   - `Authorization: Bearer <WEBHOOK_SECRET>` — must match the
     secret you set on the function.
   - `Content-Type: application/json`
6. Save. The hook fires on every successful signup with a payload of the form:
   ```json
   {
     "type": "INSERT",
     "table": "users",
     "record": {
       "id": "<uuid>",
       "email": "<email>",
       "raw_user_meta_data": { "full_name": "…" }
     }
   }
   ```
7. If the Auth Hooks UI on your plan does not let you attach custom headers,
   fall back to **Database → Webhooks** against `auth.users` with the same
   header and URL. The payload shape is identical.

### Secret rotation

1. Generate a new secret: `openssl rand -hex 32`.
2. Set it on the function first: `supabase secrets set WEBHOOK_SECRET=<new>`.
3. Update the Auth Hook header in the dashboard to the new value.
4. Re-run `scripts/smoke-welcome-email.sh` to confirm delivery.
5. Log the rotation in `STAGING_SETUP.md`.

## Observability

Every attempt writes to `public.email_events` with
`kind='welcome'` and `status` ∈ `{sent, failed}`. RLS is service-role-only for
writes; users may read their own rows.

```sql
select created_at, status, provider_id, error
from public.email_events
where user_id = '<uuid>' and kind = 'welcome'
order by created_at desc;
```

## Local smoke test

See `scripts/smoke-welcome-email.sh` — signs up a throwaway user against the
configured Supabase instance, polls `email_events`, then deletes the user.

## Local Vitest

```bash
npm run test -- supabase/functions/send-welcome-email
```
