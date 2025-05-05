import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './config/firebase';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Reemplaza con tu Client ID real de Google Cloud Console
const googleClientId = '19785403811-0rmm5ll7qhf52k96bbsk10f7kn8urur6.apps.googleusercontent.com';

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}> {/* Envolver App */}
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);


