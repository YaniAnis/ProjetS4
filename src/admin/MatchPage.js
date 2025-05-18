"use client"

import { useState } from "react"
import "./Pages.css"

const MatchPage = () => {
  const [matches, setMatches] = useState([
    {
      id: 1,
      homeTeam: "MC Alger",
      awayTeam: "CR Belouizdad",
      date: "2023-08-15",
      time: "20:00",
      stadium: "Stade 5 Juillet",
      ticketsSold: 12500,
      ticketsAvailable: 20000,
    },
    {
      id: 2,
      homeTeam: "JS Kabylie",
      awayTeam: "USM Alger",
      date: "2023-08-16",
      time: "18:30",
      stadium: "Stade 1er Novembre",
      ticketsSold: 8700,
      ticketsAvailable: 15000,
    },
    {
      id: 3,
      homeTeam: "Paradou AC",
      awayTeam: "ES Sétif",
      date: "2023-08-17",
      time: "17:00",
      stadium: "Stade Omar Hamadi",
      ticketsSold: 5200,
      ticketsAvailable: 10000,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredMatches = matches.filter(
    (match) =>
      match.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.awayTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.stadium.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Gestion des Matchs</h1>
        <div className="admin-page-actions">
          <button className="admin-page-button">Ajouter un Match</button>
        </div>
      </div>

      <div className="admin-search-container">
        <input
          type="text"
          placeholder="Rechercher un match..."
          className="admin-search-input"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Équipe Domicile</th>
              <th>Équipe Extérieur</th>
              <th>Date</th>
              <th>Heure</th>
              <th>Stade</th>
              <th>Billets Vendus</th>
              <th>Billets Disponibles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMatches.map((match) => (
              <tr key={match.id}>
                <td>{match.id}</td>
                <td>{match.homeTeam}</td>
                <td>{match.awayTeam}</td>
                <td>{match.date}</td>
                <td>{match.time}</td>
                <td>{match.stadium}</td>
                <td>{match.ticketsSold}</td>
                <td>{match.ticketsAvailable}</td>
                <td>
                  <button className="admin-table-button edit">Modifier</button>
                  <button className="admin-table-button delete">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MatchPage


