"use client"

import { useState } from "react"

function ProfileHeader() {
  const [isUploading, setIsUploading] = useState(false)

  const handleAvatarClick = () => {
    // Simuler un téléchargement d'avatar
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
    }, 2000)
  }

  return (
    <div className="profile-header">
      <div className="profile-avatar-container">
        <div className="profile-avatar">
          <img src="https://via.placeholder.com/100" alt="Photo de profil" />
          <div className="profile-avatar-overlay" onClick={handleAvatarClick}>
            {isUploading ? <span className="upload-spinner"></span> : <span className="upload-icon">📷</span>}
          </div>
        </div>
      </div>

      <div className="profile-info">
        <h1>Jean Dupont</h1>
        <p>jean.dupont@example.com</p>
        <span className="profile-status">Compte Premium</span>
      </div>
    </div>
  )
}

export default ProfileHeader
