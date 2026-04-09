-- Sprint 4.0: Track which concepts a user has completed in the learn flow.

CREATE TABLE IF NOT EXISTS user_learning_progress (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id text NOT NULL,
  topic_id text NOT NULL,
  concept_index integer NOT NULL,
  completed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, topic_id, concept_index)
);

CREATE INDEX IF NOT EXISTS idx_ulp_user_topic
  ON user_learning_progress(user_id, topic_id);
