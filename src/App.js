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
import HelpPage from "./Pages/ContactMessage"
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
import ContactPage from './Pages/ContactPage';
import ContactMessage from "./Pages/ContactMessage";
import PaymentPage from "./Pages/PayementPage"
import StadiumPage from './Pages/StadiumPage';
import ProfileSettings from "./Pages/ProfileSettings";
import { Contact } from "lucide-react";




function App() {
  const [darkMode, setDarkMode] = useState(false)
  const location = useLocation()

  // Charger le mode sombre depuis localStorage au chargement
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
  }, [])

  // Appliquer la classe dark-mode sur le body à chaque changement de darkMode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
    localStorage.setItem("darkMode", darkMode)
  }, [darkMode])

  // Vérifier si nous sommes sur une page admin
  const isAdminPage = location.pathname.startsWith("/admin")

  return (
    <div className={darkMode ? "dark-theme" : "light-theme"}>
      {!isAdminPage && <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />}

      <Routes>
        <Route path="/" element={<HomePage darkMode={darkMode} />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/equipes" element={<Teams darkMode={darkMode} />} />
        <Route path="/actualites" element={<NewsPage />} />
        <Route path="/actualites/:id" element={<NewsDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/contact" element={<ContactPage />} /> {/* Page avec le bouton */}
        <Route path="/contact-message" element={<ContactMessage />} /> {/* Page de message */}
        <Route path="/Payement" element={<PaymentPage />} />     
        <Route path="/tickets" element={<StadiumPage />} />  
        <Route path="/stadiums" element={<StadiumPage />} /> {/* <-- Ajout du lien vers StadiumPage */}
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

export default App