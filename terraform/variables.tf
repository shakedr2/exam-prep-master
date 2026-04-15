variable "environment" {
  description = "Deployment environment (staging or production)."
  type        = string
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "environment must be one of: staging, production."
  }
}

variable "project_name" {
  description = "Canonical project name used across providers."
  type        = string
  default     = "exam-prep-master"
}

# ---------------------------------------------------------------------------
# Vercel
# ---------------------------------------------------------------------------

variable "vercel_api_token" {
  description = "Vercel API token with project admin scope."
  type        = string
  sensitive   = true
}

variable "vercel_team_id" {
  description = "Vercel team ID (optional, leave empty for personal account)."
  type        = string
  default     = ""
}

variable "github_repo" {
  description = "GitHub repository in <owner>/<name> form connected to Vercel."
  type        = string
}

variable "production_branch" {
  description = "Branch that deploys to the production Vercel environment."
  type        = string
  default     = "main"
}

variable "custom_domain" {
  description = "Root custom domain for the site (e.g. exam-prep-master.com). Staging uses the `staging.` subdomain."
  type        = string
}

# ---------------------------------------------------------------------------
# Supabase (references — project is bootstrapped manually, managed here)
# ---------------------------------------------------------------------------

variable "supabase_access_token" {
  description = "Supabase personal access token (https://supabase.com/dashboard/account/tokens)."
  type        = string
  sensitive   = true
}

variable "supabase_organization_slug" {
  description = "Supabase organization slug that owns the project."
  type        = string
}

variable "supabase_project_ref" {
  description = "Supabase project reference (the `ref` in the project URL). Leave empty to let Terraform create the project."
  type        = string
  default     = ""
}

variable "supabase_db_password" {
  description = "Database password used when creating a new Supabase project."
  type        = string
  sensitive   = true
  default     = ""
}

variable "supabase_region" {
  description = "Supabase region (e.g. eu-central-1, us-east-1)."
  type        = string
  default     = "eu-central-1"
}

variable "supabase_url" {
  description = "Public Supabase URL used as VITE_SUPABASE_URL."
  type        = string
}

variable "supabase_publishable_key" {
  description = "Public (anon / publishable) key used as VITE_SUPABASE_PUBLISHABLE_KEY."
  type        = string
  sensitive   = true
}

# ---------------------------------------------------------------------------
# DNS (Cloudflare)
# ---------------------------------------------------------------------------

variable "cloudflare_api_token" {
  description = "Cloudflare API token with DNS edit permission on the target zone."
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for the custom_domain."
  type        = string
}

# ---------------------------------------------------------------------------
# Observability / runtime envs injected into Vercel
# ---------------------------------------------------------------------------

variable "sentry_dsn" {
  description = "Optional Sentry DSN. Leave empty to disable."
  type        = string
  default     = ""
  sensitive   = true
}

variable "posthog_key" {
  description = "Optional PostHog project key. Leave empty to disable."
  type        = string
  default     = ""
  sensitive   = true
}

variable "posthog_host" {
  description = "PostHog ingestion host."
  type        = string
  default     = "https://us.i.posthog.com"
}
