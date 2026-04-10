-- Issue #93: Create user_profiles table, RLS policies, and auto-create trigger

-- 1. Create user_profiles table
create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  onboarding_completed boolean not null default false,
  last_topic_id text,
  last_question_index integer default 0,
  streak integer not null default 0,
  xp integer not null default 0,
  level integer not null default 1,
  welcome_email_sent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Enable RLS
alter table user_profiles enable row level security;

-- 3. RLS policies: users can only access their own row
create policy "Users can read own profile"
  on user_profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on user_profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on user_profiles for update
  using (auth.uid() = id);

-- 4. Trigger function: auto-create profile on auth.users insert
--    Uses SECURITY DEFINER to bypass RLS when inserting the profile row.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.user_profiles (id, display_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', ''),
    new.email
  );
  return new;
end;
$$;

-- 5. Attach trigger to auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. Index for performance
create index if not exists idx_user_profiles_email on user_profiles(email);
