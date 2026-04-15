variable "organization_slug" {
  description = "Supabase organization slug."
  type        = string
}

variable "project_ref" {
  description = "Existing Supabase project ref. If empty, a new project is created."
  type        = string
  default     = ""
}

variable "project_name" {
  description = "Human-readable Supabase project name (used only when creating)."
  type        = string
}

variable "region" {
  description = "Supabase region (e.g. eu-central-1)."
  type        = string
}

variable "db_password" {
  description = "Database password used when creating a new project."
  type        = string
  sensitive   = true
  default     = ""
}

variable "site_url" {
  description = "Primary site URL (used for auth redirects)."
  type        = string
}

variable "additional_redirect_urls" {
  description = "Additional allowed auth redirect URLs."
  type        = list(string)
  default     = []
}
