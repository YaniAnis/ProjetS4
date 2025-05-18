import "./setting.css"

const SettingSection = ({ icon: Icon, title, children }) => {
  return (
    <div className="setting-section">
      <div className="setting-section-header">
        <span className="setting-section-icon">{typeof Icon === "string" ? Icon : "⚙️"}</span>
        <h2 className="setting-section-title">{title}</h2>
      </div>
      {children}
    </div>
  )
}
export default SettingSection


