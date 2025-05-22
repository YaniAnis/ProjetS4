"use client";
import { useEffect, useState } from "react";

function ProfileSidebar({ activeTab, setActiveTab }) {
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
    // Always fetch latest info from backend
    let token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch("http://localhost:8000/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      // credentials: "include", // Remove unless your backend requires cookies
    })
      .then(async (res) => {
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setUser({
          name: data.name || "",
          email: data.email || "",
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
    <aside className="profile-settings-sidebar">
      <div
        style={{
          padding: "1.5rem 1.5rem 0.5rem 1.5rem",
          borderBottom: "1px solid #e9ecef",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: "1.1rem",
            color: "#1a472a",
            textTransform: "lowercase",
          }}
        >
          {loading
            ? "Chargement..."
            : user.name
              ? user.name
              : ""}
        </div>
        <div
          style={{
            fontSize: "0.95rem",
            color: "#495057",
            opacity: 0.85,
          }}
        >
          {loading
            ? ""
            : user.email
              ? user.email
              : ""}
        </div>
      </div>
      <ul className="profile-settings-tabs">
        <li
          className={`profile-settings-tab${
            activeTab === "personal" ? " active" : ""
          }`}
          onClick={() => setActiveTab("personal")}
        >
          <span className="tab-icon user"></span> Informations personnelles
        </li>
        <li
          className={`profile-settings-tab${
            activeTab === "security" ? " active" : ""
          }`}
          onClick={() => setActiveTab("security")}
        >
          <span className="tab-icon shield"></span> Sécurité
        </li>
        <li
          className={`profile-settings-tab${
            activeTab === "notifications" ? " active" : ""
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          <span className="tab-icon bell"></span> Notifications
        </li>
        <li
          className={`profile-settings-tab${
            activeTab === "privacy" ? " active" : ""
          }`}
          onClick={() => setActiveTab("privacy")}
        >
          <span className="tab-icon lock"></span> Confidentialité
        </li>
        <li
          className={`profile-settings-tab${
            activeTab === "delete" ? " active" : ""
          }`}
          onClick={() => setActiveTab("delete")}
        >
          <span className="tab-icon trash"></span> Supprimer le compte
        </li>
      </ul>
    </aside>
  );
}

export default ProfileSidebar;