"use client"
import FormInput from "./FormInput"
import "./PaymentForm.css"

const PaymentForm = ({ cardDetails, handleInputChange, handleInputFocus }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Paiement traité avec succès!")
  }

  return (
    <div className="payment-form-container">
      <form className="payment-form" onSubmit={handleSubmit}>
        <FormInput
          label="Numéro de carte"
          type="text"
          name="number"
          placeholder="1234 5678 9012 3456"
          value={cardDetails.number}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          maxLength="19"
          pattern="[\d| ]{16,22}"
          format={(value) => {
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
          }}
          required
        />

        <FormInput
          label="Nom du titulaire"
          type="text"
          name="name"
          placeholder="John Doe"
          value={cardDetails.name}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          required
        />

        <div className="form-row">
          <div className="form-group half">
            <FormInput
              label="Date d'expiration"
              type="text"
              name="expiry"
              placeholder="MM/AA"
              value={cardDetails.expiry}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              maxLength="5"
              pattern="\d\d/\d\d"
              format={(value) => {
                const v = value.replace(/[^0-9]/g, "")

                if (v.length >= 3) {
                  return `${v.slice(0, 2)}/${v.slice(2, 4)}`
                }

                return v
              }}
              required
            />
          </div>

          <div className="form-group half">
            <FormInput
              label="CVC"
              type="text"
              name="cvc"
              placeholder="123"
              value={cardDetails.cvc}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              maxLength="3"
              pattern="\d{3}"
              required
            />
          </div>
        </div>

        <div className="payment-details">
          <div className="payment-detail">
            <span>Sous-total</span>
            <span>89,99 €</span>
          </div>
          <div className="payment-detail">
            <span>TVA (20%)</span>
            <span>18,00 €</span>
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
    </div>
  )
}

export default PaymentForm
