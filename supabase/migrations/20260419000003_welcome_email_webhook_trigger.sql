-- Phase 4 PR2 follow-up (#320 / #326): wire a database webhook on auth.users
-- INSERT that invokes the send-welcome-email Edge Function with the shared
-- bearer secret. The dashboard Auth Hooks UI is unavailable on this plan, so
-- we implement it directly in SQL via pg_net + a plain row trigger.
--
-- Bearer secret is stored in Supabase Vault so it is encrypted at rest and
-- can be rotated without code changes. The matching value must also be set
-- as the WEBHOOK_SECRET Edge Function secret (dashboard) for the function
-- to accept the request.
--
-- Note: the literal secret value in vault.create_secret below is the bootstrap
-- value for the prod project. Rotate post-merge via:
--   delete from vault.secrets where name = 'welcome_email_webhook_secret';
--   select vault.create_secret('<new value>', 'welcome_email_webhook_secret', '...');
-- and mirror the new value to the Edge Function secret WEBHOOK_SECRET.

-- 1. Enable pg_net for outbound HTTP from the DB.
create extension if not exists pg_net with schema extensions;

-- 2. Store the shared bearer secret in the vault. Idempotent — if the secret
--    already exists with this name, remove it first so re-applying this
--    migration re-seeds the same value.
do $mig$
declare
  existing_id uuid;
begin
  select id into existing_id from vault.secrets where name = 'welcome_email_webhook_secret';
  if existing_id is not null then
    delete from vault.secrets where id = existing_id;
  end if;

  perform vault.create_secret(
    'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    'welcome_email_webhook_secret',
    'Shared bearer token for send-welcome-email Edge Function (Phase 4 PR2). Must equal the WEBHOOK_SECRET Edge Function secret.'
  );
end
$mig$;

-- 3. Trigger function: enqueue an async HTTP POST to the Edge Function.
--    SECURITY DEFINER so the function can read the vault and call pg_net
--    regardless of the role performing the INSERT.
create or replace function public.trigger_welcome_email_on_signup()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, vault
as $fn$
declare
  webhook_secret text;
  function_url   text := 'https://txubfromrrlhqtyrxrei.supabase.co/functions/v1/send-welcome-email';
begin
  select decrypted_secret
    into webhook_secret
    from vault.decrypted_secrets
   where name = 'welcome_email_webhook_secret'
   limit 1;

  if webhook_secret is null then
    -- Fail closed but do not block signup: log and return.
    raise warning 'welcome_email_webhook_secret missing from vault; skipping welcome email for user %', NEW.id;
    return NEW;
  end if;

  perform net.http_post(
    url     := function_url,
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || webhook_secret,
      'Content-Type',  'application/json'
    ),
    body    := jsonb_build_object(
      'type',   'INSERT',
      'table',  'users',
      'record', jsonb_build_object(
        'id',                 NEW.id::text,
        'email',              NEW.email,
        'raw_user_meta_data', NEW.raw_user_meta_data
      )
    ),
    timeout_milliseconds := 5000
  );

  return NEW;
end
$fn$;

-- 4. Create the trigger. Drop-and-recreate keeps the migration idempotent.
drop trigger if exists welcome_email_on_signup on auth.users;
create trigger welcome_email_on_signup
  after insert on auth.users
  for each row
  execute function public.trigger_welcome_email_on_signup();

-- 5. Minimum privileges.
grant usage on schema extensions to postgres;
grant execute on function net.http_post(text, jsonb, jsonb, jsonb, integer) to postgres;
