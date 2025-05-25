import "./MatchesPage.css"
import Hero from "../components/Hero.js"
import Matches from "../components/Matches.js"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"

function MatchesPage(props) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [leagueFilter, setLeagueFilter] = useState("") // <-- Add this line
  const [matches, setMatches] = useState([])
  const [filteredMatches, setFilteredMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const searchInputRef = useRef(null)

  // On mount, set search if redirected from TeamsPage
  useEffect(() => {
    if (location.state && location.state.searchTeam) {
      setSearchTerm(location.state.searchTeam)
      // Optionally focus the input
      if (searchInputRef.current) {
        searchInputRef.current.value = location.state.searchTeam
        searchInputRef.current.focus()
      }
    }
  }, [location.state])

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/matches")
        if (!res.ok) throw new Error("Failed to fetch")
        const data = await res.json()
        const matches = Array.isArray(data) ? data : data.data || []

        // Trier les matchs du plus récent au plus ancien
        const sortedMatches = matches.sort((a, b) => {
          // D'abord par created_at
          if (a.created_at && b.created_at) {
            return new Date(b.created_at) - new Date(a.created_at)
          }
          // Puis par ID si pas de created_at
          return (b.id || 0) - (a.id || 0)
        })

        setMatches(sortedMatches)
        setFilteredMatches(sortedMatches)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching matches:", error)
        setMatches([])
        setFilteredMatches([])
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  return (
    <div className="App">
      <Hero />
      <Matches />
    </div>
  )
}

export default MatchesPage
