const SalesOverviewChart = () => {
  // Données pour le graphique
  const salesData = [
    { name: "Jan", sales: 4200 },
    { name: "Fév", sales: 3800 },
    { name: "Mar", sales: 5100 },
    { name: "Avr", sales: 4600 },
    { name: "Mai", sales: 5400 },
    { name: "Juin", sales: 7200 },
    { name: "Juil", sales: 6100 },
    { name: "Août", sales: 5900 },
    { name: "Sep", sales: 6800 },
    { name: "Oct", sales: 6300 },
    { name: "Nov", sales: 7100 },
    { name: "Déc", sales: 7500 },
  ]

  // Trouver la valeur maximale pour l'échelle
  const maxSales = Math.max(...salesData.map((item) => item.sales))

  return (
    <div className="sales-overview-chart">
      <h2 className="sales-overview-title">Aperçu des Ventes</h2>
      <div className="sales-overview-container">
        <div className="static-line-chart">
          <div className="chart-grid">
            {/* Axe Y */}
            <div className="y-axis">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="y-label">
                  {Math.round((maxSales / 4) * (4 - index))}
                </div>
              ))}
            </div>

            {/* Graphique */}
            <div className="chart-area">
              <div className="line-container">
                {salesData.map((item, index) => (
                  <div
                    key={index}
                    className="data-point"
                    style={{
                      left: `${(index / (salesData.length - 1)) * 100}%`,
                      bottom: `${(item.sales / maxSales) * 100}%`,
                    }}
                  >
                    <div className="point-dot"></div>
                    {index < salesData.length - 1 && (
                      <div
                        className="line-segment"
                        style={{
                          width: `${100 / (salesData.length - 1)}%`,
                          transform: `rotate(${Math.atan2(
                            ((salesData[index + 1].sales - item.sales) / maxSales) * 100,
                            100 / (salesData.length - 1),
                          )}rad)`,
                          transformOrigin: "left center",
                        }}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Axe X */}
            <div className="x-axis">
              {salesData.map((item, index) => (
                <div
                  key={index}
                  className="x-label"
                  style={{
                    left: `${(index / (salesData.length - 1)) * 100}%`,
                  }}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SalesOverviewChart

