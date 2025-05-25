import { useState, useEffect } from "react"
import StadiumMap from "../components/StadiumMap"
import SectionSelector from "../components/SectionSelector"
import { useNavigate, useLocation } from "react-router-dom"
import MatchInfo from "../components/MatchInfo"
import AdditionalOption from "../components/AdditionalOption"
import "./StadiumPage.css"

function StadiumPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const matchState = location.state || {}

  const [sections, setSections] = useState([])
  // Ajout : state pour le nombre de places sélectionnées par zone
  const [selectedCounts, setSelectedCounts] = useState({})
  const [seatError, setSeatError] = useState("")

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
      // Initialiser selectedCounts pour chaque zone à 0
      const counts = {}
      matchState.zones.forEach((zone, idx) => {
        const id = zone.name === "VIP" ? "VIP" : (zone.name.replace(/^Zone\s/, "") || String.fromCharCode(65 + idx))
        counts[id] = 0
      })
      setSelectedCounts(counts)
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
            // Initialiser selectedCounts pour chaque zone à 0
            const counts = {}
            data.zones.forEach((zone, idx) => {
              const id = zone.name === "VIP" ? "VIP" : (zone.name.replace(/^Zone\s/, "") || String.fromCharCode(65 + idx))
              counts[id] = 0
            })
            setSelectedCounts(counts)
          } else {
            setSections([])
            setSelectedCounts({})
          }
        })
    } else {
      setSections([])
      setSelectedCounts({})
    }
  }, [matchState.zones, matchState.matchId])

  const [hoveredSection, setHoveredSection] = useState(null)

  const handleSectionHover = (sectionId) => {
    setHoveredSection(sectionId)
  }

  // Gestion du changement de nombre de places pour chaque zone
  const totalSelected = Object.values(selectedCounts).reduce((sum, v) => sum + v, 0)
  const handleCountChange = (section, value) => {
    const otherTotal = totalSelected - (selectedCounts[section.id] || 0)
    if (value + otherTotal > 4) {
      setSeatError("Vous ne pouvez pas sélectionner plus de 4 places au total.")
      return
    }
    setSeatError("")
    setSelectedCounts({ ...selectedCounts, [section.id]: value })
  }

  // Pour la sélection visuelle (optionnel, peut être gardé ou retiré)
  const handleSectionSelect = (sectionId) => {
    setSections(
      sections.map((section) => ({
        ...section,
        selected: section.id === sectionId,
      })),
    )
    // Remet à 0 toutes les zones (y compris la sélectionnée)
    const newCounts = {}
    sections.forEach((section) => {
      newCounts[section.id] = 0
    })
    setSelectedCounts(newCounts)
    setSeatError("")
  }

  // Ajout : états pour les options additionnelles (parking, food box)
  const [additionalOptions, setAdditionalOptions] = useState({
    parking: false,
    foodBox: false,
  });

  // Ajout : gestion du toggle pour chaque option additionnelle
  const handleToggleOption = (option) => {
    setAdditionalOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  // Calcul du total des places et du prix total
  const totalPlaces = sections.reduce((sum, section) => sum + (selectedCounts[section.id] || 0), 0)
  let totalPrice = sections.reduce((sum, section) => sum + (selectedCounts[section.id] || 0) * (section.basePrice || 0), 0)
  if (additionalOptions.parking) {
    totalPrice += 500
  }

  const handleNextClick = () => {
    if (totalSelected < 1 || totalSelected > 4) {
      setSeatError("Veuillez sélectionner entre 1 et 4 places au total.")
      return
    }
    // Préparer la sélection pour la page suivante
    const selectedZones = sections
      .filter(section => (selectedCounts[section.id] || 0) > 0)
      .map(section => ({
        id: section.id,
        name: section.name,
        count: selectedCounts[section.id],
        price: section.basePrice,
        category: section.category
      }))

    // Ajoute les options additionnelles au state pour la page suivante
    navigate('/payement', {
      state: {
        ...matchState,
        selectedZones,
        match_id: matchState.matchId,
        additionalOptions // <-- parking inclus ici
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
                <h1 className="selector-title">Select Your Seats</h1>
              </div>
              <div className="sections-list">
                {sections.length === 0 ? (
                  <div>Chargement des zones...</div>
                ) : (
                  sections.map((section, index) => (
                    <div key={section.id}>
                      <SectionSelector
                        section={section}
                        selectedCount={selectedCounts[section.id] || 0}
                        onCountChange={handleCountChange}
                        maxSelectable={Math.min(4 - (totalSelected - (selectedCounts[section.id] || 0)), section.available)}
                        onSelect={() => handleSectionSelect(section.id)}
                        onHover={() => handleSectionHover(section.id)}
                        onLeave={() => handleSectionHover(null)}
                      />
                      {index < sections.length - 1 && <div className="separator"></div>}
                    </div>
                  ))
               ) }
              </div>
              {/* Ajout des options additionnelles */}
              <div className="additional-options">
                <h2 className="options-title">Options additionnelles</h2>
                <AdditionalOption
                  id="parking"
                  title="Parking du stade"
                  description="Place de parking sécurisée près du stade"
                  price={500}
                  icon={
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="6" width="18" height="12" rx="2" />
                      <circle cx="12" cy="12" r="2" />
                      <path d="M7 17v5" />
                      <path d="M17 17v5" />
                    </svg>
                  }
                  iconColor="#2563eb"
                  iconBgColor="rgba(59, 130, 246, 0.1)"
                  selected={additionalOptions.parking}
                  onToggle={() => handleToggleOption("parking")}
                />
              </div>
              <div style={{ margin: "12px 0", color: "#1a472a", fontWeight: 600 }}>
                Total sélectionné : <b>{totalSelected}</b> / 4
              </div>
              {seatError && (
                <div style={{ color: "red", marginBottom: 8 }}>{seatError}</div>
              )}
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