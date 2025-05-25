"use client"

import "./AdditionalOption.css"

function AdditionalOption({ id, title, description, price, icon, iconColor, iconBgColor, selected, onToggle }) {
  return (
    <div className={`additional-option-card ${selected ? "option-selected" : ""}`} onClick={onToggle}>
      <div className="additional-option-content">
        <div className="additional-option-left">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggle}
            className="additional-option-checkbox"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="additional-option-info">
            <div
              className="additional-option-icon"
              style={{
                backgroundColor: iconBgColor,
                color: iconColor,
              }}
            >
              {icon}
            </div>
            <div className="additional-option-details">
              <h3 className="additional-option-name">{title}</h3>
              <p className="additional-option-description">{description}</p>
            </div>
          </div>
        </div>
        <div className="additional-option-price">
          <span className="additional-option-price-value">{price}DZD</span>
        </div>
      </div>
    </div>
  )
}

export default AdditionalOption