import React, { useState } from 'react';
import { sheetsService } from '../services/sheetsService';

const RondaForm = ({ onSubmit }) => {
  const [guardia, setGuardia] = useState('');
  const [notas, setNotas] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const now = new Date();
    const rondaData = {
      id: Date.now().toString(),
      fecha: now.toLocaleDateString(),
      horaInicio: now.toLocaleTimeString(),
      horaFin: '',
      guardia,
      estado: 'En Progreso',
      notas,
      puntosValidados: '0',
      latitud: '',
      longitud: ''
    };

    const success = await sheetsService.addRonda(rondaData);
    if (success) {
      setGuardia('');
      setNotas('');
      onSubmit?.(rondaData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={guardia}
        onChange={(e) => setGuardia(e.target.value)}
        placeholder="Nombre del Guardia"
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
        placeholder="Notas de la ronda"
        className="w-full p-2 border rounded"
      />
      <button 
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Iniciar Ronda
      </button>
    </form>
  );
};

export default RondaForm;