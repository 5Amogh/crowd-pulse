//Frontend (React + Chart.js + Material UI)
// Auto-refreshing dashboard with station selector and trend chart

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
} from 'chart.js';
import {
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  CircularProgress
} from '@mui/material';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

export default function CrowdTrendDashboard() {
  const [history, setHistory] = useState([]);
  const [station, setStation] = useState('StationA');
  const [loading, setLoading] = useState(false);

  const fetchHistory = () => {
    setLoading(true);
    fetch('http://localhost:8000/crowd-history')
      .then(res => res.json())
      .then(data => {
        setHistory(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(() => fetchHistory(), 10000); // auto-refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  const filtered = history
    .filter(entry => entry.station_id === station)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const labels = filtered.map(item => new Date(item.timestamp).toLocaleTimeString());

  const data = {
    labels,
    datasets: [
      {
        label: 'Estimated People',
        data: filtered.map(item => item.estimated_people),
        fill: false,
        borderColor: 'blue',
        tension: 0.2
      },
      {
        label: 'Train Load %',
        data: filtered.map(item => item.train_load_pct),
        fill: false,
        borderColor: 'green',
        tension: 0.2
      },
      {
        label: 'Density (people/m²)',
        data: filtered.map(item => item.density),
        fill: false,
        borderColor: 'red',
        tension: 0.2
      }
    ]
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        TransitCrowdLens Dashboard
      </Typography>
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel id="station-select-label">Select Station</InputLabel>
        <Select
          labelId="station-select-label"
          value={station}
          label="Select Station"
          onChange={e => setStation(e.target.value)}
        >
          <MenuItem value="StationA">Station A</MenuItem>
          <MenuItem value="StationB">Station B</MenuItem>
          <MenuItem value="StationC">Station C</MenuItem>
        </Select>
      </FormControl>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={300}>
          <CircularProgress />
        </Box>
      ) : (
        <Line data={data} />
      )}
    </Container>
  );
}
