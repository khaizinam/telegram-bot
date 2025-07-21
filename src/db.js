// db.js
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'data.sqlite'));

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE,
    username TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    lasttime_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

module.exports = db;
