const CategoryDistributionChart = () => {
  // Données pour le graphique
  const categoryData = [
    { name: "MC Alger", value: 4500, color: "#6366F1", percent: "31%" },
    { name: "CR Belouizdad", value: 3200, color: "#8B5CF6", percent: "22%" },
    { name: "JS Kabylie", value: 2800, color: "#EC4899", percent: "19%" },
    { name: "USM Alger", value: 2100, color: "#10B981", percent: "15%" },
    { name: "Paradou AC", value: 1900, color: "#F59E0B", percent: "13%" },
  ]

  return (
    <div className="category-distribution-chart">
      <h2 className="category-distribution-title">Distribution Par Club</h2>
      <div className="category-distribution-container">
        <div className="static-chart">
          <div className="legend-container">
            {categoryData.map((item, index) => (
              <div key={index} className="legend-item">
                <div className="color-box" style={{ backgroundColor: item.color }}></div>
                <div className="legend-text">
                  <span className="legend-name">{item.name}</span>
                  <span className="legend-percent">{item.percent}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="pie-placeholder">
            <div className="pie-circle">
              {categoryData.map((item, index) => (
                <div
                  key={index}
                  className="pie-segment"
                  style={{
                    backgroundColor: item.color,
                    transform: `rotate(${index * 72}deg)`,
                    clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)",
                    opacity: 0.9,
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryDistributionChart


