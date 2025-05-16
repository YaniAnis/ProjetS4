"use client"
import "./SectionSelector.css"

function SectionSelector({ section, onSelect, onHover, onLeave }) {
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
            <p className="section-category">{section.category}</p>
          </div>
        </div>
        <div className="section-price-container">
          <div className="section-price-label">Price</div>
          <div className="section-price">€{section.basePrice}</div>
          <div className="section-availability">{section.available} Available</div>
        </div>
      </div>
    </div>
  )
}

export default SectionSelector
