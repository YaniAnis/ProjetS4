import React from "react"
import "./SectionSelector.css"

function SectionSelector({ section, selectedCount = 0, onCountChange, maxSelectable = 4, onSelect, onHover, onLeave }) {
  // Limite max à 5 pour le slider
  const maxForThisSection = Math.min(section.available, maxSelectable, 5);

  // Correction : empêcher la propagation ET empêcher le onClick du parent de s'exécuter sur le range et le label
  const handleRangeChange = (e) => {
    e.stopPropagation();
    if (onCountChange) onCountChange(section, parseInt(e.target.value, 10));
  };

  const handleLabelClick = (e) => {
    e.stopPropagation();
  };

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
            {section.basePrice ? `${section.basePrice} DZD` : "N/A"}
          </div>
          <div className="section-availability">
            {section.available} Available
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginLeft: "1rem", minWidth: 120 }}>
          <label
            htmlFor={`seat-count-${section.id || section.name}`}
            style={{ marginRight: "0.3rem", fontSize: "0.95em" }}
            onClick={handleLabelClick}
          >
            Places :
          </label>
          <input
            type="range"
            id={`seat-count-${section.id || section.name}`}
            min={0}
            max={maxForThisSection}
            value={selectedCount}
            onChange={handleRangeChange}
            style={{ width: 80, margin: "0 8px" }}
          />
          <span style={{ minWidth: 18, textAlign: "center", fontWeight: 600 }}>{selectedCount}</span>
        </div>
      </div>
    </div>
  );
}

export default SectionSelector
