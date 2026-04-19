#!/usr/bin/env bash
# End-to-end smoke test for send-welcome-email.
#
# Creates a throwaway auth user against the configured Supabase project, polls
# public.email_events for the welcome row, prints a Resend dashboard link, and
# deletes the test user. Always point at staging.
#
# Required env:
#   SUPABASE_URL                 — e.g. https://<ref>.supabase.co
#   SUPABASE_SERVICE_ROLE_KEY    — service role key (staging!)
# Optional env:
#   EMAIL                        — override the throwaway address
#   POLL_TIMEOUT_MS              — how long to wait for the email_events row (default 30000)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

: "${SUPABASE_URL:?SUPABASE_URL is required}"
: "${SUPABASE_SERVICE_ROLE_KEY:?SUPABASE_SERVICE_ROLE_KEY is required}"

if [[ "${SUPABASE_URL}" == *"production"* || "${CONFIRM_PROD:-}" != "yes" && "${SUPABASE_URL}" != *"staging"* ]]; then
  # Best-effort guard. Override with CONFIRM_PROD=yes if you really mean it.
  if [[ "${SUPABASE_URL}" == *"gppwqdfxbakcuybohzor"* && "${CONFIRM_PROD:-}" != "yes" ]]; then
    echo "[smoke] Refusing to run against production. Set CONFIRM_PROD=yes to override." >&2
    exit 2
  fi
fi

echo "[smoke] target: ${SUPABASE_URL}"
cd "${REPO_ROOT}"
exec node scripts/smoke-welcome-email.mjs
