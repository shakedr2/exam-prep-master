ALTER TABLE user_learning_progress
  ADD COLUMN IF NOT EXISTS xp integer NOT NULL DEFAULT 0;
