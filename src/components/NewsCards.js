"use client"

import { useState, useEffect } from "react"
import "./NewsCards.css"
import { Link } from "react-router-dom"

function NewsCards({ limit }) {
  const [hoveredCard, setHoveredCard] = useState(null)
  const [news, setNews] = useState([])

  // Détecter si nous sommes en mode sombre en vérifiant la classe sur le body
  const isDarkMode = document.body.classList.contains("dark-mode")

  useEffect(() => {
    // Fetch only actualities (admin ActualitePage.js writes to /api/actualities)
    const fetchNews = async () => {
      try {
        const actualitiesRes = await fetch("http://localhost:8000/api/actualities")
        const actualitiesData = await actualitiesRes.json()
        const actualities = (Array.isArray(actualitiesData) ? actualitiesData : actualitiesData.data || []).map(a => ({
          id: `actuality-${a.id}`,
          title: a.title,
          excerpt: a.content,
          image: a.image_url
            ? (a.image_url.startsWith('http') ? a.image_url : `http://localhost:8000${a.image_url}`)
            : (a.image ? `/storage/${a.image}` : "/images/news/default.jpg"),
          date: a.created_at ? new Date(a.created_at).toLocaleDateString("fr-FR") : "",
          readTime: a.readTime ? `${a.readTime} min` : "3 min",
          type: "actuality"
        }));
        setNews(limit ? actualities.slice(0, limit) : actualities) // Apply the limit
      } catch (error) {
        console.error("Error fetching actualities:", error);
        setNews([])
      }
    }
    fetchNews()
  }, [limit])

  return (
    <div className={`news-cards ${isDarkMode ? "dark-mode" : ""}`}>
      {news.map((newsItem) => (
        <div
          key={newsItem.id}
          className={`news-card ${hoveredCard === newsItem.id ? "hovered" : ""} ${isDarkMode ? "dark-mode" : ""}`}
          onMouseEnter={() => setHoveredCard(newsItem.id)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div className="news-card-image">
            <img src={newsItem.image || "/placeholder.svg"} alt={newsItem.title} />
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
                <span>{newsItem.date}</span>
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
                <span>{newsItem.readTime}</span>
              </div>
            </div>
            <h3 className="news-card-title two-lines">{newsItem.title}</h3>
            <p className="news-card-excerpt two-lines">{newsItem.excerpt}</p>
          </div>
          <div className="news-card-footer">
            <Link to={`/actualites/${newsItem.id.replace("actuality-", "")}`} className="news-card-link">
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
