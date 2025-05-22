"use client"

import { useEffect, useState } from "react"
import "./profile-settings.css"

function ProfileHeader() {
  const [user, setUser] = useState({ name: "", email: "" })
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    // Try to get user info from localStorage first for instant display
    const localUser = localStorage.getItem("userInfo") || localStorage.getItem("user")
    if (localUser) {
      try {
        const parsed = JSON.parse(localUser)
        setUser({
          name: parsed.name || "",
          email: parsed.email || "",
        })
      } catch {}
    }
    const token = localStorage.getItem("authToken") || localStorage.getItem("token")
    if (!token) return
    fetch("http://localhost:8000/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) return
        const data = await res.json()
        setUser({
          name: data.name || "",
          email: data.email || "",
        })
        localStorage.setItem("userInfo", JSON.stringify({ name: data.name, email: data.email }))
      })
      .catch(() => {})
  }, [])

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
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&size=100`} alt="Avatar" />
          <div className="profile-avatar-overlay" onClick={handleAvatarClick}>
            {isUploading ? <span className="upload-spinner"></span> : <span className="upload-icon">📷</span>}
          </div>
        </div>
      </div>
      <div className="profile-info">
        <div style={{ fontWeight: 600, fontSize: "1.25rem", marginBottom: 4 }}>
          {user.name ? user.name : "Nom Prénom"}
        </div>
        <div style={{ fontSize: "1rem", opacity: 0.85, marginBottom: 10 }}>
          {user.email ? user.email : "email@gmail.com"}
        </div>
        <h1>Paramètres du profil</h1>
        <p>Gérez vos informations personnelles, sécurité et préférences.</p>
      </div>
    </div>
  )
}

export default ProfileHeader
