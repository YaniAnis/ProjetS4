"use client"

import { useEffect, useState } from "react"

function PersonalInfoTab() {
  // Initialize with null to distinguish between "not loaded" and "empty"
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  // Remove default values, will be set after fetch
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })
  const [originalData, setOriginalData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })
  const [error, setError] = useState("")
  const [showEmailCode, setShowEmailCode] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [emailCode, setEmailCode] = useState("")
  const [emailCodeError, setEmailCodeError] = useState("")
  const [emailCodeSent, setEmailCodeSent] = useState(false)

  useEffect(() => {
    let token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (!token) {
      setLoading(false)
      setError("Vous devez être connecté.")
      return
    }
    fetch("http://localhost:8000/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      // Remove credentials: "include" unless your backend requires cookies for authentication.
      // credentials: "include"
    })
      .then(async (res) => {
        let data;
        try {
          data = await res.json();
        } catch (e) {
          setError("Réponse du serveur invalide.")
          setLoading(false)
          return
        }
        console.log("API /api/user status:", res.status, "data:", data);

        if (!res.ok) {
          setError(data?.message || "Impossible de récupérer les informations utilisateur.")
          setLoading(false)
          return
        }
        let firstName = ""
        let lastName = ""
        if (data.name) {
          const parts = data.name.trim().split(" ")
          firstName = parts[0] || ""
          lastName = parts.length > 1 ? parts.slice(1).join(" ") : ""
        }
        setUser({
          name: data.name || "",
          email: data.email || "",
        })
        setFormData({
          firstName,
          lastName,
          email: data.email || "",
        })
        setOriginalData({
          firstName,
          lastName,
          email: data.email || "",
        })
        setError("")
        setLoading(false)
      })
      .catch((err) => {
        console.error("Erreur réseau ou serveur:", err)
        setUser(null)
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
        })
        setError("Erreur réseau ou serveur.")
        setLoading(false)
      })
  }, [showSuccess]) // re-fetch after update

  const handleEdit = () => {
    setIsEditing(true)
    setOriginalData({ ...formData })
    setError("")
  }

  const handleCancel = (e) => {
    e.preventDefault()
    setIsEditing(false)
    setFormData({ ...originalData })
    setError("")
    setShowEmailCode(false)
    setNewEmail("")
    setEmailCode("")
    setEmailCodeError("")
    setEmailCodeSent(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Step 1: Send verification code to new email
  const handleSendEmailCode = async (e) => {
    e.preventDefault()
    setEmailCodeError("")
    setError("")
    if (!newEmail || newEmail === formData.email) {
      setEmailCodeError("Veuillez entrer un nouvel email différent.")
      return
    }
    // Check if email is already in use
    try {
      const checkRes = await fetch(`http://localhost:8000/api/check-email?email=${encodeURIComponent(newEmail)}`)
      if (checkRes.ok) {
        const checkData = await checkRes.json()
        if (checkData.exists) {
          setEmailCodeError("Un compte avec cet email existe déjà.")
          return
        }
      } else {
        setEmailCodeError("Erreur lors de la vérification de l'email.")
        return
      }
    } catch {
      setEmailCodeError("Erreur réseau lors de la vérification de l'email.")
      return
    }
    // ...existing code for sending code...
    try {
      const res = await fetch("http://localhost:8000/api/send-change-email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setEmailCodeError(data.message || "Erreur lors de l'envoi du code.")
        return
      }
      setEmailCodeSent(true)
    } catch {
      setEmailCodeError("Erreur réseau lors de l'envoi du code.")
    }
  }

  // Step 2: Verify code and update email
  const handleVerifyEmailCode = async (e) => {
    e.preventDefault()
    setEmailCodeError("")
    setError("")
    if (!emailCode || !newEmail) {
      setEmailCodeError("Veuillez entrer le code reçu.")
      return
    }
    let token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (!token) {
      setEmailCodeError("Vous devez être connecté.")
      return
    }
    try {
      const res = await fetch("http://localhost:8000/api/change-email", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: newEmail,
          code: emailCode,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setEmailCodeError(data.message || "Erreur lors de la vérification du code.")
        return
      }
      setFormData((prev) => ({
        ...prev,
        email: newEmail,
      }))
      setShowEmailCode(false)
      setEmailCode("")
      setNewEmail("")
      setEmailCodeSent(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch {
      setEmailCodeError("Erreur réseau lors de la vérification.")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    const token = localStorage.getItem("authToken") || localStorage.getItem("token")
    if (!token) {
      setError("Vous devez être connecté.")
      return
    }
    const name = `${formData.firstName} ${formData.lastName}`.trim()
    try {
      const res = await fetch("http://localhost:8000/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email: formData.email,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.message || "Erreur lors de la mise à jour.")
        return
      }
      setIsEditing(false)
      setShowSuccess(true)
      setUser({ name, email: formData.email })
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    } catch (err) {
      setError("Erreur réseau lors de la mise à jour.")
    }
  }

  return (
    <div className="settings-section" id="personal-tab">
      <div className="settings-header">
        <h2>Informations personnelles</h2>
      </div>
      {error && <div className="form-error">{error}</div>}
      {loading ? (
        <div>Chargement...</div>
      ) : (
        <>
          <div className="settings-header">
            {!isEditing ? (
              <button className="edit-button" onClick={handleEdit}>
                Modifier
              </button>
            ) : (
              <button className="cancel-button" onClick={handleCancel}>
                Annuler
              </button>
            )}
          </div>

          {showSuccess && <div className="success-message">Vos informations ont été mises à jour avec succès!</div>}

          <form id="personal-info-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">Prénom</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  // Show placeholder if not editing and value is empty
                  placeholder={!formData.firstName && !isEditing ? "Non renseigné" : ""}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Nom</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  placeholder={!formData.lastName && !isEditing ? "Non renseigné" : ""}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={isEditing ? (e) => setShowEmailCode(true) || setNewEmail(e.target.value) : undefined}
                  disabled={!isEditing}
                  required
                  placeholder={!formData.email && !isEditing ? "Non renseigné" : ""}
                />
                {isEditing && (
                  <button
                    type="button"
                    className="save-button"
                    style={{ marginTop: 8, marginLeft: 0 }}
                    onClick={() => setShowEmailCode(true)}
                  >
                    Modifier l'email
                  </button>
                )}
              </div>
            </div>

            {showEmailCode && isEditing && (
              <div className="form-group" style={{ marginTop: 10 }}>
                <label>Nouveau Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="Entrez le nouvel email"
                  required
                  disabled={emailCodeSent}
                />
                {!emailCodeSent ? (
                  <button
                    type="button"
                    className="save-button"
                    style={{ marginTop: 8 }}
                    onClick={handleSendEmailCode}
                  >
                    Envoyer le code de vérification
                  </button>
                ) : (
                  <>
                    <div style={{ marginTop: 8 }}>
                      <label>Code de vérification</label>
                      <input
                        type="text"
                        value={emailCode}
                        onChange={e => setEmailCode(e.target.value)}
                        placeholder="Code reçu"
                        maxLength={6}
                        required
                      />
                      <button
                        type="button"
                        className="save-button"
                        style={{ marginLeft: 8 }}
                        onClick={handleVerifyEmailCode}
                      >
                        Vérifier et changer l'email
                      </button>
                    </div>
                  </>
                )}
                {emailCodeError && <div className="form-error">{emailCodeError}</div>}
              </div>
            )}

            {isEditing && (
              <div className="form-actions">
                <button type="submit" className="save-button">
                  Enregistrer les modifications
                </button>
              </div>
            )}
          </form>
        </>
      )}
    </div>
  )
}

export default PersonalInfoTab