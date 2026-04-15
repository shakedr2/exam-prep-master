variable "zone_id" {
  description = "Cloudflare zone ID for the root domain."
  type        = string
}

variable "site_domain" {
  description = "Fully qualified site domain (e.g. exam-prep-master.com or staging.exam-prep-master.com)."
  type        = string
}

variable "root_domain" {
  description = "Root (apex) domain."
  type        = string
}

variable "is_production" {
  description = "Whether this environment is production (owns the apex A record)."
  type        = bool
}

variable "vercel_cname" {
  description = "Vercel CNAME target for non-apex domains."
  type        = string
  default     = "cname.vercel-dns.com"
}

variable "vercel_apex_ipv4" {
  description = "Vercel anycast IPv4 used for apex A records."
  type        = string
  default     = "76.76.21.21"
}
