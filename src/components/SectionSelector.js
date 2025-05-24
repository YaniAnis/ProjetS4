"use client"
import { useState } from "react"
import "./SectionSelector.css"

function SectionSelector({ section, onSelect, onHover, onLeave }) {
  const [ticketCount, setTicketCount] = useState(1)

  // Get classes based on selection state and section type
  const getSectionClasses = () => {
    let classes = "section-selector "

    if (section.id === "VIP") {
      classes += "vip-section "
      if (section.selected) classes += "selected"
    } else {
      classes += "regular-section "
      if (section.selected) classes += "selected"
    }

    return classes
  }

  const handleTicketChange = (e) => {
    setTicketCount(Number.parseInt(e.target.value))
  }

  return (
    <div className={getSectionClasses()} onMouseEnter={onHover} onMouseLeave={onLeave} onClick={onSelect}>
      <div className="section-selector-content">
        <div className="section-selector-left">
          <input
            type="radio"
            id={`section-${section.id}`}
            name="section"
            checked={section.selected}
            onChange={() => {}}
            className="section-radio"
          />
          <div className="section-info">
            <h3 className="section-title">{section.id === "VIP" ? "VIP Zone" : `Zone ${section.name}`}</h3>
          </div>
        </div>
        <div className="section-price-container">
          <div className="section-price-label">Price</div>
          <div className="section-price">€{section.basePrice}</div>
          <div className="section-availability">{section.available} Available</div>
        </div>
      </div>
      {/* Ligne séparatrice très fine */}
      <hr className="section-separator" />
      {section.selected && (
        <div className="ticket-selector">
          <div className="ticket-selector-label">Number of tickets: {ticketCount}</div>
          <div className="slider-container">
            <input
              type="range"
              min="1"
              max="4"
              value={ticketCount}
              onChange={handleTicketChange}
              className="ticket-slider"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="slider-labels">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SectionSelector
