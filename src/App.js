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



function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState("")

  // Vérifier le mode sombre au chargement
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)

    if (savedDarkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }

    // Vérifier si l'utilisateur est connecté
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const role = localStorage.getItem("userRole") || ""

    setIsLoggedIn(loggedIn)
    setUserRole(role)
  }, [])

  // Mettre à jour la classe dark-mode sur le body quand darkMode change
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode")
    } else {
      document.body.classList.remove("dark-mode")
    }
    localStorage.setItem("darkMode", darkMode)
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode((prevDarkMode) => !prevDarkMode)
  }
  const handleLogin = (email, password) => {
    // Simuler une connexion
    if (email === "admin@foottickets.com") {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userRole", "admin")
      setIsLoggedIn(true)
      setUserRole("admin")
      return { success: true, isAdmin: true }
    } else if (email) {
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("userRole", "user")
      setIsLoggedIn(true)
      setUserRole("user")
      return { success: true, isAdmin: false }
    }
    return { success: false }
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userRole")
    setIsLoggedIn(false)
    setUserRole("")
  }

  return (
   
      <div className={`App ${darkMode ? "dark-mode" : ""}`}>
        <Navbar
          isLoggedIn={isLoggedIn}
          isAdmin={userRole === "admin"}
          onLogout={handleLogout}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/equipes" element={<TeamsPage />} />
            <Route path="/actualites" element={<NewsPage />} />
            <Route path="/actualites/:slug" element={<NewsDetailPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          </Routes>
        </main>
        <Footer />
      </div>
  )
}

export default App


