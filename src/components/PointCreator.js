import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { pointService } from '../services/pointService';

const PointCreator = ({ points = [], zones = [], setPoints, saveData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    zoneId: '',
    location: null
  });

  // Añadimos useEffect para cargar los puntos al iniciar
  useEffect(() => {
    const loadPoints = async () => {
      try {
        const loadedPoints = await pointService.getPoints();
        setPoints(loadedPoints);
      } catch (error) {
        console.error('Error al cargar puntos:', error);
      }
    };
    loadPoints();
  }, [setPoints]);

  const [editMode, setEditMode] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      location: {
        lat: location.lat,
        lng: location.lng
      }
    }));
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          handleLocationSelect({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          alert("Error al obtener la ubicación GPS");
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("GPS no soportado en este navegador.");
    }
  };

  const handleEdit = (point) => {
    setFormData({
      id: point.id,
      name: point.name,
      description: point.description,
      zoneId: point.zoneId,
      location: point.location
    });
    setEditMode(true);
  };

  const handleDelete = async (pointId) => {
    if (window.confirm('¿Está seguro de eliminar este punto?')) {
      try {
        await pointService.deletePoint(pointId);
        const updatedPoints = await pointService.getPoints();
        setPoints(updatedPoints);
        alert('Punto eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar punto:', error);
        alert('Error al eliminar el punto');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.location) {
      alert('Por favor seleccione una ubicación en el mapa o use GPS');
      return;
    }
    if (!formData.zoneId) {
      alert('Por favor seleccione una zona');
      return;
    }
    try {
      if (editMode) {
        await pointService.updatePoint(formData.id, formData);
      } else {
        await pointService.addPoint(formData);
      }
      const updatedPoints = await pointService.getPoints();
      setPoints(updatedPoints);
      setFormData({
        id: null,
        name: '',
        description: '',
        zoneId: '',
        location: null
      });
      setEditMode(false);
      alert(editMode ? 'Punto actualizado con éxito' : 'Punto registrado con éxito');
    } catch (error) {
      console.error('Error al guardar punto:', error);
      alert('Error al guardar el punto');
    }
  };

  function MapEvents({ onLocationSelect }) {
    useMapEvents({
      click: (e) => {
        onLocationSelect({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
      },
    });
    return null;
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-6 rounded-lg shadow overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        <h2 className="text-xl font-semibold mb-4">
          {editMode ? 'Editar Punto' : 'Crear Nuevo Punto'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Nombre del Punto</label>
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
              <label className="block text-gray-700 mb-2">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                rows="3"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Zona</label>
              <select
                name="zoneId"
                value={formData.zoneId}
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

            <div>
              <label className="block text-gray-700 mb-2">Ubicación</label>
              {formData.location ? (
                <p className="text-sm text-gray-600">
                  Lat: {formData.location.lat.toFixed(6)}, 
                  Lng: {formData.location.lng.toFixed(6)}
                </p>
              ) : (
                <p className="text-sm text-gray-500">Seleccione ubicación en el mapa o use GPS</p>
              )}
              <button
                type="button"
                onClick={getCurrentLocation}
                className="mt-2 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              >
                Usar GPS
              </button>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Guardar Punto
            </button>
          </div>
        </form>
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
            <MapEvents onLocationSelect={handleLocationSelect} />
            {formData.location && (
              <Marker position={[formData.location.lat, formData.location.lng]} />
            )}
            {points && points.map((point) => (
              point.location && (
                <Marker
                  key={point.id}
                  position={[point.location.lat, point.location.lng]}
                  title={point.name}
                />
              )
            ))}
          </MapContainer>
        </div>

        <div className="mt-4 overflow-y-auto" style={{ maxHeight: '300px' }}>
          <h3 className="font-semibold mb-2">Puntos Registrados</h3>
          <div className="space-y-2">
            {points && points.map(point => (
              <div key={point.id} className="border p-3 rounded hover:bg-gray-50">
                <p className="font-medium">{point.name}</p>
                <p className="text-sm text-gray-600">{point.description}</p>
                <p className="text-xs text-gray-500">
                  Zona: {zones.find(z => z.id === point.zoneId)?.name || 'N/A'}
                </p>
                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => handleEdit(point)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(point.id)}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
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

export default PointCreator;