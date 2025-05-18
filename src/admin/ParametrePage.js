import Profile from "../components/settings/Profile"
import Security from "../components/settings/Security"
import DangerZone from "../components/settings/DangerZone"
import "./Pages.css"

const ParametrePage = () => {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Paramètres</h1>
      </div>

      <div className="admin-settings-container">
        <Profile />
        <Security />
        <DangerZone />
      </div>
    </div>
  )
}

export default ParametrePage

