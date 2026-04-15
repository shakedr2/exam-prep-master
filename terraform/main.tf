locals {
  is_production  = var.environment == "production"
  site_domain    = local.is_production ? var.custom_domain : "staging.${var.custom_domain}"
  vercel_project = "${var.project_name}-${var.environment}"

  common_env = {
    VITE_SUPABASE_URL             = var.supabase_url
    VITE_SUPABASE_PUBLISHABLE_KEY = var.supabase_publishable_key
    VITE_APP_ENV                  = var.environment
    VITE_SITE_URL                 = "https://${local.site_domain}"
  }

  optional_env = merge(
    var.sentry_dsn != "" ? { VITE_SENTRY_DSN = var.sentry_dsn } : {},
    var.posthog_key != "" ? {
      VITE_POSTHOG_KEY  = var.posthog_key
      VITE_POSTHOG_HOST = var.posthog_host
    } : {},
  )
}

provider "vercel" {
  api_token = var.vercel_api_token
  team      = var.vercel_team_id != "" ? var.vercel_team_id : null
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

provider "supabase" {
  access_token = var.supabase_access_token
}

module "vercel_project" {
  source = "./modules/vercel"

  project_name      = local.vercel_project
  framework         = "vite"
  build_command     = "npm run build"
  output_directory  = "dist"
  install_command   = "npm ci"
  github_repo       = var.github_repo
  production_branch = var.production_branch
  custom_domain     = local.site_domain
  environment       = var.environment

  environment_variables = merge(local.common_env, local.optional_env)
}

module "dns" {
  source = "./modules/dns"

  zone_id          = var.cloudflare_zone_id
  site_domain      = local.site_domain
  root_domain      = var.custom_domain
  is_production    = local.is_production
  vercel_cname     = "cname.vercel-dns.com"
  vercel_apex_ipv4 = "76.76.21.21"
}

module "supabase" {
  source = "./modules/supabase"

  organization_slug = var.supabase_organization_slug
  project_ref       = var.supabase_project_ref
  project_name      = "${var.project_name}-${var.environment}"
  region            = var.supabase_region
  db_password       = var.supabase_db_password
  site_url          = "https://${local.site_domain}"
  additional_redirect_urls = [
    "https://${local.site_domain}/auth/callback",
    "http://localhost:8080/auth/callback",
  ]
}
