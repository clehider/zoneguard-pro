import React, { useState } from 'react';
import RoundValidator from './RoundValidator';
import { guardService } from '../services/guardService';

const GuardsManager = ({ guards = [], zones = [], setGuards, saveData }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    identification: '',
    phone: '',
    email: '',
    status: 'Activo',
    assignedZone: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveData(formData);
      resetForm();
    } catch (error) {
      console.error('Error al guardar guardia:', error);
      alert('Error al guardar el guardia');
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: '',
      identification: '',
      phone: '',
      email: '',
      status: 'Activo',
      assignedZone: ''
    });
    setIsEditing(false);
  };

  const handleEdit = (guard) => {
    setFormData({
      id: guard.id,
      name: guard.name,
      identification: guard.identification,
      phone: guard.phone,
      email: guard.email,
      status: guard.status,
      assignedZone: guard.assignedZone || ''
    });
    setIsEditing(true);
  };

  const handleDelete = async (guardId) => {
    if (window.confirm('¿Está seguro de eliminar este guardia?')) {
      try {
        await guardService.deleteGuard(guardId);
        const updatedGuards = guards.filter(g => g.id !== guardId);
        setGuards(updatedGuards);
        alert('Guardia eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar guardia:', error);
        alert('Error al eliminar el guardia');
      }
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Editar Guardia' : 'Registrar Nuevo Guardia'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nombre Completo</label>
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
                <label className="block text-gray-700 mb-2">Identificación</label>
                <input
                  type="text"
                  name="identification"
                  value={formData.identification}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Zona Asignada</label>
                <select
                  name="assignedZone"
                  value={formData.assignedZone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Seleccione una zona</option>
                  {zones.map(zone => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  {isEditing ? 'Actualizar Guardia' : 'Guardar Guardia'}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Guardias Registrados</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {guards.map(guard => (
              <div
                key={guard.id}
                className="border p-3 rounded hover:bg-gray-50"
              >
                <p className="font-medium">{guard.name}</p>
                <p className="text-sm text-gray-600">{guard.identification}</p>
                <p className="text-sm text-gray-500">{guard.phone}</p>
                <p className="text-sm text-gray-500">
                  <strong>Zona Asignada:</strong> {
                    zones.find(z => z.id === guard.assignedZone)?.name || 'No asignada'
                  }
                </p>
                <div className={`text-xs mt-1 inline-block px-2 py-1 rounded ${
                  guard.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {guard.status}
                </div>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(guard)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(guard.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardsManager;

// DONE