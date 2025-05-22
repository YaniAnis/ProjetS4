"use client"

import { Outlet } from "react-router-dom"
import Sidebar from "./common/Sidebar"
import "./AdminLayout.css"

function AdminLayout() {
  // Suppression de toute logique de redirection/contrôle d'accès
  return (
    <div className="admin-layout" style={{ background: "#181f2a", minHeight: "100vh" }}>
      <Sidebar />
      <main className="admin-content" style={{ background: "transparent", flex: 1 }}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout

