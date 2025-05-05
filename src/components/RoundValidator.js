import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { RoundReports } from './RoundReports';

const RoundValidator = ({ guards, zones, points }) => {
  const [selectedGuard, setSelectedGuard] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [validatedPoints, setValidatedPoints] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  const calculateDistance = (point1, point2) => {
    const R = 6371e3; // Radio de la tierra en metros
    const φ1 = point1.lat * Math.PI/180;
    const φ2 = point2.lat * Math.PI/180;
    const Δφ = (point2.lat-point1.lat) * Math.PI/180;
    const Δλ = (point2.lng-point1.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  useEffect(() => {
    if (selectedZone) {
      // Filtrar puntos por zona seleccionada
      const zonePoints = points.filter(point => point.zoneId === selectedZone);
      // Seleccionar el primer punto no validado
      const nextPoint = zonePoints.find(p => !validatedPoints.includes(p.id));
      setSelectedPoint(nextPoint || null);
    }
  }, [selectedZone, points, validatedPoints]);

  const validatePoint = async () => {
    if (!userLocation || !selectedPoint) {
      alert('Por favor, active su GPS para validar el punto');
      return;
    }

    const distance = calculateDistance(userLocation, selectedPoint.location);
    console.log('Distancia al punto:', distance, 'metros');
    
    if (distance <= 10) { // 10 metros de distancia máxima
      const validation = {
        pointId: selectedPoint.id,
        guardId: selectedGuard,
        zoneId: selectedZone,
        timestamp: new Date().toISOString(),
        location: userLocation
      };

      try {
        // Guardar en Firebase
        await addDoc(collection(db, 'validations'), validation);
        
        setValidatedPoints([...validatedPoints, selectedPoint.id]);
        alert('¡Punto validado correctamente!');
        
        // Buscar siguiente punto no validado
        const zonePoints = points.filter(point => point.zoneId === selectedZone);
        const nextPoint = zonePoints.find(p => !validatedPoints.includes(p.id));
        setSelectedPoint(nextPoint || null);
      } catch (error) {
        console.error('Error al validar punto:', error);
        alert('Error al validar el punto');
      }
    } else {
      alert(`Debe acercarse más al punto. Está a ${Math.round(distance)} metros. Distancia máxima permitida: 10 metros`);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error obteniendo ubicación:', error);
        },
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Validación de Ronda</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Guardia</label>
              <select
                value={selectedGuard}
                onChange={(e) => setSelectedGuard(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Seleccione un guardia</option>
                {guards.map(guard => (
                  <option key={guard.id} value={guard.id}>{guard.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Zona</label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                <option value="">Seleccione una zona</option>
                {zones.map(zone => (
                  <option key={zone.id} value={zone.id}>{zone.name}</option>
                ))}
              </select>
            </div>

            {selectedPoint && (
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-semibold">Punto Actual:</h3>
                <p className="font-medium">{selectedPoint.name}</p>
                <p className="text-sm text-gray-600">{selectedPoint.description}</p>
                <button
                  onClick={validatePoint}
                  className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  Validar Punto
                </button>
              </div>
            )}

            {!selectedPoint && selectedZone && (
              <div className="bg-yellow-50 p-4 rounded">
                <p className="text-center text-gray-600">
                  No hay más puntos pendientes de validación en esta zona
                </p>
              </div>
            )}

            {validatedPoints.length > 0 && (
              <RoundReports
                validatedPoints={validatedPoints}
                guards={guards}
                zones={zones}
                points={points}
              />
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div style={{ height: '400px' }}>
            <MapContainer
              center={[-17.755607, -63.162082]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              {userLocation && (
                <Marker position={[userLocation.lat, userLocation.lng]} />
              )}
              {selectedPoint && selectedPoint.location && (
                <Marker position={[selectedPoint.location.lat, selectedPoint.location.lng]} />
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundValidator;