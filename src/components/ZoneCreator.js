import React, { useState } from 'react';
import LeafletMap from './LeafletMap';

const ZoneCreator = ({ zones, setZones, saveData, apiKey }) => {
  const [zoneName, setZoneName] = useState('');
  const [zoneDescription, setZoneDescription] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -12.0464, lng: -77.0428 });

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(loc);
          setMapCenter(loc);
        },
        (error) => alert("Error obteniendo ubicación: " + error.message)
      );
    } else {
      alert("Geolocalización no soportada por este navegador");
    }
  };

  const handleMapClick = (e) => {
    setCurrentLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!zoneName || !currentLocation) return;

    const newZone = {
      id: Date.now(),
      name: zoneName,
      description: zoneDescription,
      location: currentLocation,
      createdAt: new Date().toISOString()
    };

    const updatedZones = [...zones, newZone];
    setZones(updatedZones);
    saveData('zones', updatedZones);
    
    // Reset form
    setZoneName('');
    setZoneDescription('');
    setCurrentLocation(null);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-180px)] gap-4 overflow-hidden">
      <div className="md:w-1/2 overflow-y-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Crear Nueva Zona</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Nombre de la Zona</label>
              <input
                type="text"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Descripción</label>
              <textarea
                value={zoneDescription}
                onChange={(e) => setZoneDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>
            
            <div>
              <button
                type="button"
                onClick={getLocation}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Usar Mi Ubicación
              </button>
              
              {currentLocation && (
                <div className="mt-2 p-3 bg-blue-50 rounded">
                  <p className="text-sm text-blue-800">
                    Ubicación seleccionada: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={!currentLocation}
            >
              Guardar Zona
            </button>
          </form>
        </div>
      </div>
      
      <div className="md:w-1/2 h-full">
        <div className="bg-white p-6 rounded-lg shadow h-full">
          <LeafletMap 
            center={mapCenter} 
            zoom={15}
            points={zones}
            onMapClick={handleMapClick}
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ZoneCreator;

// DONE