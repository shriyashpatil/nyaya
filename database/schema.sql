-- ============================================================
-- Nyaya RERA Compliance Tool - PostgreSQL Schema
-- ============================================================

-- Create database (run as superuser)
-- CREATE DATABASE nyaya_db;
-- CREATE USER nyaya_user WITH PASSWORD 'nyaya_pass';
-- GRANT ALL PRIVILEGES ON DATABASE nyaya_db TO nyaya_user;
-- \c nyaya_db
-- GRANT ALL ON SCHEMA public TO nyaya_user;

-- ============================================================
-- Table: rera_rules
-- ============================================================
CREATE TABLE IF NOT EXISTS rera_rules (
    id                  BIGSERIAL PRIMARY KEY,
    rule_id             VARCHAR(50)  NOT NULL UNIQUE,
    state               VARCHAR(100) NOT NULL,
    title               VARCHAR(255) NOT NULL,
    description         TEXT,
    penalty             VARCHAR(500),
    documents_required  TEXT,
    timeline            VARCHAR(200),
    source_reference    VARCHAR(200),
    created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rera_state    ON rera_rules(state);
CREATE INDEX IF NOT EXISTS idx_rera_rule_id  ON rera_rules(rule_id);

-- ============================================================
-- Table: user_actions
-- ============================================================
CREATE TABLE IF NOT EXISTS user_actions (
    id              BIGSERIAL PRIMARY KEY,
    action_type     VARCHAR(50)  NOT NULL,   -- CHECKLIST_GENERATE | DOCUMENT_REVIEW | CHAT
    state           VARCHAR(100),
    request_data    TEXT,
    response_data   TEXT,
    timestamp       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_action_type      ON user_actions(action_type);
CREATE INDEX IF NOT EXISTS idx_action_state     ON user_actions(state);
CREATE INDEX IF NOT EXISTS idx_action_timestamp ON user_actions(timestamp);
