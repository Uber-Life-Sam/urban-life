const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'save.db');

const db = new Database(dbPath);

// Create traffic_lights table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS traffic_lights (
    id TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  )
`).run();

console.log('Migration complete: traffic_lights table ensured.');

db.close();