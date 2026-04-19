-- Issue #306: WelcomePage track picker — persist track selection and mark
-- a user as fully onboarded after the welcome flow.
--
--   preferred_track  : the track the user selected on the WelcomePage
--                      (e.g. 'python-fundamentals' | 'devops').
--                      Nullable — null means the user has not yet seen
--                      the welcome flow or skipped track selection.
--
--   onboarded_at     : set to now() when the user completes the WelcomePage
--                      flow. A non-null value gates the redirect so the page
--                      only shows once.

alter table public.user_profiles
  add column if not exists preferred_track text,
  add column if not exists onboarded_at   timestamptz;
