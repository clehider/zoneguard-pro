import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corregir el problema de los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationMarker = ({ onLocationSelect }) => {
  const [position, setPosition] = useState(null);
  
  useMapEvents({
    click(e) {
      const pos = e.latlng;
      setPosition(pos);
      if (onLocationSelect) {
        onLocationSelect(pos);
      }
    },
    dragend() {
      const map = this; // Cambiar useMap() por this
      const center = map.getCenter();
      setPosition(center);
      if (onLocationSelect) {
        onLocationSelect(center);
      }
    }
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Ubicación seleccionada</Popup>
    </Marker>
  );
};

const MapComponent = ({ incidents, onLocationSelect }) => {
  const defaultPosition = [19.4326, -99.1332];
  const [map, setMap] = useState(null);

  return (
    <MapContainer
      center={defaultPosition}
      zoom={13}
      style={{ 
        height: '400px',  // Altura fija en lugar de 100%
        width: '100%',
        maxHeight: '50vh' // Máximo 50% de la altura de la ventana
      }}
      whenCreated={setMap}
      scrollWheelZoom={false} // Desactivar zoom con rueda del mouse
      doubleClickZoom={true}
      dragging={true}
      zoomControl={true}
      keyboard={true}
      touchZoom={true}
      boxZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <LocationMarker onLocationSelect={onLocationSelect} />
      
      {incidents.map((incident, index) => (
        <Marker
          key={index}
          position={[incident.location.lat, incident.location.lng]}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{incident.type}</h3>
              <p>{incident.description}</p>
              <p>Estado: {incident.status}</p>
              <p>Asignado a: {incident.assignedTo}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;