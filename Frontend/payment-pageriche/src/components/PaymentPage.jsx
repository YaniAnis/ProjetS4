"use client"

import React from "react"
import PaymentForm from "./PaymentForm"
import CreditCardDisplay from "./CreditCardDisplay"
import "./PaymentPage.css"

const PaymentPage = () => {
  const [cardDetails, setCardDetails] = React.useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    focus: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleInputFocus = (e) => {
    setCardDetails((prev) => ({
      ...prev,
      focus: e.target.name,
    }))
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
            <CreditCardDisplay
              number={cardDetails.number}
              name={cardDetails.name}
              expiry={cardDetails.expiry}
              cvc={cardDetails.cvc}
              focused={cardDetails.focus}
            />
          </div>

          <PaymentForm
            cardDetails={cardDetails}
            handleInputChange={handleInputChange}
            handleInputFocus={handleInputFocus}
          />
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
