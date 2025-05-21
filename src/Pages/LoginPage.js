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
  const [success, setSuccess] = useState("")
  const [registerStep, setRegisterStep] = useState("form") // "form" | "code"
  const [registerCode, setRegisterCode] = useState(["", "", "", "", "", ""])
  const [registerCodeError, setRegisterCodeError] = useState("")
  const [registerEmailForCode, setRegisterEmailForCode] = useState("")
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [accountCreated, setAccountCreated] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

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
        try {
          const res = await fetch("http://localhost:8000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: firstName + " " + lastName,
              email,
              password,
              password_confirmation: confirmPassword,
            }),
          })
          const data = await res.json()
          console.log("Registration response:", data)
          if (!res.ok) {
            // Show validation errors if present
            if (data.errors) {
              const messages = Object.values(data.errors).flat().join(" ")
              setError(messages)
            } else if (data.error) {
              setError(data.message + " " + data.error)
            } else if (data.message) {
              setError(data.message)
            } else {
              setError("Échec de l'inscription")
            }
          } else {
            setSuccess("Inscription réussie ! Vous pouvez maintenant vous connecter.")
            setIsLogin(true)
          }
        } catch (err) {
          setError("Erreur réseau")
        }
      } else {
        setError("Veuillez remplir tous les champs")
      }
    }
  }

  const handleRegisterSendCode = async () => {
    setError("")
    setSuccess("")
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Veuillez remplir tous les champs")
      return
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }
    try {
      // Only check if email is already taken with a GET request to a dedicated endpoint
      const checkRes = await fetch(`http://localhost:8000/api/check-email?email=${encodeURIComponent(email)}`)
      if (checkRes.ok) {
        const checkData = await checkRes.json()
        if (checkData.exists) {
          setError("Un compte avec cet email existe déjà.")
          return
        }
      } else {
        setError("Erreur lors de la vérification de l'email")
        return
      }

      // Now send the code
      const res = await fetch("http://localhost:8000/api/register-send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) {
        setError("Erreur lors de l'envoi du code")
        return
      }
      setRegisterEmailForCode(email)
      setRegisterStep("code")
      setRegisterCode(["", "", "", "", "", ""])
      setSuccess("Un code de confirmation a été envoyé à votre email.")
    } catch (err) {
      setError("Erreur réseau lors de l'envoi du code")
    }
  }

  const handleRegisterVerifyCode = async (e) => {
    e.preventDefault()
    setRegisterCodeError("")
    const code = registerCode.join("")
    if (registerCode.some((digit) => !digit)) {
      setRegisterCodeError("Veuillez entrer le code complet.")
      return
    }
    try {
      const res = await fetch("http://localhost:8000/api/register-verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registerEmailForCode, code }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setRegisterSuccess(true)
      } else {
        setRegisterCodeError(data.message || "Code incorrect.")
      }
    } catch (err) {
      setRegisterCodeError("Erreur réseau lors de la vérification du code")
    }
  }

  const handleRegisterCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const newCode = [...registerCode]
    newCode[index] = value
    setRegisterCode(newCode)
  }

  // Registration logic after code is verified
  const handleRegisterSubmit = async () => {
    setError("")
    setSuccess("")
    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: firstName + " " + lastName,
          email: registerEmailForCode,
          password,
          password_confirmation: confirmPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.errors) {
          const messages = Object.values(data.errors).flat().join(" ")
          setError(messages)
        } else if (data.error) {
          setError(data.message + " " + data.error)
        } else if (data.message) {
          setError(data.message)
        } else {
          setError("Registration failed")
        }
      } else {
        setAccountCreated(true)
        setTimeout(() => {
          setAccountCreated(false)
          setRegisterSuccess(false)
          navigate("/")
        }, 2000)
      }
    } catch (err) {
      setError("Network error")
    }
  }

  return (
    <div className="page-container">
      <div className="row">
        <div className="col-md-4">
          <div className="auth-tabs">
            <button className={`auth-tab ${isLogin ? "active" : ""}`} onClick={() => { setIsLogin(true); setRegisterStep("form"); setRegisterSuccess(false); setAccountCreated(false); }}>
              Connexion
            </button>
            <button className={`auth-tab ${!isLogin ? "active" : ""}`} onClick={() => setIsLogin(false)}>
              Inscription
            </button>
          </div>

          {isLogin ? (
            <form id="account" method="post" className="custom-login-form" onSubmit={handleSubmit}>
              <h2 className="form-title">Bienvenue</h2>
              <p className="form-message">Connectez-vous pour accéder à votre compte</p>

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
                <span className="input-label">Mot de passe</span>
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
                <label className="form-check-label">Se souvenir de moi</label>
              </div>

              <button id="login-submit" type="submit" className="form-submit">
                Se connecter
              </button>

              <div className="form-links">
                <Link id="forgot-password" to="/forgot-password">
                  Mot de passe oublié ?
                </Link>
              </div>
            </form>
          ) : (
            registerStep === "form" ? (
              <form id="registerForm" className="custom-register-form" method="post" onSubmit={e => { e.preventDefault(); handleRegisterSendCode(); }}>
                <h2 className="form-title">Inscription</h2>
                <p className="form-message">Inscrivez-vous maintenant et profitez de toutes les fonctionnalités de FooTiX.</p>

                {error && (
                  <div className="form-error" role="alert">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="form-message" role="alert">
                    {success}
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
                    <span className="input-label">Prénom</span>
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
                    <span className="input-label">Nom</span>
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
                  <span className="input-label">Mot de passe</span>
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
                  <span className="input-label">Confirmer le mot de passe</span>
                  <span className="form-validation"></span>
                </label>

                <button id="registerSubmit" type="submit" className="form-submit">
                  Recevoir le code de confirmation
                </button>
              </form>
            ) : registerSuccess ? (
              accountCreated ? (
                <div className="custom-register-form" style={{ textAlign: "center", padding: "2rem 1rem" }}>
                  <h2 className="form-title">Compte créé !</h2>
                  <p className="form-message">
                    Votre compte a été créé avec succès.<br />
                    Vous allez être redirigé vers la page d'accueil...
                  </p>
                </div>
              ) : (
                <div className="custom-register-form" style={{ textAlign: "center", padding: "2rem 1rem" }}>
                  <h2 className="form-title">Email confirmé !</h2>
                  <p className="form-message">
                    Bienvenue sur FooTiX.<br />
                    Votre email a été confirmé avec succès.<br />
                    Cliquez ci-dessous pour créer votre compte.
                  </p>
                  <button
                    className="form-submit"
                    style={{ width: 180, margin: "1.5rem auto 0 auto", display: "block" }}
                    onClick={() => {
                      if (!accountCreated) {
                        handleRegisterSubmit();
                      }
                    }}
                    type="button"
                    disabled={accountCreated}
                  >
                    Créer mon compte
                  </button>
                  {error && (
                    <div className="form-error" role="alert" style={{ marginTop: 16 }}>
                      {error}
                    </div>
                  )}
                </div>
              )
            ) : (
              <form className="custom-register-form" onSubmit={e => { e.preventDefault(); handleRegisterVerifyCode(e); }}>
                <h2 className="form-title">Confirmation</h2>
                <p className="form-message">Entrez le code à 6 chiffres envoyé à votre email.</p>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      style={{
                        width: "40px",
                        height: "48px",
                        textAlign: "center",
                        fontSize: "1.25rem",
                        imeMode: "disabled",
                        background: "#fff",
                        color: "#222",
                        border: "1px solid #ccc"
                      }}
                      required
                      value={registerCode[index] ?? ""}
                      onChange={e => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        if (val.length === 0) {
                          handleRegisterCodeChange(index, "");
                          return;
                        }
                        handleRegisterCodeChange(index, val[val.length - 1]);
                        if (val && index < 5) {
                          const next = document.querySelector(`#register-code-input-${index + 1}`);
                          if (next) next.focus();
                        }
                      }}
                      onKeyDown={e => {
                        if (e.key === "Backspace") {
                          if (registerCode[index]) {
                            handleRegisterCodeChange(index, "");
                          } else if (index > 0) {
                            const prev = document.querySelector(`#register-code-input-${index - 1}`);
                            if (prev) prev.focus();
                          }
                        }
                      }}
                      id={`register-code-input-${index}`}
                      autoFocus={index === 0}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
                {registerCodeError && <span className="form-error">{registerCodeError}</span>}
                <button type="submit" className="form-submit">
                  Valider le code
                </button>
                <button type="button" className="form-submit" style={{ marginTop: 8 }} onClick={() => setRegisterStep("form")}>
                  Retour
                </button>
              </form>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage





