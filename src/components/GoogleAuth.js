import React, { useEffect, useState } from 'react';

const GoogleAuth = ({ onAuthSuccess, onAuthFailure }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const loadGoogleAuth = () => {
      window.gapi.load('client:auth2', initClient);
    };

    const initClient = () => {
      window.gapi.client.init({
        apiKey: 'AIzaSyAgLNdE8AzuxsQL4hzKg94Z65cFuNWTQfo',
        clientId: '19785403811-0rmm5ll7qhf52k96bbsk10f7kn8urur6.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        ux_mode: 'popup', // Cambiado a popup para evitar problemas de redirección
      }).then(() => {
        const authInstance = window.gapi.auth2.getAuthInstance();
        
        setIsSignedIn(authInstance.isSignedIn.get());
        authInstance.isSignedIn.listen(updateSigninStatus);

        if (authInstance.isSignedIn.get()) {
          handleAuthSuccess(authInstance.currentUser.get());
        }
      }).catch(error => {
        console.error('Error al inicializar el cliente:', error);
        if (onAuthFailure) onAuthFailure(error);
      });
    };

    // Cargar el script de Google API
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = loadGoogleAuth;
    script.onerror = (error) => {
      console.error('Error al cargar el script de Google API:', error);
      if (onAuthFailure) onAuthFailure(error);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [onAuthSuccess, onAuthFailure]);

  const handleAuthSuccess = (user) => {
    const token = user.getAuthResponse().access_token;
    if (onAuthSuccess) onAuthSuccess(token);
  };

  const handleSignInClick = () => {
    window.gapi.auth2.getAuthInstance().signIn()
      .then(user => handleAuthSuccess(user))
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
        if (onAuthFailure) onAuthFailure(error);
      });
  };

  const handleSignOutClick = () => {
    window.gapi.auth2.getAuthInstance().signOut()
      .then(() => {
        setIsSignedIn(false);
        if (onAuthFailure) onAuthFailure(new Error('Usuario cerró sesión'));
      });
  };

  return (
    <div>
      {!isSignedIn ? (
        <button
          onClick={handleSignInClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Iniciar Sesión con Google
        </button>
      ) : (
        <button
          onClick={handleSignOutClick}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Cerrar Sesión
        </button>
      )}
    </div>
  );
};

export default GoogleAuth;


Para resolver este problema, necesitas seguir estos pasos:

1. Ve a la [Google Cloud Console](https://console.cloud.google.com)

2. Selecciona tu proyecto (sistemainventarios-e6c15)

3. Ve a "Credenciales" en el menú lateral

4. Encuentra y edita tu ID de cliente OAuth:
   `19785403811-0rmm5ll7qhf52k96bbsk10f7kn8urur6.apps.googleusercontent.com`

5. En la sección "URIs de redirección autorizados", necesitas agregar las siguientes URLs:
   - `http://localhost:3000`
   - `http://localhost:3000/`
   - `http://localhost`
   - `http://localhost/`
   - `http://localhost:3000/oauth2callback`
   - `http://localhost:3000/auth/google/callback`

6. También asegúrate de que en "Orígenes de JavaScript autorizados" estén:
   - `http://localhost:3000`
   - `http://localhost`

7. Guarda los cambios

Además, necesitamos actualizar el componente de autenticación para manejar correctamente la redirección. Aquí está la actualización necesaria:
```javascript
import React, { useEffect, useState } from 'react';

const GoogleAuth = ({ onAuthSuccess, onAuthFailure }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const loadGoogleAuth = () => {
      window.gapi.load('client:auth2', initClient);
    };

    const initClient = () => {
      window.gapi.client.init({
        apiKey: 'AIzaSyAgLNdE8AzuxsQL4hzKg94Z65cFuNWTQfo',
        clientId: '19785403811-0rmm5ll7qhf52k96bbsk10f7kn8urur6.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/spreadsheets',
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        ux_mode: 'popup', // Cambiado a popup para evitar problemas de redirección
      }).then(() => {
        const authInstance = window.gapi.auth2.getAuthInstance();
        
        setIsSignedIn(authInstance.isSignedIn.get());
        authInstance.isSignedIn.listen(updateSigninStatus);

        if (authInstance.isSignedIn.get()) {
          handleAuthSuccess(authInstance.currentUser.get());
        }
      }).catch(error => {
        console.error('Error al inicializar el cliente:', error);
        if (onAuthFailure) onAuthFailure(error);
      });
    };

    // Cargar el script de Google API
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = loadGoogleAuth;
    script.onerror = (error) => {
      console.error('Error al cargar el script de Google API:', error);
      if (onAuthFailure) onAuthFailure(error);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [onAuthSuccess, onAuthFailure]);

  const handleAuthSuccess = (user) => {
    const token = user.getAuthResponse().access_token;
    if (onAuthSuccess) onAuthSuccess(token);
  };

  const handleSignInClick = () => {
    window.gapi.auth2.getAuthInstance().signIn()
      .then(user => handleAuthSuccess(user))
      .catch(error => {
        console.error('Error al iniciar sesión:', error);
        if (onAuthFailure) onAuthFailure(error);
      });
  };

  const handleSignOutClick = () => {
    window.gapi.auth2.getAuthInstance().signOut()
      .then(() => {
        setIsSignedIn(false);
        if (onAuthFailure) onAuthFailure(new Error('Usuario cerró sesión'));
      });
  };

  return (
    <div>
      {!isSignedIn ? (
        <button
          onClick={handleSignInClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Iniciar Sesión con Google
        </button>
      ) : (
        <button
          onClick={handleSignOutClick}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Cerrar Sesión
        </button>
      )}
    </div>
  );
};

export default GoogleAuth;