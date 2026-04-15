-- ============================================================
-- RLS Security Check Script
-- Run in a LOCAL Supabase dev environment (supabase start) to
-- verify that Row Level Security policies deny cross-user access.
--
-- Usage (local only — requires superuser / postgres role):
--   psql "$DATABASE_URL" -f scripts/rls-security-check.sql
--
-- Expected result for every TEST N FAIL assertion: 0 rows.
-- Expected result for every TEST N PASS assertion: 1 or more rows.
-- ============================================================

-- ---------------------------------------------------------------
-- Helper: create two test users via the Supabase auth.users table.
-- Requires superuser access available in local dev; not available
-- in hosted Supabase — use the Supabase dashboard/SQL editor there.
-- ---------------------------------------------------------------
do $$
begin
  -- Insert dummy auth users for testing if they don't exist
  insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
  values
    ('aaaaaaaa-0000-0000-0000-000000000001', 'rls_test_user1@example.invalid', 'x', now(), now(), now()),
    ('aaaaaaaa-0000-0000-0000-000000000002', 'rls_test_user2@example.invalid', 'x', now(), now(), now())
  on conflict (id) do nothing;

  -- Seed user_profiles rows
  insert into public.user_profiles (id, username)
  values
    ('aaaaaaaa-0000-0000-0000-000000000001', 'test_user_1'),
    ('aaaaaaaa-0000-0000-0000-000000000002', 'test_user_2')
  on conflict (id) do nothing;

  -- Seed user_progress rows (uses text user_id — anon uuid style)
  insert into public.user_progress (user_id, question_id, topic_id, is_correct)
  select
    'aaaaaaaa-0000-0000-0000-000000000001',
    q.id,
    q.topic_id,
    true
  from public.questions q
  limit 1
  on conflict (user_id, question_id) do nothing;
end $$;

-- ---------------------------------------------------------------
-- TEST 1: Authenticated as user 1 — cannot read user 2's profile
-- ---------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}';

select 'TEST 1 FAIL: user 1 can read user 2 profile' as result
from public.user_profiles
where id = 'aaaaaaaa-0000-0000-0000-000000000002';
-- Expected: 0 rows

-- ---------------------------------------------------------------
-- TEST 2: Authenticated as user 1 — can read own profile
-- ---------------------------------------------------------------
select 'TEST 2 PASS: user 1 can read own profile' as result
from public.user_profiles
where id = 'aaaaaaaa-0000-0000-0000-000000000001';
-- Expected: 1 row

-- ---------------------------------------------------------------
-- TEST 3: Unauthenticated — cannot read any profile
-- ---------------------------------------------------------------
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';

select 'TEST 3 FAIL: anon can read user profile' as result
from public.user_profiles
limit 1;
-- Expected: 0 rows

-- ---------------------------------------------------------------
-- TEST 4: Unauthenticated — cannot write questions
-- ---------------------------------------------------------------
set local role anon;
set local request.jwt.claims = '{"role":"anon"}';

do $$
begin
  begin
    insert into public.questions (topic_id, text, option_a, option_b, option_c, option_d, correct_answer)
    select id, 'rls_test_q', 'a', 'b', 'c', 'd', 'a'
    from public.topics limit 1;
    raise notice 'TEST 4 FAIL: anon was able to insert a question';
  exception when others then
    raise notice 'TEST 4 PASS: anon cannot insert question (%%)', sqlerrm;
  end;
end $$;

-- ---------------------------------------------------------------
-- TEST 5: Authenticated (non-service-role) — cannot write questions
-- ---------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"aaaaaaaa-0000-0000-0000-000000000001","role":"authenticated"}';

do $$
begin
  begin
    insert into public.questions (topic_id, text, option_a, option_b, option_c, option_d, correct_answer)
    select id, 'rls_test_q2', 'a', 'b', 'c', 'd', 'a'
    from public.topics limit 1;
    raise notice 'TEST 5 FAIL: authenticated user was able to insert a question';
  exception when others then
    raise notice 'TEST 5 PASS: authenticated user cannot insert question (%%)', sqlerrm;
  end;
end $$;

-- ---------------------------------------------------------------
-- TEST 6: user_learning_progress has RLS enabled
-- ---------------------------------------------------------------
set local role postgres;

select 'TEST 6 PASS: user_learning_progress has RLS' as result
from pg_tables t
join pg_class c on c.relname = t.tablename
where t.schemaname = 'public'
  and t.tablename = 'user_learning_progress'
  and c.relrowsecurity = true;
-- Expected: 1 row

-- ---------------------------------------------------------------
-- Cleanup: remove test rows (local dev only).
-- Superuser role required; not available in hosted Supabase.
-- ---------------------------------------------------------------
set local role postgres;

delete from public.user_profiles
where id in (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'aaaaaaaa-0000-0000-0000-000000000002'
);

delete from auth.users
where id in (
  'aaaaaaaa-0000-0000-0000-000000000001',
  'aaaaaaaa-0000-0000-0000-000000000002'
);

