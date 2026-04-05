-- Expand questions table with new columns for question types, exam metadata, and taxonomy

alter table questions
  add column if not exists question_type text check (question_type in ('multiple_choice','tracing','fill_blank','coding')) default 'multiple_choice',
  add column if not exists code_snippet text,
  add column if not exists expected_output text,
  add column if not exists source_exam text,
  add column if not exists year integer,
  add column if not exists semester text check (semester in ('A','B','summer')),
  add column if not exists pattern_family text,
  add column if not exists common_mistake text,
  add column if not exists is_generated boolean default false,
  add column if not exists template_id text;

-- Indexes for performance
create index if not exists idx_questions_type on questions(question_type);
create index if not exists idx_questions_topic on questions(topic_id);
create index if not exists idx_questions_difficulty on questions(difficulty);
create index if not exists idx_questions_pattern on questions(pattern_family);
