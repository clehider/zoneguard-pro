import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Importar el proveedor
import App from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container); // Crear root

// Reemplaza 'TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com' con tu Client ID real
const googleClientId = 'TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}> {/* Envolver App */}
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);