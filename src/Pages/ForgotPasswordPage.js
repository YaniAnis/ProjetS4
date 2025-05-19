import "./ForgotPasswordPage.css";
"use client"

import { useState, useRef, useEffect } from "react"
import EmailIcon from "./icons/EmailIcon"
import PhoneIcon from "./icons/PhoneIcon"
import LockIcon from "./icons/LockIcon"
import CheckIcon from "./icons/CheckIcon"
import ArrowRightIcon from "./icons/ArrowRightIcon"
import EyeIcon from "./icons/EyeIcon"
import EyeOffIcon from "./icons/EyeOffIcon"
import { Link } from "react-router-dom"

function ForgotPasswordPage() {
  // États pour gérer les différentes étapes
  const [currentStep, setCurrentStep] = useState("request")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [codeError, setCodeError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmError, setConfirmError] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [enteredCode, setEnteredCode] = useState(["", "", "", "", "", ""])
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [resendText, setResendText] = useState("Renvoyer")

  // Références pour les inputs du code
  const codeInputRefs = useRef([])

  // Initialiser les références pour les inputs du code
  useEffect(() => {
    codeInputRefs.current = codeInputRefs.current.slice(0, 6)
  }, [])

  // Validation de l'email
  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  // Générer un code aléatoire à 6 chiffres
  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Évaluer la force du mot de passe
  const evaluatePasswordStrength = (password) => {
    let strength = 0

    if (password.length >= 8) strength += 25
    if (password.match(/[A-Z]/)) strength += 25
    if (password.match(/[0-9]/)) strength += 25
    if (password.match(/[^A-Za-z0-9]/)) strength += 25

    return strength
  }

  // Gérer la soumission du formulaire de demande
  const handleRequestSubmit = (e) => {
    e.preventDefault()

    setEmailError("")

    if (!validateEmail(email)) {
      setEmailError("Veuillez entrer une adresse email valide.")
      return
    }

    setLoading(true)

    // Simuler l'envoi d'un email (à remplacer par votre backend)
    setTimeout(() => {
      setLoading(false)

      // Générer un code de vérification
      const code = generateCode()
      setVerificationCode(code)
      console.log("Code de vérification (à des fins de démonstration):", code)

      // Passer à l'étape de vérification
      setCurrentStep("verify")

      // Réinitialiser le code entré
      setEnteredCode(["", "", "", "", "", ""])

      // Focus sur le premier champ de code
      setTimeout(() => {
        if (codeInputRefs.current[0]) {
          codeInputRefs.current[0].focus()
        }
      }, 100)
    }, 1500)
  }

  // Gérer la soumission du formulaire de vérification
  const handleVerifySubmit = (e) => {
    e.preventDefault()

    setCodeError("")
    const code = enteredCode.join("")

    setLoading(true)

    // Simuler la vérification du code
    setTimeout(() => {
      setLoading(false)

      if (code === verificationCode) {
        // Code correct, passer à l'étape suivante
        setCurrentStep("reset")
      } else {
        setCodeError("Code incorrect. Veuillez réessayer.")
      }
    }, 1000)
  }

  // Gérer la soumission du formulaire de réinitialisation
  const handleResetSubmit = (e) => {
    e.preventDefault()

    setPasswordError("")
    setConfirmError("")

    // Vérifier la force du mot de passe
    if (passwordStrength < 75) {
      setPasswordError("Le mot de passe n'est pas assez sécurisé.")
      return
    }

    // Vérifier que les mots de passe correspondent
    if (newPassword !== confirmPassword) {
      setConfirmError("Les mots de passe ne correspondent pas.")
      return
    }

    setLoading(true)

    // Simuler la réinitialisation du mot de passe
    setTimeout(() => {
      setLoading(false)

      // Passer à l'étape de confirmation
      setCurrentStep("success")
    }, 1500)
  }

  // Gérer le changement d'un champ du code
  const handleCodeChange = (index, value) => {
    // Accepter uniquement les chiffres
    if (!/^\d*$/.test(value)) return

    const newCode = [...enteredCode]
    newCode[index] = value
    setEnteredCode(newCode)

    // Passer au champ suivant si un chiffre est entré
    if (value && index < 5) {
      codeInputRefs.current[index + 1].focus()
    }
  }

  // Gérer la touche Backspace dans les champs de code
  const handleCodeKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!enteredCode[index] && index > 0) {
        codeInputRefs.current[index - 1].focus()
      }
    }
  }

  // Gérer le collage d'un code
  const handleCodePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text")
    const digits = pastedData.match(/\d/g)

    if (digits && digits.length > 0) {
      const newCode = [...enteredCode]

      for (let i = 0; i < Math.min(digits.length, 6); i++) {
        newCode[i] = digits[i]
      }

      setEnteredCode(newCode)

      // Mettre le focus sur le dernier champ rempli ou le suivant
      const lastIndex = Math.min(digits.length, 6) - 1
      if (codeInputRefs.current[lastIndex]) {
        codeInputRefs.current[lastIndex].focus()
      }
    }
  }

  // Gérer le renvoi du code
  const handleResendCode = (e) => {
    e.preventDefault()

    if (resendDisabled) return

    setResendDisabled(true)

    // Générer un nouveau code
    const code = generateCode()
    setVerificationCode(code)
    console.log("Nouveau code de vérification:", code)

    // Réinitialiser les champs de code
    setEnteredCode(["", "", "", "", "", ""])
    if (codeInputRefs.current[0]) {
      codeInputRefs.current[0].focus()
    }

    // Afficher un message temporaire
    setResendText("Code envoyé!")

    // Réactiver le lien après un délai
    setTimeout(() => {
      setResendDisabled(false)
      setResendText("Renvoyer")
    }, 30000) // 30 secondes avant de pouvoir renvoyer
  }

  // Mettre à jour la force du mot de passe
  useEffect(() => {
    setPasswordStrength(evaluatePasswordStrength(newPassword))
  }, [newPassword])

  return (
    <div className="forgot-password-page">
      <main className="container">
        {/* Étape 1: Demande de réinitialisation */}
        <div className={`card ${currentStep !== "request" ? "hidden" : ""}`}>
          <div className="card-header">
            <div className="icon-container">
              <EmailIcon />
            </div>
            <h1 className="card-title">Mot de passe oublié</h1>
            <p className="card-description">Entrez votre adresse email et nous vous enverrons un code de vérification.</p>
          </div>
          <div className="card-content">
            <form onSubmit={handleRequestSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="votre@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {emailError && <span className="error-message">{emailError}</span>}
              </div>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading && <div className="spinner"></div>}
                <span className="button-text">Envoyer le code</span>
                {!loading && <ArrowRightIcon />}
              </button>
            </form>
          </div>
          <div className="card-footer">
            <Link to="/login" className="link">
              Retour à la connexion
            </Link>
          </div>
        </div>

        {/* Étape 2: Vérification du code */}
        <div className={`card ${currentStep !== "verify" ? "hidden" : ""}`}>
          <div className="card-header">
            <div className="icon-container">
              <PhoneIcon />
            </div>
            <h1 className="card-title">Vérification du code</h1>
            <p className="card-description">
              Nous avons envoyé un code à <span className="font-medium">{email}</span>. Veuillez entrer ce code
              ci-dessous.
            </p>
          </div>
          <div className="card-content">
            <form onSubmit={handleVerifySubmit}>
              <div className="form-group">
                <label htmlFor="verification-code">Code de vérification</label>
                <div className="code-input-container">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      className="code-input"
                      required
                      value={enteredCode[index]}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      onPaste={index === 0 ? handleCodePaste : undefined}
                      ref={(el) => (codeInputRefs.current[index] = el)}
                    />
                  ))}
                </div>
                {codeError && <span className="error-message">{codeError}</span>}
              </div>
              <button type="submit" className="submit-button" disabled={loading || enteredCode.some((digit) => !digit)}>
                {loading && <div className="spinner"></div>}
                <span className="button-text">Vérifier le code</span>
                {!loading && <ArrowRightIcon />}
              </button>
            </form>
            <div className="resend-container">
              <p>
                Vous n'avez pas reçu de code?{" "}
                <a
                  href="#"
                  className="link"
                  onClick={handleResendCode}
                  style={{ opacity: resendDisabled ? 0.5 : 1, pointerEvents: resendDisabled ? "none" : "auto" }}
                >
                  {resendText}
                </a>
              </p>
            </div>
          </div>
          <div className="card-footer">
            <button className="back-button" onClick={() => setCurrentStep("request")}>
              Retour
            </button>
          </div>
        </div>

        {/* Étape 3: Nouveau mot de passe */}
        <div className={`card ${currentStep !== "reset" ? "hidden" : ""}`}>
          <div className="card-header">
            <div className="icon-container">
              <LockIcon />
            </div>
            <h1 className="card-title">Nouveau mot de passe</h1>
            <p className="card-description">Veuillez créer un nouveau mot de passe sécurisé.</p>
          </div>
          <div className="card-content">
            <form onSubmit={handleResetSubmit}>
              <div className="form-group">
                <label htmlFor="new-password">Nouveau mot de passe</label>
                <div className="password-input-container">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="new-password"
                    name="new-password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {passwordError && <span className="error-message">{passwordError}</span>}
                <div className="password-strength-meter">
                  <div
                    className="strength-bar"
                    style={{
                      width: `${passwordStrength}%`,
                      backgroundColor: passwordStrength < 50 ? "#e53e3e" : passwordStrength < 75 ? "#dd6b20" : "#38a169",
                    }}
                  ></div>
                </div>
                <p className="password-hint">
                  Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.
                </p>
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password">Confirmer le mot de passe</label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm-password"
                    name="confirm-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {confirmError && <span className="error-message">{confirmError}</span>}
              </div>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading && <div className="spinner"></div>}
                <span className="button-text">Réinitialiser le mot de passe</span>
                {!loading && <ArrowRightIcon />}
              </button>
            </form>
          </div>
          <div className="card-footer">
            <button className="back-button" onClick={() => setCurrentStep("verify")}>
              Retour
            </button>
          </div>
        </div>

        {/* Étape 4: Confirmation finale */}
        <div className={`card ${currentStep !== "success" ? "hidden" : ""}`}>
          <div className="card-header">
            <div className="icon-container">
              <CheckIcon />
            </div>
            <h1 className="card-title">Mot de passe réinitialisé</h1>
            <p className="card-description">
              Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau
              mot de passe.
            </p>
          </div>
          <div className="card-footer">
            <a href="#" className="submit-button">
              Se connecter
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ForgotPasswordPage
