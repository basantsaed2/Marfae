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

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <LanguageProvider>
      <ToastContainer />
      <RouterProvider router={router} />
    </LanguageProvider>
  </Provider>
);