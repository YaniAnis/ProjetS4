import {  Routes , Route, useLocation} from "react-router-dom";
import { useState , useEffect ,  } from "react";

import "./App.css"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./Pages/HomePage"
import MatchesPage from "./Pages/MatchesPage"
import TeamsPage from "./Pages/TeamsPage"
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
        <Route path="/equipes" element={<TeamsPage />} />
        <Route path="/actualites" element={<NewsPage />} />
        <Route path="/actualites/:id" element={<NewsDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/contact" element={<ContactMessage />} /> {/* <-- Add this line */}
        <Route path="/Payement" element={<PaymentPage />} />     
        <Route path="/tickets" element={<StadiumPage />} />  

        {/* Routes Admin protégées */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="match" element={<MatchPage />} />
          <Route path="ventes" element={<VentesPage />} />
          <Route path="utilisateur" element={<UtilisateurPage />} />
          <Route path='actualite' element={<ActualitePage />} /> {/* <-- Add this line */}
          <Route path="commande" element={<CommandePage />} />
          <Route path="parametre" element={<ParametrePage />} />
        </Route>
      </Routes>

      {!isAdminPage && <Footer darkMode={darkMode} />}
    </div>
  )
}

export default App


