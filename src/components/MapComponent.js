import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corregir el ícono de marcador por defecto de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Componente para manejar eventos del mapa
function MapEvents({ onLocationSelect }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    },
  });
  return null;
}

const MapComponent = ({ incidents = [], onLocationSelect }) => {
  // Ciudad de Bolivia como posición por defecto
  const defaultPosition = [-17.755607, -63.162082];

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={defaultPosition}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapEvents onLocationSelect={onLocationSelect} />
        
        {incidents.map((incident, index) => (
          incident.location && (
            <Marker
              key={incident.id || index}
              position={[incident.location.lat, incident.location.lng]}
              title={incident.type || 'Incidente'}
            />
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;