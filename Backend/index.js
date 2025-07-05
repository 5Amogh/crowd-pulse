// MVP (Backend + Mock Data Generator in Node.js)
// Tech Stack: Node.js (Express), Mock Data, Scalable Structure, Historical Trend Logging

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 8000;

const HISTORY_FILE = path.join(__dirname, 'crowd_history.json');

// --- Utilities ---
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

function generateMockData() {
  const stations = ['StationA', 'StationB', 'StationC'];
  const timestamp = new Date().toISOString();

  return stations.map(station => {
    const ticket_checkins = randomInt(50, 200);
    const device_pings = Math.floor(ticket_checkins * randomFloat(1.2, 2.0));
    const platform_area = [250, 300, 400][randomInt(0, 2)];
    const train_capacity = 800;
    const current_train_load = randomInt(400, 900);

    return {
      station_id: station,
      timestamp,
      ticket_checkins,
      device_pings,
      platform_area,
      train_capacity,
      current_train_load
    };
  });
}

function calculateInsights(station) {
  const person_estimate_from_devices = station.device_pings / 1.6;
  const estimated_people = Math.max(station.ticket_checkins, person_estimate_from_devices);
  const density = estimated_people / station.platform_area;
  const train_load_pct = (station.current_train_load / station.train_capacity) * 100;

  const risk_alerts = [];
  if (density > 4) risk_alerts.push('High platform density – potential overcrowding');
  if (train_load_pct > 90) risk_alerts.push('Train likely to be overloaded');
  if (station.ticket_checkins > 1.2 * person_estimate_from_devices) {
    risk_alerts.push('Ping data underestimating crowd – check sensor coverage');
  }

  return {
    station_id: station.station_id,
    timestamp: station.timestamp,
    estimated_people: Math.round(estimated_people),
    density: parseFloat(density.toFixed(2)),
    train_load_pct: parseFloat(train_load_pct.toFixed(1)),
    alerts: risk_alerts
  };
}

function logToHistory(insights) {
  let history = [];
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const raw = fs.readFileSync(HISTORY_FILE);
      history = JSON.parse(raw);
    }
  } catch (err) {
    console.error("Failed to read history file:", err);
  }
  
  history.push(...insights);

  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
  } catch (err) {
    console.error("Failed to write history file:", err);
  }
}

app.get('/mock-crowd', (req, res) => {
  const data = generateMockData();
  const insights = data.map(station => calculateInsights(station));
  logToHistory(insights);
  res.json(insights);
});

app.get('/crowd-history', (req, res) => {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const history = fs.readFileSync(HISTORY_FILE);
      res.json(JSON.parse(history));
    } else {
      res.json([]);
    }
  } catch (err) {
    res.status(500).send("Error reading history.");
  }
});

app.listen(PORT, () => {
  console.log(`TransitCrowdLens mock server running at http://localhost:${PORT}`);
});
