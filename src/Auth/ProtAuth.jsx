import { Navigate } from 'react-router-dom';

const ProtAuth = ({ children }) => {
  const userLocal = localStorage.getItem('admin');

  if (userLocal) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtAuth;