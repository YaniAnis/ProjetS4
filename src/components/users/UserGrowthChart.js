const UserGrowthChart = () => {
  const userGrowthData = [
    { month: "Jan", users: 1000 },
    { month: "Feb", users: 1500 },
    { month: "Mar", users: 2000 },
    { month: "Apr", users: 3000 },
    { month: "May", users: 4000 },
    { month: "Jun", users: 5000 },
  ]

  // Trouver la valeur maximale pour l'échelle
  const maxUsers = Math.max(...userGrowthData.map((item) => item.users))

  return (
    <div className="user-growth-chart">
      <h2 className="user-growth-title">User Growth</h2>
      <div className="user-growth-container">
        <div className="static-line-chart">
          <div className="chart-grid">
            {/* Axe Y */}
            <div className="y-axis">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="y-label">
                  {Math.round((maxUsers / 4) * (4 - index))}
                </div>
              ))}
            </div>

            {/* Graphique */}
            <div className="chart-area">
              <div className="line-container">
                {userGrowthData.map((item, index) => (
                  <div
                    key={index}
                    className="data-point"
                    style={{
                      left: `${(index / (userGrowthData.length - 1)) * 100}%`,
                      bottom: `${(item.users / maxUsers) * 100}%`,
                    }}
                  >
                    <div className="point-dot" style={{ backgroundColor: "#8B5CF6" }}></div>
                    {index < userGrowthData.length - 1 && (
                      <div
                        className="line-segment"
                        style={{
                          width: `${100 / (userGrowthData.length - 1)}%`,
                          backgroundColor: "#8B5CF6",
                          transform: `rotate(${Math.atan2(
                            ((userGrowthData[index + 1].users - item.users) / maxUsers) * 100,
                            100 / (userGrowthData.length - 1),
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
              {userGrowthData.map((item, index) => (
                <div
                  key={index}
                  className="x-label"
                  style={{
                    left: `${(index / (userGrowthData.length - 1)) * 100}%`,
                  }}
                >
                  {item.month}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserGrowthChart



