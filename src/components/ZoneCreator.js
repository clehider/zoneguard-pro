import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

const ZoneCreator = ({ zones = [], setZones, saveData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      location: {
        lat: location.lat,
        lng: location.lng
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location) {
      alert('Por favor seleccione una ubicación en el mapa');
      return;
    }
    try {
      await saveData(formData);
      setFormData({
        name: '',
        description: '',
        location: null
      });
    } catch (error) {
      console.error('Error al guardar zona:', error);
      alert('Error al guardar la zona');
    }
  };

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

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Crear Nueva Zona</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Nombre de la Zona</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Ubicación</label>
              {formData.location ? (
                <p className="text-sm text-gray-600">
                  Lat: {formData.location.lat.toFixed(6)}, 
                  Lng: {formData.location.lng.toFixed(6)}
                </p>
              ) : (
                <p className="text-sm text-gray-500">Haga clic en el mapa para seleccionar ubicación</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Guardar Zona
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div style={{ height: '400px' }}>
          <MapContainer
            center={[-17.755607, -63.162082]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <MapEvents onLocationSelect={handleLocationSelect} />
            {formData.location && (
              <Marker position={[formData.location.lat, formData.location.lng]} />
            )}
            {zones.map((zone, index) => (
              zone.location && (
                <Marker
                  key={zone.id || index}
                  position={[zone.location.lat, zone.location.lng]}
                  title={zone.name}
                />
              )
            ))}
          </MapContainer>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Zonas Registradas</h3>
          <div className="space-y-2">
            {zones.map(zone => (
              <div key={zone.id} className="border p-3 rounded">
                <p className="font-medium">{zone.name}</p>
                <p className="text-sm text-gray-600">{zone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneCreator;

// DONE