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
        homeTeam: { name: m.equipe1, logo: "" },
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

  useEffect(() => {
    fetchMatches();
  }, []);

  // Filtrer les matchs lorsque les filtres changent
  useEffect(() => {
    filterMatches()
  }, [searchTerm, leagueFilter, selectedDate, matches])

  // Fonction pour filtrer les matchs
  const filterMatches = () => {
    if (!matches || !Array.isArray(matches)) {
      setFilteredMatches([]);
      return;
    }

    const filtered = matches.filter((match) => {
      if (!match || typeof match !== 'object') return false;

      // Defensive: ensure all fields are strings before .toLowerCase()
      const safeToString = v => (typeof v === "string" ? v : "");
      const homeName = safeToString(match.homeTeam?.name);
      const awayName = safeToString(match.awayTeam?.name);
      const stadium = safeToString(match.stadium);
      const league = safeToString(match.league);
      const searchTermLower = safeToString(searchTerm).toLowerCase();

      let matchesSearch = false;
      try {
        matchesSearch =
          homeName.toLowerCase().includes(searchTermLower) ||
          awayName.toLowerCase().includes(searchTermLower) ||
          stadium.toLowerCase().includes(searchTermLower) ||
          league.toLowerCase().includes(searchTermLower);
      } catch (e) {
        matchesSearch = false;
      }

      const matchesLeague = !leagueFilter || league === leagueFilter;

      let matchesDay = true;
      if (selectedDate !== "all" && match.date) {
        try {
          const dateParts = (typeof match.date === "string" ? match.date : "").split(" ");
          if (!dateParts[1] || typeof dateParts[1] !== "string") {
            matchesDay = false;
          } else {
            const day = Number.parseInt(dateParts[0]);
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
            };
            const monthKey = dateParts[1].toLowerCase();
            const month = monthNames[monthKey];
            const year = Number.parseInt(dateParts[2]);
            if (!month || isNaN(day) || isNaN(year)) {
              matchesDay = false;
            } else {
              const formattedDate = `${year}-${month}-${day < 10 ? "0" + day : day}`;
              matchesDay = formattedDate === selectedDate;
            }
          }
        } catch (e) {
          matchesDay = false;
        }
      }

      return matchesSearch && matchesLeague && matchesDay;
    });

    setFilteredMatches(filtered);
  }

  // Fonction pour réinitialiser tous les filtres
  const resetAllFilters = () => {
    setSearchTerm("")
    setLeagueFilter("")
    setSelectedDate("all")
  }

  // Trier les matchs par date décroissante avant de les afficher
  const sortedMatches = [...filteredMatches].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <section className="matches" id="matches-section">
      <div className="container">
        <h2>Matchs Disponibles</h2>
        <button onClick={fetchMatches} className="btn-refresh">Rafraîchir la liste</button>

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
          {/* Retour à l'ancien design : affichage sous forme de cartes */}
          {sortedMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>

        {sortedMatches.length === 0 && (
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