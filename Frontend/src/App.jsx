import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/CrowdPulseMainLayout';
import DashboardPage from './routes/DashboardPage';
import MapPage from './routes/MapPage';

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}
