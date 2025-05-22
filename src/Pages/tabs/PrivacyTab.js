"use client"

import { useState } from "react"
import Switch from "../switch.js"

function PrivacyTab() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [profileVisibility, setProfileVisibility] = useState("public")
  const [privacySettings, setPrivacySettings] = useState({
    activityStatus: true,
    searchable: true,
    dataSharing: false,
  })
  const [cookiePreferences, setCookiePreferences] = useState({
    functional: true,
    analytics: true,
    advertising: false,
    thirdParty: false,
  })

  const handlePrivacySettingChange = (setting, checked) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [setting]: checked,
    }))
  }

  const handleCookiePreferenceChange = (type, checked) => {
    setCookiePreferences((prev) => ({
      ...prev,
      [type]: checked,
    }))
  }

  const handleSave = () => {
    // Simuler l'enregistrement
    setTimeout(() => {
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 1500)
  }

  return (
    <div className="settings-section" id="privacy-tab">
      <div className="settings-header">
        <h2>Paramètres de confidentialité</h2>
      </div>

      {showSuccess && (
        <div className="success-message">Vos paramètres de confidentialité ont été enregistrés avec succès!</div>
      )}

      {/*<div className="privacy-section">
        <h3>Visibilité du profil</h3>
        <p className="privacy-description">Contrôlez qui peut voir votre profil et vos informations personnelles.</p>

        <div className="radio-options">
          <label className="radio-option">
            <input
              type="radio"
              name="profileVisibility"
              value="public"
              checked={profileVisibility === "public"}
              onChange={() => setProfileVisibility("public")}
            />
            <div className="radio-content">
              <h4>Public</h4>
              <p>Tout le monde peut voir votre profil</p>
            </div>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="profileVisibility"
              value="friends"
              checked={profileVisibility === "friends"}
              onChange={() => setProfileVisibility("friends")}
            />
            <div className="radio-content">
              <h4>Amis uniquement</h4>
              <p>Seuls vos amis peuvent voir votre profil</p>
            </div>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="profileVisibility"
              value="private"
              checked={profileVisibility === "private"}
              onChange={() => setProfileVisibility("private")}
            />
            <div className="radio-content">
              <h4>Privé</h4>
              <p>Personne ne peut voir votre profil sans votre autorisation</p>
            </div>
          </label>
        </div>
      </div>

      <div className="privacy-section">
        <h3>Paramètres de confidentialité supplémentaires</h3>

        <div className="privacy-option">
          <div className="privacy-info">
            <h4>Statut d'activité</h4>
            <p>Montrer quand vous êtes en ligne</p>
          </div>
          <Switch
            checked={privacySettings.activityStatus}
            onChange={(checked) => handlePrivacySettingChange("activityStatus", checked)}
          />
        </div>

        <div className="privacy-option">
          <div className="privacy-info">
            <h4>Recherche</h4>
            <p>Permettre aux autres utilisateurs de vous trouver par votre nom ou email</p>
          </div>
          <Switch
            checked={privacySettings.searchable}
            onChange={(checked) => handlePrivacySettingChange("searchable", checked)}
          />
        </div>

        <div className="privacy-option">
          <div className="privacy-info">
            <h4>Partage de données</h4>
            <p>Autoriser le partage de vos données avec des partenaires tiers</p>
          </div>
          <Switch
            checked={privacySettings.dataSharing}
            onChange={(checked) => handlePrivacySettingChange("dataSharing", checked)}
          />
        </div>
      </div>*/}

      <div className="privacy-section">
        <h3>Préférences de cookies</h3>
        <p className="privacy-description">
          Gérez les types de cookies que nous utilisons pour améliorer votre expérience.
        </p>

        <div className="cookie-options">
          <div className="cookie-option">
            <div className="cookie-info">
              <h4>Cookies nécessaires</h4>
              <p>Requis pour le fonctionnement du site</p>
            </div>
            <Switch checked={true} disabled={true} />
          </div>

          <div className="cookie-option">
            <div className="cookie-info">
              <h4>Cookies fonctionnels</h4>
              <p>Pour des fonctionnalités améliorées et personnalisées</p>
            </div>
            <Switch
              checked={cookiePreferences.functional}
              onChange={(checked) => handleCookiePreferenceChange("functional", checked)}
            />
          </div>

          <div className="cookie-option">
            <div className="cookie-info">
              <h4>Cookies analytiques</h4>
              <p>Pour analyser l'utilisation du site et améliorer l'expérience</p>
            </div>
            <Switch
              checked={cookiePreferences.analytics}
              onChange={(checked) => handleCookiePreferenceChange("analytics", checked)}
            />
          </div>

          <div className="cookie-option">
            <div className="cookie-info">
              <h4>Cookies publicitaires</h4>
              <p>Pour afficher des publicités personnalisées</p>
            </div>
            <Switch
              checked={cookiePreferences.advertising}
              onChange={(checked) => handleCookiePreferenceChange("advertising", checked)}
            />
          </div>

          <div className="cookie-option">
            <div className="cookie-info">
              <h4>Cookies tiers</h4>
              <p>Permettre aux services tiers de stocker des cookies</p>
            </div>
            <Switch
              checked={cookiePreferences.thirdParty}
              onChange={(checked) => handleCookiePreferenceChange("thirdParty", checked)}
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button className="save-button" onClick={handleSave}>
          Enregistrer les paramètres
        </button>
      </div>
    </div>
  )
}

export default PrivacyTab
