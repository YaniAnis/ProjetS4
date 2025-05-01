"use client"

import { useState, useEffect, useRef } from "react"
import "./HeroCarousel.css"

// Données des matchs à la une
const featuredMatches = [
  {
    id: 1,
    homeTeam: "MC Alger",
    homeTeamLogo: "/images/teams/mc_alger.png",
    awayTeam: "CR Belouizdad",
    awayTeamLogo: "/images/teams/cr_belouizdad.png",
    date: "15 Mai 2025",
    stadium: "Stade 5 Juillet",
    stadiumImage: "/images/stadiums/stade5J.jpg",
  },
  {
    id: 2,
    homeTeam: "Paradou AC",
    homeTeamLogo: "/images/teams/paradou_ac.png",
    awayTeam: "ES Sétif",
    awayTeamLogo: "/images/teams/es_setif.png",
    date: "20 Mai 2025",
    stadium: "Stade Nelson Mandela",
    stadiumImage: "/images/stadiums/stadeN.jpg",
  },
  {
    id: 3,
    homeTeam: "JS Kabylie",
    homeTeamLogo: "/images/teams/js_kabylie.png",
    awayTeam: "USM Alger",
    awayTeamLogo: "/images/teams/usm_alger.png",
    date: "25 Mai 2025",
    stadium: "Stade Hocine Ait Ahmed",
    stadiumImage: "/images/stadiums/stadejsk.jpg",
  },
]

function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === featuredMatches.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? featuredMatches.length - 1 : prev - 1))
  }

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)

    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        nextSlide()
      }, 5000)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused, currentSlide])

  return (
    <div className="hero-carousel" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
      {featuredMatches.map((match, index) => (
        <div
          key={match.id}
          className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
          style={{
            backgroundImage: `url(${match.stadiumImage})`,
          }}
        >
          <div className="carousel-content">
            <div className="carousel-header">
              <h2>Match à ne pas manquer</h2>
              <p>
                {match.date} - {match.stadium}
              </p>
            </div>

            <div className="carousel-teams">
              <div className="team">
                <div className="team-logo">
                  <img src={match.homeTeamLogo || "/placeholder.svg"} alt={match.homeTeam} />
                </div>
                <span className="team-name">{match.homeTeam}</span>
              </div>

              <div className="vs">VS</div>

              <div className="team">
                <div className="team-logo">
                  <img src={match.awayTeamLogo || "/placeholder.svg"} alt={match.awayTeam} />
                </div>
                <span className="team-name">{match.awayTeam}</span>
              </div>
            </div>

            <button className="buy-button">Acheter des billets</button>
          </div>
        </div>
      ))}

      <button className="carousel-control prev" onClick={prevSlide} aria-label="Match précédent">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button className="carousel-control next" onClick={nextSlide} aria-label="Match suivant">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <div className="carousel-indicators">
        {featuredMatches.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? "active" : ""}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Aller au match ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroCarousel

