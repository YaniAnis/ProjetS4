"use client"

import { useState } from "react"
import "./TeamCard.css"

function TeamCard({ team }) {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className="team-card">
      <div className="team-logo-container">
        <img
          src={imageError ? "/logos/placeholder.png" : team.logo}
          alt={`Logo ${team.name}`}
          className="team-logo"
          onError={handleImageError}
        />
      </div>
      <h3 className="team-name">{team.name}</h3>
      <div className="team-category">{team.category}</div>
    </div>
  )
}

export default TeamCard
