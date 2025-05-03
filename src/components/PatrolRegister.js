import React, { useState } from 'react';
import googleSheetsService from '../services/googleSheetsService';

const PatrolRegister = ({ location }) => {
  const [observation, setObservation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const patrolData = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      ubicacion: location.name || 'Sin especificar',
      latitud: location.lat,
      longitud: location.lng,
      estado: 'Activo',
      observaciones: observation
    };

    try {
      await googleSheetsService.addRecord('Patrullas', patrolData);
      setObservation('');
      alert('Registro guardado exitosamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Error al guardar el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={observation}
        onChange={(e) => setObservation(e.target.value)}
        className="w-full p-2 border rounded"
        placeholder="Observaciones"
      />
      <button 
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Guardando...' : 'Registrar Patrullaje'}
      </button>
    </form>
  );
};

export default PatrolRegister;