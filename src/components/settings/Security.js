"use client"

import { useState } from "react"
import "./setting.css"

const Security = () => {
  const [twoFactor, setTwoFactor] = useState(false)

  return (
    <div className="setting-section">
      <div className="setting-section-header">
        <span className="setting-section-icon">🔒</span>
        <h2 className="setting-section-title">Security</h2>
      </div>
      <div className="toggle-switch">
        <span className="toggle-switch-label">Two-Factor Authentication</span>
        <button
          className={`toggle-switch-button ${twoFactor ? "toggle-switch-on" : "toggle-switch-off"}`}
          onClick={() => setTwoFactor(!twoFactor)}
        >
          <span
            className={`toggle-switch-indicator ${
              twoFactor ? "toggle-switch-indicator-on" : "toggle-switch-indicator-off"
            }`}
          />
        </button>
      </div>
      <div className="security-button-container">
        <button className="security-change-password-button">Changer le Mot de Passe</button>
      </div>
    </div>
  )
}
export default Security

