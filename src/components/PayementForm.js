"use client"
import "./styles/PaymentForm.css"

function PaymentForm({ cardData, onInputChange, onInputFocus }) {
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

  const validateForm = () => {
    let isValid = true

    // Card number validation
    if (!/^(\d{4}\s){3}\d{4}$/.test(cardData.number)) {
      isValid = false
      highlightError(document.getElementById("card-number"))
    }

    // Name validation
    if (cardData.name.trim().length < 3) {
      isValid = false
      highlightError(document.getElementById("card-name"))
    }

    // Expiry validation
    if (!/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
      isValid = false
      highlightError(document.getElementById("card-expiry"))
    } else {
      // Check if date is valid and not expired
      const [month, year] = cardData.expiry.split("/")
      const expiryDate = new Date("20" + year, month - 1)
      const currentDate = new Date()

      if (expiryDate < currentDate) {
        isValid = false
        highlightError(document.getElementById("card-expiry"))
      }
    }

    // CVC validation
    if (!/^\d{3}$/.test(cardData.cvc)) {
      isValid = false
      highlightError(document.getElementById("card-cvc"))
    }

    return isValid
  }

  const highlightError = (inputElement) => {
    inputElement.style.borderColor = "#dc3545"
    inputElement.style.boxShadow = "0 0 0 3px rgba(220, 53, 69, 0.25)"

    // Remove error styling after 3 seconds
    setTimeout(() => {
      inputElement.style.borderColor = ""
      inputElement.style.boxShadow = ""
    }, 3000)
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!validateForm()) {
      return;
    }

    // Show success message
    alert("Paiement traité avec succès!");

    // Reset form
    onInputChange("number", "");
    onInputChange("name", "");
    onInputChange("expiry", "");
    onInputChange("cvc", "");
    e.target.reset();
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
          pattern="[\d| ]{16,22}"
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

      <div className="payment-details">
        <div className="payment-detail">
          <span>prix-billet</span>
          <span >89,99 €</span>
        </div>
        <div className="payment-detail">
          <span>nombre</span>
          <span>2</span>
        </div>
        <div className="payment-detail total">
          <span>Total</span>
          <span>107,99 €</span>
        </div>
      </div>

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
