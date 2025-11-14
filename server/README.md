# Urban Life Server

Simple Express + SQLite server to persist game save data.

Install:

```
cd server
npm install
npm start
```

Endpoints:
- POST /api/save { playerId?, data }
- GET  /api/load?playerId=...
- POST /api/player/position { playerId?, position, rotation, timestamp }

Security: This example is intentionally minimal. Add authentication and validation before using in production.
