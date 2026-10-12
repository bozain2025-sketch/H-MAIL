// MailHub Local Database & Migration Manager
// SQLite with WAL mode, foreign keys, and FTS5 search

pub const SCHEMA_MIGRATION_V1: &str = r#"
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    provider TEXT NOT NULL,
    group_name TEXT,
    status TEXT NOT NULL DEFAULT 'ready',
    sync_interval_minutes INTEGER NOT NULL DEFAULT 5,
    last_sync_at TEXT,
    error_message TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS folders (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    remote_id TEXT NOT NULL,
    folder_type TEXT NOT NULL,
    unread_count INTEGER NOT NULL DEFAULT 0,
    total_count INTEGER NOT NULL DEFAULT 0,
    UNIQUE(account_id, remote_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    folder_id TEXT NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    remote_id TEXT NOT NULL,
    from_address TEXT NOT NULL,
    from_name TEXT NOT NULL,
    to_addresses TEXT NOT NULL, -- JSON array
    cc_addresses TEXT,         -- JSON array
    bcc_addresses TEXT,        -- JSON array
    subject TEXT NOT NULL,
    snippet TEXT NOT NULL,
    body_plain TEXT,
    body_html_sanitized TEXT,
    is_read INTEGER NOT NULL DEFAULT 0,
    is_starred INTEGER NOT NULL DEFAULT 0,
    has_attachments INTEGER NOT NULL DEFAULT 0,
    received_at TEXT NOT NULL,
    direction TEXT NOT NULL DEFAULT 'ltr',
    created_at TEXT NOT NULL,
    UNIQUE(account_id, remote_id)
);

CREATE INDEX IF NOT EXISTS idx_messages_account_folder ON messages(account_id, folder_id);
CREATE INDEX IF NOT EXISTS idx_messages_received_at ON messages(received_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_is_starred ON messages(is_starred);

CREATE TABLE IF NOT EXISTS attachments (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    is_downloaded INTEGER NOT NULL DEFAULT 0,
    local_path TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sync_checkpoints (
    account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    folder_id TEXT NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
    cursor TEXT,
    last_synced_at TEXT NOT NULL,
    PRIMARY KEY(account_id, folder_id)
);

CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(
    message_id UNINDEXED,
    subject,
    from_name,
    from_address,
    snippet,
    body_plain,
    tokenize = 'unicode61'
);
"#;
