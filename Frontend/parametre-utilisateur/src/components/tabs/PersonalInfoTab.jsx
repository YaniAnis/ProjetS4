"use client"

import { useState } from "react"

function PersonalInfoTab() {
  const [isEditing, setIsEditing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    phone: "+33 6 12 34 56 78",
    address: "123 Rue de Paris",
    city: "Paris",
    zipCode: "75001",
    country: "France",
    bio: "Développeur web passionné par les nouvelles technologies.",
  })
  const [originalData, setOriginalData] = useState({ ...formData })

  const handleEdit = () => {
    setIsEditing(true)
    setOriginalData({ ...formData })
  }

  const handleCancel = (e) => {
    e.preventDefault()
    setIsEditing(false)
    setFormData({ ...originalData })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Simuler une sauvegarde
    setTimeout(() => {
      setIsEditing(false)
      setShowSuccess(true)

      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 1500)
  }

  return (
    <div className="settings-section" id="personal-tab">
      <div className="settings-header">
        <h2>Informations personnelles</h2>
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
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Téléphone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="address">Adresse</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">Ville</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="zipCode">Code postal</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="country">Pays</label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="bio">Biographie</label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            value={formData.bio}
            onChange={handleChange}
            disabled={!isEditing}
          ></textarea>
        </div>

        {isEditing && (
          <div className="form-actions">
            <button type="submit" className="save-button">
              Enregistrer les modifications
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default PersonalInfoTab
