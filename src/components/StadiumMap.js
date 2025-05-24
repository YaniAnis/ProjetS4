"use client"

import { useState, useRef } from "react"
import "./StadiumMap.css"

function StadiumMap({ sections, hoveredSection, onSectionHover, onSectionSelect }) {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  const mapRef = useRef(null)

  const handleSectionHover = (sectionId, e) => {
    onSectionHover(sectionId)

    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect()
      setTooltipPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    setShowTooltip(true)
  }

  const handleSectionLeave = () => {
    onSectionHover(null)
    setShowTooltip(false)
  }

  const getHoveredSection = () => {
    return sections.find((section) => section.id === hoveredSection)
  }

  // Get section color based on hover/selection state
  const getSectionClasses = (sectionId) => {
    const isSelected = sections.find((s) => s.id === sectionId)?.selected
    const isHovered = hoveredSection === sectionId
    let classes = "stadium-section "

    if (sectionId === "VIP") {
      // VIP section
      classes += "vip-section "
      if (isSelected) return classes + "vip-selected"
      if (isHovered) return classes + "vip-hovered"
      return classes + "vip-default"
    }

    if (isSelected) return classes + "section-selected"
    if (isHovered) return classes + "section-hovered"
    return classes + "section-default"
  }

  return (
    <div ref={mapRef} className="stadium-container">
      {/* Stadium Structure */}
      <div className="stadium-structure">
        {/* Field with margin */}
        <div className="field">
          {/* Field Markings */}
          <div className="field-markings">
            {/* Center Circle */}
            <div className="center-circle"></div>

            {/* Center Line */}
            <div className="center-line"></div>

            {/* Field Outline */}
            <div className="field-outline"></div>

            {/* Penalty Areas */}
            <div className="penalty-area-left"></div>
            <div className="penalty-area-right"></div>

            {/* Goal Areas */}
            <div className="goal-area-left"></div>
            <div className="goal-area-right"></div>

            {/* Penalty Spots */}
            <div className="penalty-spot-left"></div>
            <div className="penalty-spot-right"></div>
          </div>
        </div>

        {/* Stadium Sections Container */}
        <div className="stadium-sections">
          {/* Top Row */}
          <div className="section-row section-top-row">
            {/* Zone E - Top Left */}
            <div
              className={`section ${getSectionClasses("E")}`}
              onClick={() => onSectionSelect("E")}
              onMouseMove={(e) => handleSectionHover("E", e)}
              onMouseLeave={handleSectionLeave}
              style={{ width: "25%" }}
            >
              <span className="section-label">E</span>
            </div>

            {/* Zone A - Top Center (spans 2/4) */}
            <div
              className={`section ${getSectionClasses("A")}`}
              onClick={() => onSectionSelect("A")}
              onMouseMove={(e) => handleSectionHover("A", e)}
              onMouseLeave={handleSectionLeave}
              style={{ width: "50%" }}
            >
              <span className="section-label">A</span>
            </div>

            {/* Zone C - Top Right */}
            <div
              className={`section ${getSectionClasses("C")}`}
              onClick={() => onSectionSelect("C")}
              onMouseMove={(e) => handleSectionHover("C", e)}
              onMouseLeave={handleSectionLeave}
              style={{ width: "25%" }}
            >
              <span className="section-label">C</span>
            </div>
          </div>

          {/* Middle Row */}
          <div className="section-row section-middle-row">
            {/* Zone H - Left Side */}
            <div
              className={`section ${getSectionClasses("H")}`}
              onClick={() => onSectionSelect("H")}
              onMouseMove={(e) => handleSectionHover("H", e)}
              onMouseLeave={handleSectionLeave}
              style={{ width: "125px" }}
            >
              <span className="section-label">H</span>
            </div>

            {/* Center Space (for field) */}
            <div className="section-middle-space"></div>

            {/* Zone B - Right Side */}
            <div
              className={`section ${getSectionClasses("B")}`}
              onClick={() => onSectionSelect("B")}
              onMouseMove={(e) => handleSectionHover("B", e)}
              onMouseLeave={handleSectionLeave}
              style={{ width: "125px" }}
            >
              <span className="section-label">B</span>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="section-row section-bottom-row">
            {/* Zone F - Bottom Left */}
            <div
              className={`section ${getSectionClasses("F")}`}
              onClick={() => onSectionSelect("F")}
              onMouseMove={(e) => handleSectionHover("F", e)}
              onMouseLeave={handleSectionLeave}
              style={{ width: "25%" }}
            >
              <span className="section-label">F</span>
            </div>

            {/* Zone VIP - Bottom Center (spans 2/4) */}
            <div
              className={`section ${getSectionClasses("VIP")}`}
              onClick={() => onSectionSelect("VIP")}
              onMouseMove={(e) => handleSectionHover("VIP", e)}
              onMouseLeave={handleSectionLeave}
              style={{
                width: "50%",
                boxShadow: "inset 0 0 15px rgba(218, 165, 32, 0.3)",
              }}
            >
              <div className="vip-label">
                <span className="vip-text">VIP</span>
              </div>
            </div>

            {/* Zone D - Bottom Right */}
            <div
              className={`section ${getSectionClasses("D")}`}
              onClick={() => onSectionSelect("D")}
              onMouseMove={(e) => handleSectionHover("D", e)}
              onMouseLeave={handleSectionLeave}
              style={{ width: "25%" }}
            >
              <span className="section-label">D</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price Tooltip */}
      {showTooltip && hoveredSection && (
        <div
          className="tooltip"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y - 10}px`,
          }}
        >
          <div className="tooltip-content">
            <div className={`tooltip-title ${hoveredSection === "VIP" ? "tooltip-vip" : ""}`}>
              {hoveredSection === "VIP" ? "VIP Zone" : `Zone ${hoveredSection}`}
            </div>
            <div className="tooltip-price">
              {getHoveredSection()?.maxPrice
                ? `€${getHoveredSection()?.basePrice.toFixed(2)} - €${getHoveredSection()?.maxPrice.toFixed(2)}`
                : `€${getHoveredSection()?.basePrice}`}
            </div>
            <div className="tooltip-availability">{getHoveredSection()?.available || "120"} tickets available</div>
          </div>
          <div className="tooltip-arrow"></div>
        </div>
      )}

    </div>
  )
}

export default StadiumMap
