import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'guard',
    permissions: ['rondero'],
    identification: '',
    phone: '',
    assignedZone: ''
  });

  const roles = {
    admin: ['admin', 'manage_users', 'view_reports', 'zonas', 'guardias'],
    supervisor: ['view_reports', 'manage_guards', 'zonas'],
    guard: ['rondero']
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.createUser(formData);
      alert('Usuario creado exitosamente');
      resetForm();
    } catch (error) {
      alert('Error al crear usuario: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'guard',
      permissions: ['rondero'],
      identification: '',
      phone: '',
      assignedZone: ''
    });
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Crear Nuevo Usuario</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Contraseña</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* Campos específicos para guardias */}
              <div>
                <label className="block text-gray-700 mb-2">Identificación</label>
                <input
                  type="text"
                  value={formData.identification}
                  onChange={(e) => setFormData({...formData, identification: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Zona Asignada</label>
                <input
                  type="text"
                  value={formData.assignedZone}
                  onChange={(e) => setFormData({...formData, assignedZone: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => {
                    const newRole = e.target.value;
                    setFormData({
                      ...formData,
                      role: newRole,
                      permissions: roles[newRole]
                    });
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="guard">Guardia</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Permisos</label>
                <div className="space-y-2">
                  {['rondero', 'zonas', 'guardias', 'reportes'].map(permission => (
                    <label key={permission} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={() => handlePermissionChange(permission)}
                        disabled={formData.role === 'admin'}
                        className="mr-2"
                      />
                      {permission.charAt(0).toUpperCase() + permission.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              >
                {loading ? 'Creando...' : 'Crear Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserManager;