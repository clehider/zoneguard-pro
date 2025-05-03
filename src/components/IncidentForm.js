import React, { useState } from 'react';

const IncidentForm = ({ onSave }) => {
  const [incidentData, setIncidentData] = useState({
    type: '',
    description: '',
    location: null,
    status: 'Pendiente',
    assignedTo: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(incidentData);
    // Reset form
    setIncidentData({
      type: '',
      description: '',
      location: null,
      status: 'Pendiente',
      assignedTo: ''
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIncidentData({
            ...incidentData,
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Error al obtener la ubicación");
        }
      );
    } else {
      alert("Geolocalización no soportada por este navegador");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Registrar Incidente</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Tipo de Incidente</label>
          <input
            type="text"
            value={incidentData.type}
            onChange={(e) => setIncidentData({...incidentData, type: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Descripción</label>
          <textarea
            value={incidentData.description}
            onChange={(e) => setIncidentData({...incidentData, description: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
            rows="3"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 mb-2">Asignado a</label>
          <input
            type="text"
            value={incidentData.assignedTo}
            onChange={(e) => setIncidentData({...incidentData, assignedTo: e.target.value})}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        
        <div>
          <button
            type="button"
            onClick={getCurrentLocation}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
          >
            Obtener Ubicación Actual
          </button>
          
          {incidentData.location && (
            <div className="p-2 bg-gray-100 rounded">
              <p>Ubicación: {incidentData.location.lat.toFixed(6)}, {incidentData.location.lng.toFixed(6)}</p>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          disabled={!incidentData.type || !incidentData.description || !incidentData.location}
        >
          Registrar Incidente
        </button>
      </form>
    </div>
  );
};

export default IncidentForm;