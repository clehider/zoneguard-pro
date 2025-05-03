import React, { useState, useEffect } from 'react';

const RoundValidator = ({ points, rounds, setRounds, saveData }) => {
  const [currentUserLocation, setCurrentUserLocation] = useState(null);
  const [currentPointIndex, setCurrentPointIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(null);
  const [roundNotes, setRoundNotes] = useState('');
  const [guardName, setGuardName] = useState('');
  
  const filteredPoints = points;
  const currentPoint = filteredPoints[currentPointIndex];

  const getDistance = (lat1, lon1, lat2, lon2) => {
    // Simulación de cálculo de distancia (en metros)
    // En una aplicación real, usaríamos la fórmula de Haversine
    return Math.abs(lat1 - lat2) * 111000; // 1 grado ≈ 111km
  };

  const isWithinRange = () => {
    if (!currentUserLocation || !currentPoint) return false;
    const distance = getDistance(
      currentUserLocation.lat,
      currentUserLocation.lng,
      currentPoint.location.lat,
      currentPoint.location.lng
    );
    return distance <= 20; // 20 metros
  };

  const startNewRound = () => {
    const newRound = {
      id: Date.now(),
      startTime: new Date().toISOString(),
      guardName: guardName,
      validatedPoints: [],
      notes: roundNotes,
      status: 'in_progress'
    };
    
    setCurrentRound(newRound);
    setCurrentPointIndex(0);
    setGuardName('');
    setRoundNotes('');
  };

  const validateCurrentPoint = () => {
    if (!currentRound || !isWithinRange()) return;

    const updatedRound = {
      ...currentRound,
      validatedPoints: [
        ...currentRound.validatedPoints,
        {
          pointId: currentPoint.id,
          validatedAt: new Date().toISOString()
        }
      ]
    };

    setCurrentRound(updatedRound);
    
    if (currentPointIndex < filteredPoints.length - 1) {
      setCurrentPointIndex(currentPointIndex + 1);
    } else {
      finishRound(updatedRound);
    }
  };

  const finishRound = (round) => {
    const completedRound = {
      ...round,
      endTime: new Date().toISOString(),
      status: 'completed'
    };
    
    const updatedRounds = [...rounds, completedRound];
    setRounds(updatedRounds);
    saveData('rounds', updatedRounds);
    setCurrentRound(null);
    setCurrentPointIndex(0);
  };

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (currentRound) {
      const interval = setInterval(updateLocation, 5000);
      return () => clearInterval(interval);
    }
  }, [currentRound]);

  if (!currentRound) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Iniciar Nueva Ronda</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nombre del Guardia</label>
          <input
            type="text"
            value={guardName}
            onChange={(e) => setGuardName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Notas</label>
          <textarea
            value={roundNotes}
            onChange={(e) => setRoundNotes(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            rows="3"
          />
        </div>
        
        <button
          onClick={startNewRound}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          disabled={!guardName}
        >
          Iniciar Ronda
        </button>
        
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">Rondas Anteriores</h3>
          {rounds.length === 0 ? (
            <p>No hay rondas registradas</p>
          ) : (
            <div className="space-y-2">
              {rounds.map(round => (
                <div key={round.id} className="border p-3 rounded">
                  <p className="font-medium">{round.guardName}</p>
                  <p className="text-sm text-gray-500">
                    Validados: {round.validatedPoints.length} puntos
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(round.startTime).toLocaleString()} -{' '}
                    {round.endTime ? new Date(round.endTime).toLocaleString() : 'En progreso'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-1">Ronda en Progreso</h2>
      <p className="text-sm text-gray-500 mb-4">
        Guardia: {currentRound.guardName}
      </p>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-medium text-blue-800 mb-2">
          Punto Actual: {currentPointIndex + 1} de {filteredPoints.length}
        </h3>
        <p className="font-medium">{currentPoint.name}</p>
        <p className="text-sm text-gray-600">{currentPoint.description}</p>
        
        <div className="mt-4">
          <div className="flex justify-between items-center">
            <div>
              <button
                onClick={updateLocation}
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                Actualizar Ubicación
              </button>
            </div>
            <div className="text-sm">
              {currentUserLocation ? (
                <span>
                  Distancia: {getDistance(
                    currentUserLocation.lat,
                    currentUserLocation.lng,
                    currentPoint.location.lat,
                    currentPoint.location.lng
                  ).toFixed(1)} m
                </span>
              ) : (
                <span>Ubicación no disponible</span>
              )}
            </div>
          </div>
          
          <div className="mt-3">
            {isWithinRange() ? (
              <div className="bg-green-100 text-green-800 p-2 rounded flex items-center">
                <span className="mr-2">✔️</span>
                <span>Estás dentro del rango (≤20m) para validar este punto</span>
              </div>
            ) : (
              <div className="bg-yellow-100 text-yellow-800 p-2 rounded flex items-center">
                <span className="mr-2">⚠️</span>
                <span>Acércate más al punto para validar (≤20m requeridos)</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <button
        onClick={validateCurrentPoint}
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-2"
        disabled={!isWithinRange()}
      >
        Validar Punto Actual
      </button>
      
      <button
        onClick={() => finishRound(currentRound)}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        Finalizar Ronda
      </button>
    </div>
  );
};

export default RoundValidator;