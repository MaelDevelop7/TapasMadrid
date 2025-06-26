import { Navigate, useLocation } from 'react-router-dom';
import React, { type JSX } from 'react';
import { useAuth } from './useAuth';

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Chargement...</div>;

  if (!user || user.isAnonymous) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};
