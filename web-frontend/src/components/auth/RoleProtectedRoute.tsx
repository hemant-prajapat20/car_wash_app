import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface RoleProtectedRouteProps {
  allowedRoles: string[];
  // Path to go when not authenticated (defaults to admin-access secret path)
  fallbackPath?: string;
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  allowedRoles,
  fallbackPath,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAuthenticated = !!user;
  const role = user?.role;

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath ?? '/admin-access'} replace />;
  }

  if (!allowedRoles.includes(role!)) {
    // Redirect to the appropriate home for the actual role
    const home = (() => {
      switch (role) {
        case 'admin':
        case 'superAdmin':
          return '/admin/dashboard';
        case 'vendor':
          return '/vendor/dashboard';
        default:
          return '/customer/search';
      }
    })();
    return <Navigate to={home} replace />;
  }

  // Role matches – render the nested route(s)
  return <Outlet />;
};
