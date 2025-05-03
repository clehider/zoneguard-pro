import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corregir el problema del ícono del marcador por defecto
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para manejar eventos y actualización del centro del mapa
const MapEventHandler = ({ onMapClick }) => {
  const map = useMapEvents({
    click: (e) => {
      if (onMapClick) {
        // Obtener las coordenadas directamente del evento
        onMapClick({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
      }
    },
  });
  return null;
};

// Componente para actualizar la vista del mapa cuando cambian las props
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
};

const handleMapClick = (e) => {
  if (e && e.lat && e.lng) {
    setPointLocation({
      lat: e.lat,
      lng: e.lng
    });
  }
};

const LeafletMap = ({ 
  center = { lat: -12.0464, lng: -77.0428 }, 
  zoom = 12, 
  points = [], 
  onMapClick,
  className = ''
}) => {
  return (
    <div className={`w-full h-[500px] ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        className="h-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Renderizar marcadores para cada punto */}
        {points.map((point, index) => (
          <Marker
            key={point.id || index}
            position={[point.location.lat, point.location.lng]}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{point.name}</h3>
                {point.description && (
                  <p className="text-sm">{point.description}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        <MapEventHandler onMapClick={onMapClick} />
        <MapUpdater center={[center.lat, center.lng]} zoom={zoom} />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;