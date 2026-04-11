-- Issue #93 dependency: add welcome_email_sent flag to user_profiles.
-- The send-welcome-email Edge Function sets this to true after a successful
-- delivery so that subsequent logins never trigger a duplicate send.

alter table public.user_profiles
  add column if not exists welcome_email_sent boolean not null default false;
