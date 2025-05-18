import UserGrowthChart from "../components/users/UserGrowthChart"
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

const UserActivityHeatmapComponent = () => (
  <div className="chart-container">
    <h2>Activité des utilisateurs</h2>
    <div className="chart-placeholder">Carte thermique d'activité des utilisateurs</div>
  </div>
)

const UserDemographicsChartComponent = () => (
  <div className="chart-container">
    <h2>Démographie des utilisateurs</h2>
    <div className="chart-placeholder">Graphique démographique des utilisateurs</div>
  </div>
)

const userStats = {
  totalUsers: 152845,
  newUsersToday: 243,
  activeUsers: 98520,
  churnRate: "2.4%",
}

// Définition d'un composant UsersTable intégré directement dans ce fichier
// pour éviter les problèmes d'importation
const InlineUsersTable = () => {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active" },
    { id: 3, name: "Robert Johnson", email: "robert@example.com", role: "Editor", status: "Inactive" },
    { id: 4, name: "Emily Davis", email: "emily@example.com", role: "User", status: "Active" },
    { id: 5, name: "Michael Wilson", email: "michael@example.com", role: "User", status: "Pending" },
  ]

  return (
    <div className="users-table">
      <div className="users-table-header">
        <h2 className="users-table-title">Utilisateurs</h2>
        <div className="users-table-search">
          <input type="text" placeholder="Rechercher un utilisateur..." className="users-table-search-input" />
          <span className="users-table-search-icon">🔍</span>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table-content">
          <thead>
            <tr>
              <th className="users-table-header-cell">Nom</th>
              <th className="users-table-header-cell">Email</th>
              <th className="users-table-header-cell">Rôle</th>
              <th className="users-table-header-cell">Statut</th>
              <th className="users-table-header-cell">Actions</th>
            </tr>
          </thead>

          <tbody className="users-table-body">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="users-table-cell">
                  <div className="users-table-cell-content">
                    <div className="users-table-avatar">
                      <div className="users-table-avatar-placeholder">{user.name.charAt(0)}</div>
                    </div>
                    <div className="users-table-name">{user.name}</div>
                  </div>
                </td>

                <td className="users-table-cell">{user.email}</td>
                <td className="users-table-cell">
                  <span className="users-table-role">{user.role}</span>
                </td>

                <td className="users-table-cell">
                  <span
                    className={`users-table-status ${
                      user.status === "Active" ? "users-table-status-active" : "users-table-status-inactive"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="users-table-cell">
                  <button className="users-table-action-edit">Edit</button>
                  <button className="users-table-action-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const UtilisateurPage = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestion des Utilisateurs</h1>
        <div className="admin-page-actions">
          <button className="admin-page-button">Nouvel Utilisateur</button>
        </div>
      </div>

      <div className="admin-charts-grid">
        <div className="admin-chart-container">
          <UserGrowthChart />
        </div>
        <div className="admin-chart-container">
          <UserDemographicsChartComponent />
        </div>
      </div>

      <div className="admin-chart-container full-width">
        <UserActivityHeatmapComponent />
      </div>

      <div className="admin-table-container">
        <InlineUsersTable />
      </div>
    </div>
  )
}

export default UtilisateurPage




