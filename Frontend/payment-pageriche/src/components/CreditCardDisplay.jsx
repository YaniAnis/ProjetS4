import "./CreditCardDisplay.css"

const CreditCardDisplay = ({ number, name, expiry, cvc, focused }) => {
  const cardNumber = number || "•••• •••• •••• ••••"
  const cardName = name || "NOM DU TITULAIRE"
  const cardExpiry = expiry || "MM/AA"

  return (
    <div className={`credit-card ${focused === "cvc" ? "flipped" : ""}`}>
      <div className="credit-card-inner">
        <div className="credit-card-front">
          <div className="card-background"></div>
          <div className="card-chip"></div>
          <div className="card-data">
            <div className={`card-number ${focused === "number" ? "focused" : ""}`}>{cardNumber}</div>
            <div className="card-info">
              <div className={`card-holder ${focused === "name" ? "focused" : ""}`}>
                <div className="card-holder-label">Titulaire</div>
                <div className="card-holder-name">{cardName}</div>
              </div>
              <div className={`card-expiry ${focused === "expiry" ? "focused" : ""}`}>
                <div className="card-expiry-label">Expire</div>
                <div className="card-expiry-date">{cardExpiry}</div>
              </div>
            </div>
          </div>
          <div className="card-brand">
            <div className="card-brand-circle"></div>
            <div className="card-brand-circle"></div>
          </div>
        </div>
        <div className="credit-card-back">
          <div className="card-background"></div>
          <div className="card-stripe"></div>
          <div className={`card-cvc ${focused === "cvc" ? "focused" : ""}`}>
            <div className="card-cvc-label">CVC</div>
            <div className="card-cvc-value">{cvc || "•••"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditCardDisplay
