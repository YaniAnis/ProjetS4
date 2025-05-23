import React from "react"
import CreditCard from "../components/CreditCard"
import PaymentForm from "../components/PayementForm"
import "./PaymentPage.css"
import { QRCodeSVG } from "qrcode.react"

function PaymentPage() {
  const [cardData, setCardData] = React.useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    email: "", // Assurez-vous que PaymentForm gère ce champ
  })

  const [isFlipped, setIsFlipped] = React.useState(false)
  const [focusedField, setFocusedField] = React.useState(null)
  const [showCodeInput, setShowCodeInput] = React.useState(false)
  const [confirmationCode, setConfirmationCode] = React.useState("")
  const [codeSent, setCodeSent] = React.useState(false)
  const [codeConfirmed, setCodeConfirmed] = React.useState(false)
  const [qrValue, setQrValue] = React.useState("")
  const [paiementId, setPaiementId] = React.useState(null)
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [ticketSent, setTicketSent] = React.useState(false)
  const [ticketError, setTicketError] = React.useState("")
  const [confirmError, setConfirmError] = React.useState("")
  // Ajoutez paiementId à l'état pour stocker l'id du paiement reçu après le paiement

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

  // Appelé quand le paiement est validé via PaymentForm
  const handlePayment = async () => {
    setShowCodeInput(true)
    setCodeSent(true)
    try {
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          card_number: cardData.number,
          email: cardData.email,
          // ...autres champs nécessaires...
        }),
      })
      const data = await response.json()
      if (data && data.paiement_id) {
        setPaiementId(data.paiement_id)
        // Générer le QR code dès que le paiement est créé
        const qr = "ticket-" + Date.now()
        setQrValue(qr)
      }
    } catch (err) {
      // Gérer l'erreur
    }
  }

  // Simule la confirmation du code
  const handleConfirmCode = async () => {
    if (
      confirmationCode.trim() !== "" &&
      !isVerifying &&
      !codeConfirmed &&
      paiementId
    ) {
      setIsVerifying(true)
      setConfirmError("")
      try {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paiement_id: paiementId,
            verification_code: confirmationCode,
          }),
        })
        const data = await res.json()
        if (data.success) {
          setCodeConfirmed(true)
          setShowCodeInput(false) // Ajouté : cache le champ code après succès
        } else {
          setConfirmError(data.message || "Code incorrect.")
        }
      } catch (err) {
        setConfirmError("Erreur technique lors de la confirmation.")
      }
      setIsVerifying(false)
    }
  }

  // Nouvelle fonction pour envoyer le ticket par mail
  const handleSendTicket = async () => {
    setTicketError("")
    try {
      const res = await fetch("/api/send-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paiement_id: paiementId,
          qr_value: qrValue,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setTicketSent(true)
      } else {
        setTicketError(data.message || "Erreur lors de l'envoi du ticket.")
      }
    } catch (err) {
      setTicketError("Erreur technique lors de l'envoi du ticket.")
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
            {/* Affiche le formulaire de paiement si le code n'est pas encore confirmé */}
            {!codeConfirmed && (
              <>
                <PaymentForm
                  cardData={cardData}
                  onInputChange={handleInputChange}
                  onInputFocus={handleInputFocus}
                  onPay={handlePayment}
                />
                {showCodeInput && (
                  <div style={{ marginTop: "1rem" }}>
                    <label>
                      Entrez le code reçu par email :
                      <input
                        type="text"
                        value={confirmationCode}
                        onChange={(e) => setConfirmationCode(e.target.value)}
                        style={{ marginLeft: "0.5rem" }}
                        disabled={isVerifying}
                      />
                    </label>
                    <button
                      onClick={handleConfirmCode}
                      style={{ marginLeft: "1rem" }}
                      disabled={isVerifying || codeConfirmed}
                    >
                      Confirmer
                    </button>
                    {confirmError && (
                      <div style={{ color: "red", marginTop: "0.5rem" }}>{confirmError}</div>
                    )}
                  </div>
                )}
              </>
            )}
            {codeConfirmed && (
              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <h2 style={{ marginBottom: "1rem" }}>Paiement confirmé !</h2>
                {!ticketSent ? (
                  <>
                    <button
                      style={{
                        marginTop: "1rem",
                        padding: "10px 24px",
                        background: "#1a472a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "16px",
                        cursor: "pointer"
                      }}
                      onClick={handleSendTicket}
                    >
                      Recevoir le ticket en ligne
                    </button>
                    {ticketError && (
                      <div style={{ color: "red", marginTop: "1rem" }}>{ticketError}</div>
                    )}
                  </>
                ) : (
                  <div style={{ color: "green", marginTop: "1rem" }}>
                    Ticket envoyé par email !
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
