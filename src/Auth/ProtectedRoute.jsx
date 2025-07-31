// ProtectedRoute.js
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  try {
    const user = JSON.parse(localStorage.getItem('admin'));
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;