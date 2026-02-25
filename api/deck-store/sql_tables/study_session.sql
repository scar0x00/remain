CREATE IF NOT EXISTS TABLE study_session (
    session_id TEXT PRIMARY KEY, -- GUID
    deckid TEXT NOT NULL,
    user_id TEXT, -- Added user_id
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    correct_count INTEGER NOT NULL DEFAULT 0,
    incorrect_count INTEGER NOT NULL DEFAULT 0,
    wrong_answers_indexes TEXT, -- JSON array of card indexes (e.g., "[1, 5, 12]")
    FOREIGN KEY (deckid) REFERENCES deck(deckid) ON DELETE CASCADE
);

CREATE INDEX idx_study_session_deckid ON study_session(deckid);
CREATE INDEX idx_study_session_user_id ON study_session(user_id); -- Optional but recommended