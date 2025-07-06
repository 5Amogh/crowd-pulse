import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const stationCoordinates = {
  StationA: [12.9716, 77.5946],
  StationB: [12.9352, 77.6146],
  StationC: [13.0105, 77.5555]
};

const getColor = (load, density) => {
  if (load > 90 || density > 4) return 'red';
  if (load > 75 || density > 3) return 'orange';
  return 'green';
};

export default function CrowdPulseMapView() {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:8000/crowd-history');
      setData(res.data);
    } catch (err) {
      console.error('Map API error:', err.message);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const latestByStation = Object.values(
    data.reduce((acc, item) => {
      const current = acc[item.station_id];
      if (!current || new Date(item.timestamp) > new Date(current.timestamp)) {
        acc[item.station_id] = item;
      }
      return acc;
    }, {})
  );

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      <MapContainer center={[12.9716, 77.5946]} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {latestByStation.map((station, i) => {
          const coords = stationCoordinates[station.station_id];
          if (!coords) return null;

          return (
            <CircleMarker
              key={i}
              center={coords}
              radius={15}
              pathOptions={{ color: getColor(station.train_load_pct, station.density), fillOpacity: 0.6 }}
            >
              <Popup>
                <strong>{station.station_id}</strong><br />
                👥 People: {station.estimated_people}<br />
                🚇 Load: {station.train_load_pct}%<br />
                📏 Density: {station.density} people/m²
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}


