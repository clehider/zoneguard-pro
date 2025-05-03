import React, { useState } from 'react';

const GuardsManager = ({ guards, setGuards, saveData }) => {
  const [newGuardName, setNewGuardName] = useState('');
  const [newGuardEmail, setNewGuardEmail] = useState('');
  const [newGuardPhone, setNewGuardPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newGuardName) return;

    const newGuard = {
      id: Date.now(),
      name: newGuardName,
      email: newGuardEmail,
      phone: newGuardPhone,
      createdAt: new Date().toISOString(),
      permissions: {
        createRounds: false
      }
    };

    const updatedGuards = [...guards, newGuard];
    setGuards(updatedGuards);
    saveData('guards', updatedGuards);

    setNewGuardName('');
    setNewGuardEmail('');
    setNewGuardPhone('');
  };

  const togglePermission = (guardId, permission) => {
    const updatedGuards = guards.map(guard => {
      if (guard.id === guardId) {
        return {
          ...guard,
          permissions: {
            ...guard.permissions,
            [permission]: !guard.permissions[permission]
          }
        };
      }
      return guard;
    });

    setGuards(updatedGuards);
    saveData('guards', updatedGuards);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Administración de Guardias</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Agregar Nuevo Guardia</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Nombre</label>
              <input
                type="text"
                value={newGuardName}
                onChange={(e) => setNewGuardName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={newGuardEmail}
                onChange={(e) => setNewGuardEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Teléfono</label>
              <input
                type="tel"
                value={newGuardPhone}
                onChange={(e) => setNewGuardPhone(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Registrar Guardia
          </button>
        </form>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Guardias Registrados</h3>
        {guards.length === 0 ? (
          <p>No hay guardias registrados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2 text-left">Nombre</th>
                  <th className="border p-2 text-left">Contacto</th>
                  <th className="border p-2 text-left">Permisos</th>
                </tr>
              </thead>
              <tbody>
                {guards.map(guard => (
                  <tr key={guard.id} className="hover:bg-gray-50">
                    <td className="border p-2">{guard.name}</td>
                    <td className="border p-2">
                      <div className="text-sm">
                        {guard.email && <div>{guard.email}</div>}
                        {guard.phone && <div>{guard.phone}</div>}
                      </div>
                    </td>
                    <td className="border p-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`permission-create-${guard.id}`}
                          checked={guard.permissions.createRounds}
                          onChange={() => togglePermission(guard.id, 'createRounds')}
                          className="mr-2"
                        />
                        <label htmlFor={`permission-create-${guard.id}`}>
                          Realizar Rondas
                        </label>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuardsManager;

// DONE