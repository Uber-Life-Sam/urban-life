const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { saveData, loadData, saveTrafficLights, loadTrafficLights, saveTrafficLightById } = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

// POST /api/save { playerId?, data }
app.post('/api/save', (req, res) => {
  const { playerId = 'default', data } = req.body || {};
  if (!data) return res.status(400).json({ ok: false, error: 'missing data' });
  try {
    const result = saveData(playerId, data);
    return res.json({ ok: true, result });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// GET /api/load?playerId=
app.get('/api/load', (req, res) => {
  const playerId = (req.query.playerId) || 'default';
  try {
    const row = loadData(playerId);
    if (!row) return res.status(404).json({ ok: false, error: 'not found' });
    return res.json({ ok: true, data: row.data, updatedAt: row.updatedAt });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// POST /api/player/position { playerId?, position, rotation, timestamp }
app.post('/api/player/position', (req, res) => {
  const { playerId = 'default', position, rotation, timestamp } = req.body || {};
  if (!position) return res.status(400).json({ ok: false, error: 'missing position' });

  try {
    const existing = loadData(playerId);
    const data = existing && existing.data ? existing.data : {};
    data.playerPosition = position;
    data.playerRotation = rotation;
    data.lastPositionTimestamp = timestamp || new Date().toISOString();
    saveData(playerId, data);
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// GET all traffic-lights
app.get('/api/traffic-lights', (req, res) => {
  try {
    const lights = loadTrafficLights();
    return res.json({ ok: true, data: lights });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// POST replace entire array of traffic lights (body: { lights: [...] })
app.post('/api/traffic-lights', (req, res) => {
  const { lights } = req.body || {};
  if (!Array.isArray(lights)) return res.status(400).json({ ok: false, error: 'missing lights array' });
  try {
    const result = saveTrafficLights(lights);
    return res.json({ ok: true, result });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

// POST update single traffic light by id (body: { ...lightData })
app.post('/api/traffic-lights/:id', (req, res) => {
  const id = req.params.id;
  const data = req.body || {};
  try {
    const result = saveTrafficLightById(id, data);
    return res.json({ ok: true, result });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: e.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Urban-Life server listening on ${PORT}`));