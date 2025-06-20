// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from './Context/AuthContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ChakraProvider>
);