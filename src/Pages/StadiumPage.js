import { useState, useEffect } from "react"
import StadiumMap from "../components/StadiumMap"
import SectionSelector from "../components/SectionSelector"
import { useNavigate, useLocation } from "react-router-dom"
import MatchInfo from "../components/MatchInfo"
import "./StadiumPage.css"

function StadiumPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const matchState = location.state || {}

  // Synchronisation : fetch zones depuis le backend si elles ne sont pas fournies dans matchState
  const [sections, setSections] = useState([])

  useEffect(() => {
    // Si les zones sont déjà passées via matchState (depuis MatchCard), on les utilise directement
    if (Array.isArray(matchState.zones) && matchState.zones.length > 0) {
      setSections(
        matchState.zones.map((zone, idx) => ({
          id: zone.name === "VIP" ? "VIP" : (zone.name.replace(/^Zone\s/, "") || String.fromCharCode(65 + idx)),
          name: zone.name,
          basePrice: Number(zone.price),
          maxPrice: null,
          available: Number(zone.places),
          selected: idx === 0,
          category: zone.name === "VIP" ? "VIP" : "Standard",
        }))
      )
    } else if (matchState.matchId) {
      // Sinon, on va chercher les zones du match via l'API backend
      fetch(`http://localhost:8000/api/matches/${matchState.matchId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.zones) && data.zones.length > 0) {
            setSections(
              data.zones.map((zone, idx) => ({
                id: zone.name === "VIP" ? "VIP" : (zone.name.replace(/^Zone\s/, "") || String.fromCharCode(65 + idx)),
                name: zone.name,
                basePrice: Number(zone.price),
                maxPrice: null,
                available: Number(zone.places),
                selected: idx === 0,
                category: zone.name === "VIP" ? "VIP" : "Standard",
              }))
            )
          } else {
            setSections([])
          }
        })
    } else {
      setSections([])
    }
  }, [matchState.zones, matchState.matchId])

  const [hoveredSection, setHoveredSection] = useState(null)

  const handleSectionHover = (sectionId) => {
    setHoveredSection(sectionId)
  }

  const handleSectionSelect = (sectionId) => {
    setSections(
      sections.map((section) => ({
        ...section,
        selected: section.id === sectionId,
      })),
    )
  }

  const handleNextClick = () => {
    const selectedSection = sections.find((section) => section.selected)
    alert(
      `Proceeding with ${selectedSection?.id === "VIP" ? "VIP Zone" : `Zone ${selectedSection?.name}`} at ${selectedSection?.basePrice} DZD`,
    )
    navigate('/payement', {
      state: {
        ...matchState,
        selectedZone: selectedSection,
      }
    })
  }

  // Match information (from state or fallback)
  const matchInfo = {
    homeTeam: matchState.homeTeam || "USM Alger",
    awayTeam: matchState.awayTeam || "MC Alger",
    date: matchState.date || "May 20, 2025",
    time: matchState.time || "20:45",
    stadium: matchState.stadium || "5th July Stadium",
    homeTeamLogo: matchState.homeLogo || "/placeholder.svg?height=80&width=80&text=MCA",
    awayTeamLogo: matchState.awayLogo || "/placeholder.svg?height=80&width=80&text=USMA",
  }

  return (
    <div className="app-container">
      <main className="main-content">
        <MatchInfo
          homeTeam={matchInfo.homeTeam}
          awayTeam={matchInfo.awayTeam}
          date={matchInfo.date}
          time={matchInfo.time}
          stadium={matchInfo.stadium}
          homeTeamLogo={matchInfo.homeTeamLogo}
          awayTeamLogo={matchInfo.awayTeamLogo}
        />

        <div className="container">
          <div className="booking-container">
            <div className="map-container">
              {sections.length === 0 ? (
                <div>Chargement des zones...</div>
              ) : (
                <StadiumMap
                  sections={sections}
                  hoveredSection={hoveredSection}
                  onSectionHover={handleSectionHover}
                  onSectionSelect={handleSectionSelect}
                />
              )}
            </div>
            <div className="selector-container">
              <div className="selector-header">
                <h1 className="selector-title">Select Your Seat</h1>
              </div>
              <div className="sections-list">
                {sections.length === 0 ? (
                  <div>Chargement des zones...</div>
                ) : (
                  sections.map((section, index) => (
                    <div key={section.id}>
                      <SectionSelector
                        section={section}
                        onSelect={() => handleSectionSelect(section.id)}
                        onHover={() => handleSectionHover(section.id)}
                        onLeave={() => handleSectionHover(null)}
                      />
                      {index < sections.length - 1 && <div className="separator"></div>}
                    </div>
                  ))
                )}
              </div>
              <button className="checkout-button" onClick={handleNextClick}>
                CONTINUE TO CHECKOUT
              </button>
              <p className="terms-text">By proceeding, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StadiumPage
