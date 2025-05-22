"use client"

import { useState, useRef, useEffect } from "react"
import "./CategoryFilter.css"

function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  const [isOpen, setIsOpen] = useState(false)
  const filterRef = useRef(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleCategorySelect = (category) => {
    onSelectCategory(category === selectedCategory ? "" : category)
    setIsOpen(false)
  }

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [filterRef])

  return (
    <div className={`category-filter ${isOpen ? "open" : ""}`} ref={filterRef}>
      <button className="filter-button" onClick={toggleDropdown}>
        {selectedCategory || "Toutes les catégories"} <span className="dropdown-arrow">▼</span>
      </button>

      <div className="dropdown-menu">
        <div className="dropdown-item" onClick={() => handleCategorySelect("")}>
          Toutes les catégories
        </div>
        {categories.map((category, index) => (
          <div
            key={index}
            className={`dropdown-item ${selectedCategory === category ? "active" : ""}`}
            onClick={() => handleCategorySelect(category)}
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilter
