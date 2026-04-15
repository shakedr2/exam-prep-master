terraform {
  required_providers {
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
  }
}

locals {
  create_project = var.project_ref == ""
}

# Create the Supabase project only when a project_ref is not provided.
# Supabase project deletion is irreversible, so in practice we recommend
# bootstrapping the project manually and passing its ref in via
# `supabase_project_ref`.
resource "supabase_project" "this" {
  count = local.create_project ? 1 : 0

  organization_id   = var.organization_slug
  name              = var.project_name
  database_password = var.db_password
  region            = var.region

  lifecycle {
    # Prevent accidental destroy/recreate, which would delete all data.
    prevent_destroy = true
    ignore_changes  = [database_password]
  }
}

locals {
  project_ref = local.create_project ? supabase_project.this[0].id : var.project_ref
}

# Manage auth-related settings (site URL + redirect URLs) declaratively.
resource "supabase_settings" "auth" {
  project_ref = local.project_ref

  auth = jsonencode({
    site_url                       = var.site_url
    uri_allow_list                 = join(",", concat([var.site_url], var.additional_redirect_urls))
    jwt_exp                        = 3600
    refresh_token_rotation_enabled = true
  })

  api = jsonencode({
    db_schema            = "public"
    db_extra_search_path = "public,extensions"
    max_rows             = 1000
  })
}
