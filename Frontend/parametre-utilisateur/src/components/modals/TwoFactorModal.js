"use client"

import { useState } from "react"

function TwoFactorModal({ onClose }) {
  const [verificationCode, setVerificationCode] = useState("")

  const handleActivate = () => {
    // Simuler l'activation
    onClose(true) // Passer true pour indiquer que l'activation a réussi
  }

  const handleCancel = () => {
    onClose(false) // Passer false pour indiquer que l'activation a été annulée
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Activer l'authentification à deux facteurs</h3>
          <button className="modal-close" onClick={handleCancel}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <p>Scannez ce QR code avec votre application d'authentification :</p>

          <div className="qr-code">
            <img src="https://via.placeholder.com/200" alt="QR Code" />
          </div>

          <div className="form-group">
            <label htmlFor="verificationCode">Code de vérification</label>
            <input
              type="text"
              id="verificationCode"
              placeholder="Entrez le code à 6 chiffres"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={handleCancel}>
            Annuler
          </button>
          <button className="confirm-button" onClick={handleActivate}>
            Activer
          </button>
        </div>
      </div>
    </div>
  )
}

export default TwoFactorModal
