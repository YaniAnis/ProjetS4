"use client"
import { useRef, forwardRef } from "react";
import CategoryFilter from "./CategoryFilter";

const leagues = [
  { value: "", label: "Toutes les ligues" },
  { value: "Ligue 1 Mobilis", label: "Ligue 1 Mobilis" },
  { value: "Ligue 2 Mobilis Est", label: "Ligue 2 Mobilis Est" },
  { value: "Ligue 2 Mobilis Ouest", label: "Ligue 2 Mobilis Ouest" },
  { value: "Coupe Algérie", label: "Coupe d'Algérie" },
  { value: "Champions League", label: "Champions League" }
]

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
          categories={leagues}
          selectedCategory={leagueFilter}
          onSelectCategory={setLeagueFilter}
        />
      </div>
    </div>
  );
});

export default FilterBar;