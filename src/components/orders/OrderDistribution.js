import "./Order.css"

const OrderDistribution = () => {
  // Données fictives pour le graphique
  const orderStatusData = [
    { name: "Pending", value: 30, color: "#FF6B6B" },
    { name: "Processing", value: 45, color: "#4ECDC4" },
    { name: "Shipped", value: 60, color: "#45B7D1" },
    { name: "Delivered", value: 120, color: "#FED766" },
  ]

  // Calculer le total pour les pourcentages
  const total = orderStatusData.reduce((sum, item) => sum + item.value, 0)

  // Calculer les angles pour le graphique circulaire
  let startAngle = 0
  const segments = orderStatusData.map((item) => {
    const percentage = (item.value / total) * 100
    const angle = (percentage / 100) * 360
    const segment = {
      ...item,
      percentage,
      startAngle,
      endAngle: startAngle + angle,
    }
    startAngle += angle
    return segment
  })

  return (
    <div className="order-distribution">
      <h2 className="order-distribution-title">Order Status Distribution</h2>
      <div style={{ width: "100%", height: 300 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            color: "#f3f4f6",
          }}
        >
          <div style={{ marginBottom: "20px", fontSize: "18px" }}>Distribution des statuts de commande</div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "200px",
              height: "200px",
              position: "relative",
              marginBottom: "20px",
            }}
          >
            {/* Graphique circulaire SVG */}
            <svg width="200" height="200" viewBox="0 0 100 100">
              {segments.map((segment, index) => {
                // Convertir les angles en coordonnées pour l'arc SVG
                const startAngleRad = (segment.startAngle - 90) * (Math.PI / 180)
                const endAngleRad = (segment.endAngle - 90) * (Math.PI / 180)

                const x1 = 50 + 40 * Math.cos(startAngleRad)
                const y1 = 50 + 40 * Math.sin(startAngleRad)
                const x2 = 50 + 40 * Math.cos(endAngleRad)
                const y2 = 50 + 40 * Math.sin(endAngleRad)

                // Déterminer si l'arc est grand (plus de 180 degrés)
                const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0

                return (
                  <path
                    key={index}
                    d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={segment.color}
                  />
                )
              })}
              {/* Cercle central pour créer l'effet donut */}
              <circle cx="50" cy="50" r="20" fill="rgba(31, 41, 55, 0.8)" />
            </svg>
          </div>

          {/* Légende */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "10px",
              width: "100%",
            }}
          >
            {segments.map((segment, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginRight: "15px",
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: segment.color,
                    marginRight: "5px",
                  }}
                ></div>
                <span style={{ fontSize: "12px" }}>
                  {segment.name} ({segment.percentage.toFixed(0)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDistribution

