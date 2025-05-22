import { AuthProvider } from "./contexts/AuthContext";
import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App"


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
