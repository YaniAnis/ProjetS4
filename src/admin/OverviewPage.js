import CategoryDistributionChart from "../components/overview/CategoryDistributionChart"
import SalesOverviewChart from "../components/overview/SalesOverviewChart"
import SalesChannelChart from "../components/overview/SalesChannelChart"
import "./Pages.css"

const OverviewPage = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Tableau de Bord</h1>
        <div className="admin-page-actions">
          <select className="admin-page-select">
            <option value="all-time">Tout le temps</option>
            <option value="this-year">Cette année</option>
            <option value="this-month">Ce mois</option>
            <option value="this-week">Cette semaine</option>
          </select>
        </div>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-card-content">
            <h3 className="admin-stat-card-title">Ventes Totales</h3>
            <p className="admin-stat-card-value">132,500 DA</p>
            <p className="admin-stat-card-change positive">+12.5% depuis le mois dernier</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-content">
            <h3 className="admin-stat-card-title">Billets Vendus</h3>
            <p className="admin-stat-card-value">1,245</p>
            <p className="admin-stat-card-change positive">+8.3% depuis le mois dernier</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-content">
            <h3 className="admin-stat-card-title">Matchs Programmés</h3>
            <p className="admin-stat-card-value">18</p>
            <p className="admin-stat-card-change positive">+3 depuis le mois dernier</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card-content">
            <h3 className="admin-stat-card-title">Taux de Conversion</h3>
            <p className="admin-stat-card-value">3.2%</p>
            <p className="admin-stat-card-change negative">-0.5% depuis le mois dernier</p>
          </div>
        </div>
      </div>

      <div className="admin-charts-grid">
        <div className="admin-chart-container">
          <SalesOverviewChart />
        </div>
        <div className="admin-chart-container">
          <CategoryDistributionChart />
        </div>
        <div className="admin-chart-container">
          <SalesChannelChart />
        </div>
      </div>
    </div>
  )
}

export default OverviewPage

