import React, { useState } from 'react';
import {
  AppBar, Toolbar, Tabs, Tab, Switch, Typography, Box, CssBaseline
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export default function CrowdPulseMainLayout({ children }) {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const theme = createTheme({ palette: { mode: darkMode ? 'dark' : 'light' } });
  const tabValue = location.pathname === '/map' ? 1 : 0;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Typography variant="h6">Crowd-Pulse</Typography>

          <Tabs
            value={tabValue}
            onChange={(e, newValue) => navigate(newValue === 1 ? '/map' : '/')}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="📊 Dashboard" />
            <Tab label="🗺️ Map View" />
          </Tabs>

          <Switch
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            inputProps={{ 'aria-label': 'dark mode toggle' }}
          />
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        {children}
      </Box>
    </ThemeProvider>
  );
}
