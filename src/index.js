import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Importar el proveedor
import App from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container); // Crear root

// Reemplaza con tu Client ID real de Google Cloud Console
const googleClientId = '19785403811-0rmm5ll7qhf52k96bbsk10f7kn8urur6.apps.googleusercontent.com';

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}> {/* Envolver App */}
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);