// server/lovable_sync.js
// Simple Express endpoint to receive save requests and forward to Lovable API.
// Usage: place in your existing server, or run with `node lovable_sync.js`

const express = require('express');
const fetch = require('node-fetch'); // if using node 18+ native fetch may be available
require('dotenv').config();
const app = express();
app.use(express.json());

const LOVABLE_API_URL = process.env.LOVABLE_API_URL || 'REPLACE_ME_LOVABLE_API_URL';
const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY || 'REPLACE_ME_API_KEY';

app.post('/api/savePlayer', async (req, res) => {
  const playerData = req.body; // expect {playerId, money, level, houseData, inventory, ...}

  try {
    // Example: POST to Lovable API - adjust path & headers as per Lovable docs
    const resp = await fetch(`${LOVABLE_API_URL}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`
      },
      body: JSON.stringify(playerData)
    });

    const result = await resp.json();
    if (!resp.ok) return res.status(resp.status).json({ error: result });
    return res.json({ success: true, result });
  } catch (err) {
    console.error('Lovable sync error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
});

const PORT = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Lovable sync running on ${PORT}`));
}

module.exports = app;
