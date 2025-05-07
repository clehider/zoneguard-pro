import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

const ZoneAssignment = ({ zones = [], guards = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (zones.length > 0 && guards.length > 0) {
      loadAssignments().finally(() => setIsLoading(false));
    }
  }, [zones, guards]);

  if (isLoading) {
    return <div className="p-4 text-center">Cargando zonas y guardias...</div>;
  }

  if (!zones.length || !guards.length) {
    return <div className="p-4 text-center">No hay zonas o guardias disponibles</div>;
  }

  const loadAssignments = async () => {
    try {
      const assignmentsRef = collection(db, 'zoneAssignments');
      const q = query(assignmentsRef, orderBy('assignedAt', 'desc'));
      const assignmentsSnapshot = await getDocs(q);
      const assignmentsData = assignmentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAssignments(assignmentsData);
    } catch (error) {
      console.error('Error al cargar asignaciones:', error);
    }
  };

  const handleZoneClick = (zone) => {
    setSelectedZone(zone);
    setShowModal(true);
  };

  const handleAssignGuard = async (guard) => {
    try {
      await addDoc(collection(db, 'zoneAssignments'), {
        zoneId: selectedZone.id,
        guardId: guard.id,
        assignedAt: new Date().toISOString()
      });
      
      await loadAssignments();
      setShowModal(false);
      alert('Guardia asignado correctamente');
    } catch (error) {
      console.error('Error al asignar guardia:', error);
      alert('Error al asignar guardia');
    }
  };

  const handleRemoveAssignment = async (assignmentId) => {
    if (window.confirm('¿Está seguro de eliminar esta asignación?')) {
      try {
        await deleteDoc(doc(db, 'zoneAssignments', assignmentId));
        await loadAssignments();
        alert('Asignación eliminada correctamente');
      } catch (error) {
        console.error('Error al eliminar asignación:', error);
        alert('Error al eliminar asignación');
      }
    }
  };

  const filteredGuards = guards.filter(guard => 
    guard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guard.identification.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Delegación de Rondas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {zones.map(zone => {
          const zoneAssignments = assignments.filter(a => a.zoneId === zone.id);
          const assignedGuards = zoneAssignments.map(a => 
            guards.find(g => g.id === a.guardId)
          ).filter(Boolean);

          return (
            <div 
              key={zone.id} 
              className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleZoneClick(zone)}
            >
              <h3 className="text-lg font-semibold">{zone.name}</h3>
              <p className="text-gray-600">{zone.description}</p>
              <div className="mt-2">
                <p className="font-medium">Guardias Asignados:</p>
                {assignedGuards.map(guard => (
                  <div key={guard.id} className="flex justify-between items-center mt-1">
                    <span>{guard.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const assignment = zoneAssignments.find(a => a.guardId === guard.id);
                        handleRemoveAssignment(assignment.id);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-semibold mb-4">
              Asignar Guardia a {selectedZone.name}
            </h3>
            
            <input
              type="text"
              placeholder="Buscar por nombre o CI..."
              className="w-full p-2 border rounded mb-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="max-h-60 overflow-y-auto">
              {filteredGuards.map(guard => (
                <div
                  key={guard.id}
                  className="p-2 hover:bg-gray-100 cursor-pointer rounded"
                  onClick={() => handleAssignGuard(guard)}
                >
                  <p className="font-medium">{guard.name}</p>
                  <p className="text-sm text-gray-600">CI: {guard.identification}</p>
                </div>
              ))}
            </div>

            <button
              className="mt-4 w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
              onClick={() => setShowModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoneAssignment;