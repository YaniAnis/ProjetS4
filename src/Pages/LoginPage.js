"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./LoginPage.css"

// Liste des administrateurs (dans un cas réel, cela serait vérifié côté serveur)
const ADMIN_EMAILS = ["admin@foottickets.com", "admin@admin.com"]

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (isLogin) {
      // Vérification simple pour la démo
      if (email && password) {
        // Vérifier si c'est un admin
        if (ADMIN_EMAILS.includes(email.toLowerCase())) {
          console.log("Admin login successful")
          // Stocker l'information que l'utilisateur est un admin
          localStorage.setItem("userRole", "admin")
          localStorage.setItem("isLoggedIn", "true")
          // Rediriger vers le tableau de bord d'administration
          navigate("/admin")
        } else {
          console.log("User login successful")
          // Stocker l'information que l'utilisateur est un utilisateur normal
          localStorage.setItem("userRole", "user")
          localStorage.setItem("isLoggedIn", "true")
          // Rediriger vers la page d'accueil
          navigate("/")
        }
      } else {
        setError("Veuillez remplir tous les champs")
      }
    } else {
      // Logique d'inscription
      if (firstName && lastName && email && password && confirmPassword) {
        if (password !== confirmPassword) {
          setError("Les mots de passe ne correspondent pas")
          return
        }

        console.log("Registration successful")
        localStorage.setItem("userRole", "user")
        localStorage.setItem("isLoggedIn", "true")
        navigate("/")
      } else {
        setError("Veuillez remplir tous les champs")
      }
    }
  }

  return (
    <div className="page-container">
      <div className="row">
        <div className="col-md-4">
          <div className="auth-tabs">
            <button className={`auth-tab ${isLogin ? "active" : ""}`} onClick={() => setIsLogin(true)}>
              Connexion
            </button>
            <button className={`auth-tab ${!isLogin ? "active" : ""}`} onClick={() => setIsLogin(false)}>
              Inscription
            </button>
          </div>

          {isLogin ? (
            <form id="account" method="post" className="custom-login-form" onSubmit={handleSubmit}>
              <h2 className="form-title">Welcome back</h2>
              <p className="form-message">Log in to access your account</p>

              {error && (
                <div className="form-error" role="alert">
                  {error}
                </div>
              )}

              <label className="form-label">
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  aria-required="true"
                  required
                  name="Input.Email"
                />
                <span className="input-label">Email</span>
                <span className="form-validation"></span>
              </label>

              <label className="form-label">
                <input
                  className="form-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  aria-required="true"
                  required
                  name="Input.Password"
                />
                <span className="input-label">Password</span>
                <span className="form-validation"></span>
              </label>

              <div className="form-checkbox">
                <input
                  className="form-check-input"
                  name="Input.RememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label">Remember me</label>
              </div>

              <button id="login-submit" type="submit" className="form-submit">
                Log in
              </button>

              <div className="form-links">
                <Link id="forgot-password" to="/forgot-password">
                  Forgot your password?
                </Link>
                <Link id="resend-confirmation" to="/resend-confirmation">
                  Resend email confirmation
                </Link>
              </div>
            </form>
          ) : (
            <form id="registerForm" className="custom-register-form" method="post" onSubmit={handleSubmit}>
              <h2 className="form-title">Register</h2>
              <p className="form-message">Signup now and get full access to our app.</p>

              {error && (
                <div className="form-error" role="alert">
                  {error}
                </div>
              )}

              <div className="form-flex">
                <label className="form-label">
                  <input
                    className="form-input"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="given-name"
                    aria-required="true"
                    required
                    name="Input.FirstName"
                  />
                  <span className="input-label">Firstname</span>
                  <span className="form-validation"></span>
                </label>

                <label className="form-label">
                  <input
                    className="form-input"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    autoComplete="family-name"
                    aria-required="true"
                    required
                    name="Input.LastName"
                  />
                  <span className="input-label">Lastname</span>
                  <span className="form-validation"></span>
                </label>
              </div>

              <label className="form-label">
                <input
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  aria-required="true"
                  required
                  name="Input.Email"
                />
                <span className="input-label">Email</span>
                <span className="form-validation"></span>
              </label>

              <label className="form-label">
                <input
                  className="form-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  aria-required="true"
                  required
                  name="Input.Password"
                />
                <span className="input-label">Password</span>
                <span className="form-validation"></span>
              </label>

              <label className="form-label">
                <input
                  className="form-input"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  aria-required="true"
                  required
                  name="Input.ConfirmPassword"
                />
                <span className="input-label">Confirm password</span>
                <span className="form-validation"></span>
              </label>

              <button id="registerSubmit" type="submit" className="form-submit">
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage





