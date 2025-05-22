"use client"

import { Outlet, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Sidebar from "./common/Sidebar"
import "./AdminLayout.css"

function AdminLayout() {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement du composant
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const role = localStorage.getItem("userRole") || ""
    setIsLoggedIn(loggedIn)
    setUserRole(role)
    if (!loggedIn || role !== "admin") {
      navigate("/login")
    }
  }, [navigate])

  if (!isLoggedIn || userRole !== "admin") {
    return <div className="loading">Redirection...</div>
  }

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

