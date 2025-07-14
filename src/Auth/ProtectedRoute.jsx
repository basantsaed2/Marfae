import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '@/components/Loading'; // Add a loading spinner component

const ProtectedRoute = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check localStorage directly for faster initial check
    const storedUser = localStorage.getItem('admin');
    
    if (storedUser || user) {
      setIsChecking(false);
    } else {
      // If no stored user, no need to wait
      setIsChecking(false);
    }
  }, [user]);

  if (isChecking) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;