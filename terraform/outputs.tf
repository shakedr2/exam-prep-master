output "vercel_project_id" {
  description = "Vercel project ID."
  value       = module.vercel_project.project_id
}

output "site_url" {
  description = "Public site URL for this environment."
  value       = "https://${local.site_domain}"
}

output "supabase_project_ref" {
  description = "Supabase project ref used or created for this environment."
  value       = module.supabase.project_ref
}
