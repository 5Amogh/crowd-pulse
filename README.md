# 🚦 Crowd-Pulse

**Real-time public transport crowd monitoring and predictive analytics MVP.**
Designed to help authorities and commuters visualize crowd density, detect risks, and optimize train operations.

> Built collaboratively by **Amoghavarsh Desai** and **ChatGPT (OpenAI)** 🤝

---

## 🧠 What is Crowd-Pulse?

Crowd-Pulse is a demo prototype (MVP) that simulates how public transport systems (e.g., metros, subways) can:

* 📊 Track real-time **platform crowd density**
* 🚇 Compare **expected vs actual train loads**
* 🔔 Raise **alerts** for overcrowding or sensor inconsistencies
* 📈 Visualize **historical crowd trends**
* 🌐 Enable smart, data-driven transit decisions

It’s designed as a starting point for cities, researchers, or civic tech hackers who want to reduce stampedes, delays, and discomfort in public transport.

---

## 🏗️ Project Structure

```
Crowd-Pulse/
├── backend/           # Express.js API for mock crowd simulation & risk analysis
│   ├── index.js
│   ├── crowd_history.json
│   └── package.json
├── frontend/          # React + Material UI + Chart.js dashboard
│   ├── src/
│   │   └── CrowdTrendDashboard.jsx
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## ⚙️ Features

✅ Crowd Estimation from:

* Ticket check-ins
* Device ping approximations (simulated)

✅ Insights Engine:

* Calculates density (people/m²)
* Computes train load vs capacity
* Flags high-risk conditions (e.g., overcrowding)

✅ Historical Logging:

* Saves every simulation step to JSON
* Visualized with line charts

✅ Frontend Dashboard:

* Station selector
* Auto-refresh every 10s
* Responsive and clean UI using Material UI

---

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
npm install
npm start
```

Starts the mock server at: [http://localhost:8000/mock-crowd](http://localhost:8000/mock-crowd)

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Opens the dashboard at: [http://localhost:5173](http://localhost:5173)

---

## 📸 Screenshots

Coming soon!

---

## 🤝 Authors

* [Amoghavarsh Desai](https://github.com/5Amogh) – Ideation, Design, Engineering
* [ChatGPT (OpenAI)](https://openai.com/chatgpt) – Rapid prototyping, logic architecture, and code generation

---

## 💡 Future Ideas

* Live integration with metro check-in APIs or IoT devices
* SMS/push alerts to passengers
* Multi-station congestion forecasting
* Admin panel for transport authorities

---

## 📄 License

MIT – Free to use, fork, or modify.

> Let’s make cities safer, smarter, and commuter-friendly – one pulse at a time. 🚦📊
