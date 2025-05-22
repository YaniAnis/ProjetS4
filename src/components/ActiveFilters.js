"use client"

function ActiveFilters({ searchTerm, leagueFilter, selectedDate, setSearchTerm, setLeagueFilter, setSelectedDate }) {
  // Fonction pour obtenir le texte du filtre de jour
  const getDayFilterText = () => {
    if (selectedDate === "all") return "Jour: Tous"

    const dayItems = document.querySelectorAll(`.day-item`)
    for (const item of dayItems) {
      if (item.getAttribute("data-date") === selectedDate) {
        const dayName = item.querySelector(".day-name").textContent
        const dayDate = item.querySelector(".day-date").textContent
        return `Jour: ${dayName} ${dayDate}`
      }
    }

    return "Jour: Sélectionné"
  }

  return (
    <div className="active-filters" id="active-filters">
      {selectedDate !== "all" && (
        <span className="filter-tag" id="day-filter-tag">
          <span id="day-filter-text">{getDayFilterText()}</span>
          <button className="remove-filter" data-filter="day" onClick={() => setSelectedDate("all")}>
            <i className="fas fa-times"></i>
          </button>
        </span>
      )}

      {searchTerm && (
        <span className="filter-tag" id="search-filter-tag">
          <span id="search-filter-text">Recherche: {searchTerm}</span>
          <button className="remove-filter" data-filter="search" onClick={() => setSearchTerm("")}>
            <i className="fas fa-times"></i>
          </button>
        </span>
      )}

      {leagueFilter && (
        <span className="filter-tag" id="league-filter-tag">
          <span id="league-filter-text">Ligue: {leagueFilter}</span>
          <button className="remove-filter" data-filter="league" onClick={() => setLeagueFilter("")}>
            <i className="fas fa-times"></i>
          </button>
        </span>
      )}
    </div>
  )
}

export default ActiveFilters
