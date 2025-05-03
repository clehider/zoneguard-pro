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
        clientConfig: {
          client_id: '19785403811-0rmm5ll7qhf52k96bbsk10f7kn8urur6.apps.googleusercontent.com',
          scope: 'email profile https://www.googleapis.com/auth/spreadsheets',
          prompt: 'select_account',
          hosted_domain: 'clehider.github.io'
        },
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        ux_mode: 'redirect',
        cookie_policy: 'single_host_origin',
        redirect_uri: 'https://clehider.github.io/zoneguard-pro/'
      })
      .then(() => {
        const authInstance = window.gapi.auth2.getAuthInstance();
        
        // Actualizar el estado inicial
        const currentUser = authInstance.currentUser.get();
        const isSignedIn = authInstance.isSignedIn.get();
        setIsSignedIn(isSignedIn);
        
        if (isSignedIn && currentUser) {
          handleAuthSuccess(currentUser);
        }

        // Escuchar cambios en el estado de autenticación
        authInstance.isSignedIn.listen((signedIn) => {
          setIsSignedIn(signedIn);
          if (signedIn) {
            handleAuthSuccess(authInstance.currentUser.get());
          }
        });
      }).catch(error => {
        console.error('Error al inicializar el cliente:', error);
        if (onAuthFailure) onAuthFailure(error);
      });
    };

    // Cargar el script de Google API con async
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js?loading=async';
    script.async = true;
    script.defer = true;
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