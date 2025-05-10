"use client"

import { useParams, Link } from "react-router-dom"
import { useState, useEffect } from "react"
import "./NewsDetailPage.css"

function NewsDetailPage() {
  const { id } = useParams()
  const [newsItem, setNewsItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/actualities/${id}`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setNewsItem(data)
      } catch (e) {
        setError(e)
      } finally {
        setLoading(false)
      }
    }

    fetchNewsItem()
  }, [id])

  if (loading) return <div className="loading">Chargement...</div>
  if (error) return <div className="loading">Erreur : {error.message}</div>
  if (!newsItem) return <div className="loading">Actualité non trouvée.</div>

  return (
    <div className="news-detail">
      <Link to="/actualites" className="back-link">
        &larr; Retour aux actualités
      </Link>
      <div className="news-detail-header">
        <h1 className="news-detail-title">{newsItem.title}</h1>
        <div className="news-detail-meta">
          <div className="news-detail-date">
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
              {newsItem.created_at
                ? new Date(newsItem.created_at).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </span>
          </div>
          <div className="news-detail-time">
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
              {newsItem.readTime ? `${newsItem.readTime} min` : ""}
            </span>
          </div>
        </div>
      </div>
      {newsItem.image && (
        <div className="news-detail-image">
          <img
            src={
              newsItem.image.startsWith("http")
                ? newsItem.image
                : `http://localhost:8000/storage/${newsItem.image}`
            }
            alt={newsItem.title}
          />
        </div>
      )}
      <div className="news-detail-content">
        {newsItem.description && (
          <div className="news-detail-description-centered">
            <h2 className="news-detail-description-title">Description</h2>
            <div className="news-detail-description-text">{newsItem.description}</div>
          </div>
        )}
        {newsItem.content}
      </div>
    </div>
  )
}

export default NewsDetailPage
