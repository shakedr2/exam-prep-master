-- ============================================================
-- Curriculum Domain Model
-- Hierarchy: Track > Phase > Module > Lesson > Practice > Quiz
--
-- This migration creates the structural tables only.
-- Seed data lives in a separate migration.
-- Existing topics / questions tables are NOT altered.
-- ============================================================

-- ---------------------------------------------------------------------------
-- curriculum_tracks
-- ---------------------------------------------------------------------------
create table if not exists curriculum_tracks (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  content_id  text not null unique,
  name        text not null,
  description text,
  default_locale text not null default 'he' check (default_locale in ('he', 'en')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- curriculum_phases
-- ---------------------------------------------------------------------------
create table if not exists curriculum_phases (
  id          uuid primary key default gen_random_uuid(),
  track_id    uuid not null references curriculum_tracks(id) on delete cascade,
  "order"     int  not null,
  slug        text not null,
  content_id  text not null unique,
  name        text not null,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (track_id, "order"),
  unique (track_id, slug)
);

-- ---------------------------------------------------------------------------
-- curriculum_modules
-- ---------------------------------------------------------------------------
create table if not exists curriculum_modules (
  id          uuid primary key default gen_random_uuid(),
  phase_id    uuid not null references curriculum_phases(id) on delete cascade,
  "order"     int  not null,
  slug        text not null,
  content_id  text not null unique,
  name        text not null,
  description text,
  icon        text,
  -- Transition: legacy topic_ids that this module covers (array of topic UUIDs)
  topic_ids   uuid[] not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (phase_id, "order"),
  unique (phase_id, slug)
);

-- ---------------------------------------------------------------------------
-- curriculum_lessons
-- ---------------------------------------------------------------------------
create table if not exists curriculum_lessons (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid not null references curriculum_modules(id) on delete cascade,
  "order"     int  not null,
  content_id  text not null unique,
  title       text not null,
  body        text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (module_id, "order")
);

-- ---------------------------------------------------------------------------
-- curriculum_concepts
-- ---------------------------------------------------------------------------
create table if not exists curriculum_concepts (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid not null references curriculum_modules(id) on delete cascade,
  lesson_id   uuid references curriculum_lessons(id) on delete set null,
  content_id  text not null unique,
  name        text not null,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- curriculum_practices
-- ---------------------------------------------------------------------------
create table if not exists curriculum_practices (
  id           uuid primary key default gen_random_uuid(),
  module_id    uuid not null references curriculum_modules(id) on delete cascade,
  content_id   text not null unique,
  title        text not null,
  description  text,
  -- Ordered list of question IDs from the existing `questions` table
  question_ids uuid[] not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- curriculum_quizzes
-- ---------------------------------------------------------------------------
create table if not exists curriculum_quizzes (
  id                  uuid primary key default gen_random_uuid(),
  module_id           uuid not null references curriculum_modules(id) on delete cascade,
  content_id          text not null unique,
  title               text not null,
  description         text,
  question_ids        uuid[] not null default '{}',
  passing_score       int  not null default 70 check (passing_score between 0 and 100),
  time_limit_minutes  int  check (time_limit_minutes > 0),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- curriculum_question_attempts
-- ---------------------------------------------------------------------------
create table if not exists curriculum_question_attempts (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  question_id      uuid not null references questions(id) on delete cascade,
  module_id        uuid not null references curriculum_modules(id) on delete cascade,
  session_type     text not null check (session_type in ('practice', 'quiz')),
  -- session_id points to curriculum_practices.id or curriculum_quizzes.id depending on
  -- session_type. A polymorphic FK cannot be enforced at the DB level; integrity is
  -- maintained by application logic.
  session_id       uuid not null,
  is_correct       boolean not null,
  submitted_answer text not null,
  answered_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- curriculum_track_enrolments
-- ---------------------------------------------------------------------------
create table if not exists curriculum_track_enrolments (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  track_id       uuid not null references curriculum_tracks(id) on delete cascade,
  enrolled_at    timestamptz not null default now(),
  last_active_at timestamptz not null default now(),
  unique (user_id, track_id)
);

-- ---------------------------------------------------------------------------
-- curriculum_module_progress
-- ---------------------------------------------------------------------------
create table if not exists curriculum_module_progress (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  module_id        uuid not null references curriculum_modules(id) on delete cascade,
  lesson_completed boolean not null default false,
  quiz_passed      boolean not null default false,
  best_quiz_score  int check (best_quiz_score between 0 and 100),
  updated_at       timestamptz not null default now(),
  unique (user_id, module_id)
);

-- ---------------------------------------------------------------------------
-- curriculum_translations  (i18n content layer)
-- ---------------------------------------------------------------------------
create table if not exists curriculum_translations (
  id         uuid primary key default gen_random_uuid(),
  content_id text not null,
  locale     text not null,
  fields     jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (content_id, locale)
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
create index if not exists idx_curriculum_phases_track_id
  on curriculum_phases(track_id);

create index if not exists idx_curriculum_modules_phase_id
  on curriculum_modules(phase_id);

create index if not exists idx_curriculum_lessons_module_id
  on curriculum_lessons(module_id);

create index if not exists idx_curriculum_concepts_module_id
  on curriculum_concepts(module_id);

create index if not exists idx_curriculum_practices_module_id
  on curriculum_practices(module_id);

create index if not exists idx_curriculum_quizzes_module_id
  on curriculum_quizzes(module_id);

create index if not exists idx_curriculum_attempts_user_id
  on curriculum_question_attempts(user_id);

create index if not exists idx_curriculum_attempts_module_id
  on curriculum_question_attempts(module_id);

create index if not exists idx_curriculum_enrolments_user_id
  on curriculum_track_enrolments(user_id);

create index if not exists idx_curriculum_module_progress_user_id
  on curriculum_module_progress(user_id);

create index if not exists idx_curriculum_translations_content_id
  on curriculum_translations(content_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

-- Tracks, Phases, Modules, Lessons, Concepts — public read
alter table curriculum_tracks enable row level security;
create policy "Anyone can read tracks"
  on curriculum_tracks for select using (true);

alter table curriculum_phases enable row level security;
create policy "Anyone can read phases"
  on curriculum_phases for select using (true);

alter table curriculum_modules enable row level security;
create policy "Anyone can read modules"
  on curriculum_modules for select using (true);

alter table curriculum_lessons enable row level security;
create policy "Anyone can read lessons"
  on curriculum_lessons for select using (true);

alter table curriculum_concepts enable row level security;
create policy "Anyone can read concepts"
  on curriculum_concepts for select using (true);

alter table curriculum_practices enable row level security;
create policy "Anyone can read practices"
  on curriculum_practices for select using (true);

alter table curriculum_quizzes enable row level security;
create policy "Anyone can read quizzes"
  on curriculum_quizzes for select using (true);

alter table curriculum_translations enable row level security;
create policy "Anyone can read translations"
  on curriculum_translations for select using (true);

-- User-private tables
alter table curriculum_question_attempts enable row level security;
create policy "Users can read own question attempts"
  on curriculum_question_attempts for select using (auth.uid() = user_id);
create policy "Users can insert own question attempts"
  on curriculum_question_attempts for insert with check (auth.uid() = user_id);

alter table curriculum_track_enrolments enable row level security;
create policy "Users can read own enrolments"
  on curriculum_track_enrolments for select using (auth.uid() = user_id);
create policy "Users can insert own enrolments"
  on curriculum_track_enrolments for insert with check (auth.uid() = user_id);
create policy "Users can update own enrolments"
  on curriculum_track_enrolments for update using (auth.uid() = user_id);

alter table curriculum_module_progress enable row level security;
create policy "Users can read own module progress"
  on curriculum_module_progress for select using (auth.uid() = user_id);
create policy "Users can insert own module progress"
  on curriculum_module_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own module progress"
  on curriculum_module_progress for update using (auth.uid() = user_id);
