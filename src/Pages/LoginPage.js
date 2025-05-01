"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "./LoginPage.css"

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const endpoint = isLogin ? "http://localhost:8000/api/login" : "http://localhost:8000/api/register";
  
    const payload = isLogin
      ? { email, password }
      : {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          password_confirmation: confirmPassword,
        };
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Erreur :", data.message || "Erreur inconnue");
        alert(data.message || "Échec de l'opération");
        return;
      }
  
      alert(data.message || (isLogin ? "Connexion réussie" : "Inscription réussie"));
      console.log("Réponse :", data);
  
      if (isLogin) {
        // rediriger vers une page après connexion si besoin
      }
  
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Une erreur réseau est survenue.");
    }
  };
  

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

              <div className="form-validation" role="alert"></div>

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

