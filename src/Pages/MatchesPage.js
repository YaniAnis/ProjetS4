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

  return (
    <div className="App">
      <Hero />
      <Matches />
    </div>
  )
}

export default MatchesPage
