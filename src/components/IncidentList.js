import React from 'react';

const IncidentList = ({ incidents = [], onIncidentSelect }) => {
  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Lista de Incidentes</h2>
      {incidents.length === 0 ? (
        <p className="text-gray-500">No hay incidentes registrados</p>
      ) : (
        <div className="space-y-2">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="border p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              onClick={() => onIncidentSelect(incident)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{incident.type || 'Sin tipo'}</h3>
                  <p className="text-sm text-gray-600">{incident.description || 'Sin descripción'}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    <p>Estado: {incident.status || 'Pendiente'}</p>
                    <p>Asignado a: {incident.assignedTo || 'Sin asignar'}</p>
                    {incident.location && (
                      <p>Ubicación: {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncidentList;