import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './Store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createPortal } from 'react-dom';
import './index.css';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import './i18n';
import { LanguageProvider } from './context/LanguageContext';

// Create a portal-based ToastContainer with maximum z-index
function GlobalToast() {
  return createPortal(
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover
      theme="light"
      style={{
        zIndex: 999999, // Extremely high z-index
        position: 'fixed' // Ensure fixed positioning
      }}
      className="toast-container" // Add a class for additional styling
    />,
    document.body
  );
}

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <LanguageProvider>
      <GlobalToast />
      <RouterProvider router={router} />
    </LanguageProvider>
  </Provider>
);