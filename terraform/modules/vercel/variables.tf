variable "project_name" {
  description = "Vercel project name."
  type        = string
}

variable "framework" {
  description = "Framework preset."
  type        = string
  default     = "vite"
}

variable "build_command" {
  description = "Build command."
  type        = string
  default     = "npm run build"
}

variable "output_directory" {
  description = "Output directory."
  type        = string
  default     = "dist"
}

variable "install_command" {
  description = "Install command."
  type        = string
  default     = "npm ci"
}

variable "github_repo" {
  description = "GitHub repo in <owner>/<name> form."
  type        = string
}

variable "production_branch" {
  description = "Production branch."
  type        = string
  default     = "main"
}

variable "custom_domain" {
  description = "Custom domain attached to this project."
  type        = string
}

variable "environment" {
  description = "Environment tag (staging or production)."
  type        = string
}

variable "environment_variables" {
  description = "Map of environment variable name => value to set on the Vercel project."
  type        = map(string)
  default     = {}
}
