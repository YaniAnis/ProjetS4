import "../styles/CreditCard.css"

function CreditCard({ cardData, isFlipped, focusedField }) {
  return (
    <div className={`credit-card ${isFlipped ? "flipped" : ""}`}>
      <div className="credit-card-inner">
        <div className="credit-card-front">
          <div className="card-background"></div>
          <div className="card-chip"></div>
          <div className="card-data">
            <div className={`card-number ${focusedField === "number" ? "focused" : ""}`} id="card-number-display">
              {cardData.number || "•••• •••• •••• ••••"}
            </div>
            <div className="card-info">
              <div className="card-holder">
                <div className="card-holder-label">Titulaire</div>
                <div className={`card-holder-name ${focusedField === "name" ? "focused" : ""}`} id="card-name-display">
                  {cardData.name || "NOM DU TITULAIRE"}
                </div>
              </div>
              <div className="card-expiry">
                <div className="card-expiry-label">Expire</div>
                <div
                  className={`card-expiry-date ${focusedField === "expiry" ? "focused" : ""}`}
                  id="card-expiry-display"
                >
                  {cardData.expiry || "MM/AA"}
                </div>
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
          <div className={`card-cvc ${focusedField === "cvc" ? "focused" : ""}`}>
            <div className="card-cvc-label">CVC</div>
            <div className="card-cvc-value" id="card-cvc-display">
              {cardData.cvc || "•••"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreditCard
