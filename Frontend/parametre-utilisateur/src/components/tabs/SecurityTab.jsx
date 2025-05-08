"use client"

import { useState } from "react"
import Switch from "../common/switch"

function SecurityTab({ showTwoFactorModal }) {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessions, setSessions] = useState([
    { id: 1, device: "Chrome - Windows", location: "Paris, France", time: "Connecté maintenant", isCurrent: true },
    {
      id: 2,
      device: "Safari - iPhone",
      location: "Lyon, France",
      time: "Dernière activité il y a 2 heures",
      isCurrent: false,
    },
    {
      id: 3,
      device: "Firefox - MacOS",
      location: "Marseille, France",
      time: "Dernière activité il y a 3 jours",
      isCurrent: false,
    },
  ])

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validatePasswordForm = () => {
    const newErrors = {}

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Veuillez entrer votre mot de passe actuel"
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = "Veuillez entrer un nouveau mot de passe"
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = "Le mot de passe doit contenir au moins 8 caractères"
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre nouveau mot de passe"
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()

    if (validatePasswordForm()) {
      // Simuler le changement de mot de passe
      setTimeout(() => {
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })

        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
        }, 3000)
      }, 1500)
    }
  }

  const handleTwoFactorToggle = (checked) => {
    if (checked) {
      showTwoFactorModal()
    } else {
      setTwoFactorEnabled(false)
    }
  }

  const handleSessionLogout = (sessionId) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId))
  }

  const handleLogoutAll = () => {
    setSessions((prev) => prev.filter((session) => session.isCurrent))
  }

  return (
    <div className="settings-section" id="security-tab">
      <div className="settings-header">
        <h2>Sécurité</h2>
      </div>

      <div className="security-section">
        <h3>Changer le mot de passe</h3>
        {showSuccess && <div className="success-message">Votre mot de passe a été modifié avec succès!</div>}

        <form id="password-form" onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Mot de passe actuel</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className={errors.currentPassword ? "error" : ""}
            />
            {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nouveau mot de passe</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className={errors.newPassword ? "error" : ""}
            />
            {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className={errors.confirmPassword ? "error" : ""}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-actions">
            <button type="submit" className="save-button">
              Modifier le mot de passe
            </button>
          </div>
        </form>
      </div>

      <div className="security-section">
        <h3>Authentification à deux facteurs</h3>
        <p className="security-description">
          L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire à votre compte en demandant un
          code en plus de votre mot de passe.
        </p>

        <div className="two-factor-toggle">
          <span>Authentification à deux facteurs</span>
          <Switch checked={twoFactorEnabled} onChange={handleTwoFactorToggle} />
        </div>

        {twoFactorEnabled && (
          <div className="two-factor-info">
            <p>
              L'authentification à deux facteurs est activée. Un code de vérification sera envoyé à votre téléphone lors
              de la connexion.
            </p>
          </div>
        )}
      </div>

      {/*<div className="security-section">
        <h3>Sessions actives</h3>
        <div className="active-sessions">
          {sessions.map((session) => (
            <div className="session-item" key={session.id}>
              <div className="session-info">
                <div className="session-device">{session.device}</div>
                <div className="session-location">{session.location}</div>
                <div className="session-time">{session.time}</div>
              </div>
              {session.isCurrent ? (
                <div className="session-current">Session actuelle</div>
              ) : (
                <button className="session-logout" onClick={() => handleSessionLogout(session.id)}>
                  Déconnecter
                </button>
              )}
            </div>
          ))}
        </div>

        {sessions.length > 1 && (
          <button className="logout-all-button" onClick={handleLogoutAll}>
            Déconnecter toutes les autres sessions
          </button>
        )}
      </div>*/}
    </div>
  )
}

export default SecurityTab
