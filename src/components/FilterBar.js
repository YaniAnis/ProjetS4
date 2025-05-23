"use client"
import "./CategoryFilter.css"

function FilterBar({ searchTerm, setSearchTerm, leagueFilter, setLeagueFilter }) {
  return (
    <div className="filter-bar">
      <div className="search">
        <input
          type="text"
          id="search-input"
          placeholder="Rechercher un match..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>
          <i className="fas fa-search"></i>
        </button>
      </div>
      <div className="filters">
        <select id="filter-league" value={leagueFilter} onChange={(e) => setLeagueFilter(e.target.value)}>
          <option value="">Toutes les ligues</option>
          <option value="Ligue 1">Ligue 1</option>
          <option value="Champions League">Champions League</option>
          <option value="Coupe Algérie">Coupe Algérie</option>
        </select>
        <select id="filter-month" hidden>
          <option value="">Toutes les ligues</option>
          <option value="ligue1">Ligue 1</option>
          <option value="Champions League">Champions League</option>
          <option value="Europa League">Coupe Algérie</option>
        </select>
      </div>
    </div>
  )
}

export default FilterBar