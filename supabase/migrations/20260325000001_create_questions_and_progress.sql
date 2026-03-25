-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Topics table (if not exists)
create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  icon text,
  created_at timestamptz default now()
);

-- Questions table
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references topics(id) on delete cascade,
  text text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer char(1) not null check (correct_answer in ('a','b','c','d')),
  explanation text,
  difficulty text check (difficulty in ('easy','medium','hard')) default 'medium',
  created_at timestamptz default now()
);

-- User progress table
create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  topic_id uuid references topics(id) on delete cascade,
  is_correct boolean not null,
  answered_at timestamptz default now(),
  unique(user_id, question_id)
);

-- RLS: Topics (public read)
alter table topics enable row level security;
create policy "Anyone can read topics" on topics
  for select using (true);

-- RLS: Questions (public read)
alter table questions enable row level security;
create policy "Anyone can read questions" on questions
  for select using (true);
create policy "Authenticated users can insert questions" on questions
  for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update questions" on questions
  for update using (auth.role() = 'authenticated');
create policy "Authenticated users can delete questions" on questions
  for delete using (auth.role() = 'authenticated');

-- RLS: User progress (private per user)
alter table user_progress enable row level security;
create policy "Users can read own progress" on user_progress
  for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on user_progress
  for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on user_progress
  for update using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists idx_questions_topic_id on questions(topic_id);
create index if not exists idx_user_progress_user_id on user_progress(user_id);
create index if not exists idx_user_progress_topic_id on user_progress(topic_id);
