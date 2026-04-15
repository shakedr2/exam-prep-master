# Staging & Preview Deployment Setup

This guide describes how the staging environment for Exam Prep Master is
configured, how to promote changes to production, and how to roll back.

It covers:

1. Environment matrix
2. Vercel preview deployments (per PR)
3. Supabase database branching strategy
4. Environment variable management
5. Smoke tests on preview URLs
6. Promotion workflow (staging → production)
7. Rollback procedure (target: < 5 minutes)

Related files:

- `.env.example` — production template
- `.env.staging.example` — staging template
- `vercel.json` — Vercel framework + header config
- `.github/workflows/preview-smoke-tests.yml` — smoke tests on preview URLs

Tracked by: [issue #168](https://github.com/shakedr2/exam-prep-master/issues/168).

---

## 1. Environment matrix

| Environment | Trigger | URL | Supabase | Purpose |
|---|---|---|---|---|
| **Preview** | Every PR commit | `https://exam-prep-master-git-<branch>-<team>.vercel.app` | Supabase branch (ephemeral) **or** shared staging project | Review UI + smoke tests per PR |
| **Staging** | Push to `main` (pre-promote) | `https://staging.exam-prep-master.vercel.app` (alias) | Dedicated Supabase staging project | Full integration environment, QA |
| **Production** | Manual promotion from Vercel | `https://exam-prep-master.vercel.app` (plus custom domain) | Production Supabase project | Real users |

Rule: **production never shares credentials, data, or analytics streams with
staging or previews.**

---

## 2. Vercel preview deployments (per PR)

Vercel's GitHub integration already creates a unique preview deployment for
each push to a PR branch. We rely on the default behavior and only enforce
configuration.

### One-time setup

1. **Link the repo** in the Vercel dashboard → Project → *Git*.
2. In *Settings → Git*:
   - Production Branch: `main`
   - Enable "Automatically create Preview Deployments for all branches".
   - Enable "Comment on Pull Requests" so preview URLs are posted back to GitHub.
3. In *Settings → Environments* verify three environments exist: **Production**,
   **Preview**, and (optional) **Development**.

### Build configuration

`vercel.json` at the repo root pins the framework (`vite`), build command, and
sets security headers (CSP, HSTS, X-Frame-Options). No per-environment branches
of this file are needed — the same build produces all three environments, and
environment-specific behavior is driven by `VITE_APP_ENV` + per-environment
variables.

### Per-PR preview checklist

Every PR should automatically get:

- [x] A unique `*.vercel.app` preview URL (posted by Vercel bot)
- [x] `Preview Smoke Tests` workflow green (see §5)
- [x] Lint + unit tests green (`PR Checks` workflow)

---

## 3. Supabase database branching strategy

We support two strategies. Pick one per environment:

### Strategy A — Supabase branches (preferred for previews)

Supabase's built-in Git-based branching creates an ephemeral Postgres branch
per Git branch, with migrations replayed from `supabase/migrations/`.

- **Enable:** Supabase Dashboard → Project → *Branching* → connect the GitHub
  repo and enable "Create branch for every pull request".
- **How it works:** Pushing to a PR branch creates a Supabase branch with a
  full schema copy and an empty (or seeded) data set. The branch gets its own
  URL + anon key, injected into Vercel previews via Supabase's Vercel
  integration.
- **Lifecycle:** The branch is torn down when the PR is merged or closed.
- **Pros:** Zero-risk schema changes, real migration testing, isolated per PR.
- **Cons:** Slower cold-start; costs per active branch.

### Strategy B — Dedicated staging project (preferred for long-lived staging)

A separate Supabase project named `exam-prep-master-staging` with the same
schema as production. Used for the long-lived staging alias and as a fallback
when branches are disabled.

- **Provisioning:**
  1. Create a new Supabase project in the same region as production.
  2. Apply migrations: `supabase db push --linked --project-ref <staging-ref>`.
  3. Seed baseline data (optional) from `supabase/seed.sql`.
- **Schema sync:** every migration merged to `main` is auto-applied to staging
  via `supabase db push` in CI (future work — tracked under issue #168).
- **Access:** only team members and a read-only QA account. No real user data.

### Which strategy where?

| Environment | Strategy | Notes |
|---|---|---|
| Preview (per PR) | **A** (Supabase branches) | Falls back to **B** credentials if branching is disabled. |
| Staging (long-lived) | **B** (dedicated project) | Stable URL, shared by QA. |
| Production | N/A | Single Supabase project, no branching. |

### Schema-based isolation (not used)

We deliberately do **not** use schema-based isolation (e.g.
`staging.users` vs `public.users` in one database) because:

- RLS policies would need to be duplicated and drift would be invisible.
- A migration bug in staging could corrupt production tables.
- Supabase Auth is per-project, not per-schema.

---

## 4. Environment variable management

### Where variables live

| Source | Used by | Commit? |
|---|---|---|
| `.env.example` | Local dev scaffold | ✅ yes |
| `.env.staging.example` | Staging scaffold | ✅ yes |
| `.env`, `.env.staging`, `.env.production` | Local dev only | ❌ gitignored |
| Vercel → Environment Variables | Preview / Staging / Production builds | — |
| GitHub Actions secrets | CI test + build jobs | — |

### Required variables

See `.env.example` (production) and `.env.staging.example` (staging) — both
are kept in sync and the staging file sets `VITE_APP_ENV=staging`.

### Vercel scoping rules

When adding a variable in Vercel, choose the correct *Environment* scope:

- **Production** → only the production build.
- **Preview** → every PR preview and every non-main branch build.
- **Development** → `vercel dev` only.

Keep production Supabase keys scoped to **Production only**. Staging/preview
Supabase keys scope to **Preview** (and to a specific Git branch if you run a
long-lived staging alias).

### Local workflow

```bash
# Production-like local build
cp .env.example .env
npm run dev

# Staging-like local build (uses .env.staging)
cp .env.staging.example .env.staging
npm run dev -- --mode staging
npm run build -- --mode staging
```

Vite automatically loads `.env.staging` when invoked with `--mode staging`.

---

## 5. Smoke tests on preview URLs

File: `.github/workflows/preview-smoke-tests.yml`.

### What it does

Listens for GitHub's `deployment_status` event (emitted by the Vercel GitHub
integration). When a Preview deployment reports `state: success`, it runs:

1. **Readiness wait** — polls the preview URL until `HTTP 200` (6 attempts,
   exponential backoff).
2. **HTML shell check** — asserts the response contains `<html dir="rtl">`
   and references a built `/assets/*.js` bundle.
3. **SPA fallback check** — requests a deep link (`/practice/variables_io`)
   and verifies the rewrite in `vercel.json` still serves the HTML shell.
4. **Security header check** — asserts `Content-Security-Policy`,
   `X-Frame-Options`, and `Strict-Transport-Security` headers are present.

### Why not Playwright / headless browser?

For a staging gate we want a workflow that is **fast, free, and boring**. The
HTTP checks above catch the overwhelming majority of broken deployments (bad
build, missing env vars, broken rewrites, missing CSP). A full Playwright E2E
suite belongs in the pre-merge `PR Checks` workflow against a local build,
not against a live preview — tracked separately.

### Extending the smoke suite

Add new steps to `preview-smoke-tests.yml`. Guidelines:

- Keep per-step timeout ≤ 15s; total workflow ≤ 5 min.
- Do not require secrets — previews are public URLs.
- Fail loudly: every check must exit non-zero on regression.

---

## 6. Promotion workflow (staging → production)

We use **manual promotion** — Vercel's "Promote to Production" button —
rather than auto-promote, to satisfy the issue-#168 acceptance criterion
*"Promotion to production requires manual approval."*

### Steps

1. PR is merged to `main`.
2. Vercel builds `main` automatically and publishes it to the **staging
   alias** (`staging.exam-prep-master.vercel.app`).
3. QA runs against the staging alias. Smoke tests on the preview URL must be
   green before merge, so this is usually a sanity pass.
4. When ready, a maintainer opens the `main` deployment in Vercel →
   *"Promote to Production"*. This re-uses the already-built artifact (no
   rebuild, no drift).
5. Announce in the team channel.

### Who can promote

Only repository maintainers listed in `.github/CODEOWNERS` with Vercel
*Member* role or higher. The Vercel "Protection Bypass" setting stays off for
production.

---

## 7. Rollback procedure

**Target: under 5 minutes end-to-end.**

### Fast path — Vercel instant rollback

1. Open Vercel dashboard → Project → *Deployments*.
2. Find the last known-good production deployment (the one before the bad
   one).
3. Click the `⋯` menu → *"Promote to Production"*.
4. Confirm. Vercel swaps the production alias to the previous build — no
   rebuild, zero downtime. Typically takes < 60 seconds.

### Database rollback

Most of our outages are front-end-only and the fast path above is enough.
For schema-level regressions:

1. **Down migration.** Every file in `supabase/migrations/` must be paired
   with an inverse; write one if it is missing.
2. `supabase db reset --linked --project-ref <prod-ref>` is **destructive** —
   never run it against production. Instead, author a new forward migration
   that undoes the change and apply it: `supabase db push --linked`.
3. If data was corrupted, restore from Supabase's *Daily Backup* (Settings →
   Database → Backups). This is point-in-time restore and is the slow path
   (can exceed the 5-minute target; coordinate with the team).

### Communication

- Post in the team channel when rollback starts and when it completes.
- Open a post-mortem issue labeled `incident` within 24 hours.

---

## Appendix — Secrets checklist

When spinning up a new staging environment from scratch, ensure the following
are configured:

**Vercel → Environment Variables (Preview + Staging scope):**

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_ADMIN_EMAIL`
- `VITE_POSTHOG_KEY`
- `VITE_POSTHOG_HOST`
- `VITE_SENTRY_DSN`
- `VITE_APP_ENV=staging`

**GitHub Actions secrets (repo-level):**

- `VITE_SUPABASE_URL` — staging value, used only by CI unit tests + builds.
- `VITE_SUPABASE_PUBLISHABLE_KEY` — staging anon key.
- `VERCEL_AUTOMATION_BYPASS_SECRET` — **required only if** Vercel Deployment
  Protection is enabled on the project. Generate from Vercel → Project
  Settings → Deployment Protection → *Protection Bypass for Automation*, then
  paste the same value here. The preview smoke-test workflow sends it as the
  `x-vercel-protection-bypass` header so the GitHub runner can reach the
  preview URL without a human login. If Deployment Protection is off, leave
  this secret unset.

Production secrets live only in Vercel's Production scope and are never
mirrored to GitHub Actions.
