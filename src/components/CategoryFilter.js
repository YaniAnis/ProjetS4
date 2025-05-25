"use client"

import { useState, useRef, useEffect } from "react"
import "./CategoryFilter.css"

function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  const [isOpen, setIsOpen] = useState(false)
  const filterRef = useRef(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleCategorySelect = (categoryValue) => {
    onSelectCategory(categoryValue === selectedCategory ? "" : categoryValue)
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
        {categories.find(cat => cat.value === selectedCategory)?.label || "Toutes les ligues"} 
        <span className="dropdown-arrow">▼</span>
      </button>

      <div className="dropdown-menu">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`dropdown-item ${selectedCategory === category.value ? "active" : ""}`}
            onClick={() => handleCategorySelect(category.value)}
          >
            {category.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilter
