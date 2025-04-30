"use client"

import { useState } from "react"
import Switch from "../common/switch"

function NotificationsTab() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState({
    accountUpdates: true,
    securityAlerts: true,
    newsletter: false,
    promotions: false,
    newFeatures: true,
  })
  const [pushNotifications, setPushNotifications] = useState({
    messages: true,
    mentions: true,
    comments: true,
    likes: false,
    followers: true,
  })

  const handleEmailNotificationChange = (type, checked) => {
    setEmailNotifications((prev) => ({
      ...prev,
      [type]: checked,
    }))
  }

  const handlePushNotificationChange = (type, checked) => {
    setPushNotifications((prev) => ({
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
    <div className="settings-section" id="notifications-tab">
      <div className="settings-header">
        <h2>Paramètres de notification</h2>
      </div>

      {showSuccess && (
        <div className="success-message">Vos préférences de notification ont été enregistrées avec succès!</div>
      )}

      <div className="notification-section">
        <h3>Notifications par email</h3>

        <div className="notification-option">
          <div className="notification-info">
            <h4>Mises à jour du compte</h4>
            <p>Informations importantes concernant votre compte</p>
          </div>
          <Switch
            checked={emailNotifications.accountUpdates}
            onChange={(checked) => handleEmailNotificationChange("accountUpdates", checked)}
          />
        </div>

        <div className="notification-option">
          <div className="notification-info">
            <h4>Alertes de sécurité</h4>
            <p>Notifications concernant la sécurité de votre compte</p>
          </div>
          <Switch
            checked={emailNotifications.securityAlerts}
            onChange={(checked) => handleEmailNotificationChange("securityAlerts", checked)}
          />
        </div>

        <div className="notification-option">
          <div className="notification-info">
            <h4>Newsletter</h4>
            <p>Actualités et mises à jour mensuelles</p>
          </div>
          <Switch
            checked={emailNotifications.newsletter}
            onChange={(checked) => handleEmailNotificationChange("newsletter", checked)}
          />
        </div>

        <div className="notification-option">
          <div className="notification-info">
            <h4>Promotions</h4>
            <p>Offres spéciales et réductions</p>
          </div>
          <Switch
            checked={emailNotifications.promotions}
            onChange={(checked) => handleEmailNotificationChange("promotions", checked)}
          />
        </div>

        <div className="notification-option">
          <div className="notification-info">
            <h4>Nouvelles fonctionnalités</h4>
            <p>Informations sur les nouvelles fonctionnalités et améliorations</p>
          </div>
          <Switch
            checked={emailNotifications.newFeatures}
            onChange={(checked) => handleEmailNotificationChange("newFeatures", checked)}
          />
        </div>
      </div>

      <div className="notification-section">
        <h3>Notifications push</h3>

        <div className="notification-option">
          <div className="notification-info">
            <h4>Messages</h4>
            <p>Notifications pour les nouveaux messages</p>
          </div>
          <Switch
            checked={pushNotifications.messages}
            onChange={(checked) => handlePushNotificationChange("messages", checked)}
          />
        </div>

        <div className="notification-option">
          <div className="notification-info">
            <h4>Mentions</h4>
            <p>Notifications lorsque quelqu'un vous mentionne</p>
          </div>
          <Switch
            checked={pushNotifications.mentions}
            onChange={(checked) => handlePushNotificationChange("mentions", checked)}
          />
        </div>

        <div className="notification-option">
          <div className="notification-info">
            <h4>Commentaires</h4>
            <p>Notifications pour les nouveaux commentaires sur vos publications</p>
          </div>
          <Switch
            checked={pushNotifications.comments}
            onChange={(checked) => handlePushNotificationChange("comments", checked)}
          />
        </div>

        <div className="notification-option">
          <div className="notification-info">
            <h4>J'aime</h4>
            <p>Notifications lorsque quelqu'un aime votre contenu</p>
          </div>
          <Switch
            checked={pushNotifications.likes}
            onChange={(checked) => handlePushNotificationChange("likes", checked)}
          />
        </div>

        <div className="notification-option">
          <div className="notification-info">
            <h4>Nouveaux abonnés</h4>
            <p>Notifications lorsque quelqu'un commence à vous suivre</p>
          </div>
          <Switch
            checked={pushNotifications.followers}
            onChange={(checked) => handlePushNotificationChange("followers", checked)}
          />
        </div>
      </div>

      <div className="form-actions">
        <button className="save-button" onClick={handleSave}>
          Enregistrer les préférences
        </button>
      </div>
    </div>
  )
}

export default NotificationsTab
