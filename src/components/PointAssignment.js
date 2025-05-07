import React, { useState, useEffect } from 'react';
import { guardService } from '../services/guardService';
import { pointService } from '../services/pointService';

const PointAssignment = ({ guards, points }) => {
  const [selectedGuard, setSelectedGuard] = useState('');
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [assignedPoints, setAssignedPoints] = useState([]);

  useEffect(() => {
    if (selectedGuard) {
      const guard = guards.find(g => g.id === selectedGuard);
      setAssignedPoints(guard?.assignedPoints || []);
    }
  }, [selectedGuard, guards]);

  const handleAssignPoints = async () => {
    try {
      await guardService.assignPointsToGuard(selectedGuard, selectedPoints);
      alert('Puntos asignados correctamente');
      setSelectedPoints([]);
      
      // Actualizar lista de puntos asignados
      const guard = guards.find(g => g.id === selectedGuard);
      setAssignedPoints([...(guard?.assignedPoints || []), ...selectedPoints]);
    } catch (error) {
      console.error('Error al asignar puntos:', error);
      alert('Error al asignar puntos');
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Asignación de Puntos a Guardias</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-2">Seleccionar Guardia</label>
          <select
            value={selectedGuard}
            onChange={(e) => setSelectedGuard(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Seleccione un guardia</option>
            {guards.map(guard => (
              <option key={guard.id} value={guard.id}>
                {guard.name}
              </option>
            ))}
          </select>
        </div>

        {selectedGuard && (
          <>
            <div>
              <label className="block text-gray-700 mb-2">Seleccionar Puntos</label>
              <select
                multiple
                value={selectedPoints}
                onChange={(e) => setSelectedPoints(
                  Array.from(e.target.selectedOptions, option => option.value)
                )}
                className="w-full p-2 border border-gray-300 rounded h-32"
              >
                {points.map(point => (
                  <option key={point.id} value={point.id}>
                    {point.name} - {point.description}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAssignPoints}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              disabled={selectedPoints.length === 0}
            >
              Asignar Puntos Seleccionados
            </button>

            <div>
              <h3 className="font-medium mb-2">Puntos Asignados</h3>
              {assignedPoints.length === 0 ? (
                <p>No hay puntos asignados</p>
              ) : (
                <ul className="space-y-1">
                  {points
                    .filter(point => assignedPoints.includes(point.id))
                    .map(point => (
                      <li key={point.id} className="border p-2 rounded">
                        {point.name} - {point.description}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PointAssignment;