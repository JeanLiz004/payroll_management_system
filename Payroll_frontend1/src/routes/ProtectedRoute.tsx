import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  // 1. Si no está autenticado, va al Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si se definen roles permitidos y el rol del usuario no está en la lista
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/employees" replace />;
  }

  return <Outlet />;
};