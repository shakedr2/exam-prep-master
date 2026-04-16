variable "vercel_api_token" {
  type      = string
  sensitive = true
}

variable "vercel_team_id" {
  type    = string
  default = ""
}

variable "github_repo" {
  type = string
}

variable "production_branch" {
  type    = string
  default = "main"
}

variable "custom_domain" {
  type = string
}

variable "supabase_access_token" {
  type      = string
  sensitive = true
}

variable "supabase_organization_slug" {
  type = string
}

variable "supabase_project_ref" {
  type    = string
  default = ""
}

variable "supabase_db_password" {
  type      = string
  sensitive = true
  default   = ""
}

variable "supabase_region" {
  type    = string
  default = "eu-central-1"
}

variable "supabase_url" {
  type = string
}

variable "supabase_publishable_key" {
  type      = string
  sensitive = true
}

variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}

variable "cloudflare_zone_id" {
  type = string
}

variable "sentry_dsn" {
  type      = string
  default   = ""
  sensitive = true
}

variable "posthog_key" {
  type      = string
  default   = ""
  sensitive = true
}

variable "posthog_host" {
  type    = string
  default = "https://us.i.posthog.com"
}
