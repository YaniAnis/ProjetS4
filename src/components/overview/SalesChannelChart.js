const SalesChannelChart = () => {
  // Données pour le graphique
  const SALES_CHANNEL_DATA = [
    { name: "MC Alger", value: 45600, color: "#6366F1" },
    { name: "CR Belouizdad", value: 38200, color: "#8B5CF6" },
    { name: "JS Kabylie", value: 29800, color: "#EC4899" },
    { name: "USM Alger", value: 18700, color: "#10B981" },
  ]

  // Trouver la valeur maximale pour l'échelle
  const maxValue = Math.max(...SALES_CHANNEL_DATA.map((item) => item.value))

  return (
    <div className="sales-channel-chart">
      <h2 className="sales-channel-title">Vente par Club</h2>
      <div className="sales-channel-container">
        <div className="static-bar-chart">
          <div className="bars-container">
            {SALES_CHANNEL_DATA.map((item, index) => (
              <div key={index} className="bar-item">
                <div
                  className="bar"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color,
                  }}
                >
                  <span className="bar-value">{item.value}</span>
                </div>
                <div className="bar-label">{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesChannelChart


