import "./Pages.css"

// Composants simplifiés pour éviter les problèmes d'importation
const Header = ({ title }) => (
  <div className="admin-header">
    <h1>{title}</h1>
  </div>
)

const StatCard = ({ name, icon: Icon, value, color }) => (
  <div className="stat-card" style={{ borderTop: `3px solid ${color}` }}>
    <div className="stat-icon" style={{ backgroundColor: `${color}20`, color }}>
      {typeof Icon === "function" ? (
        <Icon />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      )}
    </div>
    <div className="stat-content">
      <h3 className="stat-name">{name}</h3>
      <p className="stat-value">{value}</p>
    </div>
  </div>
)

const SalesOverviewChart = () => (
  <div className="chart-container">
    <h2>Aperçu des ventes</h2>
    <div className="chart-placeholder">Graphique d'aperçu des ventes</div>
  </div>
)

const SalesByCategoryChart = () => (
  <div className="chart-container">
    <h2>Ventes par catégorie</h2>
    <div className="chart-placeholder">Graphique des ventes par catégorie</div>
  </div>
)

const DailySalesTrend = () => (
  <div className="chart-container">
    <h2>Tendance des ventes quotidiennes</h2>
    <div className="chart-placeholder">Graphique des tendances de ventes quotidiennes</div>
  </div>
)

const salesStats = {
  totalRevenue: "$1,234,567",
  averageOrderValue: "$78.90",
  conversionRate: "3.45%",
  salesGrowth: "12.3%",
}

const VentesPage = () => {
  return (
    <div className="sales-page">
      <Header title="Ventes" />

      <main className="sales-main">
        {/* SALES STATS */}
        <div className="sales-stats-grid">
          <StatCard
            name="Total Revenue"
            value={salesStats.totalRevenue}
            color="#6366F1"
            icon={() => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            )}
          />
          <StatCard
            name="Avg. Order Value"
            value={salesStats.averageOrderValue}
            color="#10B981"
            icon={() => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            )}
          />
          <StatCard
            name="Conversion Rate"
            value={salesStats.conversionRate}
            color="#F59E0B"
            icon={() => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
            )}
          />
          <StatCard
            name="Sales Growth"
            value={salesStats.salesGrowth}
            color="#EF4444"
            icon={() => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
            )}
          />
        </div>

        <SalesOverviewChart />

        <div className="sales-charts-grid">
          <SalesByCategoryChart />
          <DailySalesTrend />
        </div>
      </main>
    </div>
  )
}
export default VentesPage
