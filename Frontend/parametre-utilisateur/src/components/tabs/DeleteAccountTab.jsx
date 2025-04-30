"use client"

import { useState } from "react"

function DeleteAccountTab() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [deleteReason, setDeleteReason] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const handleRequestDelete = () => {
    setShowConfirmation(true)
  }

  const handleCancelDelete = () => {
    setShowConfirmation(false)
    setDeleteReason("")
    setConfirmPassword("")
    setError("")
  }

  const handleConfirmDelete = () => {
    if (!confirmPassword) {
      setError("Veuillez entrer votre mot de passe pour confirmer")
      return
    }

    setError("")
    setIsDeleting(true)

    // Simuler la suppression
    setTimeout(() => {
      alert("Compte supprimé avec succès. Vous allez être redirigé vers la page d'accueil.")
    }, 2000)
  }

  return (
    <div className="settings-section delete-account-section" id="delete-tab">
      <div className="settings-header">
        <h2>Supprimer le compte</h2>
      </div>

      <div className="warning-box">
        <div className="warning-icon">⚠️</div>
        <div className="warning-content">
          <h3>Attention : Cette action est irréversible</h3>
          <p>
            La suppression de votre compte entraînera la perte définitive de toutes vos données, y compris votre profil,
            vos préférences et votre historique.
          </p>
        </div>
      </div>

      <div className="delete-info">
        <h3>Avant de supprimer votre compte</h3>
        <ul className="delete-checklist">
          <li>Téléchargez vos données si vous souhaitez les conserver</li>
          <li>Vérifiez si vous avez des abonnements actifs à annuler</li>
          <li>Notez que les contenus que vous avez partagés publiquement pourraient rester visibles</li>
          <li>La suppression sera effective après une période de réflexion de 30 jours</li>
        </ul>
      </div>

      {!showConfirmation ? (
        <div className="form-actions" id="delete-request">
          <button className="delete-button" onClick={handleRequestDelete}>
            Supprimer mon compte
          </button>
        </div>
      ) : (
        <div className="delete-confirmation">
          <h3>Confirmer la suppression du compte</h3>

          <div className="form-group">
            <label htmlFor="deleteReason">Pourquoi souhaitez-vous supprimer votre compte ? (facultatif)</label>
            <select id="deleteReason" value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)}>
              <option value="">Sélectionnez une raison</option>
              <option value="privacy">Préoccupations concernant la confidentialité</option>
              <option value="experience">Mauvaise expérience utilisateur</option>
              <option value="alternative">J'utilise un service alternatif</option>
              <option value="temporary">Je vais créer un nouveau compte</option>
              <option value="other">Autre raison</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="confirmDeletePassword">Entrez votre mot de passe pour confirmer</label>
            <input
              type="password"
              id="confirmDeletePassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <div className="confirmation-actions">
            <button className="cancel-button" onClick={handleCancelDelete} disabled={isDeleting}>
              Annuler
            </button>
            <button className="confirm-delete-button" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? "Suppression en cours..." : "Confirmer la suppression"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeleteAccountTab
