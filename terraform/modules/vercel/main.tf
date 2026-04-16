terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 2.0"
    }
  }
}

locals {
  # Production projects deploy from the production branch on every push.
  # Staging projects deploy from the production branch of a staging Git repo,
  # or in practice from `main` with a dedicated preview alias. We keep one
  # project per environment so secrets never leak across envs.
  target_envs = var.environment == "production" ? ["production", "preview", "development"] : ["preview", "development"]
}

resource "vercel_project" "this" {
  name             = var.project_name
  framework        = var.framework
  build_command    = var.build_command
  output_directory = var.output_directory
  install_command  = var.install_command

  git_repository = {
    type              = "github"
    repo              = var.github_repo
    production_branch = var.production_branch
  }

  # Serverless-friendly defaults; the app is a static SPA so these mostly
  # apply to preview deployments.
  serverless_function_region = "iad1"
}

# Attach the custom domain. Only the production project owns the apex domain;
# staging uses the staging.* subdomain.
resource "vercel_project_domain" "custom" {
  project_id = vercel_project.this.id
  domain     = var.custom_domain
}

# Project-level environment variables. We fan-out each (key, value) pair across
# the target_envs for this environment.
resource "vercel_project_environment_variable" "envs" {
  for_each = var.environment_variables

  project_id = vercel_project.this.id
  key        = each.key
  value      = each.value
  target     = local.target_envs
}
