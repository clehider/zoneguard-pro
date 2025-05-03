import React from 'react';
import { useLoadScript, GoogleMap, Marker } from '@react-google-maps/api';

const MapComponent = ({ incidents }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyAgLNdE8AzuxsQL4hzKg94Z65cFuNWTQfo", // Tu API key
    libraries: ["places"]
  });

  const mapStyles = {
    height: "100%",
    width: "100%"
  };

  const defaultCenter = {
    lat: -12.0464,
    lng: -77.0428
  };

  if (loadError) return <div>Error al cargar el mapa</div>;
  if (!isLoaded) return <div>Cargando...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapStyles}
      zoom={13}
      center={defaultCenter}
    >
      {incidents.map((incident, index) => (
        incident.location && (
          <Marker
            key={index}
            position={{
              lat: parseFloat(incident.location.lat),
              lng: parseFloat(incident.location.lng)
            }}
            title={incident.type}
          />
        )
      ))}
    </GoogleMap>
  );
};

export default MapComponent;