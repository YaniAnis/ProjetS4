"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./Navbar.css"

function Navbar({ darkMode, toggleDarkMode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement du composant
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const role = localStorage.getItem("userRole") || ""
    setIsLoggedIn(loggedIn)
    setUserRole(role)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userRole")
    setIsLoggedIn(false)
    setUserRole("")
    navigate("/")
  }

  return (
    <header className={`navbar ${darkMode ? "dark-mode" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <img
              src="/images/Logos/raw.png"
              alt="Footix Logo"
              className="navbar-logo-img"
              style={{ width: 44, height: 44, marginRight: 20, verticalAlign: "middle", objectFit: "contain", display: "block" }}
              onError={e => { e.target.style.display = "none"; }}
            />
            <span className="navbar-logo-text" style={{ marginLeft: 6, fontSize: "2rem" }}>Footix</span>
          </Link>
        </div>

        <nav className="navbar-links">
          <Link to="/" className="navbar-link">
            Accueil
          </Link>
          <Link to="/matches" className="navbar-link">
            Matchs
          </Link>
          <Link to="/equipes" className="navbar-link">
            Équipes
          </Link>
          <Link to="/actualites" className="navbar-link">
            Actualités
          </Link>
          <Link to="/help" className="navbar-link">
            Contact
          </Link>
        </nav>

        <div className="navbar-actions">
          {/* Bouton de basculement jour/nuit */}
          <button className="theme-toggle-button" onClick={toggleDarkMode}>
            <div className={`toggle-slider ${darkMode ? "active" : ""}`}>
              <div className="toggle-circle">
                {darkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                )}
              </div>
            </div>
          </button>

          {isLoggedIn ? (
            <>
              {userRole === "admin" && (
                <Link to="/admin" className="admin-button">
                  Admin
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                </Link>
              )}
              <button onClick={handleLogout} className="logout-button">
                LOG OUT
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </>
          ) : (
            <Link to="/login" className="login-button">
              LOG IN
              <svg className="login-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
          )}
          <button className="navbar-menu-button" onClick={toggleMenu}>
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="navbar-mobile-menu">
          <Link to="/" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>
            Accueil
          </Link>
          <Link to="/matches" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>
            Matchs
          </Link>
          <Link to="/equipes" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>
            Équipes
          </Link>
          <Link to="/actualites" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>
            Actualités
          </Link>
          <Link to="/help" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>
          Contact
          </Link>
          {isLoggedIn ? (
            <>
              {userRole === "admin" && (
                <Link to="/admin" className="navbar-mobile-link admin" onClick={() => setIsMenuOpen(false)}>
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="navbar-mobile-link logout">
                Déconnexion
              </button>
            </>
          ) : (
            <Link to="/login" className="login-button mobile" onClick={() => setIsMenuOpen(false)}>
              LOG IN
              <svg className="login-icon" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

export default Navbar







