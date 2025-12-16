// src/Auth/ProtectedRoute.jsx 
import React from 'react';
import { Navigate, useLocation, useMatches } from 'react-router-dom';
import { usePermissionCheck } from '../Hooks/usePermissionCheck';
import { toast } from 'react-toastify';
import AccessDenied from '../Pages/AccessDenied';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const matches = useMatches();
  const { hasPermission } = usePermissionCheck();

  // 1. Authentication Check (using localStorage)
  let isAuthenticated = false;
  try {
    const user = JSON.parse(localStorage.getItem('admin'));
    // Check if user object exists and has a token (or whatever defines your successful login)
    if (user && user.token) {
      isAuthenticated = true;
    }
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // --- Authentication Passed. Now check Permissions. ---

  // 2. Find the permission requirement for the current matching route
  const currentRouteMatch = matches[matches.length - 1]; // Last match is the deepest route

  // Read the permission from the route's handle data defined in router.jsx
  const requiredPermission = currentRouteMatch?.handle?.permission;

  // 3. Check if the user has the required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    // User is logged in but lacks the permission for this route
    return <AccessDenied />;
  }

  // 4. Access Granted
  return children;
};

export default ProtectedRoute;