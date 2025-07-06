// CrowdPulse Enhanced UI with Light/Dark Toggle, Station Selector & Responsive Charts

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  CssBaseline
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

const getTheme = (mode) => createTheme({
  palette: {
    mode
  }
});

export default function CrowdPulseUIUpgrades() {
  const [history, setHistory] = useState([]);
  const [station, setStation] = useState('StationA');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8000/crowd-history');
      setHistory(response.data);
      generateSummary(response.data);
    } catch (err) {
      console.error('Error fetching crowd data', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = (data) => {
    const filtered = data.filter(d => d.station_id === station);
    if (!filtered.length) return;

    const totalPeople = filtered.reduce((sum, d) => sum + d.estimated_people, 0);
    const avgLoad = filtered.reduce((sum, d) => sum + d.train_load_pct, 0) / filtered.length;
    const maxDensity = Math.max(...filtered.map(d => d.density));

    const riskLevel =
      maxDensity > 6 || avgLoad > 95 ? 'High' :
      maxDensity > 4 || avgLoad > 85 ? 'Moderate' : 'Low';

    const message =
      riskLevel === 'High' ? '⚠️ Critical crowding. Alert station staff!' :
      riskLevel === 'Moderate' ? '🚧 Crowding increasing. Monitor platform.' :
      '✅ All clear. Normal operation.';

    setSummary({
      totalPeople,
      avgLoad: avgLoad.toFixed(1),
      maxDensity,
      riskLevel,
      message
    });
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 10000);
    return () => clearInterval(interval);
  }, [station]);

  const filtered = history
    .filter(h => h.station_id === station)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const labels = filtered.map(h => new Date(h.timestamp).toLocaleTimeString());

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  const peopleData = {
    labels,
    datasets: [{
      label: 'Estimated People',
      data: filtered.map(h => h.estimated_people),
      borderColor: 'blue',
      tension: 0.3,
      fill: false
    }]
  };

  const densityData = {
    labels,
    datasets: [{
      label: 'Density (people/m²)',
      data: filtered.map(h => h.density),
      borderColor: 'red',
      tension: 0.3,
      fill: false
    }]
  };

  const loadData = {
    labels,
    datasets: [{
      label: 'Train Load %',
      data: filtered.map(h => h.train_load_pct),
      borderColor: 'green',
      tension: 0.3,
      fill: false
    }]
  };

  return (
    <ThemeProvider theme={getTheme(darkMode ? 'dark' : 'light')}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap">
          <Typography variant="h4" gutterBottom>
            Crowd-Pulse Dashboard
          </Typography>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
            label="Dark Mode"
          />
        </Box>

        <FormControl fullWidth sx={{ my: 3 }}>
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
          <Box textAlign="center" py={6}><CircularProgress /></Box>
        ) : (
          <>
            {summary && (
              <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                  <Card><CardContent>
                    <Typography variant="subtitle2">Total People</Typography>
                    <Typography variant="h6">{summary.totalPeople}</Typography>
                  </CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card><CardContent>
                    <Typography variant="subtitle2">Avg Train Load %</Typography>
                    <LinearProgress value={summary.avgLoad} variant="determinate" color={summary.avgLoad > 90 ? 'error' : 'primary'} />
                    <Typography variant="h6" mt={1}>{summary.avgLoad}%</Typography>
                  </CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card><CardContent>
                    <Typography variant="subtitle2">Risk Level</Typography>
                    <Typography variant="h6" color={
                      summary.riskLevel === 'High' ? 'error' :
                      summary.riskLevel === 'Moderate' ? 'warning.main' : 'green'
                    }>
                      {summary.riskLevel}
                    </Typography>
                    <Typography variant="body2">{summary.message}</Typography>
                  </CardContent></Card>
                </Grid>
              </Grid>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: 300 }}><CardContent>
                  <Typography variant="h6">Estimated People</Typography>
                  <Box height={220}><Line data={peopleData} options={chartOptions} /></Box>
                </CardContent></Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: 300 }}><CardContent>
                  <Typography variant="h6">Density (people/m²)</Typography>
                  <Box height={220}><Line data={densityData} options={chartOptions} /></Box>
                </CardContent></Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: 300 }}><CardContent>
                  <Typography variant="h6">Train Load %</Typography>
                  <Box height={220}><Line data={loadData} options={chartOptions} /></Box>
                </CardContent></Card>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
}