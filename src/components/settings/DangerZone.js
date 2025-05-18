import "./setting.css"

const DangerZone = () => {
  return (
    <div className="danger-zone">
      <div className="danger-zone-header">
        <span className="danger-zone-icon">🗑️</span>
        <h2 className="danger-zone-title">Danger Zone</h2>
      </div>
      <p className="danger-zone-description">Supprimez définitivement votre compte et tout votre contenu.</p>
      <button className="danger-zone-button">Supprimer le Compte</button>
    </div>
  )
}
export default DangerZone

