"use client"

import { useState } from "react"
import "./ContactForm.css"

function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("http://localhost:8000/api/send-contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        }),
      })

      if (response.ok) {
        alert("Message envoyé avec succès !")
        setFormData({ firstName: "", lastName: "", email: "", subject: "", message: "" })
      } else {
        alert("Erreur lors de l'envoi du message. Veuillez réessayer.")
      }
    } catch (error) {
      alert("Erreur de connexion. Veuillez réessayer plus tard.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-form-container">
      <div className="form-header">
        <h2>Envoyez-nous un message</h2>
        <p>Nous vous répondrons dans les plus brefs délais</p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">Prénom</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="Votre prénom"
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
              required
              placeholder="Votre nom"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Adresse e-mail</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="votre.email@exemple.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Objet du message</label>
          <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required>
            <option value="">Sélectionnez un sujet</option>
            <option value="reservation">Problème de réservation</option>
            <option value="payment">Question de paiement</option>
            <option value="refund">Demande de remboursement</option>
            <option value="info">Informations générales</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="message">Votre message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            placeholder="Décrivez votre demande en détail..."
            rows="6"
          ></textarea>
        </div>

        <button type="submit" className={`submit-btn ${isSubmitting ? "submitting" : ""}`} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner"></span>
              Envoi en cours...
            </>
          ) : (
            "Envoyer le message"
          )}
        </button>
      </form>
    </div>
  )
}

export default ContactForm
