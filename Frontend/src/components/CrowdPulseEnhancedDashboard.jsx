import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Grid, Card, CardContent, CircularProgress, FormControl, InputLabel, Select, MenuItem, LinearProgress
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip
} from 'chart.js';
import axios from 'axios';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

export default function CrowdPulseEnhancedDashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [station, setStation] = useState('StationA');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8000/crowd-history');
      setHistory(res.data);
    } catch (error) {
      console.error('API error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const filtered = history
    .filter(item => item.station_id === station)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const labels = filtered.map(item => new Date(item.timestamp).toLocaleTimeString());

  const estimatedPeople = filtered.map(item => item.estimated_people);
  const density = filtered.map(item => item.density);
  const loadPct = filtered.map(item => item.train_load_pct);

  const avgPeople = estimatedPeople.reduce((a, b) => a + b, 0) / estimatedPeople.length || 0;
  const avgLoad = loadPct.reduce((a, b) => a + b, 0) / loadPct.length || 0;
  const maxDensity = Math.max(...density, 0);

  let riskLevel = 'Low';
  let riskMessage = '✅ All clear. Normal operation.';
  if (avgLoad > 90 || maxDensity > 4) {
    riskLevel = 'High';
    riskMessage = '⚠️ Critical crowding. Alert station staff!';
  } else if (avgLoad > 75 || maxDensity > 3) {
    riskLevel = 'Moderate';
    riskMessage = '🚧 Crowding increasing. Monitor platform.';
  }

  const generateChart = (label, data, color) => ({
    labels,
    datasets: [{
      label,
      data,
      fill: false,
      borderColor: color,
      tension: 0.3
    }]
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Crowd Trend Dashboard</Typography>

      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel>Select Station</InputLabel>
        <Select value={station} onChange={e => setStation(e.target.value)} label="Select Station">
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
        <>
          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2">Total People (avg)</Typography>
                  <Typography variant="h5">{avgPeople.toFixed(0)}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2">Train Load</Typography>
                  <Typography variant="h5">{avgLoad.toFixed(1)}%</Typography>
                  <LinearProgress variant="determinate" value={avgLoad} sx={{ mt: 1 }} color={avgLoad > 90 ? 'error' : 'primary'} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2">Risk Level</Typography>
                  <Typography variant="h6">{riskLevel}</Typography>
                  <Typography variant="body2">{riskMessage}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card><CardContent><Line data={generateChart('Estimated People', estimatedPeople, 'blue')} /></CardContent></Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card><CardContent><Line data={generateChart('Density (people/m²)', density, 'red')} /></CardContent></Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card><CardContent><Line data={generateChart('Train Load %', loadPct, 'green')} /></CardContent></Card>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}
