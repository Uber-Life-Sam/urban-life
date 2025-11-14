const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'save.db');

const db = new Database(dbPath);

// Create saves table
db.prepare(`CREATE TABLE IF NOT EXISTS saves (\n  playerId TEXT PRIMARY KEY,\n  data TEXT,\n  updatedAt TEXT\n)`).run();

module.exports = {
  saveData: (playerId, data) => {
    const now = new Date().toISOString();
    const json = JSON.stringify(data);
    const stmt = db.prepare('INSERT INTO saves (playerId, data, updatedAt) VALUES (?, ?, ?) ON CONFLICT(playerId) DO UPDATE SET data=excluded.data, updatedAt=excluded.updatedAt');
    stmt.run(playerId, json, now);
    return { ok: true, playerId, updatedAt: now};
  },
  loadData: (playerId) => {
    const row = db.prepare('SELECT data, updatedAt FROM saves WHERE playerId = ?').get(playerId);
    if (!row) return null;
    try {
      return { data: JSON.parse(row.data), updatedAt: row.updatedAt };
    } catch (e) {
      return null;
    }
  }
};