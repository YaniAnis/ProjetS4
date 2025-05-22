"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

function DeleteAccountTab() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleDelete = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (!password || !confirm) {
      setError("Veuillez entrer votre mot de passe pour confirmer.")
      return
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
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
      const res = await fetch("http://localhost:8000/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Erreur lors de la suppression du compte.")
      } else {
        setSuccess("Votre compte a été supprimé avec succès.")
        // Clean up localStorage and redirect after a short delay
        setTimeout(() => {
          localStorage.clear()
          navigate("/login")
        }, 2000)
      }
    } catch {
      setError("Erreur réseau.")
    }
    setLoading(false)
  }

  return (
    <div className="delete-account-section">
      <div className="warning-box">
        <span className="warning-icon">⚠️</span>
        <div className="warning-content">
          <h3>Attention : Cette action est irréversible !</h3>
          <p>La suppression de votre compte entraînera la perte définitive de toutes vos données.</p>
        </div>
      </div>
      <form onSubmit={handleDelete}>
        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <div className="form-group">
          <label>Confirmer le mot de passe</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        {error && <div className="form-error">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <button type="submit" className="delete-button" disabled={loading}>
          {loading ? "Suppression..." : "Confirmer la suppression"}
        </button>
      </form>
    </div>
  )
}

export default DeleteAccountTab
