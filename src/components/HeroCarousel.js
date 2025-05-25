"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./HeroCarousel.css"

function HeroCarousel() {
  const [featuredMatches, setFeaturedMatches] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef(null)
  const navigate = useNavigate()

  // Fonction utilitaire pour obtenir le logo d'un club
  const clubLogo = (name) => {
    if (!name) return "/placeholder.svg"
    const basePath = "/logos"
    const l1 = {
      "USM Alger": `${basePath}/Ligue1/usm_alger.png`,
      "JS Kabylie": `${basePath}/Ligue1/js_kabylie.png`,
      "CR Belouizdad": `${basePath}/Ligue1/cr_belouizdad.png`,
      "Paradou AC": `${basePath}/Ligue1/paradou_ac.png`,
      "ES Sétif": `${basePath}/Ligue1/es_setif.png`,
      "MC Alger": `${basePath}/Ligue1/mc_alger.png`,
      "MC El Bayadh": `${basePath}/Ligue1/mc_elbayadh.png`,
      "CS Constantine": `${basePath}/Ligue1/cs_constantine.png`,
      "ASO Chlef": `${basePath}/Ligue1/aso_chlef.png`,
      "JS Saoura": `${basePath}/Ligue1/js_saoura.png`,
      "MC Oran": `${basePath}/Ligue1/mc_oran.png`,
      "Olympique Akbou": `${basePath}/Ligue1/o_akbou.png`,
      "USM Khenchela": `${basePath}/Ligue1/usm_khenchela.png`,
      "US Biskra": `${basePath}/Ligue1/us_biskra.png`,
      "NC Magra": `${basePath}/Ligue1/nc_magra.png`,
      "ES Mostaganem": `${basePath}/Ligue1/es_mostaganem.png`,
    }
    // Ajoute d'autres mappings si besoin
    return l1[name] || "/placeholder.svg"
  }

  useEffect(() => {
    // Récupère les 3 derniers matchs ajoutés par l'admin
    const fetchMatches = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/matches")
        const data = await res.json()
        let matches = Array.isArray(data) ? data : data.data || []
        // Images à utiliser pour les 3 slides
        const images = [
          "/images/stadiums/stade5J.jpg",
          "/images/stadiums/stadeN.jpg",
          "/images/stadiums/stadejsk.jpg",
        ]
        matches = matches
          .filter((m) => m.equipe1 && m.equipe2 && m.date)
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3)
          .map((m, idx) => ({
            id: m.id,
            homeTeam: m.equipe1,
            homeTeamLogo: clubLogo(m.equipe1),
            awayTeam: m.equipe2,
            awayTeamLogo: clubLogo(m.equipe2),
            date: m.date,
            stadium: m.stade?.nom || "",
            stadiumImage: images[idx % images.length], // Associe une image différente à chaque match
          }))
        setFeaturedMatches(matches)
      } catch {
        setFeaturedMatches([])
      }
    }
    fetchMatches()
  }, [])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === featuredMatches.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? featuredMatches.length - 1 : prev - 1))
  }

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!isPaused && featuredMatches.length > 0) {
      intervalRef.current = setInterval(() => {
        nextSlide()
      }, 5000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPaused, currentSlide, featuredMatches.length])

  if (featuredMatches.length === 0) {
    return (
      <div
        className="hero-carousel"
        style={{
          minHeight: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Aucun match à afficher
      </div>
    )
  }

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
            <button
              className="buy-button"
              onClick={() => navigate("/matches")}
            >
              Acheter des billets
            </button>
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

