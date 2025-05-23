import {  Routes , Route, useLocation, Navigate} from "react-router-dom";
import { useState , useEffect ,  } from "react";

import "./App.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./Pages/HomePage"
import MatchesPage from "./Pages/MatchesPage"
import Teams from "./Pages/Teams"
import NewsPage from "./Pages/NewsPage"
import NewsDetailPage from "./Pages/NewsDetailPage"
import LoginPage from "./Pages/LoginPage"
import HelpPage from "./Pages/HelpPage"
import OverviewPage from "./admin/OverviewPage"
import MatchPage from "./admin/MatchPage"
import CommandePage from "./admin/CommandePage"
import UtilisateurPage from "./admin/UtilisateurPage"
import VentesPage from "./admin/VentesPage"
import ParametrePage from "./admin/ParametrePage"
import "./components/AdminLayout.css"
import ProtectedRoute from "./components/ProtectedRoute"  
import AdminRoute from "./components/AdminRoute"
import AdminLayout from "./components/AdminLayout"
import ForgotPasswordPage from "./Pages/ForgotPasswordPage"
import ActualitePage from "./admin/ActualitePage";
import ContactMessage from './Pages/ContactMessage';
import PaymentPage from "./Pages/PayementPage"
import StadiumPage from './Pages/StadiumPage';
import ProfileSettings from "./Pages/ProfileSettings";




function App() {
  const [darkMode, setDarkMode] = useState(false)
  const location = useLocation()

  // Charger le mode sombre depuis localStorage au chargement
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)

    if (savedDarkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
  }, [])

  // Vérifier si nous sommes sur une page admin
  const isAdminPage = location.pathname.startsWith("/admin")

  return (
    <div className={darkMode ? "dark-theme" : "light-theme"}>
      {!isAdminPage && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/equipes" element={<Teams />} />
        <Route path="/actualites" element={<NewsPage />} />
        <Route path="/actualites/:id" element={<NewsDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/contact" element={<ContactMessage />} /> {/* <-- Add this line */}
        <Route path="/Payement" element={<PaymentPage />} />     
        <Route path="/tickets" element={<StadiumPage />} />  
        <Route path="/profilesettings" element={<ProfileSettings />} /> {/* <-- Add this line */}

        {/* Routes Admin protégées */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* Ajoute un fallback pour /admin sans sous-route */}
          <Route index element={<OverviewPage />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="match" element={<MatchPage />} />
          <Route path="ventes" element={<VentesPage />} />
          <Route path="utilisateur" element={<UtilisateurPage />} />
          <Route path="actualite" element={<ActualitePage />} />
          <Route path="commande" element={<CommandePage />} />
          <Route path="parametre" element={<ParametrePage />} />
          {/* Fallback pour toute route inconnue sous /admin */}
          <Route path="*" element={<OverviewPage />} />
        </Route>
        {/* Redirection explicite pour /admin vers /admin/overview */}
        <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
      </Routes>

      {!isAdminPage && <Footer darkMode={darkMode} />}
    </div>
  )
}

export default App;

// Ce fichier ne doit contenir que le composant AdminRoute si tu veux protéger l'accès admin.
// Mais ta question concerne l'envoi d'email de confirmation de paiement.

// Si tu ne reçois pas de mail :
// 1. Vérifie que ton backend Laravel fonctionne bien sur http://localhost:8000.
// 2. Vérifie que la route /api/create-checkout-session existe et envoie bien le mail.
// 3. Vérifie la configuration mail de Laravel (.env) :
//    MAIL_MAILER=smtp
//    MAIL_HOST=smtp.gmail.com (ou autre)
//    MAIL_PORT=587
//    MAIL_USERNAME=ton@email
//    MAIL_PASSWORD=ton_mdp
//    MAIL_ENCRYPTION=tls
//    MAIL_FROM_ADDRESS=ton@email
//    MAIL_FROM_NAME="FooTiX"
// 4. Teste l'envoi d'un mail avec tinker ou une route de test Laravel.
// 5. Regarde les logs Laravel (storage/logs/laravel.log) pour voir s'il y a une erreur d'envoi de mail.

// Le message "un code a été envoyé" s'affiche côté frontend même si le backend échoue à envoyer le mail.
// Pour déboguer, regarde la réponse du backend dans le code JS et affiche-la si erreur :

// ...dans PayementForm.js, modifie :
      if (res.ok && data.paiement_id) {
        setPaiementId(data.paiement_id);
        setShowVerification(true);
        alert("Un code de vérification a été envoyé à votre email. Veuillez le saisir pour valider le paiement.");
      } else {
        alert(data.message || "Erreur lors de la création du paiement.");
      }
// ...ajoute un console.log(data) pour voir la réponse exacte du backend.


// Résumé :
// - Le frontend affiche toujours le message si la réponse backend est "ok".
// - Si tu ne reçois pas de mail, c'est un problème de configuration ou d'erreur backend.
// - Regarde les logs Laravel et la config mail.