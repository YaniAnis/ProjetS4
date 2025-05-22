import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App"

<<<<<<< HEAD

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
=======
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

>>>>>>> 47488ee1fca2cae69c180f8bf78ea06ccc97d7bd
