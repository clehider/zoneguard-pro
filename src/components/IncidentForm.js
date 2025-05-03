import React, { useState } from 'react';

const IncidentForm = ({ onSave, initialData, isEditing }) => {
  const [formData, setFormData] = useState(initialData || {
    type: '',
    description: '',
    location: null,
    status: 'Pendiente',
    assignedTo: ''
  });

  const incidentTypes = [
    'Robo',
    'Vandalismo',
    'Persona Sospechosa',
    'Accidente',
    'Emergencia Médica',
    'Otro'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    // Limpiar formulario después de guardar
    setFormData({
      type: '',
      description: '',
      location: null,
      status: 'Pendiente',
      assignedTo: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? 'Editar Incidente' : 'Registrar Nuevo Incidente'}
      </h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo de Incidente</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({...formData, type: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Seleccione un tipo</option>
          {incidentTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows="3"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Asignado a</label>
        <input
          type="text"
          value={formData.assignedTo}
          onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({...formData, status: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="Pendiente">Pendiente</option>
          <option value="En Proceso">En Proceso</option>
          <option value="Resuelto">Resuelto</option>
          <option value="Cerrado">Cerrado</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Guardar Incidente
      </button>
    </form>
  );
};

export default IncidentForm;