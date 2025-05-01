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
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
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

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  if (!newsItem) {
    return <div>News item not found.</div>
  }

  return (
    <div className="news-detail-page">
      <h1>{newsItem.title}</h1>
      {newsItem.url ? (
        <a href={newsItem.url} target="_blank" rel="noopener noreferrer">
          Read more
        </a>
      ) : (
        <p>No URL available.</p>
      )}
      <p>By: {newsItem.by}</p>
      <p>Score: {newsItem.score}</p>
      <Link to="/">Back to Home</Link>
    </div>
  )
}

export default NewsDetailPage
