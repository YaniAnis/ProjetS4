"use client"
import { useRef, forwardRef } from "react";
import CategoryFilter from "./CategoryFilter";

const leagueOptions = [
  "Ligue 1",
  "Coupe Algérie",
  "Champions League"
];

const FilterBar = forwardRef(function FilterBar({ searchTerm, setSearchTerm, leagueFilter, setLeagueFilter }, ref) {
  return (
    <div className="filter-bar">
      <div className="search">
        <input
          type="text"
          id="search-input"
          placeholder="Rechercher un match..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          ref={ref}
        />
        <button>
          <i className="fas fa-search"></i>
        </button>
      </div>
      <div className="filters">
        <CategoryFilter
          categories={leagueOptions}
          selectedCategory={leagueFilter}
          onSelectCategory={setLeagueFilter}
        />
      </div>
    </div>
  );
});

export default FilterBar;