terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

locals {
  is_apex = var.site_domain == var.root_domain
}

# Apex A record — only managed by the production environment to avoid
# conflicts between workspaces.
resource "cloudflare_record" "apex" {
  count = var.is_production && local.is_apex ? 1 : 0

  zone_id = var.zone_id
  name    = "@"
  type    = "A"
  content = var.vercel_apex_ipv4
  ttl     = 1 # automatic (proxied)
  proxied = false
  comment = "Managed by Terraform — Vercel apex"
}

# CNAME for subdomains (www, staging, etc.).
resource "cloudflare_record" "subdomain" {
  count = local.is_apex ? 0 : 1

  zone_id = var.zone_id
  name    = trimsuffix(replace(var.site_domain, ".${var.root_domain}", ""), ".")
  type    = "CNAME"
  content = var.vercel_cname
  ttl     = 1
  proxied = false
  comment = "Managed by Terraform — Vercel subdomain"
}

# Canonical www -> apex alias on the production environment.
resource "cloudflare_record" "www" {
  count = var.is_production ? 1 : 0

  zone_id = var.zone_id
  name    = "www"
  type    = "CNAME"
  content = var.vercel_cname
  ttl     = 1
  proxied = false
  comment = "Managed by Terraform — www alias"
}
