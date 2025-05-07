import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { authService } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userData = await authService.getUserData(firebaseUser.uid);
          
          // Verificar si el usuario está activo
          if (userData.status === 'inactive') {
            await authService.logout();
            setError('Usuario inactivo. Contacte al administrador.');
            setUser(null);
          } else {
            setUser({
              ...firebaseUser,
              role: userData.role || 'guard',
              permissions: userData.permissions || ['rondero'],
              status: userData.status || 'active',
              assignedZone: userData.assignedZone || null,
              name: userData.name || firebaseUser.email
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        setError(error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return user.permissions?.includes(permission) || false;
  };

  const isGuard = () => user?.role === 'guard';
  const isSupervisor = () => user?.role === 'supervisor';
  const isAdmin = () => user?.role === 'admin';

  const value = {
    user,
    loading,
    error,
    hasPermission,
    isGuard,
    isSupervisor,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}