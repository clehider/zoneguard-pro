import React from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

const GoogleMap = () => {
  // Configuración inicial del mapa
  const mapConfig = {
    center: { lat: 0, lng: 0 }, // Coordenadas iniciales (ajustar según necesidad)
    zoom: 12,
    mapId: 'YOUR_MAP_ID' // Reemplazar con tu Map ID de Google Cloud Console
  };

  return (
    <div className="w-full h-[500px]">
      <APIProvider apiKey="YOUR_API_KEY"> {/* Reemplazar con tu API key de Google Maps */}
        <Map
          {...mapConfig}
          gestureHandling={'greedy'}
          disableDefaultUI={false}
        />
      </APIProvider>
    </div>
  );
};

export default GoogleMap;