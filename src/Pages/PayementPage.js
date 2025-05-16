
import React from "react"
import CreditCard from "../components/CreditCard"
import PaymentForm from "../components/PayementForm"
import "./PaymentPage.css"

function PaymentPage() {
  const [cardData, setCardData] = React.useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  })

  const [isFlipped, setIsFlipped] = React.useState(false)
  const [focusedField, setFocusedField] = React.useState(null)

  const handleInputChange = (field, value) => {
    setCardData({
      ...cardData,
      [field]: value,
    })
  }

  const handleInputFocus = (field) => {
    setFocusedField(field)
    if (field === "cvc") {
      setIsFlipped(true)
    } else {
      setIsFlipped(false)
    }
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Finaliser votre paiement</h1>
          <p>Veuillez entrer vos informations de carte pour procéder au paiement</p>
        </div>

        <div className="payment-content">
          <div className="card-preview">
            <CreditCard cardData={cardData} isFlipped={isFlipped} focusedField={focusedField} />
          </div>

          <div className="payment-form-container">
            <PaymentForm cardData={cardData} onInputChange={handleInputChange} onInputFocus={handleInputFocus} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
