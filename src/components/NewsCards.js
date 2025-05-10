"use client"

import { useState, useEffect } from "react"
import "./NewsCards.css"
import { Link } from "react-router-dom"

// Remove static newsData and fetch from backend
function NewsCards({ limit }) {
  const [newsData, setNewsData] = useState([])
  const [hoveredCard, setHoveredCard] = useState(null)

  useEffect(() => {
    const fetchActualities = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/actualities")
        const data = await res.json()
        setNewsData(Array.isArray(data) ? data : data.data || [])
      } catch {
        setNewsData([])
      }
    }
    fetchActualities()
  }, [])

  const displayedNews = limit ? newsData.slice(0, limit) : newsData

  return (
    <div className="news-cards">
      {displayedNews.map((news) => (
        <div
          key={news.id}
          className={`news-card ${hoveredCard === news.id ? "hovered" : ""}`}
          onMouseEnter={() => setHoveredCard(news.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="news-card-image">
            <img
              src={
                news.image
                  ? news.image.startsWith("http")
                    ? news.image
                    : `http://localhost:8000/storage/${news.image}`
                  : "/placeholder.svg"
              }
              alt={news.title}
            />
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
                <span>
                  {news.created_at
                    ? new Date(news.created_at).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </span>
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
                <span>
                  {news.readTime ? `${news.readTime} min` : ""}
                </span>
              </div>
            </div>
            <h3 className="news-card-title">{news.title}</h3>
            <p className="news-card-excerpt">{news.excerpt || news.content}</p>
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
      {displayedNews.length === 0 && (
        <div className="news-card-empty">Aucune actualité disponible.</div>
      )}
    </div>
  )
}

export default NewsCards


