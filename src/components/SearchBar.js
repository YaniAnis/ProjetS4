"use client"

import { useState } from "react"
import "./SearchBar.css"

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("")

  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  return (
    <div className="search-bar">
      <input type="text" placeholder="Rechercher une équipe..." value={searchTerm} onChange={handleChange} />
    </div>
  )
}

export default SearchBar
