CREATE TABLE IF NOT EXISTS schema_version (
    version INTEGER PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    status TEXT CHECK(status IN ('pending', 'successful', 'failed')) NOT NULL,
    payment_request TEXT NOT NULL,
    payment_hash TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS change (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at INTEGER NOT NULL,
    proof_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    secret TEXT NOT NULL,
    C TEXT NOT NULL
);


INSERT INTO schema_version (version) VALUES (1);
