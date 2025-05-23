import React, { useState, useEffect } from "react"
import "./styles/PaymentForm.css"

function PaymentForm({ cardData, onInputChange, onInputFocus, selectedZones = [], totalPlaces = 0, totalPrice = 0 }) {
  const [showVerification, setShowVerification] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [paiementId, setPaiementId] = useState(null)
  const [verificationMessage, setVerificationMessage] = useState("")
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [qrInfoMessage, setQrInfoMessage] = useState("")

  // Ajoutez ce log pour debug :
  // console.log("selectedZones", selectedZones, "totalPlaces", totalPlaces, "totalPrice", totalPrice);

  const formatCardNumber = (value) => {
    if (!value) return ""

    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const formatExpiryDate = (value) => {
    if (!value) return ""

    const v = value.replace(/[^0-9]/g, "")

    if (v.length >= 3) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`
    }

    return v
  }

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value)
    e.target.value = formattedValue
    onInputChange("number", formattedValue)
  }

  const handleCardNameChange = (e) => {
    onInputChange("name", e.target.value)
  }

  const handleCardExpiryChange = (e) => {
    const formattedValue = formatExpiryDate(e.target.value)
    e.target.value = formattedValue
    onInputChange("expiry", formattedValue)
  }

  const handleCardCvcChange = (e) => {
    onInputChange("cvc", e.target.value)
  }

  // Récupère l'email du compte connecté au chargement du composant
  useEffect(() => {
    // Suppose que l'utilisateur est stocké dans localStorage sous la clé 'user'
    const user = JSON.parse(localStorage.getItem("user") || "null")
    if (user && user.email) {
      onInputChange("email", user.email)
    }
    // NE PAS mettre else { onInputChange("email", "") } sinon ça efface la saisie manuelle
  }, [onInputChange])

  const validateForm = () => {
    let isValid = true

    // Card number validation
    if (!/^(\d{4}\s){3}\d{4}$/.test(cardData.number)) {
      isValid = false
      const el = document.getElementById("card-number")
      if (el) highlightError(el)
    }

    // Name validation
    if (cardData.name.trim().length < 3) {
      isValid = false
      const el = document.getElementById("card-name")
      if (el) highlightError(el)
    }

    // Expiry validation
    if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
      isValid = false
      const el = document.getElementById("card-expiry")
      if (el) highlightError(el)
    } else {
      // Check if date is valid and not expired
      const [month, year] = cardData.expiry.split("/")
      const expiryDate = new Date("20" + year, month - 1)
      const currentDate = new Date()
      if (expiryDate < currentDate) {
        isValid = false
        const el = document.getElementById("card-expiry")
        if (el) highlightError(el)
      }
    }

    // CVC validation
    if (!/^\d{3}$/.test(cardData.cvc)) {
      isValid = false
      const el = document.getElementById("card-cvc")
      if (el) highlightError(el)
    }

    // Email validation (champ non visible, donc pas de highlight)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cardData.email)) {
      isValid = false
      // pas de highlightError ici car pas de champ email dans le DOM
    }

    return isValid
  }

  const highlightError = (inputElement) => {
    if (!inputElement) return
    inputElement.style.borderColor = "#dc3545"
    inputElement.style.boxShadow = "0 0 0 3px rgba(220, 53, 69, 0.25)"

    // Remove error styling after 3 seconds
    setTimeout(() => {
      inputElement.style.borderColor = ""
      inputElement.style.boxShadow = ""
    }, 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!token) {
      alert("Vous devez être connecté pour effectuer un paiement.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/create-payment", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          card_number: cardData.number.replace(/\s/g, ''),
          name: cardData.name,
          expiry: cardData.expiry,
          cvc: cardData.cvc,
          selectedZones,
          totalPlaces,
          totalPrice
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de la création du paiement");
      }

      const data = await res.json();
      
      if (data.success) {
        setPaiementId(data.paiement_id);
        setShowVerification(true);
        alert("Un code de vérification a été envoyé à votre email.");
      } else {
        alert(data.message || "Erreur lors de la création du paiement.");
      }
    } catch (err) {
      console.error("Erreur:", err);
      alert(err.message || "Erreur lors de la création du paiement.");
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setVerificationMessage("")

    if (!verificationCode || !paiementId) {
      setVerificationMessage("Veuillez saisir le code de vérification.")
      return
    }

    // Debug log
    console.log("Vérification paiementId:", paiementId, "code:", verificationCode)

    // Call backend to verify payment
    try {
      const res = await fetch("http://localhost:8000/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paiement_id: paiementId,
          verification_code: verificationCode,
        }),
      })
      let data
      let rawText = ""
      try {
        rawText = await res.text()
        console.log("Réponse brute backend:", rawText) // <-- Ajoutez ce log
        try {
          data = JSON.parse(rawText)
        } catch (jsonErr) {
          setVerificationMessage("Erreur technique lors de la vérification. Veuillez réessayer plus tard.")
          console.error("Réponse inattendue du backend:", rawText)
          return
        }
      } catch (streamErr) {
        setVerificationMessage("Erreur lors de la lecture de la réponse : " + (streamErr.message || streamErr))
        return
      }
      if (data.success) {
        setVerificationMessage("")
        setShowVerification(false)
        setPaymentConfirmed(true)
        setQrInfoMessage(data.message || "Paiement confirmé ! Un email avec votre QR code a été envoyé.")
      } else {
        setVerificationMessage(data.message || "Code invalide.")
      }
    } catch (err) {
      setVerificationMessage("Erreur lors de la vérification : " + (err.message || err))
    }
  }

  if (paymentConfirmed) {
    return (
      <div className="payment-confirmed-message">
        <h2>Paiement confirmé !</h2>
        <p>{qrInfoMessage || "Un email avec votre QR code a été envoyé. Présentez-le le jour du match."}</p>
      </div>
    )
  }

  if (showVerification) {
    return (
      <form className="payment-form" onSubmit={handleVerify}>
        <div className="form-input">
          <label htmlFor="verification-code">Code de vérification</label>
          <input
            type="text"
            id="verification-code"
            value={verificationCode}
            onChange={e => setVerificationCode(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="payment-button"
          disabled={!verificationCode || !paiementId}
        >
          Vérifier
        </button>
        {verificationMessage && <div style={{ color: "red", marginTop: 10 }}>{verificationMessage}</div>}
      </form>
    )
  }

  return (
    <form className="payment-form" id="payment-form" onSubmit={handleSubmit}>
      <div className="form-input">
        <label htmlFor="card-number">Numéro de carte</label>
        <input
          type="text"
          id="card-number"
          name="card-number"
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          pattern="(?:\d{4} ?){4}" // Accepte 16 chiffres avec ou sans espaces
          required
          value={cardData.number}
          onChange={handleCardNumberChange}
          onFocus={() => onInputFocus("number")}
        />
      </div>

      <div className="form-input">
        <label htmlFor="card-name">Nom du titulaire</label>
        <input
          type="text"
          id="card-name"
          name="card-name"
          placeholder="John Doe"
          required
          value={cardData.name}
          onChange={handleCardNameChange}
          onFocus={() => onInputFocus("name")}
        />
      </div>

      <div className="form-row">
        <div className="form-group half">
          <div className="form-input">
            <label htmlFor="card-expiry">Date d'expiration</label>
            <input
              type="text"
              id="card-expiry"
              name="card-expiry"
              placeholder="MM/AA"
              maxLength="5"
              pattern="\d\d/\d\d"
              required
              value={cardData.expiry}
              onChange={handleCardExpiryChange}
              onFocus={() => onInputFocus("expiry")}
            />
          </div>
        </div>

        <div className="form-group half">
          <div className="form-input">
            <label htmlFor="card-cvc">CVC</label>
            <input
              type="text"
              id="card-cvc"
              name="card-cvc"
              placeholder="123"
              maxLength="3"
              pattern="\d{3}"
              required
              value={cardData.cvc}
              onChange={handleCardCvcChange}
              onFocus={() => onInputFocus("cvc")}
            />
          </div>
        </div>
      </div>

      <div className="form-input">
        <label htmlFor="card-email">Email</label>
        <input
          type="email"
          id="card-email"
          name="card-email"
          placeholder="Votre email pour recevoir le code"
          required
          value={cardData.email || ""}
          onChange={e => onInputChange("email", e.target.value)}
          onFocus={() => onInputFocus("email")}
          style={{ color: "#000", background: "#f8f9fa" }}
        />
      </div>

      {/* Affichage dynamique du récapitulatif */}
      {selectedZones && selectedZones.length > 0 && (
        <div className="payment-details">
          {selectedZones.map(z => (
            <div className="payment-detail" key={z.id}>
              <span>{z.name} ({z.count} × {z.price} DZD)</span>
              <span>{z.count * z.price} DZD</span>
            </div>
          ))}
          <div className="payment-detail total">
            <span>Total places</span>
            <span>{totalPlaces}</span>
          </div>
          <div className="payment-detail total">
            <span>Total à payer</span>
            <span>{totalPrice} DZD</span>
          </div>
        </div>
      )}

      <button type="submit" className="payment-button">
        Payer maintenant
      </button>
      <div className="secure-payment">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <span>Paiement sécurisé</span>
      </div>
    </form>
  )
}

export default PaymentForm
