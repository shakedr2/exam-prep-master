# Infrastructure as Code — Terraform

This directory manages the `exam-prep-master` infrastructure declaratively.
It covers:

- **Vercel** — project configuration, environment variables, custom domain.
- **Cloudflare DNS** — apex A record, `www` CNAME, and staging CNAME.
- **Supabase** — project reference + auth/API settings (site URL, redirect
  allowlist). Project creation is gated behind `prevent_destroy`; in practice
  we bootstrap the project manually and manage settings here.

Tracks issue [#166](https://github.com/shakedr2/exam-prep-master/issues/166).

## Layout

```
terraform/
├── README.md
├── versions.tf              # provider + Terraform version pins
├── backend.tf               # Terraform Cloud backend (root module)
├── main.tf                  # composes modules for a single environment
├── variables.tf             # root-module inputs
├── outputs.tf               # root-module outputs
├── terraform.tfvars.example # placeholders for ad-hoc root-module runs
├── environments/
│   ├── staging/             # staging workspace (state isolated)
│   └── production/          # production workspace (state isolated)
└── modules/
    ├── vercel/              # Vercel project + domain + env vars
    ├── dns/                 # Cloudflare DNS records
    └── supabase/            # Supabase project ref + auth settings
```

State is **isolated per environment** via separate Terraform Cloud workspaces
(`exam-prep-master-staging` and `exam-prep-master-production`). This is the
foundation for independent staging/production lifecycles.

## Providers

| Purpose | Provider | Registry |
|---------|----------|----------|
| Hosting | `vercel/vercel` | https://registry.terraform.io/providers/vercel/vercel |
| DNS | `cloudflare/cloudflare` | https://registry.terraform.io/providers/cloudflare/cloudflare |
| Database / Auth | `supabase/supabase` | https://registry.terraform.io/providers/supabase/supabase |

If you use a DNS provider other than Cloudflare (Route53, GoDaddy, Namecheap),
replace `modules/dns` or swap the provider inside it — the module's public
interface (`zone_id`, `site_domain`, `root_domain`, `is_production`) is
provider-agnostic in spirit.

## Prerequisites

1. **Terraform Cloud** organization named `exam-prep-master` with two
   workspaces: `exam-prep-master-staging` and `exam-prep-master-production`.
   (Or swap the backend for S3 + DynamoDB — see `backend.tf`.)
2. **Tokens**, set as workspace variables (sensitive):
   - `TF_VAR_vercel_api_token` — https://vercel.com/account/tokens
   - `TF_VAR_supabase_access_token` — https://supabase.com/dashboard/account/tokens
   - `TF_VAR_cloudflare_api_token` — Zone:DNS:Edit scope
3. **Bootstrap manually** (one-time, before first `apply`):
   - Create the Supabase project and note its `project_ref`.
   - Connect the GitHub repo to Vercel at least once so the GitHub
     integration is authorized for the team. Terraform will then manage the
     Vercel-side project cleanly.

## Usage

```bash
cd terraform/environments/staging

cp terraform.tfvars.example terraform.tfvars
# Fill in values locally (for plan previews) or rely on TF_VAR_* in CI.

terraform init
terraform plan  -out=tfplan
terraform apply tfplan
```

Replace `staging` with `production` for the production workspace. The two
environments share the same module code but have **completely isolated
state**.

## Secrets handling

- `*.tfvars` is git-ignored; only `*.tfvars.example` is committed.
- Credentials are injected via Terraform Cloud workspace variables (or
  `TF_VAR_*` in CI) — never checked in.
- Vercel project environment variables are managed in Terraform so they are
  reproducible, but the actual values come from `TF_VAR_*` and remain
  sensitive in state.

## CI

Pull requests that touch `terraform/**` trigger `.github/workflows/terraform.yml`,
which runs `terraform fmt -check`, `terraform validate`, and
`terraform plan` (read-only) for each environment. The plan output is
posted back as a PR comment. `apply` is **never** run from CI — it is
performed manually from Terraform Cloud after a reviewer approves the plan.

## Supabase notes

The Supabase provider is young and does not yet expose every setting in the
dashboard. What it *does* support reliably:

- Project creation (`supabase_project`) — guarded by `prevent_destroy`.
- Branch management (`supabase_branch`) — not used here yet.
- A subset of settings (`supabase_settings` for `auth`, `api`, `database`).

For anything not yet covered by the provider (RLS policies, webhooks, auth
providers, storage buckets), keep using:

- `supabase/migrations/*.sql` — schema and RLS policies (already in repo).
- Supabase CLI (`supabase db push`, `supabase functions deploy`) — edge
  functions and local-first workflows.
- Dashboard-only settings — documented in `docs/infra/supabase-runbook.md`
  (to be added in a follow-up).

## Rollback

Because state is isolated per environment, you can roll back a single
environment by reverting the PR that introduced the change and re-running
`terraform apply` in that workspace. Never edit state directly.
