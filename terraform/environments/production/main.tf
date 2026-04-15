module "infrastructure" {
  source = "../../"

  environment = "production"

  # Vercel
  vercel_api_token  = var.vercel_api_token
  vercel_team_id    = var.vercel_team_id
  github_repo       = var.github_repo
  production_branch = var.production_branch
  custom_domain     = var.custom_domain

  # Supabase
  supabase_access_token      = var.supabase_access_token
  supabase_organization_slug = var.supabase_organization_slug
  supabase_project_ref       = var.supabase_project_ref
  supabase_db_password       = var.supabase_db_password
  supabase_region            = var.supabase_region
  supabase_url               = var.supabase_url
  supabase_publishable_key   = var.supabase_publishable_key

  # DNS
  cloudflare_api_token = var.cloudflare_api_token
  cloudflare_zone_id   = var.cloudflare_zone_id

  # Observability
  sentry_dsn   = var.sentry_dsn
  posthog_key  = var.posthog_key
  posthog_host = var.posthog_host
}
