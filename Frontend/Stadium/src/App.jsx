"use client"

import { useState } from "react"
import StadiumMap from "./components/StadiumMap"
import SectionSelector from "./components/SectionSelector"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import MatchInfo from "./components/MatchInfo"
import "./app.css"

function App() {
  const [sections, setSections] = useState([
    { id: "A", name: "A", basePrice: 120, maxPrice: null, available: 184, selected: false, category: "Premium" },
    { id: "B", name: "B", basePrice: 90, maxPrice: null, available: 150, selected: false, category: "Side Premium" },
    { id: "C", name: "C", basePrice: 90, maxPrice: null, available: 145, selected: false, category: "Side Premium" },
    { id: "D", name: "D", basePrice: 90, maxPrice: null, available: 148, selected: false, category: "Side Premium" },
    { id: "E", name: "E", basePrice: 90, maxPrice: null, available: 142, selected: false, category: "Side Premium" },
    { id: "F", name: "F", basePrice: 90, maxPrice: null, available: 152, selected: false, category: "Side Premium" },
    { id: "H", name: "H", basePrice: 90, maxPrice: null, available: 154, selected: false, category: "Side Premium" },
    { id: "VIP", name: "VIP", basePrice: 150, maxPrice: null, available: 60, selected: true, category: "VIP" },
  ])

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
      `Proceeding with ${selectedSection?.id === "VIP" ? "VIP Zone" : `Zone ${selectedSection?.name}`} at €${selectedSection?.basePrice}`,
    )
  }

  // Match information
  const matchInfo = {
    homeTeam: "USM Alger",
    awayTeam: "MC Alger",
    date: "May 20, 2025",
    time: "20:45",
    stadium: "5th July Stadium",
    homeTeamLogo: "/placeholder.svg?height=80&width=80&text=MCA",
    awayTeamLogo: "/placeholder.svg?height=80&width=80&text=USMA",
  }

  return (
    <div className="app-container">
      <Navbar />

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
              <StadiumMap
                sections={sections}
                hoveredSection={hoveredSection}
                onSectionHover={handleSectionHover}
                onSectionSelect={handleSectionSelect}
              />
            </div>
            <div className="selector-container">
              <div className="selector-header">
                <h1 className="selector-title">Select Your Seat</h1>
              </div>

              <div className="sections-list">
                {sections.map((section, index) => (
                  <div key={section.id}>
                    <SectionSelector
                      section={section}
                      onSelect={() => handleSectionSelect(section.id)}
                      onHover={() => handleSectionHover(section.id)}
                      onLeave={() => handleSectionHover(null)}
                    />
                    {index < sections.length - 1 && <div className="separator"></div>}
                  </div>
                ))}
              </div>

              <button className="checkout-button" onClick={handleNextClick}>
                CONTINUE TO CHECKOUT
              </button>

              <p className="terms-text">By proceeding, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
