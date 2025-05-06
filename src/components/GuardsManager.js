import React, { useState } from 'react';
import RoundValidator from './RoundValidator';

const GuardsManager = ({ guards = [], zones = [], setGuards, saveData }) => {
  const [formData, setFormData] = useState({
    name: '',
    identification: '',
    phone: '',
    email: '',
    status: 'Activo',
    assignedZone: ''  // Agregado para manejar la zona asignada
  });

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
      setFormData({
        name: '',
        identification: '',
        phone: '',
        email: '',
        status: 'Activo'
      });
    } catch (error) {
      console.error('Error al guardar guardia:', error);
      alert('Error al guardar el guardia');
    }
  };

  const handleGuardSelect = (guard) => {
    setCurrentGuard(guard);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Registrar Nuevo Guardia</h2>
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
              
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Guardar Guardia
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Guardias Registrados</h2>
          <div className="space-y-2">
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