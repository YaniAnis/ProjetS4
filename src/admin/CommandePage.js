import DailyOrders from "../components/orders/DailyOrders"
import OrderDistribution from "../components/orders/OrderDistribution"
import OrdersTable from "../components/orders/OrdersTable"
import "./Pages.css"

const CommandePage = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestion des Commandes</h1>
        <div className="admin-page-actions">
          <button className="admin-page-button">Nouvelle Commande</button>
        </div>
      </div>

      <div className="admin-charts-grid">
        <div className="admin-chart-container">
          <DailyOrders />
        </div>
        <div className="admin-chart-container">
          <OrderDistribution />
        </div>
      </div>

      <div className="admin-table-container">
        <OrdersTable />
      </div>
    </div>
  )
}

export default CommandePage


