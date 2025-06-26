// import { Navigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const ProtAuth = ({ children }) => {
//   const userLocal = localStorage.getItem('user');

//   if (userLocal) {
//     toast.warn('You are already logged in');
//     return <Navigate to="/" />;
//   }

//   return children;
// };

// export default ProtAuth;


import { Navigate } from 'react-router-dom';

const ProtAuth = ({ children }) => {
  const userLocal = localStorage.getItem('user');

  if (userLocal) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtAuth;