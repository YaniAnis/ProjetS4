"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./Navbar.css"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="navbar-logo-icon"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
            <span className="navbar-logo-text">FootTix</span>
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
          <Link to="/contact" className="navbar-link">
            Contact
          </Link>
        </nav>

        <div className="navbar-actions">
          <button className="navbar-icon-button">
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
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </button>
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
          <Link to="/contact" className="navbar-mobile-link" onClick={() => setIsMenuOpen(false)}>
            Contact
          </Link>
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
        </div>
      )}
    </header>
  )
}

export default Navbar

