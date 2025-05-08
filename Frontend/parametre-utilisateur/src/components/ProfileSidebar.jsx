"use client"

function ProfileSidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "personal", label: "Informations personnelles", icon: "user" },
    { id: "security", label: "Sécurité", icon: "shield" },
    { id: "notifications", label: "Notifications", icon: "bell" },
    { id: "privacy", label: "Confidentialité", icon: "lock" },
    { id: "delete", label: "Supprimer le compte", icon: "trash" },
  ]

  return (
    <div className="profile-settings-sidebar">
      <ul className="profile-settings-tabs">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            className={`profile-settings-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={`tab-icon ${tab.icon}`}></span>
            {tab.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ProfileSidebar
