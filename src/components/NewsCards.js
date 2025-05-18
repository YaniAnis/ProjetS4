"use client"

import { useState } from "react"
import "./NewsCards.css"
import { Link } from "react-router-dom"

// Données des actualités
const newsData = [
  {
    id: 1,
    title: "Le MC Alger remporte une victoire éclatante contre le NC",
    excerpt: "Les joueurs du Mouloudia ont livré une prestation remarquable lors de leur dernier match de championnat.",
    image: "/images/news/MCANC.jpg",
    date: "10 Avril 2025",
    readTime: "5 min",
  },
  {
    id: 2,
    title: "Youcef Belaïli élu joueur du mois pour la troisième fois consécutive",
    excerpt: "Le prodige algérien continue d'impressionner avec ses performances exceptionnelles sur le terrain.",
    image: "/images/news/Youcef-Belaili-2-1.jpg",
    date: "5 Avril 2025",
    readTime: "3 min",
  },
  {
    id: 3,
    title: "Le Stade 5 Juillet se prépare pour accueillir la finale de la Coupe d'Algérie",
    excerpt:
      "Les préparatifs battent leur plein pour l'événement qui aura lieu le mois prochain au stade emblématique d'Alger.",
    image: "/images/news/Stade-5-Juillet.jpg",
    date: "2 Avril 2025",
    readTime: "4 min",
  },
  {
    id: 4,
    title: "Nouveau record d'affluence pour la Ligue 1 Mobilis cette saison",
    excerpt:
      "Les stades algériens n'ont jamais été aussi remplis, témoignant de l'engouement croissant pour le championnat national.",
    image: "/images/news/ligue1mobilis.jpg",
    date: "28 Mars 2025",
    readTime: "6 min",
  },
]

function NewsCards() {
  const [hoveredCard, setHoveredCard] = useState(null)

  // Détecter si nous sommes en mode sombre en vérifiant la classe sur le body
  const isDarkMode = document.body.classList.contains("dark-mode")

  return (
    <div className={`news-cards ${isDarkMode ? "dark-mode" : ""}`}>
      {newsData.map((news) => (
        <div
          key={news.id}
          className={`news-card ${hoveredCard === news.id ? "hovered" : ""} ${isDarkMode ? "dark-mode" : ""}`}
          onMouseEnter={() => setHoveredCard(news.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="news-card-image">
            <img src={news.image || "/placeholder.svg"} alt={news.title} />
          </div>
          <div className="news-card-content">
            <div className="news-card-meta">
              <div className="news-card-date">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{news.date}</span>
              </div>
              <div className="news-card-time">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{news.readTime}</span>
              </div>
            </div>
            <h3 className="news-card-title">{news.title}</h3>
            <p className="news-card-excerpt">{news.excerpt}</p>
          </div>
          <div className="news-card-footer">
            <Link to={`/actualites/${news.id}`} className="news-card-link">
              Lire plus
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NewsCards
