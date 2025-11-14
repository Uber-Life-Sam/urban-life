const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'save.db');

const db = new Database(dbPath);

// saves table
db.prepare(`CREATE TABLE IF NOT EXISTS saves (
  playerId TEXT PRIMARY KEY,
  data TEXT,
  updatedAt TEXT
)`).run();

// traffic_lights table
db.prepare(`CREATE TABLE IF NOT EXISTS traffic_lights (
  id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updatedAt TEXT NOT NULL
)`).run();

module.exports = {
  saveData: (playerId, data) => {
    const now = new Date().toISOString();
    const json = JSON.stringify(data);
    const stmt = db.prepare('INSERT INTO saves (playerId, data, updatedAt) VALUES (?, ?, ?) ON CONFLICT(playerId) DO UPDATE SET data=excluded.data, updatedAt=excluded.updatedAt');
    stmt.run(playerId, json, now);
    return { ok: true, playerId, updatedAt: now };
  },
  loadData: (playerId) => {
    const row = db.prepare('SELECT data, updatedAt FROM saves WHERE playerId = ?').get(playerId);
    if (!row) return null;
    try {
      return { data: JSON.parse(row.data), updatedAt: row.updatedAt };
    } catch (e) {
      return null;
    }
  },

  saveTrafficLights: (lightsArray) => {
    const now = new Date().toISOString();
    const insert = db.prepare('INSERT INTO traffic_lights (id, data, updatedAt) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data=excluded.data, updatedAt=excluded.updatedAt');
    const tx = db.transaction((lights) => {
      for (const light of lights) {
        insert.run(light.id, JSON.stringify(light), now);
      }
    });
    tx(lightsArray || []);
    return { ok: true, updatedAt: now };
  },

  loadTrafficLights: () => {
    const rows = db.prepare('SELECT data FROM traffic_lights').all();
    return rows.map(r => {
      try { return JSON.parse(r.data); } catch (e) { return null; }
    }).filter(Boolean);
  },

  saveTrafficLightById: (id, lightData) => {
    const now = new Date().toISOString();
    const stmt = db.prepare('INSERT INTO traffic_lights (id, data, updatedAt) VALUES (?, ?, ?) ON CONFLICT(id) DO UPDATE SET data=excluded.data, updatedAt=excluded.updatedAt');
    stmt.run(id, JSON.stringify(lightData), now);
    return { ok: true, id, updatedAt: now };
  },

  loadTrafficLightById: (id) => {
    const row = db.prepare('SELECT data, updatedAt FROM traffic_lights WHERE id = ?').get(id);
    if (!row) return null;
    try {
      return { data: JSON.parse(row.data), updatedAt: row.updatedAt };
    } catch (e) {
      return null;
    }
  }
};