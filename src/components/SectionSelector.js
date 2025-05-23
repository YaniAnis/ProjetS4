import React from "react"
import "./SectionSelector.css"

function SectionSelector({ section, selectedCount = 0, onCountChange, maxSelectable = 4, onSelect, onHover, onLeave }) {
  // Calcul du maximum sélectionnable pour cette section
  const maxForThisSection = Math.min(section.available, maxSelectable);

  // Correction : empêcher la propagation ET empêcher le onClick du parent de s'exécuter sur le select et le label
  const handleSelectChange = (e) => {
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
        <div style={{ display: "flex", alignItems: "center", marginLeft: "1rem" }}>
          <label
            htmlFor={`seat-count-${section.id || section.name}`}
            style={{ marginRight: "0.3rem", fontSize: "0.95em" }}
            onClick={handleLabelClick}
          >
            Places :
          </label>
          <select
            id={`seat-count-${section.id || section.name}`}
            value={selectedCount}
            onClick={e => e.stopPropagation()}
            onChange={handleSelectChange}
            style={{
              minWidth: 32,
              width: 48,
              height: 24,
              fontSize: "0.95em",
              padding: "0 4px",
              borderRadius: 4
            }}
          >
            {[...Array(maxForThisSection + 1)].map((_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default SectionSelector
