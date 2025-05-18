"use client"

// Création d'un composant UsersTable simplifié sans dépendances externes
// Fichier avec extension .js pour correspondre à ce que le système recherche
import { useState } from "react"
import "../users/user.css"

const UsersTable = () => {
  // Données fictives pour le tableau
  const initialUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active", lastLogin: "2023-05-15" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "Active", lastLogin: "2023-05-14" },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert@example.com",
      role: "Editor",
      status: "Inactive",
      lastLogin: "2023-05-10",
    },
    { id: 4, name: "Emily Davis", email: "emily@example.com", role: "User", status: "Active", lastLogin: "2023-05-13" },
    {
      id: 5,
      name: "Michael Wilson",
      email: "michael@example.com",
      role: "User",
      status: "Pending",
      lastLogin: "2023-05-12",
    },
  ]

  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.trim() === "") {
      setUsers(initialUsers)
    } else {
      const filtered = initialUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(term.toLowerCase()) || user.email.toLowerCase().includes(term.toLowerCase()),
      )
      setUsers(filtered)
    }
  }

  return (
    <div className="users-table">
      <div className="users-table-header">
        <h2 className="users-table-title">Utilisateurs</h2>
        <div className="users-table-search">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            className="users-table-search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
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

export default UsersTable



