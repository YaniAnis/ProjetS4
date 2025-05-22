"use client"

import { useState, useEffect } from "react"
import CalendarNavigation from "./CalendarNavigation"
import FilterBar from "./FilterBar"
import MatchCard from "./MatchCard"
import ActiveFilters from "./ActiveFilters"

function Matches() {
  const [matches, setMatches] = useState([])
  const [filteredMatches, setFilteredMatches] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [leagueFilter, setLeagueFilter] = useState("")
  const [selectedDate, setSelectedDate] = useState("all")
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  // Fetch matches from backend
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/matches");
        const data = await res.json();
        // Map backend fields to frontend model
        const mapped = (Array.isArray(data) ? data : data.data || []).map(m => ({
          id: m.id,
          league: m.league,
          date: m.date,
          time: m.heure,
          homeTeam: { name: m.equipe1, logo: "" }, // Add logo if available
          awayTeam: { name: m.equipe2, logo: "" },
          stadium: m.stade?.nom || "",
          price: m.zones && m.zones.length > 0 ? Math.min(...m.zones.map(z => z.prix)) : "",
          // ...add more fields as needed
        }));
        setMatches(mapped);
        setFilteredMatches(mapped);
      } catch {
        setMatches([]);
        setFilteredMatches([]);
      }
    };
    fetchMatches();
  }, []);

  // Filtrer les matchs lorsque les filtres changent
  useEffect(() => {
    filterMatches()
  }, [searchTerm, leagueFilter, selectedDate, matches])

  // Fonction pour filtrer les matchs
  const filterMatches = () => {
    const filtered = matches.filter((match) => {
      // Filtrer par terme de recherche
      const matchesSearch =
        match.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.stadium.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.league.toLowerCase().includes(searchTerm.toLowerCase())

      // Filtrer par ligue
      const matchesLeague = leagueFilter === "" || match.league === leagueFilter

      // Filtrer par jour
      let matchesDay = true
      if (selectedDate !== "all") {
        // Convertir la date du match au format YYYY-MM-DD
        const dateParts = match.date.split(" ")
        const day = Number.parseInt(dateParts[0])

        // Convertir le mois en français en numéro de mois
        const monthNames = {
          janvier: "01",
          février: "02",
          mars: "03",
          avril: "04",
          mai: "05",
          juin: "06",
          juillet: "07",
          août: "08",
          septembre: "09",
          octobre: "10",
          novembre: "11",
          décembre: "12",
        }
        const month = monthNames[dateParts[1].toLowerCase()]
        const year = Number.parseInt(dateParts[2])

        const formattedDate = `${year}-${month}-${day < 10 ? "0" + day : day}`
        matchesDay = formattedDate === selectedDate
      }

      return matchesSearch && matchesLeague && matchesDay
    })

    setFilteredMatches(filtered)
  }

  // Fonction pour réinitialiser tous les filtres
  const resetAllFilters = () => {
    setSearchTerm("")
    setLeagueFilter("")
    setSelectedDate("all")
  }

  return (
    <section className="matches" id="matches-section">
      <div className="container">
        <h2>Matchs Disponibles</h2>

        <CalendarNavigation
          currentMonth={currentMonth}
          currentYear={currentYear}
          setCurrentMonth={setCurrentMonth}
          setCurrentYear={setCurrentYear}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          matches={matches}
        />

        <FilterBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          leagueFilter={leagueFilter}
          setLeagueFilter={setLeagueFilter}
        />

        <ActiveFilters
          searchTerm={searchTerm}
          leagueFilter={leagueFilter}
          selectedDate={selectedDate}
          setSearchTerm={setSearchTerm}
          setLeagueFilter={setLeagueFilter}
          setSelectedDate={setSelectedDate}
        />

        <div className="matches-grid" id="matches-container">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>

        {filteredMatches.length === 0 && (
          <div className="no-matches" id="no-matches">
            <i className="fas fa-calendar-times"></i>
            <h3>Aucun match ne correspond à votre recherche</h3>
            <p>Essayez de modifier vos critères de recherche ou consultez d'autres dates.</p>
            <button id="reset-filters" className="btn-secondary" onClick={resetAllFilters}>
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Matches
