import React, { useEffect, useState } from "react";
import "./profile-settings.css";

function ProfileSettingsPage() {
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get user info from localStorage first for instant display
    const localUser = localStorage.getItem("userInfo") || localStorage.getItem("user");
    if (localUser) {
      try {
        const parsed = JSON.parse(localUser);
        setUser({
          name: parsed.name || "",
          email: parsed.email || "",
        });
      } catch {}
    }
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("http://localhost:8000/api/user", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    })
      .then(async res => {
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setUser({
          name: data.name || "",
          email: data.email || ""
        });
        // Also update localStorage for next time
        localStorage.setItem("userInfo", JSON.stringify({ name: data.name, email: data.email }));
        setLoading(false);
      })
      .catch(() => {
        setUser({ name: "", email: "" });
        setLoading(false);
      });
  }, []);

  return (
    <div className="profile-settings-container" style={{ marginBottom: "64px" }}>
      <div className="profile-header">
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            {/* Avatar image or placeholder */}
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&size=100`} alt="Avatar" />
          </div>
        </div>
        <div className="profile-info">
          <h1>Paramètres du profil</h1>
          <p>Gérez vos informations personnelles, sécurité et préférences.</p>
          <div style={{ marginTop: "1rem", color: "#fff", fontWeight: 500 }}>
            {loading
              ? "Chargement..."
              : (user.name && user.email)
                ? (<>{user.name}<br />{user.email}</>)
                : (<>{user.name || ""}{user.name && <br />}{user.email || ""}</>)
            }
          </div>
        </div>
      </div>
      <div className="profile-settings-content">
        <aside className="profile-settings-sidebar">
          <ul className="profile-settings-tabs">
            <li className="profile-settings-tab active">
              <span className="tab-icon user"></span> Informations personnelles
            </li>
            <li className="profile-settings-tab">
              <span className="tab-icon shield"></span> Sécurité
            </li>
            <li className="profile-settings-tab">
              <span className="tab-icon bell"></span> Notifications
            </li>
            <li className="profile-settings-tab">
              <span className="tab-icon lock"></span> Confidentialité
            </li>
            <li className="profile-settings-tab">
              <span className="tab-icon trash"></span> Supprimer le compte
            </li>
          </ul>
        </aside>
        <main className="profile-settings-main">
          <div className="settings-section">
            <div className="settings-header">
              <h2>Informations personnelles</h2>
            </div>
            {loading ? (
              <div>Chargement...</div>
            ) : (
              <form>
                <div>
                  <label>Nom</label>
                  <input type="text" value={user.name} disabled />
                </div>
                <div>
                  <label>Email</label>
                  <input type="email" value={user.email} disabled />
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ProfileSettingsPage;