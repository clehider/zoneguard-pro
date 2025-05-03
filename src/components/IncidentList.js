import React from 'react';

const IncidentList = ({ incidents, onIncidentSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Lista de Incidentes</h2>
      <div className="space-y-2">
        {incidents.length === 0 ? (
          <p className="text-gray-500">No hay incidentes registrados</p>
        ) : (
          incidents.map((incident, index) => (
            <div 
              key={index}
              className="border p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onIncidentSelect(incident)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{incident.type}</h3>
                  <p className="text-sm text-gray-600">{incident.description}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  incident.status === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                  incident.status === 'En Proceso' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {incident.status}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                <p>Asignado a: {incident.assignedTo || 'Sin asignar'}</p>
                <p>Ubicación: {incident.location?.lat.toFixed(4)}, {incident.location?.lng.toFixed(4)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IncidentList;