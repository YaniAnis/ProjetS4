import "./Order.css"

const DailyOrders = () => {
  // Données fictives pour le graphique
  const dailyOrdersData = [
    { date: "07/01", orders: 45 },
    { date: "07/02", orders: 52 },
    { date: "07/03", orders: 49 },
    { date: "07/04", orders: 60 },
    { date: "07/05", orders: 55 },
    { date: "07/06", orders: 58 },
    { date: "07/07", orders: 62 },
  ]

  return (
    <div className="daily-orders">
      <h2 className="daily-orders-title">Daily Orders</h2>

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
          <div style={{ marginBottom: "20px", fontSize: "18px" }}>Commandes quotidiennes</div>
          <div
            style={{
              width: "80%",
              height: "150px",
              position: "relative",
              marginBottom: "20px",
            }}
          >
            {/* Simulation d'un graphique linéaire */}
            <div
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "100%",
                height: "1px",
                backgroundColor: "#4B5563",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                left: "0",
                bottom: "0",
                width: "1px",
                height: "100%",
                backgroundColor: "#4B5563",
              }}
            ></div>

            {/* Points de données */}
            {dailyOrdersData.map((data, index) => {
              const xPosition = (index / (dailyOrdersData.length - 1)) * 100 + "%"
              const yPosition = 100 - ((data.orders - 40) / 25) * 100 + "%"

              return (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    bottom: yPosition,
                    left: xPosition,
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#8B5CF6",
                    borderRadius: "50%",
                    transform: "translate(-50%, 50%)",
                  }}
                  title={`${data.date}: ${data.orders} commandes`}
                ></div>
              )
            })}

            {/* Lignes entre les points */}
            <svg
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "100%",
                height: "100%",
                overflow: "visible",
              }}
            >
              <polyline
                points={dailyOrdersData
                  .map((data, index) => {
                    const x = (index / (dailyOrdersData.length - 1)) * 100
                    const y = 100 - ((data.orders - 40) / 25) * 100
                    return `${x},${y}`
                  })
                  .join(" ")}
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
            </svg>
          </div>

          {/* Légende des dates */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "80%",
              color: "#9CA3AF",
              fontSize: "12px",
            }}
          >
            {dailyOrdersData.map((data, index) => (
              <div key={index}>{data.date}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DailyOrders


