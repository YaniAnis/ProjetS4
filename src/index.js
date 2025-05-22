import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';


import "./index.css"

const root = ReactDOM.createRoot(document.getElementById('root')); // Updated to use createRoot
root.render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
  
);
