ALTER TABLE study_session ADD COLUMN user_id TEXT DEFAULT NULL;
CREATE INDEX IF NOT EXISTS idx_study_session_user_id ON study_session(user_id);
