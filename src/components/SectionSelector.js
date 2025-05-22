import React from "react"
import "./SectionSelector.css"

function SectionSelector({ section, onSelect, onHover, onLeave }) {
  return (
    <div
      className={`section-selector ${section.category === "VIP" ? "vip-section" : "regular-section"}${section.selected ? " selected" : ""}`}
      onClick={onSelect}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="section-selector-content">
        <div className="section-selector-left">
          <input
            type="radio"
            className="section-radio"
            checked={section.selected}
            readOnly
          />
          <div className="section-info">
            <div className="section-title">
              {section.name}
            </div>
            <div className="section-category">{section.category}</div>
          </div>
        </div>
        <div className="section-price-container">
          <div className="section-price-label">Price</div>
          <div className="section-price">
            {section.basePrice ? `€${section.basePrice}` : "N/A"}
          </div>
          <div className="section-availability">
            {section.available} Available
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(SectionSelector)
