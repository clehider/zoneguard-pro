import React, { useState, useEffect } from 'react';

const PointManager = ({ zones, points, setPoints, saveData }) => {
  const [selectedZone, setSelectedZone] = useState('');
  const [pointName, setPointName] = useState('');
  const [pointDescription, setPointDescription] = useState('');
  const [pointLocation, setPointLocation] = useState(null);
  const [isMapVisible, setIsMapVisible] = useState(false);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPointLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleMapClick = (e) => {
    // Simulación de clic en mapa para seleccionar ubicación
    setPointLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedZone || !pointName || !pointLocation) return;

    const newPoint = {
      id: Date.now(),
      zoneId: selectedZone,
      name: pointName,
      description: pointDescription,
      location: pointLocation,
      createdAt: new Date().toISOString()
    };

    const updatedPoints = [...points, newPoint];
    setPoints(updatedPoints);
    saveData('points', updatedPoints);
    
    setPointName('');
    setPointDescription('');
    setPointLocation(null);
    setSelectedZone('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Administrar Puntos</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Crear Nuevo Punto</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Zona</label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">Seleccionar Zona</option>
              {zones.map(zone => (
                <option key={zone.id} value={zone.id}>
                  {zone.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nombre del Punto</label>
            <input
              type="text"
              value={pointName}
              onChange={(e) => setPointName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Descripción</label>
            <textarea
              value={pointDescription}
              onChange={(e) => setPointDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
            />
          </div>
          
          <div className="mb-4">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={getCurrentLocation}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Usar Ubicación Actual
              </button>
              <button
                type="button"
                onClick={() => setIsMapVisible(!isMapVisible)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                {isMapVisible ? 'Ocultar Mapa' : 'Seleccionar en Mapa'}
              </button>
            </div>
            
            {pointLocation && (
              <div className="mt-2 p-2 bg-gray-100 rounded">
                <p>Ubicación seleccionada:</p>
                <p>Latitud: {pointLocation.lat.toFixed(6)}</p>
                <p>Longitud: {pointLocation.lng.toFixed(6)}</p>
              </div>
            )}
            
            {isMapVisible && (
              <div 
                className="mt-4 h-64 w-full bg-gray-200 rounded-lg relative"
                onClick={handleMapClick}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <p>Mapa Interactivo Aquí (Simulación)</p>
                  {pointLocation && (
                    <div 
                      className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-2 -translate-y-2"
                      style={{
                        left: '50%',
                        top: '50%'
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={!selectedZone || !pointName || !pointLocation}
          >
            Crear Punto
          </button>
        </form>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Puntos Existentes</h3>
        {points.length === 0 ? (
          <p>No hay puntos creados aún</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {points.map(point => {
              const zone = zones.find(z => z.id === point.zoneId);
              return (
                <div key={point.id} className="border p-4 rounded-lg">
                  <h4 className="font-medium">{point.name}</h4>
                  <p className="text-sm text-gray-600">{point.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Zona: {zone ? zone.name : 'Desconocida'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Ubicación: {point.location.lat.toFixed(4)}, {point.location.lng.toFixed(4)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Creado: {new Date(point.createdAt).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PointManager;