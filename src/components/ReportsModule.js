import React, { useState } from 'react';

const ReportsModule = ({ rounds, guards }) => {
  const [selectedRound, setSelectedRound] = useState(null);
  
  const exportToPDF = () => {
    alert("Función de exportación a PDF simulada");
  };
  
  const exportToExcel = () => {
    alert("Función de exportación a Excel simulada");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Reportes de Rondas</h2>
      
      <div className="flex space-x-4 mb-6">
        <button
          onClick={exportToPDF}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Exportar a PDF
        </button>
        <button
          onClick={exportToExcel}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Exportar a Excel
        </button>
      </div>
      
      <div className="space-y-4">
        {rounds.length === 0 ? (
          <p>No hay rondas registradas</p>
        ) : (
          rounds.map(round => (
            <div 
              key={round.id} 
              className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => setSelectedRound(round)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{round.guardName}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(round.startTime).toLocaleDateString()} -{' '}
                    {round.endTime ? new Date(round.endTime).toLocaleTimeString() : 'En progreso'}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                  {round.validatedPoints.length} puntos
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      {selectedRound && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Detalle de Ronda</h3>
            <button 
              onClick={() => setSelectedRound(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Cerrar
            </button>
          </div>
          
          <div className="mb-4">
            <p><span className="font-medium">Guardia:</span> {selectedRound.guardName}</p>
            <p><span className="font-medium">Inicio:</span> {new Date(selectedRound.startTime).toLocaleString()}</p>
            {selectedRound.endTime && (
              <p><span className="font-medium">Fin:</span> {new Date(selectedRound.endTime).toLocaleString()}</p>
            )}
            <p><span className="font-medium">Estado:</span> {selectedRound.status === 'completed' ? 'Completada' : 'En progreso'}</p>
            {selectedRound.notes && (
              <p className="mt-2">
                <span className="font-medium">Notas:</span> {selectedRound.notes}
              </p>
            )}
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Puntos Validados</h4>
            {selectedRound.validatedPoints.length === 0 ? (
              <p>No se validaron puntos</p>
            ) : (
              <div className="space-y-2">
                {selectedRound.validatedPoints.map((vp, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-3 py-1">
                    <p>
                      <span className="font-medium">Hora:</span>{' '}
                      {new Date(vp.validatedAt).toLocaleTimeString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsModule;