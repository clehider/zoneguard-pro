import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const GoogleAuth = ({ onAuthSuccess, onAuthFailure }) => {
  return (
    <GoogleLogin
      onSuccess={credentialResponse => {
        const decoded = jwtDecode(credentialResponse.credential);
        onAuthSuccess(decoded);
      }}
      onError={() => {
        onAuthFailure('Error en la autenticación con Google');
      }}
      useOneTap
      auto_select
    />
  );
};

export default GoogleAuth;