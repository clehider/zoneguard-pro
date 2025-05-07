import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { user, permissions } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (permissions.includes('all')) {
    return children;
  }

  const hasRequiredPermissions = requiredPermissions.every(
    permission => permissions.includes(permission)
  );

  if (!hasRequiredPermissions) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;