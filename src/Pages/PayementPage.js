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
    email: "",
  })

  const [isFlipped, setIsFlipped] = React.useState(false)
  const [focusedField, setFocusedField] = React.useState(null)
  const [showCodeInput, setShowCodeInput] = React.useState(false)
  const [confirmationCode, setConfirmationCode] = React.useState("")
  const [codeSent, setCodeSent] = React.useState(false)
  const [codeConfirmed, setCodeConfirmed] = React.useState(false)
  const [paiementId, setPaiementId] = React.useState(null)
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [ticketSent, setTicketSent] = React.useState(false)
  const [ticketError, setTicketError] = React.useState("")
  const [confirmError, setConfirmError] = React.useState("")
  // Supprimé : toute la logique liée aux sections et à la sélection de places

  // idée de structure pour les données de section, si jamais nécessaire à l'avenir
  // const sections = [
  //   { id: "A", name: "Zone A", category: "Standard", basePrice: 20, available: 10 },
  //   { id: "B", name: "Zone B", category: "VIP", basePrice: 40, available: 5 },
  //   { id: "C", name: "Zone C", category: "Standard", basePrice: 15, available: 8 }
  // ]

  // Stocke le nombre de places sélectionnées par section : { [sectionId]: count }
  // const [selectedCounts, setSelectedCounts] = React.useState(
  //   sections.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {})
  // )
  // const [seatError, setSeatError] = React.useState("")

  // Calcul du total sélectionné
  // const totalSelected = Object.values(selectedCounts).reduce((sum, v) => sum + v, 0)

  // Ajout : récupération des zones sélectionnées depuis location.state
  const location = window.location || {}
  const navState = location.state || (window.history && window.history.state && window.history.state.usr) || {}
  const selectedZones = navState.selectedZones || []
  const match_id = navState.match_id // <-- Ajouté

  // Calcul du total des places et du prix total
  const totalPlaces = selectedZones.reduce((sum, z) => sum + (z.count || 0), 0)
  const totalPrice = selectedZones.reduce((sum, z) => sum + (z.count || 0) * (z.price || 0), 0)

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
          selectedZones, // on envoie la sélection au backend si besoin
          totalPlaces,
          totalPrice,
          match_id // <-- Ajouté ici pour garantir l'envoi au backend
          // ...autres champs nécessaires...
        }),
      })
      const data = await response.json()
      if (data && data.paiement_id) {
        setPaiementId(data.paiement_id)
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
        // AJOUT : Vérification du nombre de billets déjà achetés avant de confirmer le paiement
        let user = null
        const userStr = localStorage.getItem("user")
        if (userStr && userStr !== "undefined" && userStr !== "null") {
          user = JSON.parse(userStr)
        }
        const matchId = match_id
        if (user && user.id && matchId) {
          // Appel API pour vérifier le nombre de billets déjà achetés
          const countRes = await fetch(`/api/user-tickets-count?user_id=${user.id}&match_id=${matchId}`)
          const countData = await countRes.json()
          const billetsDejaAchetes = Number(countData.count) || 0
          const placesVoulu = totalPlaces
          if (billetsDejaAchetes + placesVoulu > 4) {
            setConfirmError("Limite de 4 billets atteinte pour ce match. Vous ne pouvez pas acheter plus de billets.")
            setIsVerifying(false)
            return
          }
        }
        // ...suite logique normale...
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
      // Pour compatibilité backend, il faut envoyer aussi un qr_value (dummy si non utilisé)
      const res = await fetch("/api/send-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paiement_id: paiementId,
          qr_value: paiementId ? String(paiementId) : "qr" // valeur factice si non utilisée
        }),
      })
      const data = await res.json()
      if (data.success) {
        setTicketSent(true)
        // AJOUT : Mettre à jour le nombre de billets achetés dans localStorage
        try {
          let user = null
          const userStr = localStorage.getItem("user")
          if (userStr && userStr !== "undefined" && userStr !== "null") {
            user = JSON.parse(userStr)
          }
          const matchId = match_id
          const placesAchetees = totalPlaces
          if (user && user.email && matchId && placesAchetees > 0) {
            const ticketKey = `tickets_${user.email}_${matchId}`
            const current = localStorage.getItem(ticketKey)
            let total = current ? Number(current) : 0
            if (isNaN(total)) total = 0
            total += placesAchetees
            if (total > 4) total = 4
            localStorage.setItem(ticketKey, total)
            // Force le rafraîchissement des autres composants qui écoutent 'storage'
            window.dispatchEvent(new Event('storage'))
          }
        } catch (e) {
          // ignore erreur stockage
        }
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
                  selectedZones={selectedZones}
                  totalPlaces={totalPlaces}
                  totalPrice={totalPrice}
                />
                {/* Affichage du récapitulatif juste après avoir cliqué sur "Payer" */}
                {showCodeInput && (
                  <>
                    <div style={{ margin: "16px 0", padding: 12, background: "#f6f6f6", borderRadius: 8 }}>
                      <div>
                        <b>Résumé de votre sélection :</b>
                      </div>
                      <ul style={{ margin: "8px 0 0 0", padding: 0, listStyle: "none" }}>
                        {selectedZones.map(z => (
                          <li key={z.id} style={{ fontSize: "0.98em" }}>
                            {z.name} : {z.count} × {z.price} DZD = <b>{z.count * z.price} DZD</b>
                          </li>
                        ))}
                      </ul>
                      <div style={{ marginTop: 8, fontWeight: 600 }}>
                        Total places : <span style={{ color: "#1a472a" }}>{totalPlaces}</span>
                        {" | "}
                        Total à payer : <span style={{ color: "#1a472a" }}>{totalPrice} DZD</span>
                      </div>
                    </div>
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
                  </>
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
