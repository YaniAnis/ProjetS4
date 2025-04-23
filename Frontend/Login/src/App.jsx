import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Inscription from './Pages/Inscription';
import Connexion from './Pages/Connexion';
// Tu peux ajouter d'autres composants comme Accueil plus tard

function App() {
  return (
    <div>
      <nav style={{ marginBottom: 20 }}>
        <Link to="/inscription" style={{ marginRight: 10 }}>Inscription</Link>
        <Link to="/connexion">Connexion</Link>
      </nav>

      <Routes>
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/connexion" element={<Connexion />} />
      </Routes>
    </div>
  );
}

export default App;
