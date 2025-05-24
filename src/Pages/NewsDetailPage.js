"use client"

import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import "./NewsDetailPage.css"

function NewsDetailPage() {
  const { id } = useParams()
  const [actuality, setActuality] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActuality = async () => {
      setLoading(true)
      try {
        const res = await fetch(`http://localhost:8000/api/actualities/${id}`)
        const data = await res.json()
        setActuality(data)
      } catch {
        setActuality(null)
      }
      setLoading(false)
    }
    fetchActuality()
  }, [id])

  if (loading) {
    return <div className="news-detail-loading">Chargement...</div>
  }

  if (!actuality) {
    return (
      <div className="news-detail-error">
        <Link to="/actualites" className="news-detail-back">&larr; Retour aux actualités</Link>
        <h2>Actualité introuvable</h2>
      </div>
    )
  }

  return (
    <div className="news-detail-page">
      <Link to="/actualites" className="news-detail-back">&larr; Retour aux actualités</Link>
      <h1 className="news-detail-title centered-title">{actuality.title}</h1>
      <div className="news-detail-meta">
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ verticalAlign: "middle", marginRight: 4, minWidth: 16, minHeight: 16, display: "inline-block" }}
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {actuality.created_at ? new Date(actuality.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : ""}
        </span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ verticalAlign: "middle", marginRight: 4, minWidth: 16, minHeight: 16, display: "inline-block" }}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {actuality.readTime ? `${actuality.readTime} min` : "2 min"}
        </span>
      </div>
      {actuality.image_url &&
        <div className="news-detail-image-container">
          <img
            src={
              actuality.image_url.startsWith("http")
                ? actuality.image_url
                : `http://localhost:8000${actuality.image_url}`
            }
            alt={actuality.title}
            className="news-detail-image"
            style={{ objectFit: "cover", width: "100%", maxHeight: 350 }}
          />
        </div>
      }
      {!actuality.image_url &&
        <div className="news-detail-image-container">
          <img src="/images/news/default.jpg" alt="Actualité" className="news-detail-image" />
        </div>
      }
      <div className="news-detail-description">
        <h3>Description</h3>
        <p>{actuality.description}</p>
      </div>
    </div>
  )
}

export default NewsDetailPage
