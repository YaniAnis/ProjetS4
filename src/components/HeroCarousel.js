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
    };
    const l2e = {
      "AS Khroub": `${basePath}/Ligue2_Est/as_khroub.png`,
      "CA Batna": `${basePath}/Ligue2_Est/ca_batna.png`,
      "HB Chelghoum Laïd": `${basePath}/Ligue2_Est/hb_chelghoumlaid.png`,
      "IB Khémis El Khechna": `${basePath}/Ligue2_Est/ib_khemiselkhechna.png`,
      "IRB Ouargla": `${basePath}/Ligue2_Est/irb_ouargla.png`,
      "JS Bordj Ménaïel": `${basePath}/Ligue2_Est/js_bordjmenaiel.png`,
      "JS Djijel": `${basePath}/Ligue2_Est/js_djijel.png`,
      "MO Constantine": `${basePath}/Ligue2_Est/mo_constantine.png`,
      "MSP Batna": `${basePath}/Ligue2_Est/msp_batna.png`,
      "NRB Teleghma": `${basePath}/Ligue2_Est/nrb_teleghma.png`,
      "US Chaouia": `${basePath}/Ligue2_Est/us_chaouia.png`,
      "US Souf": `${basePath}/Ligue2_Est/us_souf.png`,
      "USM Annaba": `${basePath}/Ligue2_Est/usm_annaba.png`,
      "USM El Harrach": `${basePath}/Ligue2_Est/usm_elharrach.png`,
      "MB Rouissat": `${basePath}/Ligue2_Est/mb_rouissat.png`,
      "Olympique Magrane": `${basePath}/Ligue2_Est/olympique_magrane.png`,
    };
    const l2o = {
      "ASM Oran": `${basePath}/Ligue2_Ouest/asm_oran.png`,
      "CR Témouchent": `${basePath}/Ligue2_Ouest/cr_temouchent.png`,
      "ES Ben Aknoun": `${basePath}/Ligue2_Ouest/es_benaknoun.png`,
      "ESM Koléa": `${basePath}/Ligue2_Ouest/esm_kolea.png`,
      "GC Mascara": `${basePath}/Ligue2_Ouest/gc_mascara.png`,
      "JS El Biar": `${basePath}/Ligue2_Ouest/js_elbiar.png`,
      "JSM Tiaret": `${basePath}/Ligue2_Ouest/jsm_tiaret.png`,
      "MC Saïda": `${basePath}/Ligue2_Ouest/mc_saida.png`,
      "MCB Oued Sly": `${basePath}/Ligue2_Ouest/mcb_ouedsly.png`,
      "NA Hussein Dey": `${basePath}/Ligue2_Ouest/na_husseindey.png`,
      "RC Arbaâ": `${basePath}/Ligue2_Ouest/rc_arbaa.png`,
      "RC Kouba": `${basePath}/Ligue2_Ouest/rc_kouba.png`,
      "SC Mécheria": `${basePath}/Ligue2_Ouest/sc_mecheria.png`,
      "SKAF Khemis Miliana": `${basePath}/Ligue2_Ouest/skaf_khemismiliana.png`,
      "US Béchar Djedid": `${basePath}/Ligue2_Ouest/us_bechardjedid.png`,
      "WA Mostaganem": `${basePath}/Ligue2_Ouest/wa_mostaganem.png`,
    };
    // Correction : cherche dans toutes les ligues
    return l1[name] || l2e[name] || l2o[name] || "/placeholder.svg";
  }

  useEffect(() => {
    // Récupère les 3 derniers matchs ajoutés par l'admin (triés par created_at ou id décroissant)
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
        // Trie par date de création (created_at) ou id décroissant
        matches = matches
          .filter((m) => m.equipe1 && m.equipe2 && m.date)
          .sort((a, b) => {
            if (a.created_at && b.created_at) {
              return new Date(b.created_at) - new Date(a.created_at)
            }
            return (b.id || 0) - (a.id || 0)
          })
          .slice(0, 3)
          .map((m, idx) => ({
            id: m.id,
            homeTeam: m.equipe1,
            homeTeamLogo: clubLogo(m.equipe1),
            awayTeam: m.equipe2,
            awayTeamLogo: clubLogo(m.equipe2),
            date: m.date,
            stadium: m.stade?.nom || "",
            stadiumImage: images[idx % images.length], // Utilise une image différente pour chaque match
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

