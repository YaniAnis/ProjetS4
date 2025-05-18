"use client"

import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Calendar, CreditCard, Home, Menu, Settings, ShoppingBag, Users, X } from "lucide-react"
import "./Common.css"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [activeSubmenu, setActiveSubmenu] = useState(null)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const toggleSubmenu = (submenu) => {
    setActiveSubmenu(activeSubmenu === submenu ? null : submenu)
  }

  const menuItems = [
    {
      title: "Tableau de Bord",
      icon: <Home size={20} />,
      path: "/admin/overview",
    },
    {
      title: "Matchs",
      icon: <Calendar size={20} />,
      path: "/admin/match",
    },
    {
      title: "Ventes",
      icon: <ShoppingBag size={20} />,
      path: "/admin/ventes",
    },
    {
      title: "Utilisateurs",
      icon: <Users size={20} />,
      path: "/admin/utilisateur",
    },
    {
      title: "Commandes",
      icon: <CreditCard size={20} />,
      path: "/admin/commande",
    },
    {
      title: "Paramètres",
      icon: <Settings size={20} />,
      path: "/admin/parametre",
    },
  ]

  return (
    <>
      <div className={`admin-sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="admin-sidebar-header">
          <h2 className="admin-sidebar-title">FootTickets</h2>
          <button className="admin-sidebar-toggle" onClick={toggleSidebar}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="admin-sidebar-content">
          <nav className="admin-sidebar-nav">
            <ul className="admin-sidebar-nav-list">
              {menuItems.map((item, index) => (
                <li key={index} className="admin-sidebar-nav-item">
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `admin-sidebar-nav-link ${isActive ? "active" : ""}`}
                  >
                    <span className="admin-sidebar-nav-icon">{item.icon}</span>
                    <span className="admin-sidebar-nav-text">{item.title}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-user">
            <div className="admin-sidebar-user-avatar">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg"
                alt="User"
              />
            </div>
            <div className="admin-sidebar-user-info">
              <h3 className="admin-sidebar-user-name">Admin</h3>
              <p className="admin-sidebar-user-role">Administrateur</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay pour mobile */}
      <div className={`admin-sidebar-overlay ${isOpen ? "visible" : ""}`} onClick={toggleSidebar}></div>
    </>
  )
}

export default Sidebar
