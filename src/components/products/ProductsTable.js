"use client"

import { motion } from "framer-motion"
import { Edit, Search, Trash2 } from "lucide-react"
import { useState } from "react"
import "./Product.css"

// Données adaptées pour FootTickets
const MATCHES_DATA = [
  {
    id: 1,
    homeTeam: "MC Alger",
    awayTeam: "CR Belouizdad",
    date: "15/05/2025",
    stadium: "Stade 5 Juillet",
    price: 2500,
    stock: 5000,
    sales: 1200,
    status: "upcoming",
  },
  {
    id: 2,
    homeTeam: "JS Kabylie",
    awayTeam: "USM Alger",
    date: "20/05/2025",
    stadium: "Stade 1er Novembre",
    price: 2000,
    stock: 3000,
    sales: 800,
    status: "upcoming",
  },
  {
    id: 3,
    homeTeam: "Paradou AC",
    awayTeam: "ES Sétif",
    date: "25/05/2025",
    stadium: "Stade Nelson Mandela",
    price: 1800,
    stock: 2500,
    sales: 650,
    status: "upcoming",
  },
  {
    id: 4,
    homeTeam: "MC Alger",
    awayTeam: "USM Alger",
    date: "10/04/2025",
    stadium: "Stade 5 Juillet",
    price: 3000,
    stock: 5000,
    sales: 4800,
    status: "completed",
  },
  {
    id: 5,
    homeTeam: "CR Belouizdad",
    awayTeam: "JS Kabylie",
    date: "05/04/2025",
    stadium: "Stade 20 Août",
    price: 2200,
    stock: 3500,
    sales: 3200,
    status: "completed",
  },
]

const ProductsTable = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMatches, setFilteredMatches] = useState(MATCHES_DATA)

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    const filtered = MATCHES_DATA.filter(
      (match) =>
        match.homeTeam.toLowerCase().includes(term) ||
        match.awayTeam.toLowerCase().includes(term) ||
        match.stadium.toLowerCase().includes(term),
    )

    setFilteredMatches(filtered)
  }

  return (
    <motion.div
      className="products-table"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="products-table-header">
        <h2 className="products-table-title">Liste des Matchs</h2>
        <div className="products-table-search">
          <input
            type="text"
            placeholder="Rechercher des matchs..."
            className="products-table-search-input"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="products-table-search-icon" size={18} />
        </div>
      </div>

      <div className="products-table-container">
        <table className="products-table-content">
          <thead>
            <tr>
              <th className="products-table-header-cell">Match</th>
              <th className="products-table-header-cell">Date</th>
              <th className="products-table-header-cell">Stade</th>
              <th className="products-table-header-cell">Prix</th>
              <th className="products-table-header-cell">Billets restants</th>
              <th className="products-table-header-cell">Billets vendus</th>
              <th className="products-table-header-cell">Statut</th>
              <th className="products-table-header-cell">Actions</th>
            </tr>
          </thead>

          <tbody className="products-table-body">
            {filteredMatches.map((match) => (
              <motion.tr
                key={match.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="products-table-cell products-table-cell-name">
                  <div className="team-logo">
                    <span>{match.homeTeam.substring(0, 2)}</span>
                  </div>
                  {match.homeTeam} vs {match.awayTeam}
                </td>
                <td className="products-table-cell">{match.date}</td>
                <td className="products-table-cell">{match.stadium}</td>
                <td className="products-table-cell">{match.price.toLocaleString()} DA</td>
                <td className="products-table-cell">{(match.stock - match.sales).toLocaleString()}</td>
                <td className="products-table-cell">{match.sales.toLocaleString()}</td>
                <td className="products-table-cell">
                  <span className={`status-badge ${match.status === "upcoming" ? "upcoming" : "completed"}`}>
                    {match.status === "upcoming" ? "À venir" : "Terminé"}
                  </span>
                </td>
                <td className="products-table-cell">
                  <button className="products-table-action-edit">
                    <Edit size={18} />
                  </button>
                  <button className="products-table-action-delete">
                    <Trash2 size={18} />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default ProductsTable
