"use client"

import { useState } from "react"
import Switch from "../switch.js"

function SecurityTab({ showTwoFactorModal }) {
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
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

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Veuillez remplir tous les champs.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.")
      return
    }
    setLoading(true)
    let token = localStorage.getItem("authToken") || localStorage.getItem("token")
    if (!token) {
      setError("Vous devez être connecté.")
      setLoading(false)
      return
    }
    try {
      const res = await fetch("http://localhost:8000/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          old_password: oldPassword,
          password: newPassword,
          password_confirmation: confirmPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Erreur lors du changement de mot de passe.")
      } else {
        setSuccess("Mot de passe modifié avec succès !")
        setOldPassword("")
        setNewPassword("")
        setConfirmPassword("")
      }
    } catch {
      setError("Erreur réseau.")
    }
    setLoading(false)
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
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label>Ancien mot de passe</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="form-group">
            <label>Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div className="form-group">
            <label>Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <button type="submit" className="save-button" disabled={loading}>
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>
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
