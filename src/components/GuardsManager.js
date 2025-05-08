import React, { useState, useEffect } from 'react';
import { guardService } from '../services/guardService';
import { auth } from '../config/firebase';

const GuardsManager = ({ zones = [] }) => {
  const [guards, setGuards] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    status: 'active',
    assignedZone: '' // Nuevo campo para la zona asignada
  });

  const [searchZone, setSearchZone] = useState(''); // Estado para la búsqueda de zonas
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // Filtrar zonas basado en la búsqueda
  // Modificar la función de filtrado de zonas para manejar valores undefined
  const filteredZones = zones.filter(zone =>
    zone && zone.name ? zone.name.toLowerCase().includes(searchZone.toLowerCase()) : false
  );

  useEffect(() => {
    loadGuards();
  }, []);

  const loadGuards = async () => {
    try {
      setLoading(true);
      const guardsData = await guardService.getGuards();
      setGuards(guardsData);
    } catch (err) {
      setError('Error al cargar los guardias: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El email es obligatorio');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('El email no es válido');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('El teléfono es obligatorio');
      return false;
    }
    if (!editingId && !formData.password.trim()) {
      setError('La contraseña es obligatoria para nuevos guardias');
      return false;
    }
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setError(null);
    setSuccess('');
    
    if (name === 'phone') {
      const formatted = value.replace(/\D/g, '')
        .replace(/^(\d{3})/, '($1) ')
        .replace(/(\d{3})(\d{4})/, '$1-$2');
      setFormData(prev => ({
        ...prev,
        [name]: formatted
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Modificar el resetForm para incluir assignedZone
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      status: 'active',
      assignedZone: '' // Incluir el campo assignedZone
    });
    setEditingId(null);
    setError(null);
    setSuccess('');
  };

  // Modificar handleEdit para incluir assignedZone
  const handleEdit = (guard) => {
    setError(null);
    setSuccess('');
    setFormData({
      name: guard.name || '',
      email: guard.email || '',
      phone: guard.phone || '',
      password: '',
      status: guard.status || 'active',
      assignedZone: guard.assignedZone || '' // Incluir el campo assignedZone
    });
    setEditingId(guard.id);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      setSuccess('');
  
      if (!validateForm()) return;
  
      try {
          setLoading(true);
          
          const guardDataToUpdate = {
              name: formData.name,
              email: formData.email ? formData.email.toLowerCase() : '',
              phone: formData.phone,
              status: formData.status,
              assignedZone: formData.assignedZone || null // Aseguramos que se incluya la zona asignada
          };
  
          if (!guardDataToUpdate.email) {
              throw new Error('El email es requerido');
          }
  
          if (formData.password && formData.password.trim()) {
              guardDataToUpdate.password = formData.password;
          }
  
          if (editingId) {
              const existingGuard = guards.find(g => 
                  g.email && g.email.toLowerCase() === guardDataToUpdate.email.toLowerCase() && 
                  g.id !== editingId
              );
              
              if (existingGuard) {
                  throw new Error('Ya existe otro guardia con este email');
              }
  
              await guardService.updateGuard(editingId, guardDataToUpdate);
              await loadGuards(); // Recargar inmediatamente después de la actualización
              setSuccess('Guardia actualizado exitosamente');
          } else {
              if (!guardDataToUpdate.password) {
                  throw new Error('La contraseña es requerida para nuevos guardias');
              }
              await guardService.addGuard(guardDataToUpdate);
              await loadGuards(); // Recargar inmediatamente después de agregar
              setSuccess('Guardia agregado exitosamente');
          }
  
          resetForm();
      } catch (err) {
          setError('Error: ' + err.message);
          console.error('Error detallado:', err);
      } finally {
          setLoading(false);
      }
  };

  const handleDelete = async (guardId) => {
    if (!guardId || !window.confirm('¿Está seguro de eliminar este guardia?')) {
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
      
      // Verificar si el guardia existe antes de eliminar
      const guardToDelete = guards.find(guard => guard.id === guardId);
      if (!guardToDelete) {
        throw new Error('No se encontró el guardia a eliminar');
      }
      
      // Eliminar de la base de datos
      await guardService.deleteGuard(guardId);
      
      // Actualizar el estado local solo si la eliminación fue exitosa
      setGuards(prevGuards => prevGuards.filter(guard => guard.id !== guardId));
      setSuccess('Guardia eliminado exitosamente');
      
    } catch (err) {
      setError('Error al eliminar: ' + err.message);
      console.error('Error detallado:', err);
      // Recargar la lista en caso de error para asegurar consistencia
      await loadGuards();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col h-screen overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Gestión de Guardias</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Nombre:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">Teléfono:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-2">
              Contraseña{editingId ? ' (dejar en blanco para mantener)' : ''}:
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required={!editingId}
            />
          </div>
          <div>
            <label className="block mb-2">Estado:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
          {/* Nuevo campo para selección de zona */}
          <div className="col-span-2">
            <label className="block mb-2">Zona Asignada:</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar zona..."
                value={searchZone}
                onChange={(e) => setSearchZone(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <select
                name="assignedZone"
                value={formData.assignedZone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              >
                <option value="">Seleccionar Zona</option>
                {filteredZones.map(zone => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-4 space-x-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Guardando...' : editingId ? 'Actualizar' : 'Agregar'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="flex-1">
        <div className="overflow-x-auto overflow-y-auto h-[calc(100vh-600px)] min-h-[300px]">
          <table className="min-w-full table-auto">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Teléfono</th>
                <th className="px-4 py-2">Zona Asignada</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {guards.map(guard => (
                <tr key={guard.id} className="border-b">
                  <td className="px-4 py-2">{guard.name}</td>
                  <td className="px-4 py-2">{guard.email}</td>
                  <td className="px-4 py-2">{guard.phone}</td>
                  <td className="px-4 py-2">
                    {zones.find(z => z.id === guard.assignedZone)?.name || 'Sin asignar'}
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded ${
                      guard.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {guard.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEdit(guard)}
                      className="mr-2 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(guard.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <p className="text-gray-800">Cargando...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuardsManager;