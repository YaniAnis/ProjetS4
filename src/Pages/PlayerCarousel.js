"use client"

import { useState, useEffect } from "react"
import PlayerCard from "./PlayerCard"
import { players } from "./player"
import "./Player.css"
const PlayerCarousel = ({ darkMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(4)
  const [maxIndex, setMaxIndex] = useState(0)

  // Update items per view based on screen size
  const updateItemsPerView = () => {
    const width = window.innerWidth
    let newItemsPerView

    if (width <= 480) {
      newItemsPerView = 1
    } else if (width <= 768) {
      newItemsPerView = 2
    } else if (width <= 1024) {
      newItemsPerView = 3
    } else {
      newItemsPerView = 4
    }

    setItemsPerView(newItemsPerView)
    const newMaxIndex = Math.max(0, players.length - newItemsPerView)
    setMaxIndex(newMaxIndex)

    // Adjust current index if needed
    setCurrentIndex((prev) => Math.min(prev, newMaxIndex))
  }

  // Handle window resize
  useEffect(() => {
    updateItemsPerView()

    const handleResize = () => {
      updateItemsPerView()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Navigation functions
  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goToSlide = (index) => {
    setCurrentIndex(Math.min(index, maxIndex))
  }

  // Calculate transform
  const translateX = -(currentIndex * (100 / itemsPerView))

  // Generate dots
  const numDots = maxIndex + 1
  const dots = Array.from({ length: numDots }, (_, i) => i)

  // Check if navigation should be shown
  const showNavigation = players.length > itemsPerView

  return (
    <section className={`players-section${darkMode ? " dark-mode" : ""}`}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="badge">
            <i className="fas fa-trophy"></i>
            Nos Joueurs Vedettes
          </div>
          <h2 className="excellence-text">L'Excellence sur le Terrain</h2>
          <p>Découvrez les talents exceptionnels qui font la fierté des Équipes cette saison</p>
        </div>

        {/* Carousel Container */}
        <div className="carousel-container">
          {/* Navigation Buttons */}
          {showNavigation && (
            <>
              <button
                className="nav-btn prev-btn"
                onClick={prevSlide}
                disabled={currentIndex === 0}
                style={{
                  opacity: currentIndex === 0 ? "0.5" : "1",
                  cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                className="nav-btn next-btn"
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                style={{
                  opacity: currentIndex >= maxIndex ? "0.5" : "1",
                  cursor: currentIndex >= maxIndex ? "not-allowed" : "pointer",
                }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </>
          )}

          {/* Players Carousel */}
          <div className="carousel-wrapper">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(${translateX}%)`,
                transition: "transform 0.5s ease-in-out",
              }}
            >
              {players.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          {showNavigation && (
            <div className="dots-container">
              {dots.map((index) => (
                <button
                  key={index}
                  className={`dot ${index === currentIndex ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default PlayerCarousel
